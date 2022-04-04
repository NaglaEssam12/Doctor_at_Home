import 'package:http/http.dart' as http;
import 'dart:convert';

class PrescriptionModel {
  List medicines;
  List scans;
  String doctorId;
  String patientId;
  String doctorName;
  String nextVisitDate;
  String day, date, time;

  PrescriptionModel() {
    medicines = <Map>[];
    scans = <Map>[];
  }

  PrescriptionModel.fromJson(List<dynamic> json, int index)
      : medicines = List.from(json[index]['medicines']),
       scans = json[index]['scans'],
       doctorId = json[index]['appointmentInfo']['doctorInfo']['id'],
        patientId = json[index]['appointmentInfo']['patientInfo']['id'],
       nextVisitDate = json[index]['nextVisit'],
      day = json[index]['appointmentInfo']['time']['day'],
        date = json[index]['appointmentInfo']['time']['date'],
        time = json[index]['appointmentInfo']['time']['time'];

  void addMedicine(String name, String dosage, String until) {
    var map = {};
    map['name'] = name ;
    map['dosage'] = dosage;
    map['until'] = until;
    medicines.add(map);
  }

  Map<String, dynamic> toJson() => {
    'appointmentInfo': {
      'time': {
        'date': date,
        'time': time,
        'day': day
      },
      'patientInfo': {
        'id': patientId
      },
      'doctorInfo': {
        'id': doctorId,
        'name': doctorName
      },
    },
    'nextVisit': nextVisitDate,
    'medicines' : medicines,
    'scans': scans
  };



  void addScan(String name) {
    var map = {};
    map['name'] =  name;
    scans.add(map);
  }
}
