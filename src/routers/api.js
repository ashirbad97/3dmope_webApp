const express = require('express')
const async = require('hbs/lib/async')
const apirouter = new express.Router()
const path = require('path')
const fs = require("fs")
const formidable = require("formidable")
// const multer = require("multer")
// Importing Models
const Subjects = require('../models/subjects')
// Initialisation
// var upload = multer({})
const tempUploadFolder = path.join(__dirname, '../../tempUpload/')
const trialUploadFolder = path.join(__dirname, '../../trialOutput/')
// Functions are to be moved to another file later

// End of functions and start of routers
apirouter.post('/api/createUser', async (req, res) => {
    try {
        saveStatus = await Subjects.createNewUser(req.body.uid)
        console.log(saveStatus)
        if (saveStatus)
            res.status(200).send("Subject Saved")
        else
            throw Error('Not able to save')
    } catch (error) {
        console.log(error)
        res.status(500).send("Error saving the subject")
    }
})
// API Endpoint to check if a given uid exists
apirouter.post('/api/checkUser', async (req, res) => {
    try {
        checkIfUser = await Subjects.findUser(req.body.uid)
        if (checkIfUser) {
            sessionDetails = await checkIfUser.createNewSession()
            res.status(200).send(sessionDetails)
        }
        else return res.status(404).send("Subject Not Found")
    } catch (error) {
        console.log(error)
        res.status(500).send("Error fetching the user details")
    }
})
// API Endpoint to handle uploaded trial files
apirouter.post('/api/fileUploadHandler', async (req, res) => {
    try {
        console.log()
        const form = new formidable.IncomingForm()
        form.multilples = true
        form.uploadDir = tempUploadFolder
        // For some reason this only shows the last file
        form.parse(req, async (err, fields, files) => {
            if (err) {
                console.log(err)
            }
        })
        form.on('file', async (field, file) => {
            console.log(file.filepath)
            fs.renameSync(file.filepath, path.join(trialUploadFolder, file.originalFilename))
            console.log("Successfull")
        })
    } catch (error) {
        console.log(error)
    }
})

module.exports = apirouter