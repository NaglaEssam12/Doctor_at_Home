const Joi = require('joi');

const Prescription = require('../models/prescription');
const admin = require('../db');
const db = admin.firestore();
const FieldValue = admin.firestore.FieldValue;

//add prescription(POST)

// in addPrescription of ui,
// in for loop, call add medicine then append the returned document id into medicines list,
// after the for loop ends, call addPrescription and send to it the medicine list and other fields.
const addPrescription = (req, res) => {
    try {
        const data = req.body;
        const result = validatePrescription(data);
        if (result.error) {
            res.status(400).send(result.error.details[0].message);
            return;
        }
        const ref = db.collection('Prescriptions').doc()
        ref.set(data)
        res.send("Prescription has been added successfully, and the id is: "+ ref.id);
    } catch (error) {
        res.status(400).send(error.message);
    }
}


//get patient prescriptions (GET)
const getPatientPrescriptions = async (req, res) => {
    try {
        const prescriptions = await db.collection('Prescriptions').get();

        prescriptionList = [];
        prescriptions.forEach(prescriptionDoc => {
            let doc = prescriptionDoc.data();
            const {patient, doctor} = req.query
            let condition = (doc.appointmentInfo.doctorInfo.id == doctor && doc.appointmentInfo.patientInfo.id == patient)
            if(condition)
                prescriptionList.push(doc)
        });
        prescriptionList.push(prescriptionList.length)
        res.send(prescriptionList)
    } catch (error) {
        res.status(400).send(error.message);
    }
}

//get all prescriptions(GET)
const getAllPrescriptions = async (req, res) => {
    try {
        const prescriptions = await db.collection('Prescriptions').get();
        
        prescriptionList = [];
        prescriptions.forEach(prescriptionDoc => {
            medicineList = [];
            const medicineListSize = prescriptionDoc.data().medicines.length
            
            prescriptionDoc.data().medicines.forEach(async medicineID => {
                const medicine = await db.collection('Medicines').doc(medicineID).get();
                medicineList.push(medicine.data());

                if(medicineList.length == medicineListSize){
                    const prescription = new Prescription(
                        prescriptionDoc.id,
                        medicineList,
                        prescriptionDoc.data().startDate,
                        prescriptionDoc.data().endDate,
                        prescriptionDoc.data().appointmentInfo,
                        prescriptionDoc.data().scan,
                        prescriptionDoc.data().scanTime,
                        prescriptionDoc.data().note
                    );
                    prescriptionList.push(prescription);
                }

                if(prescriptionList.length == prescriptions.size){
                    res.send(prescriptionList);
                }
            });

        });
    } catch (error) {
        res.status(400).send(error.message);
    }
}

//get prescription(GET)
const getPrescription = async (req, res) => {
    try {
        const docRef = await db.collection('Prescriptions').doc(req.params.id).get();

        medicineList = [];
        const medicineListSize = docRef.data().medicines.length

        docRef.data().medicines.forEach(async medicineID => {
            const medicine = await db.collection('Medicines').doc(medicineID).get();
            medicineList.push(medicine.data());

            if(medicineList.length == medicineListSize){
                const prescription = new Prescription(
                    docRef.id,
                    medicineList,
                    docRef.data().startDate,
                    docRef.data().endDate,
                    docRef.data().appointmentInfo,
                    docRef.data().scan,
                    docRef.data().scanTime,
                    docRef.data().note
                );
                res.send(prescription);
            }
        });
        
    } catch (error) {
        res.status(400).send(error.message);
    }
}
//update prescription(PUT)
const updatePrescription = async (req, res) => {
    try {
        const data = req.body;
        const result = validatePrescription(data);
        if (result.error) {
            res.status(400).send(result.error.details[0].message);
            return;
        }
        await db.collection('Prescriptions').doc(req.params.id).update(data);
        res.send("Prescription successfully updated");

    } catch (error) {
        res.status(404).send(error.message);
    }
}

//delete prescription(DELETE)
const deletePrescription = async (req, res) => {
    try {
        await db.collection('Prescriptions').doc(req.params.id).delete();
        res.send("Prescription deleted successfully");
    } catch (error) {
        res.status(400).send(error.message);
    }
}

//****************** Helper functions *****************
function validatePrescription(prescription) {
    const schema = Joi.object({
        medicines: Joi.array().items(Joi.object({
            name: Joi.string().min(3).max(21).required(),
            dosage: Joi.string().min(1).max(21).required(),
            until: Joi.date()
        })),
        scans: Joi.array().items(Joi.object({
            name: Joi.string().min(1).max(21).required()
        })),
//        startDate: Joi.date().iso(),
        nextVisit: Joi.date().iso(),
        appointmentInfo: Joi.object({
            doctorInfo: Joi.object({
                name: Joi.string().min(3).required(),
                id: Joi.string().min(3).max(50).required()
            }),
            patientInfo: Joi.object({
                id: Joi.string().min(3).max(50).required()
            }),
            time: Joi.object({
                day: Joi.string().valid('Saturday','Sunday','Monday','Tuesday', 'Wednesday', 'Thursday', 'Friday').required(),
                date: Joi.date().iso().required(),
                time: Joi.string().min(3).required()
            })
        }),
        scan: Joi.string(),
        scanTime: Joi.string(),
        note: Joi.string()
    });

    const result = schema.validate(prescription);
    return result;
}

module.exports = {
    addPrescription,
    getPatientPrescriptions,
    getAllPrescriptions,
    getPrescription,
    updatePrescription,
    deletePrescription

}
