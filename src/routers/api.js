const express = require('express')
const apirouter = new express.Router()

apirouter.post('/api/createUser', async (req, res) => {
    try {
        console.log(req.body)
        res.status(200).send("Score Received")
    } catch (error) {
        console.log(error)
        res.status(500).send("Error saving the scores")
    }
})

module.exports = apirouter