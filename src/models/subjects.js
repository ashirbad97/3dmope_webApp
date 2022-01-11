const mongoose = require('mongoose')

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
// Schema Statics
subjectSchema.statics.allSubjectList = async () => {
    subjectList = await Subjects.find().select('subjectId')
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
        ifUser = await Subjects.findOne({ subjectId })
        if (ifUser) {
            console.log("Found User ", subjectId)
            return true
        } else {
            console.log("Subject Not Found ", subjectId)
            return false
        }
    } catch (error) {
        console.log(error)
        return false
    }
}
const Subjects = mongoose.model('Subjects', subjectSchema)
module.exports = Subjects