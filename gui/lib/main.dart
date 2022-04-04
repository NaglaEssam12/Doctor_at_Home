import 'package:GPV1/Screens/Firstpage/firstpage.dart';
import 'package:GPV1/Screens/prescription.dart';
import 'package:GPV1/Screens/viewPrescription.dart';
import 'package:GPV1/services/auth.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:GPV1/models/user.dart';
import 'package:GPV1/Screens/Home/doctor_profile.dart';
import 'package:GPV1/Screens/Home/home.dart';
import 'package:GPV1/Screens/search.dart';

import 'Screens/Home/home2.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return StreamProvider<User>.value(
      value: AuthService().user,
      child: MaterialApp(
        // initialRoute: Home2.id,
       routes: {
          Home2.id: (context) => Home2(),
          Search.id: (context) => Search(),
         DoctorProfile.id: (context) => DoctorProfile(),
         Prescription.id: (context) => Prescription(),
         ViewPrescription.id: (context) => ViewPrescription(),
        },
        debugShowCheckedModeBanner: false,
        theme: ThemeData(
          scaffoldBackgroundColor: Color(0xff1F1F1F),
          primarySwatch: Colors.blue,
        ),
      home: FristPage(),
     )
    );
  }
  // @override
  // Widget build(BuildContext context) {
  //   return StreamProvider<User>.value(
  //     value: AuthService().user,
  //     child: MaterialApp(
  //
  //     home: FristPage(),
  //    )
  //   );
  // }
}






