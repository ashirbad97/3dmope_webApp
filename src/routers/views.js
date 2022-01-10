const express = require('express')
const router = new express.Router()
const path = require('path')

// Importing Models
const Subjects = require('../models/subjects')

// Functions Start, remove to another file later

// End of functions and start of routers
router.get('/', async (req, res) => {
    try {
        allSubjects = await Subjects.allSubjectList()
        res.render('adminHome',{allSubjects})
    } catch (error) {
        console.log(error)
    }
})

module.exports = router