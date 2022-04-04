const Joi = require('joi');

const Patient = require('../models/patient');
const admin = require('../db');
const db = admin.firestore();
const FieldValue = admin.firestore.FieldValue;

//add patient(POST)
const addPatient = async (req, res) => {
    try {
        const data = req.body;
        const result = validatePatient(data);
        if (result.error) {
            res.status(400).send(result.error.details[0].message);
            console.log('error');
            return;
        }
        console.log('Done');
        await db.collection('Patients').doc(req.params.id).set(data);
        res.send("Patient has been added successfully");
    } catch (error) {
        res.status(400).send(error.message);
    }
}
//get all patient(GET)
const getAllPatients = async (req, res) => {
    try {
        const patients = await db.collection('Patients').get();
        patientList = [];
        patients.forEach(patientDoc => {
            const patient = new Patient(
                patientDoc.id,
                patientDoc.data().userInfo,
                patientDoc.data().email,
                patientDoc.data().password,
                patientDoc.data().phoneNumber,
                patientDoc.data().dateOfBirth,
                patientDoc.data().address,
                patientDoc.data().appointments
            );
            patientList.push(patient);
        });
        res.send(patientList);
    } catch (error) {
        res.status(400).send(error.message);
    }
}
//get patient(GET)
const getPatient = async (req, res) => {
    try {
        const docRef = await db.collection('Patients').doc(req.params.id).get();
        
        res.send(docRef.data());
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const getPatientEmail = async (req, res) => {
    try {

    const docRef = await db.collection('Patients').where('userName', '==', req.query.pname).get();
      let email = '';
      docRef.forEach(doc => {
        email = doc.id
      });

        res.send(email);
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const getGender = async (req, res) => {
    try {
        const docRef = await db.collection('Patients').doc(req.params.id).get();
        
        res.send(docRef.data().gender);
    } catch (error) {
        res.status(400).send(error.message);
    }
}
//update patient(PUT)
const updatePatient = async (req, res) => {
    try {
        const data = req.body;
        const result = validatePatient(data);
        if (result.error) {
            res.status(400).send(result.error.details[0].message);
            return;
        }
        await db.collection('Patients').doc(req.params.id).update(data);
        res.send("Patient successfully updated");

    } catch (error) {
        res.status(404).send(error.message);
    }
}
//update patient(PATCH)
const editPatient = async (req, res) => {
    try {
        const obj = updateField(req.body);
        const { data, field } = obj;
        await db.collection('Patients').doc(req.params.id).update(data);
        res.send(`${field} was successfully updated`);
    } catch (error) {
        res.status(400).send(error.message);
    }
}

//delete patient(DELETE)
const deletePatient = async (req, res) => {
    try {
        await db.collection('Patients').doc(req.params.id).delete();
        res.send("Patient deleted successfully");
    } catch (error) {
        res.status(400).send(error.message);
    }
}

//****************** Helper functions *****************
function validatePatient(patient) {
    const schema = Joi.object({
        password: Joi.string().min(6).required(),
        phoneNumber: Joi.string().min(11),
        dateOfBirth: Joi.date().iso().required(),
        address: Joi.string().min(4).required(),
        email: Joi.string().email(),
        /*userInfo: Joi.object({
            name: Joi.string().min(3).required(),
            id: Joi.string().min(3).max(21).required()

        }),*/
        gender: Joi.string().valid("female","male","Female","Male"),
        userName: Joi.string().min(3).required(),
        appointments: Joi.object({
            appointmentID: Joi.string().min(3).max(21).required()
        }),
    });

    const result = schema.validate(patient);
    return result;
}

function updateField(body) {
    const { userInfo, email, phoneNumber, password, dateOfBirth, address, appointments } = body;
    let field = "NULL";
    if (userInfo) {
        field = "userInfo";
        return { data: {userInfo: userInfo}, field: field };
    }
    if (email) {
        field = "E-mail";
        return { data: {email: email}, field: field };
    }
    if (phoneNumber) {
        field = "Phone Number";
        return { data: { phoneNumber: phoneNumber }, field: field };
    }
    if (password) {
        console.log(password);
        field = "Password";
        return { data: { password: password }, field: field };
    }
    if (dateOfBirth) {
        field = "Date of Birth";
        return { data: {dateOfBirth: dateOfBirth}, field: field };
    }
    if (address) {
        field = "Address";
        return { data: {address: address}, field: field };
    }
    if (appointments) {
        field = "Appointments";
        return { data: {appointments: appointments}, field: field };
    }
}

module.exports = {
    addPatient,
    getPatient,
    updatePatient,
    getAllPatients,
    editPatient,
    deletePatient,
    getGender,
    getPatientEmail
}
