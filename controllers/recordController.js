const Joi = require('joi');

const Record = require('../models/record');
const admin = require('../db');
const db = admin.firestore();
const FieldValue = admin.firestore.FieldValue;

//add Record(POST)
const addRecord = async (req, res) => {
    try {
        const data = req.body;
        const result = validateRecord(data);
        if (result.error) {
            res.status(400).send(result.error.details[0].message);
            return;
        }
        await db.collection('Records').doc(req.params.id).set(data);
        res.send("Record has been added successfully");
    } catch (error) {
        res.status(400).send(error.message);
    }
}
//get all records(GET)
const getAllRecords = async (req, res) => {
    try {
        const records = await db.collection('Records').get();
        recordList = [];
        records.forEach(recordDoc => {
            const record = new Record(
                recordDoc.id,
                recordDoc.data().patientName,
                recordDoc.data().patientId,
                recordDoc.data().medications,
                recordDoc.data().hospitals,
                recordDoc.data().history,
                recordDoc.data().allergies
            );
            recordList.push(record);
        });
        res.send(recordList);
    } catch (error) {
        res.status(400).send(error.message);
    }
}
//get Record(GET)
const getRecord = async (req, res) => {
    try {
        const docRef = await db.collection('Records').doc(req.params.id).get();
        if(docRef.data())
            res.send(docRef.data());
        else
            res.status(404).send('Not Found');
    } catch (error) {
        res.status(400).send(error.message);
    }
}
//update Record(PUT)
const updateRecord = async (req, res) => {
    try {
        const data = req.body;
        const result = validateRecord(data);
        if (result.error) {
            res.status(400).send(result.error.details[0].message);
            return;
        }
        await db.collection('Record').doc(req.params.id).update(data);
        res.send("Record successfully updated");

    } catch (error) {
        res.status(404).send(error.message);
    }
}

const addPrescriptionToRecord = async (req, res) => {
    try {
        const patientId = req.body.appointmentInfo.patientInfo.id
       const docRef = await db.collection('Records').where('patientId', '==', patientId).get();


        let docId = '';
        let oldMed = '';
        let oldHistory = '';
        docRef.forEach(doc => {
                docId = doc.id
                oldMed = doc.data().medications
                oldHistory = doc.data().history
              });

         let medications = '';
        req.body.medicines.forEach(med => {
                medications += med.name + ","
              });

              medications += '-'
              oldHistory += "Went to doctor " + req.body.appointmentInfo.doctorInfo.name
              oldHistory +=  ' and took the medications : ' + medications

              let newMed = oldMed + medications

            await db.collection('Records').doc(docId).update({'medications' :newMed, 'history' : oldHistory})
            res.status(200).send('updated')

    } catch (error) {
        res.status(404).send(error.message);
console.log(error.message)
    }
}
//update patient(PATCH)
// const editPatient = async (req, res) => {
//     try {
//         const obj = updateField(req.body);
//         const { data, field } = obj;
//         await db.collection('Patients').doc(req.params.id).update(data);
//         res.send(`${field} was successfully updated`);
//     } catch (error) {
//         res.status(400).send(error.message);
//     }
// }

//delete patient(DELETE)
const deleteRecord = async (req, res) => {
    try {
        await db.collection('Record').doc(req.params.id).delete();
        res.send("Record deleted successfully");
    } catch (error) {
        res.status(400).send(error.message);
    }
}

//****************** Helper functions *****************
function validateRecord(record) {
    const schema = Joi.object({
        patientName: Joi.string(),
        patientId: Joi.string().required(),
        history: Joi.string().min(15).required(),
        medications:Joi.string().required(),
        allergies: Joi.string().required(),
        hospitals: Joi.string().required(),
    });

    const result = schema.validate(record);
    return result;
}

// function updateField(body) {
//     const { userInfo, email, phoneNumber, password, dateOfBirth, address, appointments } = body;
//     let field = "NULL";
//     if (userInfo) {
//         field = "userInfo";
//         return { data: {userInfo: userInfo}, field: field };
//     }
//     if (email) {
//         field = "E-mail";
//         return { data: {email: email}, field: field };
//     }
//     if (phoneNumber) {
//         field = "Phone Number";
//         return { data: { phoneNumber: phoneNumber }, field: field };
//     }
//     if (password) {
//         console.log(password);
//         field = "Password";
//         return { data: { password: password }, field: field };
//     }
//     if (dateOfBirth) {
//         field = "Date of Birth";
//         return { data: {dateOfBirth: dateOfBirth}, field: field };
//     }
//     if (address) {
//         field = "Address";
//         return { data: {address: address}, field: field };
//     }
//     if (appointments) {
//         field = "Appointments";
//         return { data: {appointments: appointments}, field: field };
//     }
// }

module.exports = {
    addRecord,
    getRecord,
    updateRecord,
    getAllRecords,
    addPrescriptionToRecord,
    deleteRecord,
    
}
