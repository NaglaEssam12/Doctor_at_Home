import 'package:http/http.dart' as http;
import 'dart:convert';

class Doctor {
  final String uid;
  final Map userInfo;
  final String userEmail;
  final String gender;
  final String address;
  final String password;
  final String phoneNumber;
  final String dateOfBirth;
  final String department;
  final String history;
  dynamic availableTimes;
  String scheduledTimes;
  String prescription;

  factory Doctor.fromJson(Map<String, dynamic> json) {
    return Doctor(
      userInfo: json['userInfo'],
      userEmail: json['email'],
      gender: json['gender'],
      address: json['address'],
      password: json['password'],
      phoneNumber: json['phoneNumber'],
      dateOfBirth: json['dateOfBirth'],
      department: json['department'],
      history: json['history'],
      availableTimes: json['availableTimes'],
    );
  }
  factory Doctor.listfromJson(Map<String, dynamic> json) {
    return Doctor(
      userInfo: json['userInfo'],
      userEmail: json['email'],
      gender: json['gender'],
      address: json['address'],
      password: json['password'],
      phoneNumber: json['phoneNumber'],
      dateOfBirth: json['dateOfBirth'],
      department: json['department'],
      history: json['history'],
      availableTimes: json['availableTimes'],
    );
  }

  Future<Doctor> searchForDoctor(String name) async {
    print("Getting");
    var url = Uri.parse("https://doctor-at-home.herokuapp.com/api/doctorSearch/${name}");

    http.Response response = await http.get(
      url,
      headers: {"Content-Type": "application/json"},
    );

    print('Response status: ${response.statusCode}');
    if(response.statusCode == 200)
      return Doctor.fromJson(jsonDecode(response.body));
    else print(response.body);
      // throw Exception(response.body);
  }

  //  getAllDoctors() async {
  //   print("Getting");
  //   var url = Uri.parse("http://10.0.2.2:5000/api/doctor");
  //
  //   http.Response response = await http.get(
  //     url,
  //     headers: {"Content-Type": "application/json"},
  //   );
  //
  //   print('Response status: ${response.statusCode}');
  //   print('Response status: ${jsonDecode(response.body)}');
  //   if(response.statusCode == 200)
  //     return jsonDecode(response.body);
  //   else
  //     throw Exception(response.body);
  // }

  Doctor({
    this.uid,
    this.userInfo = const{'name':'','id':''},
    this.userEmail,
    this.gender,
    this.dateOfBirth,
    this.password,
    this.phoneNumber,
    this.address,
    this.department,
    this.history,
    this.availableTimes,
  });
}
