class Doctor{
    constructor(id,userInfo, email, password, phoneNumber, dateOfBirth, address, department, history,availableTimes, scheduledTimes, prescription){
        this.id = id,
        this.userInfo = userInfo,
        this.email = email,
        this.password = password,
        this.phoneNumber = phoneNumber,
        this.dateOfBirth = dateOfBirth,
        this.address = address,
        this.department = department,
        this.history = history,
        this.availableTimes = availableTimes,
        this.scheduledTimes = scheduledTimes,
        this.prescription = prescription
        
    }
}
module.exports = Doctor;
