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
router.get('/', async (req, res) => {
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
router.get('/parseAndPopulate?:sessionId', async (req, res) => {
    try {
        sessionId = req.query.sessionId
        sessionOutputCount = await Sessions.findOutputImages(sessionId)
    } catch (error) {
        console.log(error)
    }
})
router.get('/downloadOutputImg?:sessionId', async (req, res) => {
    try {
        sessionId = req.query.sessionId
        fileName = sessionId + ".zip"
        zippedDir = await lib.convertToZip(sessionId)
        res.set('Content-Type', 'application/octet-stream');
        res.set('Content-Disposition', `attachment; filename=${fileName}`);
        res.set('Content-Length', zippedDir.length);
        res.send(zippedDir);
    } catch (error) {
        console.log(error)
    }
})
module.exports = router