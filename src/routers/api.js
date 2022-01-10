const express = require('express')
const apirouter = new express.Router()
const path = require('path')
const sqlite3 = require('sqlite3').verbose();
// Functions are to be moved to another file later
// Path to database file
db_directory = path.join(__dirname, '../db/3dmoper.db')
// Defining connection to the on-disk db
let db = new sqlite3.Database(db_directory, (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log("Successfully connected to database")
    }
});

// End of functions and start of routers
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