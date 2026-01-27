import 'package:flutter/material.dart';

void main() {
  runApp(MugayadaApp());
}

class MugayadaApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'مُقايضة',
      theme: ThemeData(
        primarySwatch: Colors.indigo,
        fontFamily: 'Arial', // يمكنك تغيير الخط لاحقاً
      ),
      home: HomeScreen(),
    );
  }
}

class HomeScreen extends StatelessWidget {
  final List<Map<String, dynamic>> skills = [
    {"name": "ياسين", "skill": "برمجة Dart", "time": "30", "dist": "1.2 كم"},
    {"name": "ليلى", "skill": "تصميم واجهات", "time": "45", "dist": "0.5 كم"},
    {"name": "عمر", "skill": "لغة إنجليزية", "time": "20", "dist": "3.0 كم"},
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Color(0xFFF5F5F5),
      appBar: AppBar(
        title: Text('مُقايضة - المهارات القريبة'),
        centerTitle: true,
        backgroundColor: Colors.indigo[700],
        actions: [
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: Chip(
              label: Text('120 دقيقة', style: TextStyle(color: Colors.white)),
              backgroundColor: Colors.orange[700],
            ),
          )
        ],
      ),
      body: ListView.builder(
        itemCount: skills.length,
        itemBuilder: (context, index) {
          return Card(
            margin: EdgeInsets.symmetric(horizontal: 15, vertical: 8),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
            child: ListTile(
              contentPadding: EdgeInsets.all(15),
              leading: CircleAvatar(
                backgroundColor: Colors.indigo[100],
                child: Text(skills[index]['name'][0]),
              ),
              title: Text(skills[index]['skill'], style: TextStyle(fontWeight: FontWeight.bold)),
              subtitle: Text("بواسطة ${skills[index]['name']} • ${skills[index]['dist']}"),
              trailing: ElevatedButton(
                onPressed: () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text("تم إرسال طلب المقايضة لـ ${skills[index]['name']}")),
                  );
                },
                child: Text("اطلب ${skills[index]['time']} د"),
                style: ElevatedButton.styleFrom(backgroundColor: Colors.indigo),
              ),
            ),
          );
        },
      ),
      bottomNavigationBar: BottomNavigationBar(
        items: [
          BottomNavigationBarItem(icon: Icon(Icons.home), label: 'الرئيسية'),
          BottomNavigationBarItem(icon: Icon(Icons.add_circle_outline), label: 'أضف مهارة'),
          BottomNavigationBarItem(icon: Icon(Icons.person), label: 'حسابي'),
        ],
        selectedItemColor: Colors.indigo,
      ),
    );
  }
}
