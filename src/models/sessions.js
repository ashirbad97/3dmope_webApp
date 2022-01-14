const mongoose = require('mongoose')

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

const Sessions = mongoose.model('Sessions', sessionSchema)
module.exports = Sessions