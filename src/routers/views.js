const express = require('express')
const router = new express.Router()
const path = require('path')
const lib = require("../lib")
// Importing Models
const Subjects = require('../models/subjects')
const Sessions = require('../models/sessions')
const async = require('hbs/lib/async')
const req = require('express/lib/request')
// Functions Start, remove to another file later

// End of functions and start of routers
// GET Homepage
router.get('/dashboard', async (req, res) => {
    try {
        allSubjects = await Subjects.allSubjectList()
        res.render('adminHome', { allSubjects })
    } catch (error) {
        console.log(error)
    }
})
// GET Individual Subject Page
router.get('/subjectSessions?:uid', async (req, res) => {
    try {
        // console.log(req.query.uid)
        subjectSessions = await Subjects.allSessionList(req.query.uid)
        for (i = 0; i < subjectSessions.length; i++) {
            subjectSessions[i].sessionStatus = await Sessions.findOutputImages(subjectSessions[i].sessionId)
        }
        res.render('subjectSessionList', { subjectSessions })
    } catch (error) {
        console.log(error)
    }
})
// Make Call to seed the db
router.post('/parsePopulateProcess', async (req, res) => {
    try {
        ifTrialOutputFolderExist = await lib.checkIfTrialOutputFolderExist(req.body.subjectId, req.body.sessionId)
        // console.log(ifTrialOutputFolderExist)
        if (ifTrialOutputFolderExist == "FoundFiles") {
            // If output images are found store them in db by calling each individual subtrialId
            for (i = 1; i < 7; i++) {
                // Possible Error since no error handling mechanism is present
                await lib.pythonParser(req.body.subjectId, req.body.sessionId, i)
            }
            // Possible Error since no error handling mechanism is present, just checks if able to close or not
            ifCallMoper = await lib.callMoperCore(req.body.sessionId)
            console.log("IfCallMoper value is : " + ifCallMoper)
            // Does not really work as error will never be null
            if (ifCallMoper != null) {
                res.status(200).send("Run Moper Code")
            }
        } else {
            res.status(500).send("Error while processing")
        }
    } catch (error) {
        res.status(500).send("Error while processing")
    }
})
// Downloading the ouput graph files
router.get('/downloadOutputImg?:sessionId', async (req, res) => {
    try {
        sessionId = req.query.sessionId
        fileName = sessionId + ".zip"
        // Specify the parent directory of the session Id folders
        zippedDir = await lib.convertToZip("sessionImgFolder", sessionId)
        res.set('Content-Type', 'application/octet-stream');
        res.set('Content-Disposition', `attachment; filename=${fileName}`);
        res.set('Content-Length', zippedDir.length);
        res.send(zippedDir);
    } catch (error) {
        console.log(error)
    }
})
// Downloading the raw .csv files
router.get('/downloadRawCsv', async (req, res) => {
    try {
        fileName = req.query.sessionId + "_csvFile" + ".zip"
        rawCsvZippedFile = await lib.getRawCsvFiles(req.query.subjectId, req.query.sessionId)
        res.set('Content-Type', 'application/octet-stream');
        res.set('Content-Disposition', `attachment; filename=${fileName}`);
        res.set('Content-Length', rawCsvZippedFile.length);
        res.status(200).send(rawCsvZippedFile)
    } catch (error) {
        console.log(error)
        res.status(500).send(error)
    }
})
// Show to main (entry) page
router.get('/', async (req, res) => {
    try {
        allSubjects = await Subjects.allSubjectList()
        res.render('mainPage', { allSubjects })
    } catch (error) {
        console.log(error)
    }
})
module.exports = router