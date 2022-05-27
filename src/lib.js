const path = require('path')
const fs = require("fs")
const { spawn, spawnSync } = require('child_process')
const async = require('hbs/lib/async')
const admz = require('adm-zip')
const trialUploadFolder = path.join(__dirname, '../trialOutput')
const tempUploadFolder = path.join(__dirname, '../tempUpload/')
const sessionImgFolder = path.join(__dirname, '../imgOutput/')
const dbFilePath = path.join(__dirname, '/db/3dmoper.db')
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
// Lib function to check if the raw .csv folder exist or not
checkIfTrialOutputFolderExist = async (subjectId, sessionId) => {
    targetTrialOutputFolder = path.join(trialUploadFolder, seperator, subjectId.toString(), sessionId.toString())
    // console.log(targetTrialOutputFolder)
    if (fs.existsSync(targetTrialOutputFolder)) {
        // console.log("Folder Exist")
        // Find the list of all output img files
        trialOutputFileList = fs.readdirSync(targetTrialOutputFolder)
        // Check if folder is not empty
        if (trialOutputFileList.length != 6) {
            return "Not Found 6 Trial Files"
        } else {
            // console.log("Session Output Img Folder is empty")
            return "FoundFiles"
        }
    } else {
        // console.log("Folder does not exist")
        return "Trial Folder does not exist"
    }
}
// Lib function to fetch the raw .csv files
getRawCsvFiles = async (subjectId, sessionId) => {
    try {
        ifTrialOutputFolderExist = await checkIfTrialOutputFolderExist(subjectId, sessionId)
        if (ifTrialOutputFolderExist == "FoundFiles") {
            // N.B: Since in /trialOuput sessionID's are contained inside the subjectID we will have to concatenate them
            trialFolder = subjectId + "/" + sessionId
            // As called function determines all 6 files exist can assume all trials are present
            // Send output folder to be zipped with parent folder parameter
            zippedRawCsvFiles = await convertToZip("trialUploadFolder", trialFolder)
            if (!zippedRawCsvFiles) throw new Error("raw .csv files could not be zipped")
            return zippedRawCsvFiles
        } else {
            console.log("Error: ", ifTrialOutputFolderExist)
            return false
        }
    } catch (error) {
        console.log(error)
        return false
    }
}
// Lib function to go through a set of files in a folder validate them and convert into a zipped file
convertToZip = async (parentFolder, sessionId) => {
    try {
        // Really bad way of checking conditions which one is the parent folder
        if (parentFolder == "sessionImgFolder") {
            parentFolder = sessionImgFolder
        } else if (parentFolder == "trialUploadFolder") {
            parentFolder = trialUploadFolder
        } else {
            throw new Error('Parent Folder Invalid')
        }
        // Joining the parent folder with the sessions folder
        targetSessionFolder = path.join(parentFolder, sessionId.toString())
        if (fs.existsSync(targetSessionFolder)) {
            sessionOutputFileList = fs.readdirSync(targetSessionFolder)
            zp = new admz()
            sessionOutputFileList.forEach(file => {
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
pythonParser = async (subjectId, sessionId, trialId) => {
    try {
        targetParserPath = path.join(__dirname, "/utility/", "trialFilesParser.py")
        // console.log(targetParserPath)
        watchParser = spawnSync('python3', ["-u", targetParserPath, "-sessionId", sessionId, "-userId", subjectId, "-subtrialId", trialId], {
            cwd: process.cwd(),
            env: process.env,
            stdio: 'pipe',
            encoding: 'utf-8'
        });
        // console.log(watchParser.output)
    } catch (error) {
        console.log(error)
        return false
    }
}
callMoperCore = async (sessionId) => {
    try {
        moperCorePath = path.join(__dirname, "/utility/", "run_moperCore.sh")
        mrcPath = "/usr/local/MATLAB/MATLAB_Runtime/v99"
        watchMoper = spawnSync('bash', ["-u", moperCorePath, mrcPath, sessionId, dbFilePath, sessionImgFolder], {
            cwd: process.cwd(),
            env: process.env,
            stdio: 'pipe',
            encoding: 'utf-8'
        })
        console.log(watchMoper)
        return watchMoper
    } catch (error) {
        console.log(error)
        return false
    }
}
module.exports = {
    createNewFolder, handlerUploadFiles, checkIfSessionImgFolderExist,
    convertToZip, checkIfTrialOutputFolderExist, pythonParser,
    callMoperCore, getRawCsvFiles
}