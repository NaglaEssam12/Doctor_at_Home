import 'dart:convert';

import 'package:GPV1/Screens/record.dart';
import 'package:http/http.dart'as http;
class User{
  final String uid;
  final String userName;
  final String userEmail;
  final String gender;
  final String address;
  final String password;
  final String phoneNumber;
  final String dateOfBirth;
  final bool isPatient;
  final appointments;
  final String history;
  final String allergies;
  final String hospitals;
  final String medications;

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      userName: json['userName'],
      userEmail: json['email'],
      gender: json['gender'],
      address: json['address'],
      password: json['password'],
      phoneNumber: json['phoneNumber'],
      dateOfBirth: json['dateOfBirth'],
      appointments: json['appointments'],
      history: json['history'],
      allergies:json['allergies'],
      hospitals:json['hospitals'],
      medications:json['medications']
    );
  }

  Future<User> getPatient(String id) async {
    print("Getting");
    var url = Uri.parse("https://doctor-at-home.herokuapp.com/api/patient/${id}");

    http.Response response = await http.get(
      url,
      headers: {"Content-Type": "application/json"},
    );

    // print('Response status: ${response.statusCode}');
    // print(jsonDecode(response.body));
    if(response.statusCode == 200)
      return User.fromJson(jsonDecode(response.body));
    else
      throw Exception(response.body);
  }


  User({this.isPatient,this.uid, this.userName, this.userEmail, this.gender,this.dateOfBirth,this.password,this.phoneNumber,this.address,this.appointments,this.history,this.allergies,this.hospitals,this.medications});

}
class UserDetails{
  final String providerDetails;
  final String userName;
  final String userEmail;
  final List<ProviderDetails> providerData;
  
  UserDetails(providerID, {this.providerDetails,this.userName,this.userEmail,this.providerData});
}

class ProviderDetails{
  ProviderDetails(this.providerDetails);
  final String providerDetails;
}

