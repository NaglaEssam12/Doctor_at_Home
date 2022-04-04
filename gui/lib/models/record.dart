import 'dart:convert';

import 'package:GPV1/Screens/record.dart';
import 'package:http/http.dart' as http;

class Record {
  final String history;
  final String allergies;
  final String hospitals;
  final String medications;

  Record({this.history, this.allergies, this.hospitals, this.medications});

  factory Record.fromJson(Map<String, dynamic> json) {

    return Record(
        history: json['history'],
        allergies: json['allergies'],
        hospitals: json['hospitals'],
        medications: json['medications']);
  }
}
