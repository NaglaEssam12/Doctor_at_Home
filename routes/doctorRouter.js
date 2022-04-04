const express = require('express');

const {
        addDoctor,
        updateDoctor,
        addAvailableTimes,
        getAvailableTimes,
        addScheduledTimes,
        deleteDoctor,
        deleteAvailableTimes,
        deleteScheduledTimes,
        getDoctors,
        getDoctor,
        updateAvailableTimeSlot,
        updateScheduledTimeSlot,
        searchForDoctor,
        updateDoctorFields,
        getGender,
      } = require('../controllers/doctorController');


const router = express.Router();

router.post('/doctor/:id', addDoctor);
router.patch('/doctor/available/:id',addAvailableTimes);
router.patch('/doctor/scheduled/:id',addScheduledTimes);
router.patch('/doctor/:id', updateDoctorFields);

router.get('/doctor/available/:id', getAvailableTimes);
router.put('/doctor/:id', updateDoctor);

router.delete('/doctor/:id',deleteDoctor);
router.delete('/doctor/deleteAvailableTimes/:id',deleteAvailableTimes);
router.delete('/doctor/deleteScheduledTimes/:id',deleteScheduledTimes);

router.get('/doctor',getDoctors);
router.get('/doctor/:id',getDoctor);
router.get('/doctorSearch/:name',searchForDoctor);
router.get('/doctor/gender/:id',getGender);
router.patch('/doctor/updateAvailable/:id',updateAvailableTimeSlot);
router.patch('/doctor/updateScheduled/:id/:slot',updateScheduledTimeSlot);


/*router.get('/appointment', getAppointment);
router.delete('/appointment/:id',deleteAppointment);
router.put('/appointment/:id', updateAppointment);
router.patch('/appointment/:id', editAppointment);*/

module.exports = {
    routes: router
}
