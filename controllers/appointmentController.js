const express = require('express');
const Joi = require('joi');

const Appointment = require('../models/appointment');
const Doctor = require('../models/doctor');

const admin = require('../db');

const db = admin.firestore();
const FieldValue = admin.firestore.FieldValue;


//add appointment
const addAppointment = async (req, res) => {
    try {
        const data = req.body;
        const result = validateAppointment(data);
        if (result.error){
            res.status(400).send(result.error.details[0].message);
            return;
        }
        await db.collection('Appointments').add(data);
        res.send('Record saved successfuly');
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const getAppointment = async (req,res) =>{
    try{
        const docRef = await db.collection('Appointments').get();
        appointmentArray = [];
        docRef.forEach(doc =>{
            const appointment = new Appointment(
                doc.id,
                doc.data().doctorInfo,
                doc.data().time,
                doc.data().phoneNumber,
                doc.data().patientInfo,
                doc.data().reason,
                doc.data().prescription
            );
            appointmentArray.push(appointment);
        });
        res.send(appointmentArray);

    }catch(error){
        res.status(404).send("No appointments");
    }
};
const getPatientAppointments = async (req,res) =>{
    try{
        const docRef = await db.collection('Appointments').get();
        appointmentArray = [];
        patientEmail = req.params.id;
        docRef.forEach(doc =>{
            if (patientEmail == doc.data().patientInfo.id){
                const appointment = [
                    doc.id,
                    doc.data().doctorInfo,
                    doc.data().time,
                    doc.data().phoneNumber,
                    doc.data().patientInfo,
                    doc.data().reason,
                    doc.data().prescription
                ]

                appointmentArray.push(appointment);
            }
        });
        res.send(appointmentArray);

    }catch(error){
        console.log(error.message);
        res.status(404).send("No appointments");
    }
};
const getDoctorAppointments = async (req,res) =>{
    try{
        const docRef = await db.collection('Appointments').get();
        appointmentArray = [];
        doctorEmail = req.params.id;
        docRef.forEach(doc =>{
            if (doctorEmail == doc.data().doctorInfo.id){
                const appointment = [
                    doc.id,
                    doc.data().doctorInfo,
                    doc.data().time,
                    doc.data().phoneNumber,
                    doc.data().patientInfo,
                    doc.data().reason,
                    doc.data().prescription
                ]

                appointmentArray.push(appointment);
            }
        });
        res.send(appointmentArray);

    }catch(error){
        console.log(error.message);
        res.status(404).send("No appointments");
    }
};

//get all doctors that match the inserted email from the appointments collection
const getSpecificAppointments = async (req,res) =>{
    //try{
        const docRef = await db.collection('Appointments').get();
        doctorArray = [];
        patientArray = [];
        infoArray = [];
        counter = 0;
        // console.log(Object.values(docRef.docs));
        for (const doc of docRef.docs){
            counter += 1;
            console.log(doc.data());
            
            if(doc.data().patientInfo.id == req.params.id){
                console.log(doc.data().doctorInfo.id);
                const docRef1 = await db.collection('Doctors').doc(doc.data().doctorInfo.id).get();
                    console.log(docRef1.data());
                    const doctorInfo = [
                        docRef1.data().userInfo.name,
                        docRef1.data().email,

                    ]
                    infoArray.push(doctorInfo);
                
            }
            else if(doc.data().doctorInfo.id == req.params.id){
                const docRef1 = await db.collection('Patients').doc(doc.data().patientInfo.id).get();
                    // console.log(docRef1.data().userInfo.name);
                    const patientInfo = [
                        docRef1.data().userName,
                        docRef1.data().email
                    ]
                    infoArray.push(patientInfo);
                
            }
    }
        console.log("Entered");

                if(counter == docRef.size){
                    console.log(counter);
                    console.log(docRef.size);
                    console.log(infoArray);
                    res.send(infoArray);
                }

        
        
    // }catch(error){
    //     console.log(error.message);
    //     res.status(404).send("No appointments with the doctor!"+error.message);
    // }
};

//get messaging access denpends on the time of the appointment
const getSpecificTimeAppointments = async (req,res) =>{
    try{
        const docRef = await db.collection('Appointments').get();
        flagArray = [];
        hours = 0;
        state = "";
        startTime = "";
        startDate = "";
        endDate = "";
        flag = "";

        currentDate = new Date();
        console.log(currentDate);

        docRef.forEach(doc =>{
            console.log('---------');
            console.log(doc.data().doctorInfo.name);
            console.log(req.params.doctorName);
            console.log(doc.data().patientInfo.name);
            console.log(req.params.patientName);
            console.log('----------');
            if((doc.data().doctorInfo.name == req.params.doctorName && doc.data().patientInfo.name == req.params.patientName) ||
            (doc.data().doctorInfo.name == req.params.patientName && doc.data().patientInfo.name == req.params.doctorName) ){
                startTime = doc.data().time.time;
                arr = startTime.split(" ");
                str = arr[0] + "";
                arr1 = str.split(":");
                hours = arr1[0];
                if((parseInt(arr1[0]) < 12) && arr[1] == "PM"){
                    hours = parseInt(arr1[0]) + 12;
                }
                if((parseInt(arr1[0]) == 12) && arr[1] == "AM"){
                    hours = "00";
                }

                myDate = doc.data().time.date + " " + hours + ":" + arr1[1] + ":" + "00";
                startDate = new Date(myDate);
                
                endDate = new Date(startDate);
                endDate.setMinutes( endDate.getMinutes() + 30 );
                
                console.log(startDate);
                console.log(endDate);
                if((currentDate.getTime() >= startDate.getTime()) && (currentDate.getTime() <= endDate.getTime())){
                    flag = "true";
                }
                else{
                    flag = "false";
                }
                flagArray.push(flag);
            }
        });
        res.send(flagArray);

    }catch(error){
        console.log(error.message);
        res.status(404).send("No appointments with the doctor" );
    }
};

// const deleteAppointment = async(req,res) =>{
//     try {
//         const docRef = db.collection('Appointments').doc(req.params.id);
//         await docRef.delete();
//         res.send('Appointment deleted successfully');
//     } catch (error) {
//         res.status(404).send("Invalid appointment ID");
//     }
// };
const updateAppointment = async(req,res) =>{
    try {
        const docRef = db.collection('Appointments').doc(req.params.id);
        await docRef.update({
            doctorInfo: req.body.doctorInfo,
            time: req.body.time,
            phoneNumber: req.body.phoneNumber,
            patientInfo: req.body.patientInfo,
            reason: req.body.reason,
            prescription: req.body.prescription
        });
        res.send("Appointment updated successfully");
     } catch (error) {
         res.status(404).send("Invalid appointment ID");
     }
}
// patch doctor
const cancelAppointment = async(req,res) =>{
    try {
        const docRef = await db.collection('Appointments').doc(req.params.id).get();
        const doctorID = docRef.data().doctorInfo.id;
        const date = docRef.data().time.date;
        const slot = docRef.data().time.time;
        const doctorRef = await db.collection('Doctors').doc(doctorID).get();
        
        const availableTimes = doctorRef.data().availableTimes;
        const scheduledTimes = doctorRef.data().scheduledTimes;
        for(let obj of scheduledTimes){
            if (obj.date == date){
                for(const [key, value] of Object.entries(obj.Time)){
                    if(value == slot){
                        //delete time from scheduledTimes
                        await db.collection('Doctors').doc(doctorID).update({ scheduledTimes: FieldValue.arrayRemove(obj) });
                        delete obj.Time[key];
                        await db.collection('Doctors').doc(doctorID).update({ scheduledTimes: FieldValue.arrayUnion(obj) });
                        //restoring time in available times
                        for (let item of availableTimes){
                            if(item.date == date){
                                await db.collection('Doctors').doc(doctorID).update({ availableTimes: FieldValue.arrayRemove(item) });
                                item.Time[key] = slot;
                                await db.collection('Doctors').doc(doctorID).update({ availableTimes: FieldValue.arrayUnion(item) });
                            }
                        }
                    }
                }
            }
        }
        await db.collection('Appointments').doc(req.params.id).delete();

    res.send("Appointment Canceled");

    } catch (error) {
        res.status(404).send(error.message);
    }
}
const deleteAppointment = async(req,res) =>{
    try {
        // const docRef = await db.collection('Appointments').doc(req.params.id).get();
        const appointmentRef = db.collection('Appointments');
        const docRef = await appointmentRef
        .where('patientInfo.name', '==', req.params.patientName)
        .where('doctorInfo.name', '==', req.params.doctorName)
        .where('time.date', '==', req.params.date)
        .where('time.day', '==', req.params.day).get();
        if (docRef.empty) {
            console.log('No matching documents.');
            return;
          }  
          docRef.forEach(async doc =>{
            console.log(doc.data());
            const doctorID = doc.data().doctorInfo.id;
            const date = doc.data().time.date;
            const slot = doc.data().time.time;
            const doctorRef = await db.collection('Doctors').doc(doctorID).get();
            
            const scheduledTimes = doctorRef.data().scheduledTimes;
            for(let obj of scheduledTimes){
                if (obj.date == date){
                    for(const [key, value] of Object.entries(obj.Time)){
                        if(value == slot){
                            //delete time from scheduledTimes
                            await db.collection('Doctors').doc(doctorID).update({ scheduledTimes: FieldValue.arrayRemove(obj) });
                            delete obj.Time[key];
                            await db.collection('Doctors').doc(doctorID).update({ scheduledTimes: FieldValue.arrayUnion(obj) });
                        }
                    }
                }
            }
            await db.collection('Appointments').doc(doc.id).delete();
          });

    res.send("Appointment Deleted");

    } catch (error) {
        res.status(404).send(error.message);
    }
}

const editAppointment = async(req,res) =>{
    try {
        const docRef = db.collection('Appointments').doc(req.params.id);
        const {doctorInfo,time,phoneNumber,patientInfo,reason} = req.body;
        if(phoneNumber){
            console.log(phoneNumber);
            docRef.phoneNumber = phoneNumber;
            await docRef.update({phoneNumber: docRef.phoneNumber});
        }
        if(doctorInfo){
            docRef.doctorInfo = doctorInfo;
            console.log(docRef.doctorInfo);
            await docRef.update({doctorInfo: docRef.doctorInfo});
        }
        if(time){
            docRef.time = time;
            await docRef.update({time: docRef.time});
        }
        if(patientInfo){
            docRef.patientInfo = patientInfo;
            await docRef.update({patientInfo: docRef.patientInfo});
        }
        if(reason){
            docRef.reason = reason;
            await docRef.update({reason: docRef.reason});
        }        
        res.send("Appointment updated successfully");
     } catch (error) {
         res.status(404).send("Invalid appointment ID");
     }
}

//shifts all appointments in a specific date
const shiftAppointment = async(req,res) =>{
    try {
        let docRef = await db.collection('Appointments').doc(req.params.id).get();
        const appointmentDate = docRef.data().time.date; 
        const shiftAmount = parseInt(req.params.shiftAmount);
        appointmentTime = docRef.data().time.time;
        let newTime = shiftTime(appointmentTime,shiftAmount);
        
        await db.collection('Appointments').doc(req.params.id).update({"time.time": newTime});

        const doctorID = docRef.data().doctorInfo.id;
        const doctorRef = await db.collection('Doctors').doc(doctorID).get();
        for(let obj of doctorRef.data().scheduledTimes){
            if(obj.date == appointmentDate){
                let slotArray = Object.entries(obj.Time);
                for (let [slot,slotVal] of slotArray){
                    if(appointmentTime == slotVal){
                        await db.collection('Doctors').doc(doctorID).update({ scheduledTimes: FieldValue.arrayRemove(obj) });
                        //for each key in obj.Time
                        for ([slot,slotVal] of slotArray){
                            newTime = shiftTime(slotVal,shiftAmount);
                            obj.Time[slot] = newTime;
                        }
                        console.log(obj);
                        await db.collection('Doctors').doc(doctorID).update({ scheduledTimes: FieldValue.arrayUnion(obj) });
                    }
                }
            }
        }
        res.send(`Appointment shifted by ${shiftAmount} hours`);
    } catch (error) {
        res.send(error.message);
    }
}

function shiftTime(appointmentTime, shiftAmount){
    hourString = appointmentTime.split(":");
    hour = parseInt(hourString[0]);
    let newTime = "";
        if(hour+shiftAmount > 12 && hourString[1].includes("PM")){
            newTime = shiftAmount-(12-hour).toString()+":00 AM";
        }
        else if (hour+shiftAmount > 12 && hourString[1].includes("AM")){
            newTime = shiftAmount-(12-hour).toString()+":00 PM";
        }
        else{
            newTime = (hour+shiftAmount).toString() + ":" + hourString[1];
        }
    return newTime;
}

function validateAppointment(appointment){
    const schema = Joi.object({
        reason: Joi.string().min(3),
        phoneNumber: Joi.string().min(11),
        time: Joi.object({
            day: Joi.string().valid('Saturday','Sunday','Monday','Tuesday', 'Wednesday', 'Thursday', 'Friday').required(),
            date: Joi.date().iso().required(),
            time: Joi.string().min(6).required()
        }),
        
        doctorInfo: Joi.object({
            name: Joi.string().min(3).required(),
            id: Joi.string().min(3).required()

        }),
        patientInfo: Joi.object({
            name: Joi.string().min(3).required(),
            id:Joi.string().min(3).required()
        }),
        prescription: Joi.string().min(3).max(21)
    });

    const result = schema.validate(appointment);
    return result;
}

module.exports = {
    addAppointment,
    editAppointment,
    deleteAppointment,
    updateAppointment,
    getAppointment,
    getPatientAppointments,
    getSpecificAppointments,
    getSpecificTimeAppointments,
    cancelAppointment,
    shiftAppointment,
    getDoctorAppointments
}
