const express = require('express');

const {addAppointment, 
       editAppointment, 
       getAppointment,
       getSpecificAppointments,
       updateAppointment,
       deleteAppointment,
       cancelAppointment,
       shiftAppointment,
       getSpecificTimeAppointments,
       getPatientAppointments,
       getDoctorAppointments
      } = require('../controllers/appointmentController');


const router = express.Router();

router.post('/appointment', addAppointment);

router.get('/appointment', getAppointment);
router.get('/appointment/:id', getSpecificAppointments);
router.get('/appointment/patient/:id', getPatientAppointments);
router.get('/appointment/doctor/:id', getDoctorAppointments);

router.get('/appointment/checkTime/:doctorName/:patientName', getSpecificTimeAppointments);

router.patch('/appointment/delete/:patientName/:doctorName/:date/:day',deleteAppointment);

router.patch('/appointment/cancel/:id',cancelAppointment);
router.patch('/appointment/shift/:id/:shiftAmount',shiftAppointment);

router.put('/appointment/:id', updateAppointment);
router.patch('/appointment/:id', editAppointment);

module.exports = {
    routes: router
}
