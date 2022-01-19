const async = require('hbs/lib/async')
const mongoose = require('mongoose')
const lib = require("../lib")

const sessionSchema = new mongoose.Schema({
    sessionId: {
        type: Number,
        required: true,
        unique: true
    },
    timestamp: {
        type: Date,
        required: true
    },
    subjectId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Subjects'
    },
    trialFilesDir: {
        type: String,
        trim: true
    },
    outputFilesDir: {
        type: String,
        trim: true
    }
})

sessionSchema.statics.findSessionOfSubject = async (subjectId) => {
    try {
        subjectSessions = Sessions.find(subjectId).count()
    } catch (error) {
        console.log(error)
    }
}

sessionSchema.statics.findOutputImages = async (sessionId) => {
    try {
        // Check if the session exist in the db
        sessionCheck = await Sessions.findOne({ sessionId })
        if (!sessionCheck) {
            console.log('Session not found in MongoDB')
            return false
        }
        else {
            ifFilesExistinSessionFolder = await lib.checkIfSessionImgFolderExist(sessionId)
            if (ifFilesExistinSessionFolder) return true
            else return false
        }
    } catch (error) {
        console.log(error)
    }
}

const Sessions = mongoose.model('Sessions', sessionSchema)
module.exports = Sessions