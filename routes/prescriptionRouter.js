const express = require('express');
const router = express.Router();


const { addPrescription,
        getPatientPrescriptions,
        getAllPrescriptions, 
        getPrescription,
        updatePrescription,
        deletePrescription
    } = require("../controllers/prescriptionController");

router.post("/prescription",addPrescription);

router.get('/patientprescriptions',getPatientPrescriptions);

router.get('/prescription',getAllPrescriptions);
router.get('/prescription/:id',getPrescription);

router.put('/prescription/:id',updatePrescription);

router.delete('/prescription/:id',deletePrescription);

module.exports = {
    routes: router
}