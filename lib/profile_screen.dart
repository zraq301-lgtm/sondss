import 'package:flutter/material.dart';

class ProfileScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        children: [
          Container(
            height: 200,
            width: double.infinity,
            color: Colors.indigo,
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                CircleAvatar(radius: 40, child: Icon(Icons.person, size: 50)),
                SizedBox(height: 10),
                Text("أحمد محمد", style: TextStyle(color: Colors.white, fontSize: 20)),
                Text("رصيدك: 120 دقيقة", style: TextStyle(color: Colors.orangeAccent)),
              ],
            ),
          ),
          ListTile(
            leading: Icon(Icons.history),
            title: Text("سجل المقايضات"),
            trailing: Icon(Icons.arrow_forward_ios),
          ),
          ListTile(
            leading: Icon(Icons.settings),
            title: Text("إعدادات الحساب"),
            trailing: Icon(Icons.arrow_forward_ios),
          ),
          Spacer(),
          Padding(
            padding: const EdgeInsets.all(20.0),
            child: Text("عضو منذ 2026", style: TextStyle(color: Colors.grey)),
          )
        ],
      ),
    );
  }
}
