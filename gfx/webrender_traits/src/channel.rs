



use serde::{Deserialize, Serialize};
use std::io::Error;

#[cfg(feature = "ipc")]
use ipc_channel::ipc::{self, IpcSender, IpcReceiver, IpcBytesSender, IpcBytesReceiver};

#[cfg(not(feature = "ipc"))]
use serde::{Deserializer, Serializer};

#[cfg(not(feature = "ipc"))]
use std::sync::mpsc;



pub trait PayloadHelperMethods {
    fn send_vec(&self, data: Vec<u8>) -> Result<(), Error>;
}





#[cfg(feature = "ipc")]
pub type MsgSender<T> = IpcSender<T>;

#[cfg(feature = "ipc")]
pub type MsgReceiver<T> = IpcReceiver<T>;

#[cfg(feature = "ipc")]
pub type PayloadSender = IpcBytesSender;

#[cfg(feature = "ipc")]
pub type PayloadReceiver = IpcBytesReceiver;

#[cfg(feature = "ipc")]
impl PayloadHelperMethods for PayloadSender {
    fn send_vec(&self, data: Vec<u8>) -> Result<(), Error> {
        self.send(&data)
    }
}

#[cfg(feature = "ipc")]
pub fn msg_channel<T: Serialize + Deserialize>() -> Result<(MsgSender<T>, MsgReceiver<T>), Error> {
    ipc::channel()
}

#[cfg(feature = "ipc")]
pub fn payload_channel() -> Result<(PayloadSender, PayloadReceiver), Error> {
    ipc::bytes_channel()
}





#[cfg(not(feature = "ipc"))]
pub type PayloadSender = MsgSender<Vec<u8>>;

#[cfg(not(feature = "ipc"))]
pub type PayloadReceiver = MsgReceiver<Vec<u8>>;

#[cfg(not(feature = "ipc"))]
impl PayloadHelperMethods for PayloadSender {
    fn send_vec(&self, data: Vec<u8>) -> Result<(), Error> {
        self.send(data)
    }
}

#[cfg(not(feature = "ipc"))]
pub struct MsgReceiver<T> {
    rx: mpsc::Receiver<T>,
}

#[cfg(not(feature = "ipc"))]
impl<T> MsgReceiver<T> {
    pub fn recv(&self) -> Result<T, Error> {
        Ok(self.rx.recv().unwrap())
    }
}

#[cfg(not(feature = "ipc"))]
#[derive(Clone)]
pub struct MsgSender<T> {
    tx: mpsc::Sender<T>,
}

#[cfg(not(feature = "ipc"))]
impl<T> MsgSender<T> {
    pub fn send(&self, data: T) -> Result<(), Error> {
        Ok(self.tx.send(data).unwrap())
    }
}

#[cfg(not(feature = "ipc"))]
pub fn payload_channel() -> Result<(PayloadSender, PayloadReceiver), Error> {
    let (tx, rx) = mpsc::channel();
    Ok((PayloadSender { tx: tx }, PayloadReceiver { rx: rx }))
}

#[cfg(not(feature = "ipc"))]
pub fn msg_channel<T>() -> Result<(MsgSender<T>, MsgReceiver<T>), Error> {
    let (tx, rx) = mpsc::channel();
    Ok((MsgSender { tx: tx }, MsgReceiver { rx: rx }))
}











#[cfg(not(feature = "ipc"))]
impl<T> Serialize for MsgReceiver<T> {
    fn serialize<S: Serializer>(&self, _: &mut S) -> Result<(), S::Error> {
        unreachable!();
    }
}

#[cfg(not(feature = "ipc"))]
impl<T> Serialize for MsgSender<T> {
    fn serialize<S: Serializer>(&self, _: &mut S) -> Result<(), S::Error> {
        unreachable!();
    }
}

#[cfg(not(feature = "ipc"))]
impl<T> Deserialize for MsgReceiver<T> {
    fn deserialize<D>(_: &mut D) -> Result<MsgReceiver<T>, D::Error>
                      where D: Deserializer {
        unreachable!();
    }
}

#[cfg(not(feature = "ipc"))]
impl<T> Deserialize for MsgSender<T> {
    fn deserialize<D>(_: &mut D) -> Result<MsgSender<T>, D::Error>
                      where D: Deserializer {
        unreachable!();
    }
}
