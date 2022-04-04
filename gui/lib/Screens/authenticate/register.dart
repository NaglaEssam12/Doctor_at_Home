import 'dart:convert';

import 'package:GPV1/Screens/Home/home.dart';
import 'package:GPV1/Services/database.dart';
import 'package:GPV1/helper/constants.dart';
import 'package:GPV1/helper/helperfunctions.dart';
import 'package:GPV1/models/user.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:GPV1/Services/auth.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:http/http.dart' as http;
import 'package:dropdownfield/dropdownfield.dart';

class Register extends StatefulWidget {
  final Function toggleView;
  Register({this.toggleView});

  @override
  _RegisterState createState() => _RegisterState();
}

class _RegisterState extends State<Register> {
  final AuthService _auth = AuthService();
  final GoogleSignApp _firebaseAuth = GoogleSignApp();
  final _formKey = GlobalKey<FormState>();

  String email = '';
  String password = '';
  String userName = '';
  String gender = '';
  String address = '';
  String phoneNumber = '';
  String error = '';
  String dateOfBirth;



    void post(String email) async {
    print("posting");
    var url = Uri.parse('https://doctor-at-home.herokuapp.com/api/patient/${email}');

    Map data = {
      'userName': userName,
      'address': address,
      'email': email,
      'gender': gender,
      'phoneNumber': phoneNumber,
      'password': password,
      'dateOfBirth': dateOfBirth
    };

    String body = json.encode(data);

    http.Response response = await http.post(url,
        headers: {"Content-Type": "application/json"}, body: body);

    print('Response status: ${response.statusCode}');
    print('Response body: ${response.body}');

    if ( response.statusCode == 200) {
      User result = await _auth.registerWithEmailAndPassword(
          email, password, userName);
      if (result == null) {
        setState(() => error = 'please provide a valid email');
        delete(email);
      }else{

        Map<String,String> userDataMap = {
          "userName" : userName,
          "userEmail" : email,
        };

        DatabaseService().addUserInfo(userDataMap);


        HelperFunctions.saveIsDoctorSharedPreference(false);
        HelperFunctions.saveUserLoggedInSharedPreference(true);
        HelperFunctions.saveUserNameSharedPreference(userName);
        HelperFunctions.saveUserEmailSharedPreference(email);
        HelperFunctions.saveUserGenderSharedPreference(gender);

        Constants.myEmail = await HelperFunctions.getUserEmailSharedPreference();
        Constants.myName = await HelperFunctions.getUserNameSharedPreference();
        Constants.myGender = await HelperFunctions.getUserGenderSharedPreference();
        Navigator.push(context,MaterialPageRoute(builder: (context) => Home(email)));




      }

    }
    else
      setState(() => error = response.body);
   // return response;
  }

  delete(String email) async {
    print("deleting");
    var url = Uri.parse('https://doctor-at-home.herokuapp.com/api/patient/${email}');
   /* Map data = {
      'userName': userName,
      'address': address,
      'email': email,
      'gender': gender,
      'phoneNumber': phoneNumber,
      'password': password,
      'dateOfBirth': dateOfBirth
    };*/

  ///  String body = json.encode(data);

    http.Response response = await http.delete(url,
        headers: {"Content-Type": "application/json"});

    print('Response status: ${response.statusCode}');
    print('Response body: ${response.body}');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
          backgroundColor: Colors.blue[900],
          elevation: 0.0,
          title: Text('Sign up'),
          actions: <Widget>[
            FlatButton.icon(
              icon: Icon(Icons.person),
              label: Text('Sign In'),
              onPressed: () {
                widget.toggleView();
              },
            )
          ]),
      body: SingleChildScrollView(
        padding: EdgeInsets.symmetric(vertical: 20.0, horizontal: 50.0),
        child: Form(
          key: _formKey,
          child: Column(
            children: <Widget>[
              SizedBox(height: 20.0),
              TextFormField(
                  decoration: InputDecoration(
                    hintText: 'user name',
                    suffixIcon: Icon(Icons.person),
                    fillColor: Colors.white,
                    filled: true,
                    enabledBorder: OutlineInputBorder(
                        borderSide:
                            BorderSide(color: Colors.blue[900], width: 2.0)),
                    focusedBorder: OutlineInputBorder(
                        borderSide:
                            BorderSide(color: Colors.blue[200], width: 2.0)),
                  ),
                  validator: (val) => val.isEmpty ? 'Enter a user name' : null,
                  onChanged: (val) {
                    setState(() => userName = val);
                  }),
              SizedBox(height: 20.0),
              TextFormField(
                  decoration: InputDecoration(
                    hintText: 'email',
                    suffixIcon: Icon(Icons.email),
                    fillColor: Colors.white,
                    filled: true,
                    enabledBorder: OutlineInputBorder(
                        borderSide:
                            BorderSide(color: Colors.blue[900], width: 2.0)),
                    focusedBorder: OutlineInputBorder(
                        borderSide:
                            BorderSide(color: Colors.blue[200], width: 2.0)),
                  ),
                  validator: (val) => val.isEmpty ? 'Enter an email' : null,
                  onChanged: (val) {
                    setState(() => email = val);
                  }),
              SizedBox(
                height: 20.0,
              ),
              TextFormField(
                  decoration: InputDecoration(
                    hintText: 'password',
                    suffixIcon: Icon(Icons.lock),
                    fillColor: Colors.white,
                    filled: true,
                    enabledBorder: OutlineInputBorder(
                        borderSide:
                            BorderSide(color: Colors.blue[900], width: 2.0)),
                    focusedBorder: OutlineInputBorder(
                        borderSide:
                            BorderSide(color: Colors.blue[200], width: 2.0)),
                  ),
                  obscureText: true,
                  validator: (val) =>
                      val.length < 6 ? 'Enter a password 6+ chars long' : null,
                  onChanged: (val) {
                    setState(() => password = val);
                  }),
              SizedBox(
                height: 20.0,
              ),
              TextFormField(
                  decoration: InputDecoration(
                    hintText: 'address',
                    suffixIcon: Icon(Icons.home),
                    fillColor: Colors.white,
                    filled: true,
                    enabledBorder: OutlineInputBorder(
                        borderSide:
                            BorderSide(color: Colors.blue[900], width: 2.0)),
                    focusedBorder: OutlineInputBorder(
                        borderSide:
                            BorderSide(color: Colors.blue[200], width: 2.0)),
                  ),
                  validator: (val) => val.isEmpty ? 'Enter an address' : null,
                  onChanged: (val) {
                    setState(() => address = val);
                  }),
              SizedBox(
                height: 20.0,
              ),
              TextFormField(
                  decoration: InputDecoration(
                    hintText: 'YYYY-MM-DD',
                    suffixIcon: Icon(Icons.cake),
                    fillColor: Colors.white,
                    filled: true,
                    enabledBorder: OutlineInputBorder(
                        borderSide:
                            BorderSide(color: Colors.blue[900], width: 2.0)),
                    focusedBorder: OutlineInputBorder(
                        borderSide:
                            BorderSide(color: Colors.blue[200], width: 2.0)),
                  ),
                  validator: (val) =>
                      val.isEmpty ? 'Enter your birthDate' : null,
                  onChanged: (val) {
                    setState(() => dateOfBirth = val);
                  }),
              SizedBox(height: 20.0),
              TextFormField(
                  decoration: InputDecoration(
                    hintText: 'gender',
                    suffixIcon: Icon(FontAwesomeIcons.venusMars),
                    fillColor: Colors.white,
                    filled: true,
                    enabledBorder: OutlineInputBorder(
                        borderSide:
                            BorderSide(color: Colors.blue[900], width: 2.0)),
                    focusedBorder: OutlineInputBorder(
                        borderSide:
                            BorderSide(color: Colors.blue[200], width: 2.0)),
                  ),
                  validator: (val) => val.isEmpty ? 'Enter a Gender' : null,
                  onChanged: (val) {
                    setState(() => gender = val);
                  }),
              SizedBox(
                height: 20.0,
              ),
              TextFormField(
                  decoration: InputDecoration(
                    hintText: 'phone number',
                    suffixIcon: Icon(Icons.phone),
                    fillColor: Colors.white,
                    filled: true,
                    enabledBorder: OutlineInputBorder(
                        borderSide:
                            BorderSide(color: Colors.blue[900], width: 2.0)),
                    focusedBorder: OutlineInputBorder(
                        borderSide:
                            BorderSide(color: Colors.blue[200], width: 2.0)),
                  ),
                  obscureText: false,
                  validator: (val) =>
                      val.length < 11 ? 'phone number is not true' : null,
                  onChanged: (val) {
                    setState(() => phoneNumber = val);
                  }),
              SizedBox(height: 20.0),
              RaisedButton(
                color: Colors.blue[900],
                child: Text(
                  'Register',
                  style: TextStyle(color: Colors.white),
                ),
                onPressed: () async {
                  if (_formKey.currentState.validate()) {
                    /*http.Response response =*/ post(email);
                    // print(responses.statusCode);
                    // print(responses.body);
                    // if ( responses.statusCode == 200) {
                    //   User result = await _auth.registerWithEmailAndPassword(
                    //       email, password, userName);
                    //   if (result == null) {
                    //     setState(() => error = 'please supply a valid email');
                    //     delete(email);
                    //   }
                    // }
                    // else
                    //   setState(() => error = responses.body);
                  }
                },
              ),
             /* SizedBox(
                height: 5.0,
              ),
              Container(
                width: 250.0,
                child: Align(
                  alignment: Alignment.center,
                  child: RaisedButton(
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(30.0),
                    ),
                    color: Colors.blue[900],
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.start,
                      children: <Widget>[
                        Icon(FontAwesomeIcons.google, color: Colors.white),
                        SizedBox(
                          width: 10.0,
                        ),
                        Text(
                          'Sign up with Google',
                          style: TextStyle(color: Colors.white, fontSize: 18.0),
                        )
                      ],
                    ),
                    onPressed: () => _firebaseAuth
                        .signInwithgoogle(context)
                        .then((FirebaseUser user) => print(user))
                        .catchError((e) => print(e)),
                  ),
                ),
              ),*/
              SizedBox(height: 12.0),
              Text(
                error,
                style: TextStyle(color: Colors.red, fontSize: 14.0),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
