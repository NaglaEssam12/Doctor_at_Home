import 'dart:convert';
import 'dart:io';

import 'package:bubble/bubble.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:image_picker/image_picker.dart';

class DiagnosisScreen extends StatefulWidget{
  @override
  _DiagnosisScreenState createState() => _DiagnosisScreenState();
}

class _DiagnosisScreenState extends State<DiagnosisScreen> {

  File image;
  String diagnosis;
  final _picker = ImagePicker();


  Future getImage() async{
    final pickedFile = await _picker.getImage(source: ImageSource.gallery);
    final File imageFile = File(pickedFile.path);

    setState(() {
      this.image = imageFile;
    });
  }
  ///POST
  classifyPneumonia() async {
    var postUri = Uri.parse("http://10.0.2.2:7000/pne");

    http.MultipartRequest request = new http.MultipartRequest("POST", postUri);

    http.MultipartFile multipartFile = await http.MultipartFile.fromPath(
        'file', image.path);

    request.files.add(multipartFile);

    http.StreamedResponse response = await request.send();


    print(response.statusCode);
    if(response.statusCode == 200){
    response.stream.transform(utf8.decoder).listen((value) {
      setState(() {
        this.diagnosis = value;
      });
    });
    }
  }

  classifyTuberculosis() async {
    var postUri = Uri.parse("http://10.0.2.2:7000/tuberc");

    http.MultipartRequest request = new http.MultipartRequest("POST", postUri);

    http.MultipartFile multipartFile = await http.MultipartFile.fromPath(
        'file', image.path);

    request.files.add(multipartFile);

    http.StreamedResponse response = await request.send();


    print(response.statusCode);
    if(response.statusCode == 200){
    response.stream.transform(utf8.decoder).listen((value) {
      setState(() {
        this.diagnosis = value;
      });
    });
    }
  }

  // classifyImage() async{
  //   print("posting");
  //   var url = Uri.parse('http://10.0.2.2:5000/tuberc');
  //
  //   Map body = {"file": this.image};
  //
  //   http.Response response = await http.post(
  //       url,
  //       headers: {"Content-Type": "application/x-www-form-urlencoded"},
  //       body: body
  //   );
  //
  //   print('Response status: ${response.statusCode}');
  //   print('Response body: ${response.body}');
  //
  //   if(response.statusCode == 200){
  //     setState(() {
  //       this.diagnosis = response.body;
  //     });
  //   }
  // }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.blue[900],
        centerTitle: true,
        title: Text("Diagnosis"),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(15.0),
        child: Column(
          children: <Widget>[
           Padding( padding: const EdgeInsets.all(10.0)),
            Text("This page uses x-ray images as input and outputs whether you have Pneumonia or Tuberculosis",style: TextStyle(fontSize: 16),),
          // SizedBox(height: 50.0),
          image == null ? Text("Image not yet uploaded") : Image.file(this.image),
          SizedBox(height: 20.0),
            diagnosis == null ? Text("Diagnosis:....",style: TextStyle(fontSize: 16,fontWeight: FontWeight.bold)) : Text(diagnosis,style: TextStyle(fontSize: 16,fontWeight: FontWeight.bold)),
            Padding(padding: const EdgeInsets.all(10.0)),
            Row(
              children: [
                SizedBox(width: 10),
                ElevatedButton(onPressed: classifyTuberculosis, child: Text("Classify Tuberculosis"),style:ElevatedButton.styleFrom(primary: Colors.blue[900]) ,),
                SizedBox(width: 20),
                ElevatedButton(onPressed: classifyPneumonia, child: Text("Classify Pneumonia"),style:ElevatedButton.styleFrom(primary: Colors.blue[900]),),
              ],
            )
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        backgroundColor: Colors.blue[900],
        onPressed: getImage,
        child: Icon(Icons.upload_file,),
      ),
    );
  }
}