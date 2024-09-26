const readlineSync = require("readline-sync");
const fs = require("fs");
const { dropAndCreateReferenceDatabase } = require("./database");
const { execSync } = require("child_process");
const {
  deleteExistingFolder,
  createFolder,
  copyFilesSourceToTarget,
} = require("./folder-and-file");
const path = require("path");
const os = require("os");

const CHANGELOG_FOR_EXEC_DIFF_DB_FOLDER_PATH = path.join(
  __dirname,
  "change-log-for-exec-diff-db"
);
const CHANGELOG_FOR_DIFF_DB_FILE_PATH = "db/changelog-for-diff-db.xml";

function generateChangelogFileName(changelogName) {
  const timestamp = new Date()
    .toISOString()
    .replace(/[-:]/g, "")
    .replace("T", "")
    .split(".")[0];
  return `${timestamp}_${changelogName}.xml`;
}

function createChangelogForExecuteDiffDB(config) {
  deleteExistingFolder(CHANGELOG_FOR_EXEC_DIFF_DB_FOLDER_PATH);
  createFolder(CHANGELOG_FOR_EXEC_DIFF_DB_FOLDER_PATH);
  copyFilesSourceToTarget(
    config.changeLogCreator.changelogBasePath,
    CHANGELOG_FOR_EXEC_DIFF_DB_FOLDER_PATH,
    config.changeLogCreator.changelogForExecForDiffDb.includes,
    config.changeLogCreator.changelogForExecForDiffDb.excludes
  );
}

function createChangelog(config) {
  const changelogName = readlineSync.question(
    "Please enter the name for the changelog file: "
  );
  const changelogFileName = generateChangelogFileName(changelogName, config);
  const changelogFilePath = path.join(
    config.changeLogCreator.outputCreateChangelogBasePath,
    changelogFileName
  );

  console.log("Create changelog file...");
  fs.writeFileSync(
    changelogFilePath,
    `<?xml version="1.1" encoding="UTF-8" standalone="no"?>
<databaseChangeLog xmlns="http://www.liquibase.org/xml/ns/dbchangelog"
                   xmlns:ext="http://www.liquibase.org/xml/ns/dbchangelog-ext"
                   xmlns:pro="http://www.liquibase.org/xml/ns/pro"
                   xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                   xsi:schemaLocation="http://www.liquibase.org/xml/ns/dbchangelog-ext http://www.liquibase.org/xml/ns/dbchangelog/dbchangelog-ext.xsd
                                       http://www.liquibase.org/xml/ns/pro http://www.liquibase.org/xml/ns/pro/liquibase-pro-latest.xsd
                                       http://www.liquibase.org/xml/ns/dbchangelog http://www.liquibase.org/xml/ns/dbchangelog/dbchangelog-latest.xsd">
    <!-- Add your changes here -->
</databaseChangeLog>`
  );

  console.log("Create changelog file success");
}

async function initDiffDb(config) {
  const osType = os.type();
  let command = config.changeLogCreator.initDiffDbScript.default;

  if (osType === "Linux" || osType === "Darwin") {
    command = config.changeLogCreator.initDiffDbScript.unix;
  }

  execSync(command, { stdio: "inherit" });
}

async function generateDiffChangelog(config) {
  const changelogName = readlineSync.question(
    "Please enter the name for the changelog file: "
  );
  const changelogFileName = generateChangelogFileName(changelogName, config);
  const changelogFilePath = path.join(
    config.changeLogCreator.outputGenerateDiffChangelogFilePath,
    changelogFileName
  );

  console.log("Generate diff database...");
  try {
    createChangelogForExecuteDiffDB(config);
    await dropAndCreateReferenceDatabase(config);
    initDiffDb(config);
    execSync(
      `liquibase update --changelog-file="${CHANGELOG_FOR_DIFF_DB_FILE_PATH}" --url="${config.database.referenceUrl}" --username="${config.database.referenceUsername}" --password="${config.database.referencePassword}"`,
      { stdio: "inherit" }
    );
    console.log(
      "Generate diff database passed successfully. Running Liquibase diff-changelog..."
    );

    execSync(
      `liquibase diff-changelog --changelog-file=${changelogFilePath} --url="${config.database.url}" --username="${config.database.username}" --password="${config.database.password}" --reference-url="${config.database.referenceUrl}" --reference-username="${config.database.referenceUsername}" --reference-password="${config.database.referencePassword}"`,
      { stdio: "inherit" }
    );

    console.log("Generate diff changelog file success");
  } catch (error) {
    console.error(
      "Generate diff database failed. Aborting Liquibase diff-changelog.",
      error
    );
  }
}

module.exports = {
  createChangelog,
  generateDiffChangelog,
};
