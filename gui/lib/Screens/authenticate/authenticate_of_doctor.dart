import 'package:GPV1/Screens/authenticate/register_of_doctor.dart';
import 'package:GPV1/Screens/authenticate/sign_in_of_Doctor.dart';
import 'package:flutter/material.dart';


class Authenticate_of_doctor extends StatefulWidget {
  @override
  _Authenticate_of_doctorState createState() => _Authenticate_of_doctorState();
}

class _Authenticate_of_doctorState extends State<Authenticate_of_doctor> {
   bool showSignIn = true;
  void toggleView(){
    setState(() => showSignIn = !showSignIn); 
  }
 
  @override
  Widget build(BuildContext context) {
    if(showSignIn){
      return sign_in_doctor(toggleView: toggleView);
    }else{
      return Register_of_doctor(toggleView: toggleView);
    }
    
  }
}