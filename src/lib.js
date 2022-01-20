const path = require('path')
const fs = require("fs")
const async = require('hbs/lib/async')
const admz = require('adm-zip')
const trialUploadFolder = path.join(__dirname, '../trialOutput')
const tempUploadFolder = path.join(__dirname, '../tempUpload/')
const sessionImgFolder = path.join(__dirname, '../imgOutput/')
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
checkIfSessionImgFolderExist = async (sessionId) => {
    try {
        targetSessionFolder = path.join(sessionImgFolder, sessionId.toString())
        if (fs.existsSync(targetSessionFolder)) {
            // console.log("Folder Exist")
            // Find the list of all output img files
            sessionOutputFileList = fs.readdirSync(targetSessionFolder)
            // Check if folder is not empty
            if (sessionOutputFileList.length != 0) {
                return true
            } else {
                // console.log("Session Output Img Folder is empty")
                return false
            }
        } else {
            // console.log("Folder does not exist")
            return false
        }
    } catch (error) {
        console.log(error)
        return false
    }
}
convertToZip = async (sessionId) => {
    try {
        targetSessionFolder = path.join(sessionImgFolder, sessionId.toString())
        // console.log(targetSessionFolder)
        if (fs.existsSync(targetSessionFolder)) {
            sessionOutputFileList = fs.readdirSync(targetSessionFolder)
            zp = new admz()
            sessionOutputFileList.forEach(file => {
                // console.log(path.join(targetSessionFolder, "/", file))
                zp.addLocalFile(path.join(targetSessionFolder, "/", file))
            });
            const zippedData = zp.toBuffer()
            return zippedData
        }
        return false
    } catch (error) {
        console.log(error)
        return false
    }
}
module.exports = { createNewFolder, handlerUploadFiles, checkIfSessionImgFolderExist, convertToZip }