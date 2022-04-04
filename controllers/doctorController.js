// const express = require('express');
const Joi = require('joi');

const Doctor = require('../models/doctor');

const admin = require('../db');

const db = admin.firestore();

const FieldValue = admin.firestore.FieldValue;


const addDoctor = async (req, res) => {
    try {
        const data = req.body;
        const result = validateDoctor(data);
        if (result.error) {
            res.status(400).send(result.error.details[0].message);
            return;
        }
        await db.collection('Doctors').doc(req.params.id).set(data);
        res.send('Doctor saved successfuly');
    } catch (error) {
        res.status(400).send(error.message);
    }
}

const getGender = async (req, res) => {
    try {
        const docRef = await db.collection('Doctors').doc(req.params.id).get();
        
        res.send(docRef.data().gender);
    } catch (error) {
        res.status(400).send(error.message);
    }
}
const updateDoctor = async (req, res) => {
    try {
        const docRef = db.collection('Doctors').doc(req.params.id);
        const data = req.body;
        const result = validateDoctor(data);
        if (result.error) {
            res.status(400).send(result.error.details[0].message);
            return;
        }
        await docRef.update(data);
        res.send("Doctor successfully updated");

    } catch (error) {
        res.status(404).send(error.message);
    }
}
//update doctor fields
const updateDoctorFields = async (req, res) => {
    try {
        const docRef = db.collection('Doctors').doc(req.params.id);
        data = req.body;
        const obj = updateField(req.body);
        const { data, field } = obj;

        const result = validateDoctor(data);
        if (result.error) {
            res.status(400).send(result.error.details[0].message);
            return;
        }

        await docRef.update(data);
        // const result = validateDoctor(data);
        // if (result.error) {
        //     res.status(400).send(result.error.details[0].message);
        //     return;
        // }
        // if(userInfo){
        //     await docRef.update({userInfo: userInfo});
        // }
        // if(address)
        res.send(`${field} was successfully updated`);

    } catch (error) {
        res.status(404).send(error.message);
    }
}




//update,delete and get doctor (searchForDoctor)
//update Time slot in available times
//update day and date in available times
//delete available times field

//update Time slot in scheduled times
//update day and date in scheduled times
//delete scheduled times field

const addAvailableTimes = async (req, res) => {
    try {
        const docRef = db.collection('Doctors').doc(req.params.id);
        const availableTimes = req.body;

        await docRef.update({ availableTimes: FieldValue.arrayUnion(availableTimes) });
        res.send("Available Time added Sucessfully");


    } catch (error) {
        res.status(404).send(error.message);
    }
}

const addScheduledTimes = async (req, res) => {
   // try {
        const docRef = db.collection('Doctors').doc(req.params.id);

        const scheduledTimes = req.body;
        const docRef2 = await db.collection('Doctors').doc(req.params.id).get();
        for(let item of docRef2.data().availableTimes){
            // console.log(item.date);
                // if date exists in available Times
                if (item.date == scheduledTimes.date) {
                    for(let obj of docRef2.data().scheduledTimes){
                        // case of provided date already exists in scheduled times
                        if(scheduledTimes.date == obj.date){
                            for(let [key1,value1] of Object.entries(item.Time)){
                                console.log(scheduledTimes.Time);
                                for([key2,value2] of Object.entries(scheduledTimes.Time)){
                                    if (value1 == value2){
                                        //updating scheduled times
                                        await docRef.update({ scheduledTimes: FieldValue.arrayRemove(obj) });
                                        obj.Time[key2] = value2;
                                        console.log(obj);
                                        await docRef.update({ scheduledTimes: FieldValue.arrayUnion(obj) });
                                        //updating available times
                                        await docRef.update({ availableTimes: FieldValue.arrayRemove(item) });
                                        delete item.Time[key1];     
                                        console.log(item);
                                        await docRef.update({ availableTimes: FieldValue.arrayUnion(item) });
                                       
                                        res.send("Success");
                                        return;
                                    }

                                }
                            }
                        }

                    }
                    

                    await docRef.update({ scheduledTimes: FieldValue.arrayUnion(scheduledTimes) });
                    
                    for (let [key1,value1] of Object.entries(item.Time)) {
                        for (let [key2,value2] of Object.entries(scheduledTimes.Time)) {
                            console.log(key1);
                            console.log(key2);
                            if (value1 == value2) {
                                await docRef.update({ availableTimes: FieldValue.arrayRemove(item) });
                                delete item.Time[key1]; 
                                await docRef.update({ availableTimes: FieldValue.arrayUnion(item) });
                                res.send("Successsssss");
                                return;
                            }
                        }
                    }
    
                }  

            
        }



    // } catch (error) {
    //     res.status(404).send(error.message);
    // }
}

const getAvailableTimes = async (req, res) => {
    try {
        const docRef = await db.collection('Doctors').doc(req.params.id).get();
        res.send(docRef.data().availableTimes);
    } catch (error) {
        res.status(400).send(error.message);
    }
}
const getScheduledTimes = async (req, res) => {
    try {
        const docRef = await db.collection('Doctors').doc(req.params.id).get();
        res.send(docRef.data().scheduledTimes);
    } catch (error) {
        res.status(404).send(error.message);
    }
}

//Delete Doctor with document id:
const deleteDoctor = async (req, res) => {
    try {
        const docRef = await db.collection('Doctors').doc(req.params.id).delete();

        res.send("Doctor deleted Sucessfully");
    } catch (error) {
        res.status(404).send(error.message);
    }
}

//Delete available times field
const deleteAvailableTimes = async (req, res) => {
    try {
        const docRef = db.collection('Doctors').doc(req.params.id);

        await docRef.update({ availableTimes: FieldValue.delete() });

        res.send("Available Times deleted Sucessfully");
    } catch (error) {
        res.status(404).send(error.message);
    }
}

//Delete scheduled times field
const deleteScheduledTimes = async (req, res) => {
    try {
        const docRef = db.collection('Doctors').doc(req.params.id);

        await docRef.update({ scheduledTimes: FieldValue.delete() });

        res.send("Scheduled Times deleted Sucessfully");
    } catch (error) {
        res.status(404).send(error.message);
    }
}

//Get All Doctors
const getDoctors = async (req, res) => {
    try {
        const docRef = await db.collection('Doctors').get();
        doctorArray = [];
        docRef.forEach(doc => {
            //Document ID is not included inside Doctor Object 
            const doctor = new Doctor(
                doc.id,
                doc.data().userInfo,
                doc.data().email,
                doc.data().password,
                doc.data().phoneNumber,
                doc.data().dateOfBirth,
                doc.data().address,
                doc.data().department,
                doc.data().history,
                doc.data().availableTimes,
                doc.data().scheduledTimes
            )
            doctorArray.push(doctor);
        });
        res.send(doctorArray);
    } catch (error) {
        console.log(error.message);
        res.status(404).send("No Doctors Found");
    }

}
//Search For Doctor
const searchForDoctor = async (req, res) => {
    try {
        const docRef = await db.collection('Doctors').get();
        const name = req.params.name;
        let doctorName;
        docRef.forEach(doc => {
            doctorName = doc.data().userInfo.name;
            if (doctorName.toLowerCase() == name) {
                res.send(doc.data());
            }
            // else {
            //     res.status(400).send("There is no doctor with this name");
            // }

        });
    } catch (error) {
        console.log(error.message);
        res.status(404).send(error.message);
    }
}
//Get a specific doctor
const getDoctor = async (req, res) => {
    try {
        const docRef = await db.collection('Doctors').doc(req.params.id).get();


        res.send(docRef.data());
    } catch (error) {
        res.status(400).send(error.message);
    }
}
//Update AvailableTimes Slot*
const updateAvailableTimeSlot = async (req, res) => {
    try {
        const docRef = db.collection('Doctors').doc(req.params.id);
        const { availableTimes, day, date } = req.body;
        let field = null;
        if (availableTimes) {
            field = "availableTimes"
            await docRef.update({ availableTimes: availableTimes });
        }
        if (date) {
            field = "date"
            await docRef.update({ date: date });
        }
        if (day) {
            field = "day"
            await docRef.update({ day: day });
        }
        res.send(`${field} was updated`);
    } catch (error) {
        res.status(404).send(error.message);
    }
}
//Update scheduledTimes Slot*
const updateScheduledTimeSlot = async (req, res) => {
    try {
        const docRef = db.collection('Doctors').doc(req.params.id);
        const { scheduledTimes, day, date, Time } = req.body;
        let field = null;
        if (scheduledTimes) {
            field = "scheduledTimes";
            docRef.scheduledTimes = scheduledTimes;
            await docRef.update({ scheduledTimes: docRef.scheduledTimes });
        }
        if (date) {
            field = "date";
            docRef.date = date;
            await docRef.update({ date: docRef.date });
        }
        if (day) {
            field = "day";
            docRef.day = day;
            await docRef.update({ 'scheduledTimes.day': day });
        }
        //needs work
        if (Time) {
            field = "time";
            let timeSlot = "scheduledTimes.Time.".concat(req.params.slot);
            console.log(timeSlot);
            await docRef.update({ [timeSlot]: Time });
        }
        res.send(`${field} was updated`);
    } catch (error) {
        res.status(404).send(error.message);
    }
}
// const updateAvailableDayandDate = async (req, res) => {
//     const docRef = db.collection('Doctors').doc(req.params.id);
//     const { day, date } = req.body;

//     if (date) {
//         docRef.date = date;
//         await docRef.update({ date: docRef.date });
//     }
//     if (day) {
//         docRef.day = day;
//         await docRef.update({ day: docRef.day });
//     }

//     res.send("Available times successfully updated");
// }

// const updateScheduledDayandDate = async (req, res) => {

//     const docRef = db.collection('Doctors').doc(req.params.id);
//     const { day, date } = req.body;

//     if (date) {
//         docRef.date = date;
//         await docRef.update({ date: docRef.date });
//     }
//     if (day) {
//         docRef.day = day;
//         await docRef.update({ day: docRef.day });
//     }

//     res.send("Scheduled Times successfully updated");
// }

function validateDoctor(doctor) {
    const { userInfo, email,availableTimes,scheduledTimes, gender,phoneNumber, password, dateOfBirth, address, department, history, prescription } = doctor;
    const schemaRules = {};
    if (userInfo) {
       schemaRules.userInfo = Joi.object({
                    name: Joi.string().min(3).required(),
                    id: Joi.string().min(3).optional()
                });
    }
    if (address) {
        schemaRules.address = Joi.string().min(4).required();
    }if (gender) {
        schemaRules.gender = Joi.string().min(4).required();
    }
    if (email) {
        schemaRules.email = Joi.string().email();
    }
    if (phoneNumber) {
       schemaRules.phoneNumber = Joi.string().min(11);
    }
    if (password) {
        schemaRules.password = Joi.string().min(6).required();
    }
    if (dateOfBirth) {
        schemaRules.dateOfBirth = Joi.date().iso().required();
    }

    if(department){
       schemaRules.department = Joi.string().optional();
    }
    // if(prescription){
    //     schemaRules.prescription = 
    // }
    if(history){
       schemaRules.history = Joi.string().min(10).optional();
    }if(availableTimes){
       schemaRules.availableTimes = Joi.array().optional();
    }if(scheduledTimes){
       schemaRules.scheduledTimes = Joi.array().optional();
    }
    const schema = Joi.object(schemaRules);
    const result = schema.validate(doctor);
    console.log(result);
    return result;
    // const schema = Joi.object({
    //     password: Joi.string().min(6).required(),
    //     phoneNumber: Joi.string().min(11),
    //     dateOfBirth: Joi.date().iso().required(),
    //     address: Joi.string().min(4).required(),
    //     department: Joi.string().required(),
    //     availableTimes: Joi.object({
    //         day: Joi.string().valid('Saturday','Sunday','Monday','Tuesday', 'Wednesday', 'Thursday', 'Friday').required(),
    //         date: Joi.date().iso().required(),
    //         //find a way to validate time
    //         // Time: Joi.object({
    //         //     [slot]: Joi.string().min(7).required()
    //         // }),
    //         Time: Joi.object().optional(),
    //     }).optional(),
    //     //scheduled time validation
    //     email: Joi.string().email(),
    //     history: Joi.string().min(50).required(),
    //     userInfo: Joi.object({
    //         name: Joi.string().min(3).required(),
    //         id: Joi.string().min(3).required()

    //     }),
    //     patientInfo: Joi.object({
    //         name: Joi.string().min(3).required(),
    //         id: Joi.string().min(3).required()
    //     })
    // });

    // const result = schema.validate(doctor);
    // return result;
}
function updateField(body) {
    const { userInfo, email, phoneNumber, password, dateOfBirth, address, department, history, prescription } = body;
    let field = "NULL";
    if (userInfo) {
        field = "userInfo";
        return { data: {userInfo: userInfo}, field: field };
    }
    if (email) {
        field = "E-mail";
        return { data: {email: email}, field: field };
    }
    if (phoneNumber) {
        field = "Phone Number";
        return { data: { phoneNumber: phoneNumber }, field: field };
    }
    if (password) {
        console.log(password);
        field = "Password";
        return { data: { password: password }, field: field };
    }
    if (dateOfBirth) {
        field = "Date of Birth";
        return { data: {dateOfBirth: dateOfBirth}, field: field };
    }
    if (address) {
        field = "Address";
        return { data: {address: address}, field: field };
    }

    if(department){
        field = "department";
        return {data: {department: department}, field: field};
    }
    if(prescription){
        field = "prescription";
        return {data: {prescription: prescription}, field: field};
    }
    if(history){
        field = "history";
        return {data: {history: history}, field: field};
    }
}

    


module.exports = {
    addDoctor,
    addAvailableTimes,
    getAvailableTimes,
    addScheduledTimes,
    getScheduledTimes,
    deleteDoctor,
    deleteAvailableTimes,
    deleteScheduledTimes,
    getDoctors,
    getDoctor,
    updateAvailableTimeSlot,
    updateScheduledTimeSlot,
    searchForDoctor,
    updateDoctor,
    getGender,
    updateDoctorFields
}
