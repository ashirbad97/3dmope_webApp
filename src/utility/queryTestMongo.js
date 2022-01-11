const mongoose = require('../db/mongoose')
const Subjects = require('../models/subjects')

findAllPatients = async () => {
    try {
        allSubjects = await Subjects.find()
        console.log(allSubjects)
    } catch (error) {
        console.log(error)
    }

}

// findAllPatients()

findOnePatient = async (uid) => {
    try {
        patient = await Subjects.findOne({ subjectId: uid })
        console.log(patient)
    } catch (error) {
        console.log(error)
    }

}

findOnePatient("ashirbad97")