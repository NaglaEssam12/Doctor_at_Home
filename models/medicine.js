class Medicine{
    constructor(id, medicineName, typeOfMedicine, strength, methodOfIntake, quantity, dosage, timeOfDosage, otherInstructions,startDate, endDate, takenFor, sideEffect){
        this.id = id,
        this.medicineName = medicineName,
        this.typeOfMedicine = typeOfMedicine,
        this.strength = strength,
        this.methodOfIntake = methodOfIntake,
        this.quantity = quantity,
        this.dosage = dosage,
        this.timeOfDosage = timeOfDosage,
        this.otherInstructions = otherInstructions,
        this.startDate = startDate,
        this.endDate = endDate,
        this.takenFor = takenFor,
        this.sideEffect = sideEffect
        
    }
}
module.exports = Medicine;