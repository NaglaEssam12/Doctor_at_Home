import 'dart:convert';

import 'package:GPV1/Screens/Home/home.dart';
import 'package:GPV1/Services/database.dart';
import 'package:GPV1/helper/constants.dart';
import 'package:GPV1/helper/helperfunctions.dart';
import 'package:GPV1/models/user.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:GPV1/Services/auth.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:http/http.dart' as http;

class SignIn extends StatefulWidget {

  final Function toggleView;
  SignIn({this.toggleView});

  @override
  _SignInState createState() => _SignInState();
}

class _SignInState extends State<SignIn>
{
  final AuthService _auth = AuthService();
  final GoogleSignApp _firebaseAuth =  GoogleSignApp();
  final _formKey = GlobalKey<FormState>();

  String email ='';
  String password ='';
   String error = '';

  getPatientData(String email) async {
    print("Getting");
    Constants.myEmail=await HelperFunctions.getUserEmailSharedPreference();
    var url = Uri.parse("https://doctor-at-home.herokuapp.com/api/patient/${email}");

    http.Response response = await http.get(
      url,
      headers: {"Content-Type": "application/json"},
    );

    print('Response status: ${response.statusCode}');
    print('Response body: ${response.body}');
    if(response.body.isEmpty){
      return false;
    }
    return true;
    // return User.fromJson(jsonDecode(response.body));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.blue[900],
        elevation: 0.0,
        title: Text('Sign in'),
        actions: <Widget>[
          FlatButton.icon(
            icon: Icon(Icons.person),
            label:Text('Register'),
            onPressed: (){
              widget.toggleView();
            },
          )
        ]
      ),
      body: SingleChildScrollView(
        padding: EdgeInsets.symmetric(vertical: 20.0, horizontal: 50.0),
        child: Form(
           key: _formKey,
          child:Column(
            children: <Widget>[
              SizedBox(height:20.0),
              TextFormField(
                decoration: InputDecoration (
                  hintText: 'Email',
                  suffixIcon: Icon(Icons.email),
                  fillColor: Colors.white,
                  filled: true,
                  enabledBorder: OutlineInputBorder(
                    borderSide: BorderSide(color: Colors.blue[900] , width: 2.0)
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderSide: BorderSide(color: Colors.blue[200] , width: 2.0)
                  ),
                ),
                validator: (val) => val.isEmpty ? 'Enter an email' : null,
                onChanged: (val){
                  setState(() => email = val);
                }
              ),
              SizedBox(height: 20.0,),
              TextFormField(
                decoration: InputDecoration (
                  hintText: 'Password',
                  suffixIcon: Icon(Icons.lock),
                  fillColor: Colors.white,
                  filled: true,
                  enabledBorder: OutlineInputBorder(
                    borderSide: BorderSide(color: Colors.blue[900] , width: 2.0)
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderSide: BorderSide(color: Colors.blue[200] , width: 2.0)
                  ),
                ),
                obscureText: true,
                validator: (val) => val.length < 6 ? 'Enter a password 6+ chars long' : null,
                onChanged:(val){
                  setState(() => password = val);
                }
              ),
              SizedBox(height:20.0),
              RaisedButton(
                color: Colors.blue[900],
                child:Text(
                  'Sign In',
                  style: TextStyle(color:Colors.white),
                ),
                onPressed: () async{
                  if(_formKey.currentState.validate()){
                    ScaffoldMessenger.of(context)
                        .showSnackBar(SnackBar(
                        content: Text(
                          'Signing in....',
                        )
                    ));
                    User result = await _auth.signInWithEmailAndPassword(email,password);
                    bool isPatient = await getPatientData(email);

                    if(result == null || !isPatient){
                      setState(() => error = 'COULD NOT SIGN IN WITH THOSE CRDENTIALS');
                    }
                    else{
                      QuerySnapshot userInfoSnapshot =
                      await DatabaseService().getUserInfo(email);


                      HelperFunctions.saveIsDoctorSharedPreference(false);
                      HelperFunctions.saveUserLoggedInSharedPreference(true);
                      HelperFunctions.saveUserNameSharedPreference(
                          userInfoSnapshot.documents[0].data["userName"]);
                      HelperFunctions.saveUserEmailSharedPreference(
                          userInfoSnapshot.documents[0].data["userEmail"]);

                      Constants.myEmail = await HelperFunctions.getUserEmailSharedPreference();
                      Constants.myName = await HelperFunctions.getUserNameSharedPreference();
                      Constants.myGender = await HelperFunctions.getUserGenderSharedPreference();
                      print("singing in");
                      print(Constants.myGender);

                      Navigator.push(context,MaterialPageRoute(builder: (context) => Home(result.uid)));


                    }

                  }
                } 
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
                    onPressed: () => _firebaseAuth.signInwithgoogle(context)
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
            ]
          )
        )
      ),
    );
  }
}