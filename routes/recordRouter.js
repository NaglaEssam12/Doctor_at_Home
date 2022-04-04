const express = require('express');
const router = express.Router();


const {
    addRecord,
    getRecord,
    updateRecord,
    getAllRecords,
    addPrescriptionToRecord,
    deleteRecord,

} = require("../controllers/recordController");

router.post("/record/:id",addRecord);

router.get('/record',getAllRecords);
router.get('/record/:id',getRecord);

router.put('/record/:id',updateRecord);

router.put('/addPrescriptionToRecord',addPrescriptionToRecord);

// router.patch('/patient/:id',editPatient);

router.delete('/record/:id',deleteRecord);

module.exports = {
    routes: router
}
