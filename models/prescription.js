class Prescription{
    constructor(id, medicines, startDate, endDate, appointmentInfo, scan, scanTime, note){
        this.id = id
        this.medicines = medicines,
        this.startDate = startDate,
        this.endDate = endDate,
        this.appointmentInfo = appointmentInfo,
        this.scan = scan,
        this.scanTime = scanTime,
        this.note = note
    }
}
module.exports = Prescription;
