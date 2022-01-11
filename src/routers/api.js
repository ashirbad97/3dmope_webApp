const express = require('express')
const apirouter = new express.Router()
const path = require('path')

// Importing Models
const Subjects = require('../models/subjects')
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
        // uid = JSON.stringify(req.query.uid)
        console.log(req.body)
        // console.log(typeof (req.query.uid))
        // uid = String(req.query.uid)
        // checkIfUser = await Subjects.findUser(subjectUid)
        // checkIfUser = await Subjects.find({ subjectId: JSON.parse(uid) })
        // console.log(checkIfUser)
        // if (checkIfUser) res.status(200).send("Subject Found")
        // else return res.status(404).send("Subject Not Found")
    } catch (error) {
        console.log(error)
        res.status(500).send("Error fetching the user details")
    }
})

module.exports = apirouter