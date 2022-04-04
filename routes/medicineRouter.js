const express = require('express');
const router = express.Router();


const { addMedicine, 
        getAllMedicines, 
        getMedicine, 
        updateMedicine, 
        deleteMedicine 
    } = require("../controllers/medicineController");

router.post("/medicine",addMedicine);

router.get('/medicine',getAllMedicines);
router.get('/medicine/:id',getMedicine);

router.put('/medicine/:id',updateMedicine);

router.delete('/medicine/:id',deleteMedicine);

module.exports = {
    routes: router
}