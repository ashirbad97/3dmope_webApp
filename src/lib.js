const path = require('path')
const fs = require("fs")
const trialUploadFolder = path.join(__dirname, '../trialOutput')
const tempUploadFolder = path.join(__dirname, '../tempUpload/')
seperator = "/"
// Function definition
createNewFolder = async (subjectId, newSessionCount) => {
    newFolderDir = path.join(trialUploadFolder, subjectId, seperator, newSessionCount.toString())
    // console.log("Creating new folder in: ", newFolderDir)
    if (!fs.existsSync(newFolderDir)) {
        fs.mkdirSync(newFolderDir, { recursive: true });
    }
}
handlerUploadFiles = async (uploadFileName, tempFileName) => {
    try {
        subjectId = uploadFileName.split('_')[0]
        sessionCount = uploadFileName.split('_')[1]
        targetFolderDir = path.join(trialUploadFolder, subjectId, seperator, sessionCount.toString())
        // console.log("Target Folder for trial files: ", targetFolderDir)
        if (!fs.existsSync(targetFolderDir)) {
            console.log("Folder earlier did not exist, creating a new one")
            fs.mkdirSync(targetFolderDir, { recursive: true });
        }
        fs.renameSync(tempFileName, path.join(targetFolderDir, uploadFileName))
    } catch (error) {
        console.log(error)
    }
}
module.exports = { createNewFolder, handlerUploadFiles }