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

subjectSchema.statics.findUser = async (uid) => {
    try {
        // Big ambiguity, due to some error the find function working with Postman API calls but not with Unity
        // so have to manually fetch all the users and check among them
        ifUser = await Subjects.find()
        console.log(ifUser.subjectId)
        if (ifUser) {
            console.log("Found User ", uid)
            return true
        } else {
            console.log("Subject Not Found ", uid)
            return false
        }
    } catch (error) {
        console.log(error)
        return false
    }
}
const Subjects = mongoose.model('Subjects', subjectSchema)
module.exports = Subjects