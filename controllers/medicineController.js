const Joi = require('joi');

const Medicine = require('../models/medicine');
const admin = require('../db');
const db = admin.firestore();
const FieldValue = admin.firestore.FieldValue;

//add medince(POST)
const addMedicine = async (req, res) => {
    try {
        const data = req.body;
        const result = validateMedicine(data);
        if (result.error) {
            res.status(400).send(result.error.details[0].message);
            return;
        }
        const ref = db.collection('Medicines').doc()
        ref.set(data)  
        res.send("Medicine has been added successfully, and the id is: "+ ref.id);
    } catch (error) {
        res.status(400).send(error.message);
    }
}

//get all medicines(GET)
const getAllMedicines = async (req, res) => {
    try {
        const medicines = await db.collection('Medicines').get();
        medicineList = [];
        medicines.forEach(medicineDoc => {
            const medicine = new Medicine(
                medicineDoc.id,
                medicineDoc.data().medicineName,
                medicineDoc.data().typeOfMedicine,
                medicineDoc.data().strength,
                medicineDoc.data().methodOfIntake,
                medicineDoc.data().quantity,
                medicineDoc.data().dosage,
                medicineDoc.data().timeOfDosage,
                medicineDoc.data().otherInstructions,
                medicineDoc.data().startDate,
                medicineDoc.data().endDate,
                medicineDoc.data().takenFor,
                medicineDoc.data().sideEffect
            );
            medicineList.push(medicine);
        });
        res.send(medicineList);
    } catch (error) {
        res.status(400).send(error.message);
    }
}
//get medicine(GET)
const getMedicine = async (req, res) => {
    try {
        const docRef = await db.collection('Medicines').doc(req.params.id).get();

        res.send(docRef.data());
    } catch (error) {
        res.status(400).send(error.message);
    }
}
//update prescription(PUT)
const updateMedicine = async (req, res) => {
    try {
        const data = req.body;
        const result = validateMedicine(data);
        if (result.error) {
            res.status(400).send(result.error.details[0].message);
            return;
        }
        await db.collection('Medicines').doc(req.params.id).update(data);
        res.send("Medicine successfully updated");

    } catch (error) {
        res.status(404).send(error.message);
    }
}

//delete medicine(DELETE)
const deleteMedicine = async (req, res) => {
    try {
        await db.collection('Medicines').doc(req.params.id).delete();
        res.send("Medicine deleted successfully");
    } catch (error) {
        res.status(400).send(error.message);
    }
}

//****************** Helper functions *****************
function validateMedicine(medicine) {
    const schema = Joi.object({
        medicineName: Joi.string().required(),
        typeOfMedicine: Joi.string().required(),
        strength: Joi.number().positive().required(),
        methodOfIntake: Joi.string(),
        quantity: Joi.number().positive().required(),
        dosage: Joi.string().required(),
        timeOfDosage: Joi.string().required(),
        otherInstructions: Joi.string(),
        startDate: Joi.date().iso(),
        endDate: Joi.date().iso(),
        takenFor: Joi.string().min(3).required(),
        sideEffect: Joi.string().min(3)
    });

    const result = schema.validate(medicine);
    return result;
}

module.exports = {
    addMedicine,
    getAllMedicines,
    getMedicine,
    updateMedicine,
    deleteMedicine
}