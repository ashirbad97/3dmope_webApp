const async = require('hbs/lib/async')
const mongoose = require('mongoose')
const Sessions = require('../models/sessions')
const fs = require("fs")
const path = require('path')
const lib = require("../lib")

const subjectSchema = new mongoose.Schema({
    subjectId: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    addnInfo: {
        type: String,
        trim: true
    }
})
// Schema Virtuals
subjectSchema.virtual('noOfsessions', {
    ref: 'Sessions',
    localField: '_id',
    foreignField: 'subjectId',
    count: true
})
subjectSchema.virtual('sessions', {
    ref: 'Sessions',
    localField: '_id',
    foreignField: 'subjectId',
})
// Schema Statics
subjectSchema.statics.allSubjectList = async () => {
    subjectList = await Subjects.find().select('subjectId').populate("noOfsessions")
    return subjectList
}

subjectSchema.statics.createNewUser = async (uid) => {
    try {
        newSubject = await Subjects({
            subjectId: uid
        })
        await newSubject.save()
        return true
    } catch (error) {
        console.log(error)
        return false
    }

}

subjectSchema.statics.findUser = async (subjectId) => {
    try {
        ifUser = await Subjects.findOne({ subjectId }).populate("noOfsessions")
        // console.log(ifUser)
        if (ifUser) {
            console.log("Found User ", subjectId)
            return ifUser
        } else {
            console.log("Subject Not Found ", subjectId)
            return false
        }
    } catch (error) {
        console.log(error)
        return false
    }
}

subjectSchema.statics.allSessionList = async (subjectId) => {
    try {
        listSessions = await Subjects.findOne({ subjectId }).populate("sessions").lean()
        return listSessions.sessions
    } catch (error) {
        console.log(error)
    }
}

// Schema Methods

subjectSchema.methods.createNewSession = async function () {
    subject = this
    totalSessions = await Sessions.find().count()
    console.log("Total No of sessions in server are : " + totalSessions)
    console.log("Creating a new Session ")
    session = await Sessions({
        sessionId: totalSessions + 1,
        timestamp: Date.now(),
        subjectId: this._id
    })
    newSession = await session.save()
    await lib.createNewFolder(this.subjectId, totalSessions + 1)
    return newSession
}


const Subjects = mongoose.model('Subjects', subjectSchema)
module.exports = Subjects