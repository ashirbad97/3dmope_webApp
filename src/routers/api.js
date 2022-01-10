const express = require('express')
const apirouter = new express.Router()
const path = require('path')

// Importing Models
const Subjects = require('../models/subjects')
// Functions are to be moved to another file later

// End of functions and start of routers
apirouter.post('/api/createUser', async (req, res) => {
    try {
        console.log(req.body)
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

module.exports = apirouter