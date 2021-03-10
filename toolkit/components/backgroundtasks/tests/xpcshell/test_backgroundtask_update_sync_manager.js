





add_task(async function test_backgroundtask_update_sync_manager() {
  
  
  
  
  
  
  
  let exitCode = await do_backgroundtask("update_sync_manager", {
    extraArgs: [Services.dirsvc.get("XREExeF", Ci.nsIFile).path],
  });
  Assert.equal(80, exitCode);

  
  
  let file = do_get_profile();
  file.append("customExePath");
  exitCode = await do_backgroundtask("update_sync_manager", {
    extraArgs: [file.path],
  });
  Assert.equal(81, exitCode);
});
