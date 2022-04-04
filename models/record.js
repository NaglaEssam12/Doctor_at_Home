class Record{
    constructor(id,patientName,patientId,medications,allergies,history,hospitals){
        this.id = id,
        this.patientName = patientName,
        this.patientId = patientId,
        this.medications = medications,
        this.allergies = allergies,
        this.history = history,
        this.hospitals = hospitals
    }
}
module.exports = Record;