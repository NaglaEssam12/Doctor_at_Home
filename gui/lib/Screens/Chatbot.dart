import 'dart:async';

import 'package:GPV1/widget/widget.dart';
import 'package:bubble/bubble.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;


class ChatbotScreen extends StatefulWidget{
  @override
  _ChatbotScreenState createState() => _ChatbotScreenState();

  }

class _ChatbotScreenState extends State<ChatbotScreen>{
  final GlobalKey<AnimatedListState> _listKey = GlobalKey();
  List<String> data = [];

  static const String BOT_URL = "";
  TextEditingController queryController = TextEditingController();
  final _scrollController = ScrollController();
  bool _firstAutoscrollExecuted = false;
  bool _shouldAutoscroll = false;

  // void _scrollToBottom() {
  //   _scrollController.jumpTo(_scrollController.position.maxScrollExtent+6);
  // }
  // void _scrollListener() {
  //   _firstAutoscrollExecuted = true;
  //
  //   if (_scrollController.hasClients && _scrollController.position.pixels == _scrollController.position.maxScrollExtent) {
  //     _shouldAutoscroll = true;
  //   } else {
  //     _shouldAutoscroll = false;
  //   }
  // }
  //
  // @override
  // void initState() {
  //   super.initState();
  //   _scrollController.addListener(_scrollListener);
  // }
  //
  // @override
  // void dispose() {
  //   _scrollController.removeListener(_scrollListener);
  //   super.dispose();
  // }


  @override
  Widget build(BuildContext context) {

    return Scaffold(
      // resizeToAvoidBottomInset: false,
      backgroundColor: Colors.white,
      appBar: AppBar(
        backgroundColor: Colors.blue[900],
        centerTitle: true,
        title: Text("Chatbot"),
      ),
      body: Column(
        children:<Widget> [
          Expanded(
            child: AnimatedList(
              // controller: _scrollController,
              key: _listKey,
              initialItemCount: data.length,
              itemBuilder: (BuildContext context,int index,Animation animation){
                return buildItem(data[index],animation,index);
              },
              // reverse: true,
            ),
          ),
          // SizedBox(height: 120),
          Align(
            alignment: Alignment.bottomCenter,
            child: ColorFiltered(
              colorFilter: ColorFilter.linearToSrgbGamma(),
              child: Container(
                // color: Color(0x54FFFFFF),
                color: Colors.grey[300],
                child: Padding(
                  padding: EdgeInsets.only(left: 20,right: 20),
                  child: TextField(
                    style: TextStyle(color: Colors.black),
                    //   style: simpleTextStyle(),
                    decoration: InputDecoration(
                      icon: Icon(
                        Icons.message,
                        color: Colors.blue[900],
                      ),
                      hintText: "Hello",
                      fillColor: Colors.white12
                    ),
                    controller: queryController,
                    // textInputAction: TextInputAction.send,
                    onSubmitted: (msg){
                      this.getResponse();
                      queryController.clear();
                    },
                  ),
                ),
              ) ,
            ),
          )
        ],
      ),
    );
  }



  void getResponse() async{
    if (queryController.text.length > 0){
      this.insertSingleItem(queryController.text);

      print("posting");
      var url = Uri.parse('http://10.0.2.2:7000/bot');

      Map body = {"query": queryController.text};

      http.Response response = await http.post(
          url,
          headers: {"Content-Type": "application/x-www-form-urlencoded"},
          body: body
      );

      print('Response status: ${response.statusCode}');
      print('Response body: ${response.body}');
      if(response.statusCode == 200){
          insertSingleItem(response.body + "<bot>");
      }
    }
  }

  void insertSingleItem(String message){
    data.add(message);
    _listKey.currentState.insertItem(data.length-1);
    // _listKey.currentState.insertItem(reversedMessages.length-1);
  }

  Widget buildItem(String item, Animation animation, int index){
    // Timer(
    //   Duration(milliseconds: 500),
    //
    //       () => {print('building'), _scrollController.animateTo(_scrollController.position.maxScrollExtent,
    //         duration: Duration(milliseconds: 250),
    //         curve: Curves.fastOutSlowIn,)},
    // );

      //
      // if (_scrollController.hasClients && _shouldAutoscroll) {
      //   _scrollToBottom();
      // }
      //
      // if (!_firstAutoscrollExecuted && _scrollController.hasClients) {
      //   _scrollToBottom();
      // }


    bool mine = item.endsWith("<bot>");
    return Container(
    padding: EdgeInsets.only(
          top: 8, bottom: 8, left: mine ? 24 : 0, right: mine ? 0 : 24),
      alignment: mine ? Alignment.centerLeft : Alignment.centerRight,
      child: Container(
        margin:
            mine ? EdgeInsets.only(right: 30) : EdgeInsets.only(left: 30),
        padding: EdgeInsets.only(top: 17, bottom: 17, left: 20, right: 20),
        decoration: BoxDecoration(
            borderRadius: mine
                ? BorderRadius.only(
                    topLeft: Radius.circular(23),
                    topRight: Radius.circular(23),
                    bottomRight: Radius.circular(23))
                : BorderRadius.only(
                    topLeft: Radius.circular(23),
                    topRight: Radius.circular(23),
                    bottomLeft: Radius.circular(23)),
            gradient: LinearGradient(
               begin: FractionalOffset.topCenter,
               end: FractionalOffset.bottomCenter,
              colors: mine
                  ? [Colors.grey[600], Colors.grey]
                  
                  : [
                      Colors.blue[900],
                      Colors.blue[600],
                      // const Color(0x1AFFFFFF)
                    ],
                    
                
            )
            ),
            
            child: Text(
              item.replaceAll("<bot>", ""),
              style: TextStyle(
                color: Colors.white,
                    fontSize: 16,
              ),
            ),
           // color: mine ? Colors.blue : Colors.grey[600],
           // padding: BubbleEdges.all(10),
        
       /* child: Text(
            message,
            textAlign: TextAlign.start,
            style: TextStyle(
                color: Colors.white,
                fontSize: 18,
                fontFamily: 'OverpassRegular',
                )),*/
      ),
    );

    /*return SizeTransition(
      sizeFactor: animation,
      child: Padding(
        padding: EdgeInsets.only(top: 10),
        child: Container(
          alignment: mine ? Alignment.topLeft : Alignment.topRight,
          child: Bubble(
            child: Text(
              item.replaceAll("<bot>", ""),
              style: TextStyle(
                color: mine ? Colors.white: Colors.black
              ),
            ),
            color: mine ? Colors.blue : Colors.grey[200],
            padding: BubbleEdges.all(10),
          ),
        ),
      ),
    );*/
  }
}