const express = require('express')
const router = new express.Router()

router.get('/', async (req, res) => {
    try {
        res.render('adminHome')
    } catch (error) {
        console.log(error)
    }
})

module.exports = router