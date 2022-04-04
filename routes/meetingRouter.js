const express = require('express');
const router = express.Router();


const { addMeeting, 
        getAllMeetings, 
        getMeeting,
        updateMeeting,
        deleteMeeting,
        getPrescriptionID
    } = require("../controllers/meetingController");

router.post("/meeting",addMeeting);

router.get('/meeting/:doctorID/:patientID/:date/:time', getPrescriptionID);

router.get('/meeting',getAllMeetings);
router.get('/meeting/:id',getMeeting);

router.put('/meeting/:id',updateMeeting);

router.delete('/meeting/:id',deleteMeeting);

module.exports = {
    routes: router
}