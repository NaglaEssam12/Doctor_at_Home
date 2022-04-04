class Appointment {
    constructor(id, doctorInfo, time, phoneNumber, patientInfo, reason) {
            this.id = id;
            this.doctorInfo = doctorInfo;
            this.time = time;
            this.patientInfo = patientInfo;
            this.reason = reason;
            this.phoneNumber = phoneNumber;
    }
}

module.exports = Appointment;