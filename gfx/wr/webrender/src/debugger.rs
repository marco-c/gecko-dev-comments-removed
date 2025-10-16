



use crate::{DebugCommand, RenderApi, ApiMsg};
use crate::profiler::Profiler;
use crate::composite::CompositeState;
use std::collections::HashMap;
use std::convert::Infallible;
use api::crossbeam_channel;
use api::channel::{Sender, unbounded_channel};
use api::DebugFlags;
use api::debugger::{DebuggerMessage, SetDebugFlagsMessage, ProfileCounterDescriptor};
use api::debugger::{UpdateProfileCountersMessage, InitProfileCountersMessage, ProfileCounterId};
use api::debugger::{CompositorDebugInfo, CompositorDebugTile};
use std::thread;
use base64::prelude::*;
use sha1::{Sha1, Digest};
use hyper::{Request, Response, Body, service::{make_service_fn, service_fn}, Server};
use tokio::io::AsyncWriteExt;


#[derive(Clone)]
struct DebugRenderApi {
    api_sender: Sender<ApiMsg>,
}

impl DebugRenderApi {
    fn new(api: &RenderApi) -> Self {
        Self {
            api_sender: api.get_api_sender(),
        }
    }

    fn get_debug_flags(&self) -> DebugFlags {
        let (tx, rx) = unbounded_channel();
        let msg = ApiMsg::DebugCommand(DebugCommand::GetDebugFlags(tx));
        self.api_sender.send(msg).unwrap();
        rx.recv().unwrap()
    }

    fn send_debug_cmd(&self, cmd: DebugCommand) {
        let msg = ApiMsg::DebugCommand(cmd);
        self.api_sender.send(msg).unwrap();
    }
}










#[derive(Clone)]
pub enum DebugQueryKind {
    
    SpatialTree {},
    
    CompositorConfig {},
    
    CompositorView {},
}


#[derive(Clone)]
pub struct DebugQuery {
    
    pub kind: DebugQueryKind,
    
    pub result: Sender<String>,
}



pub struct DebuggerClient {
    tx: tokio::sync::mpsc::UnboundedSender<Vec<u8>>,
}

impl DebuggerClient {
    
    fn send_msg(
        &mut self,
        msg: DebuggerMessage,
    ) -> bool {
        let data = serde_json::to_string(&msg).expect("bug");
        let data = construct_server_ws_frame(&data);

        self.tx.send(data).is_ok()
    }
}


pub struct Debugger {
    
    clients: Vec<DebuggerClient>,
}

impl Debugger {
    pub fn new() -> Self {
        Debugger {
            clients: Vec::new(),
        }
    }

    
    pub fn add_client(
        &mut self,
        mut client: DebuggerClient,
        debug_flags: DebugFlags,
        profiler: &Profiler,
    ) {
        
        let msg = SetDebugFlagsMessage {
            flags: debug_flags,
        };
        if client.send_msg(DebuggerMessage::SetDebugFlags(msg)) {
            let mut counters = Vec::new();
            for (id, counter) in profiler.counters().iter().enumerate() {
                counters.push(ProfileCounterDescriptor {
                    id: ProfileCounterId(id),
                    name: counter.name.into(),
                });
            }
            let msg = InitProfileCountersMessage {
                counters
            };
            if client.send_msg(DebuggerMessage::InitProfileCounters(msg)) {
                
                self.clients.push(client);
            }
        }
    }

    
    
    pub fn update(
        &mut self,
        debug_flags: DebugFlags,
        profiler: &Profiler,
    ) {
        let mut clients_to_keep = Vec::new();

        for mut client in self.clients.drain(..) {
            let msg = SetDebugFlagsMessage {
                flags: debug_flags,
            };
            if client.send_msg(DebuggerMessage::SetDebugFlags(msg)) {
                let updates = profiler.collect_updates_for_debugger();

                let counters = UpdateProfileCountersMessage {
                    updates,
                };
                if client.send_msg(DebuggerMessage::UpdateProfileCounters(counters)) {
                    clients_to_keep.push(client);
                }
            }
        }

        self.clients = clients_to_keep;
    }
}


pub fn start(api: RenderApi) {
    let address = "127.0.0.1:3583";

    println!("Start WebRender debugger server on http://{}", address);

    let api = DebugRenderApi::new(&api);

    thread::spawn(move || {
        let runtime = match tokio::runtime::Runtime::new() {
            Ok(rt) => rt,
            Err(e) => {
                println!("\tUnable to create tokio runtime for the webrender debugger: {}", e);
                return;
            }
        };

        runtime.block_on(async {
            let make_svc = make_service_fn(move |_conn| {
                let api = api.clone();
                async move {
                    Ok::<_, Infallible>(service_fn(move |req| {
                        handle_request(req, api.clone())
                    }))
                }
            });

            let addr = address.parse().unwrap();
            let server = match Server::try_bind(&addr) {
                Ok(s) => s,
                Err(e) => {
                    eprintln!("WebRender debugger could not bind: {addr}: {e:?}");
                    return;
                }
            };

            if let Err(e) = server.serve(make_svc).await {
                eprintln!("WebRender debugger error: {:?}", e);
            }
        });
    });
}

async fn request_to_string(request: Request<Body>) -> Result<String, hyper::Error> {
    let body_bytes = hyper::body::to_bytes(request.into_body()).await?;
    Ok(String::from_utf8_lossy(&body_bytes).to_string())
}

fn string_response<S: Into<String>>(string: S) -> Response<Body> {
    Response::new(Body::from(string.into()))
}

fn status_response(status: u16) -> Response<Body> {
    Response::builder().status(status).body(Body::from("")).unwrap()
}

async fn handle_request(
    request: Request<Body>,
    api: DebugRenderApi,
) -> Result<Response<Body>, Infallible> {
    let path = request.uri().path();
    let query = request.uri().query().unwrap_or("");
    let args: HashMap<String, String> = url::form_urlencoded::parse(query.as_bytes())
        .into_owned()
        .collect();

    match path {
        "/ping" => {
            
            Ok(string_response("pong"))
        }
        "/debug-flags" => {
            
            match request.method() {
                &hyper::Method::GET => {
                    let debug_flags = api.get_debug_flags();
                    let result = serde_json::to_string(&debug_flags).unwrap();
                    Ok(string_response(result))
                }
                &hyper::Method::POST => {
                    let content = request_to_string(request).await.unwrap();
                    let flags = serde_json::from_str(&content).expect("bug");
                    api.send_debug_cmd(
                        DebugCommand::SetFlags(flags)
                    );
                    Ok(string_response(format!("flags = {:?}", flags)))
                }
                _ => {
                    Ok(status_response(403))
                }
            }
        }
        "/generate-frame" => {
            
            api.send_debug_cmd(
                DebugCommand::GenerateFrame
            );
            Ok(status_response(200))
        }
        "/query" => {
            
            let (tx, rx) = crossbeam_channel::unbounded();

            let kind = match args.get("type").map(|s| s.as_str()) {
                Some("spatial-tree") => DebugQueryKind::SpatialTree {},
                Some("composite-view") => DebugQueryKind::CompositorView {},
                Some("composite-config") => DebugQueryKind::CompositorConfig {},
                _ => {
                    return Ok(string_response("Unknown query"));
                }
            };

            let query = DebugQuery {
                result: tx,
                kind,
            };
            api.send_debug_cmd(
                DebugCommand::Query(query)
            );
            let result = match rx.recv() {
                Ok(result) => result,
                Err(..) => "No response received from WR".into(),
            };
            Ok(string_response(result))
        }
        "/debugger-socket" => {
            
            

            let upgrade_header = request.headers().get("upgrade");
            if upgrade_header.is_none() || upgrade_header.unwrap() != "websocket" {
                return Ok(status_response(404));
            }

            let key = match request.headers().get("sec-websocket-key") {
                Some(k) => k.to_str().unwrap_or(""),
                None => {
                    return Ok(status_response(400));
                }
            };

            let accept_key = convert_ws_key(key);

            tokio::spawn(async move {
                match hyper::upgrade::on(request).await {
                    Ok(upgraded) => {
                        let (tx, mut rx) = tokio::sync::mpsc::unbounded_channel::<Vec<u8>>();

                        
                        tokio::spawn(async move {
                            let mut stream = upgraded;
                            while let Some(data) = rx.recv().await {
                                if stream.write_all(&data).await.is_err() {
                                    break;
                                }
                                if stream.flush().await.is_err() {
                                    break;
                                }
                            }
                        });

                        api.send_debug_cmd(
                            DebugCommand::AddDebugClient(DebuggerClient {
                                tx,
                            })
                        );
                    }
                    Err(e) => eprintln!("Upgrade error: {}", e),
                }
            });

            Ok(Response::builder()
                .status(101)
                .header("upgrade", "websocket")
                .header("connection", "upgrade")
                .header("sec-websocket-accept", accept_key)
                .body(Body::from(""))
                .unwrap())
        }
        _ => {
            Ok(status_response(404))
        }
    }
}



fn convert_ws_key(input: &str) -> String {
    let mut input = input.to_string().into_bytes();
    let mut bytes = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11"
        .to_string()
        .into_bytes();
    input.append(&mut bytes);

    let sha1 = Sha1::digest(&input);
    BASE64_STANDARD.encode(sha1)
}



pub fn construct_server_ws_frame(payload: &str) -> Vec<u8> {
    let payload_bytes = payload.as_bytes();
    let payload_len = payload_bytes.len();
    let mut frame = Vec::new();

    frame.push(0x81);

    if payload_len <= 125 {
        frame.push(payload_len as u8);
    } else if payload_len <= 65535 {
        frame.push(126 as u8);
        frame.extend_from_slice(&(payload_len as u16).to_be_bytes());
    } else {
        frame.push(127 as u8);
        frame.extend_from_slice(&(payload_len as u64).to_be_bytes());
    }

    frame.extend_from_slice(payload_bytes);

    frame
}

impl From<&CompositeState> for CompositorDebugInfo {
    fn from(state: &CompositeState) -> Self {
        let tiles = state.tiles
            .iter()
            .map(|tile| {
                CompositorDebugTile {
                    local_rect: tile.local_rect,
                    clip_rect: tile.device_clip_rect,
                    device_rect: state.get_device_rect(
                        &tile.local_rect,
                        tile.transform_index,
                    ),
                    z_id: tile.z_id.0,
                }
            })
            .collect();

        CompositorDebugInfo {
            enabled_z_layers: !0,
            tiles,
        }
    }
}
