



use anyhow::Result;
use crash_helper_common::{IPCConnector, Pid, RawAncillaryData};

use crate::CrashHelperClient;

impl CrashHelperClient {
    pub(crate) fn new(server_socket: RawAncillaryData) -> Result<CrashHelperClient> {
        
        let connector = unsafe {
          IPCConnector::from_raw_ancillary(server_socket)?
        };

        Ok(CrashHelperClient {
            connector,
            spawner_thread: None,
        })
    }

    pub(crate) fn prepare_for_minidump(_crash_helper_pid: Pid) {
        
    }
}
