const Joi = require('joi');

const Meeting = require('../models/meeting');
const admin = require('../db');
const db = admin.firestore();

//add meeting(POST)
const addMeeting = async (req, res) => {
    try {
        const data = req.body;
        const result = validateMeeting(data);
        if (result.error) {
            res.status(400).send(result.error.details[0].message);
            return;
        }
        const ref = db.collection('Meetings').doc()
        ref.set(data)
        res.send("Meeting has been added successfully, and the id is: "+ ref.id);
    } catch (error) {
        res.status(400).send(error.message);
    }
}


//get all meetings(GET)
const getAllMeetings = async (req, res) => {
    try {
        const meetings = await db.collection('Meetings').get();
        
        meetingList = [];
        meetings.forEach(meetingDoc => {
            const meeting = new Meeting(
                meetingDoc.id,
                meetingDoc.data().meetingLink,
                meetingDoc.data().appointmentInfo,
                meetingDoc.data().prescription
            );
            meetingList.push(meeting);
        });
        res.send(meetingList);

    } catch (error) {
        res.status(400).send(error.message);
    }
}
//get meeting(GET)
const getMeeting = async (req, res) => {
    try {
        const docRef = await db.collection('Meetings').doc(req.params.id).get();

        const meeting = new Meeting(
            docRef.id,
            docRef.data().meetingLink,
            docRef.data().appointmentInfo,
            docRef.data().prescription
        );
        res.send(meeting);
        
    } catch (error) {
        res.status(400).send(error.message);
    }
}
//update meeting(PUT)
const updateMeeting = async (req, res) => {
    try {
        const data = req.body;
        const result = validateMeeting(data);
        if (result.error) {
            res.status(400).send(result.error.details[0].message);
            return;
        }
        await db.collection('Meetings').doc(req.params.id).update(data);
        res.send("Meeting successfully updated");

    } catch (error) {
        res.status(404).send(error.message);
    }
}

//delete meeting(DELETE)
const deleteMeeting = async (req, res) => {
    try {
        await db.collection('Meetings').doc(req.params.id).delete();
        res.send("Meetings deleted successfully");
    } catch (error) {
        res.status(400).send(error.message);
    }
}

// get prescrption field then get it from prescriptions collection, 
// then loop on its fields and keys of medicines list to get each medicine.
const getPrescriptionID = async (req,res) =>{
    try{
        const docRef = await db.collection('Meetings').get();
        
        docRef.forEach(doc =>{
            if (doc.data().appointmentInfo.doctorInfo.id == req.params.doctorID && doc.data().appointmentInfo.patientInfo.id == req.params.patientID &&
                doc.data().appointmentInfo.time.date == req.params.date && doc.data().appointmentInfo.time.time == req.params.time){
                    res.send("prescription id is : " + doc.data().prescription)
               }
        });

    }catch(error){
        res.status(404).send("No meeting");
    }
};

//****************** Helper functions *****************
function validateMeeting(meeting) {
    const schema = Joi.object({
        meetingLink: Joi.string(),
        appointmentInfo: Joi.object({
            doctorInfo: Joi.object({
                name: Joi.string().min(3).required(),
                id: Joi.string().min(3).max(21).required()
            }),
            patientInfo: Joi.object({
                name: Joi.string().min(3).required(),
                id: Joi.string().min(3).max(21).required()
            }),
            time: Joi.object({
                day: Joi.string().valid('Saturday','Sunday','Monday','Tuesday', 'Wednesday', 'Thursday', 'Friday').required(),
                date: Joi.date().iso().required(),
                time: Joi.string().min(8).required()
            })
        }),
        prescription: Joi.string().min(3).max(21)
    });

    const result = schema.validate(meeting);
    return result;
}

module.exports = {
    addMeeting,
    getAllMeetings,
    getMeeting,
    updateMeeting,
    deleteMeeting,
    getPrescriptionID
}