import 'dart:convert';

import 'package:http/http.dart' as http;

class Appointment{
  String id;
  final doctorInfo;
  final patientInfo;
  final String phoneNumber;
  final prescription;
  final time;

  factory Appointment.fromJson(Map<String, dynamic> json) {
    return Appointment(
        doctorInfo: json['doctorInfo'],
        patientInfo: json['patientInfo'],
        phoneNumber: json['phoneNumber'],
        prescription: json['prescription'],
        time: json['time']
    );
  }

  reserveAppointment(Map doctorInfo,String timeSlot,Map time,String email,String name,String confirm) async {
    print("posting");
    var url = Uri.parse('https://doctor-at-home.herokuapp.com/api/appointment');

    Map patientInfo = {
      'id': email,
      'name': name
    };

    Map data = {
      'doctorInfo': doctorInfo,
      'time': time,
      'patientInfo': patientInfo,
    };

    String body = json.encode(data);

    http.Response response = await http.post(
        url,
        headers: {"Content-Type": "application/json"},
        body: body
    );

    print('Response status: ${response.statusCode}');
    print('Response body: ${response.body}');

    if(response.statusCode == 200){
      print(time);
      print(doctorInfo['id']);
       confirm = "Appointment Reserved";
    await addScheduledTimes(timeSlot,time,doctorInfo['id']);
    }
    else{
      confirm = 'Something went wrong';
    }

  }
  addScheduledTimes(String timeSlot,Map time,String email) async {
    print("posting");
    var url = Uri.parse('https://doctor-at-home.herokuapp.com/api/doctor/scheduled/${email}');

    Map data = {
      'date': time['date'],
      'day': time['day'],
      'Time': {
       timeSlot: time['time']
      },

    };
    String body = json.encode(data);

    http.Response response = await http.patch(
        url,
        headers: {"Content-Type": "application/json"},
        body: body
    );

    print('Response status: ${response.statusCode}');
    print('Response body: ${response.body}');


  }

  Future<Appointment> getAppointment(String id) async {
    print("Getting");
    var url = Uri.parse("https://doctor-at-home.herokuapp.com/api/appointment/${id}");

    http.Response response = await http.get(
      url,
      headers: {"Content-Type": "application/json"},
    );

    // print('Response status: ${response.statusCode}');
    if(response.statusCode == 200)
      return Appointment.fromJson(jsonDecode(response.body));
    else
      throw Exception(response.body);
  }
  Future getAppointmentByName(String id) async {
    print("Getting");
    var url = Uri.parse("https://doctor-at-home.herokuapp.com/api/appointment/patient/${id}");

    http.Response response = await http.get(
      url,
      headers: {"Content-Type": "application/json"},
    );

    print('Response status: ${response.statusCode}');
    if(response.statusCode == 200)
      return (jsonDecode(response.body));
    else
      throw Exception(response.body);
  }
  Appointment({this.doctorInfo,this.patientInfo,this.phoneNumber,this.prescription,this.id,this.time});
}