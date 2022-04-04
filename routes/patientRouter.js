const express = require('express');
const router = express.Router();


const {
    addPatient,
    getPatient,
    updatePatient,
    getAllPatients,
    getGender,
    editPatient,
    getPatientEmail,
    deletePatient,
} = require("../controllers/patientController");

router.post("/patient/:id",addPatient);
router.get('/patient/gender/:id',getGender);
router.get('/patient',getAllPatients);
router.get('/patient/:id',getPatient);
router.get('/getPatientEmail',getPatientEmail);



router.put('/patient/:id',updatePatient);

router.patch('/patient/:id',editPatient);

router.delete('/patient/:id',deletePatient);
module.exports = {
    routes: router
}
