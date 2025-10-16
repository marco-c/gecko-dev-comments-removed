


"use strict";

add_task(
  async function test_findBackupsInWellKnownLocations_and_multipleFiles() {
    
    const TEST_ROOT = await IOUtils.createUniqueDirectory(
      PathUtils.tempDir,
      "test-findBackupsInWellKnownLocations"
    );
    const BACKUP_DIR = PathUtils.join(TEST_ROOT, "Backups");
    await IOUtils.makeDirectory(BACKUP_DIR, { createAncestors: true });

    
    async function touch(fileName) {
      const p = PathUtils.join(BACKUP_DIR, fileName);
      await IOUtils.writeUTF8(p, "<!-- stub backup -->", {
        tmpPath: p + ".tmp",
      });
      return p;
    }

    
    let bs = new BackupService();
    let sandbox = sinon.createSandbox();
    sandbox
      .stub(bs, "resolveExistingArchiveDestFolderPath")
      .callsFake(async _configured => BACKUP_DIR);

    
    
    sandbox.stub(bs, "getBackupFileInfo").callsFake(async _filePath => {});

    
    Assert.ok(await IOUtils.exists(BACKUP_DIR), "Backup directory exists");
    Assert.equal(
      (await IOUtils.getChildren(BACKUP_DIR)).length,
      0,
      "Folder is empty"
    );

    
    const ONE = "FirefoxBackup_one_20241201-1200.html";
    await touch(ONE);

    let result = await bs.findBackupsInWellKnownLocations();
    Assert.ok(result.found, "Found should be true with one candidate");
    Assert.equal(
      result.multipleBackupsFound,
      false,
      "multipleBackupsFound should be false"
    );
    
    Assert.ok(
      result.backupFileToRestore && result.backupFileToRestore.endsWith(ONE),
      "backupFileToRestore should point at the single html file"
    );

    
    const TWO = "FirefoxBackup_two_20241202-1300.html";
    await touch(TWO);

    let result2 = await bs.findBackupsInWellKnownLocations();
    Assert.ok(
      !result2.found,
      "Found should be false when multiple candidates exist and validateFile=false"
    );
    Assert.equal(
      result2.multipleBackupsFound,
      true,
      "Should signal multipleBackupsFound"
    );
    Assert.equal(
      result2.backupFileToRestore,
      null,
      "No file chosen if multiple & not allowed"
    );

    
    let { multipleBackupsFound } = await bs.findIfABackupFileExists({
      validateFile: false,
      multipleFiles: true, 
    });
    Assert.ok(!multipleBackupsFound, "Should not report multiple when allowed");

    
    
    let result3 = await bs.findBackupsInWellKnownLocations({
      validateFile: true,
      multipleFiles: true,
    });
    Assert.ok(
      result3.found,
      "Found should be true when validateFile=true and multiple files exist"
    );
    Assert.equal(
      result3.multipleBackupsFound,
      true,
      "Should signal multipleBackupsFound when validateFile=true and multipleFiles=true and multiple files exist"
    );
    Assert.ok(
      result3.backupFileToRestore && result3.backupFileToRestore.endsWith(TWO),
      "Should select the newest file when validateFile=true"
    );

    
    sandbox.restore();
    await IOUtils.remove(TEST_ROOT, { recursive: true });
  }
);
