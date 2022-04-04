class Patient{
    constructor(id,userInfo, email, password, phoneNumber, dateOfBirth, address,appointments,userName){
        this.id = id,
        this.userInfo = userInfo,
        this.userName = userName,
        this.email = email,
        this.password = password,
        this.phoneNumber = phoneNumber,
        this.dateOfBirth = dateOfBirth,
        this.address = address,
        this.appointments = appointments
    }
}
module.exports = Patient;