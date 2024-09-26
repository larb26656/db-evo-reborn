const fs = require('fs');
const path = require('path');
const glob = require('glob');

function deleteExistingFolder(folderPath) {
    if (fs.existsSync(folderPath)) {
        // console.log(`Deleting existing "${folderPath}" folder...`);
        fs.rmSync(folderPath, { recursive: true });
        // console.log(`"${folderPath}" folder deleted successfully.`);
    }
};

function createFolder(folderPath) {
    // console.log(`Creating "${folderPath}" folder...`);
    fs.mkdirSync(folderPath);
    // console.log(`"${folderPath}" folder created successfully.`);
};

function copyFilesSourceToTarget(sourceFolder, targetFolder, filesToInclude, filesToExclude = []) {
    console.log(`Copying files from "${sourceFolder}" to "${targetFolder}"...`);

    const allFilePathsToCopy = new Set();

    // Search for files matching filesToInclude patterns
    filesToInclude.forEach(includePattern => {
        const matchedFiles = glob.sync(includePattern, { cwd: sourceFolder });
        matchedFiles.forEach(file => allFilePathsToCopy.add(file));
    });

    // Remove files matching filesToExclude patterns
    filesToExclude.forEach(excludePattern => {
        allFilePathsToCopy.forEach(filePath => {
            if (filePath.match(excludePattern)) {
                allFilePathsToCopy.delete(filePath);
            }
        });
    });

    // Copy the remaining files to the target folder
    allFilePathsToCopy.forEach(file => {
        const sourcePath = path.join(sourceFolder, file);
        const destinationPath = path.join(targetFolder, file);
        fs.copyFileSync(sourcePath, destinationPath);
        console.log(`Copied ${file}`);
    });

    console.log(`Files copied successfully to "${targetFolder}" folder.`);
};

module.exports = {
    deleteExistingFolder,
    createFolder,
    copyFilesSourceToTarget
};