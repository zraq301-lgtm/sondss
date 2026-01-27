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
        useMaterial3: true, // تفعيل لغة التصميم الأحدث
      ),
      home: MainWrapper(),
    );
  }
}

// هذا الكلاس يتحكم في التنقل بين الصفحات
class MainWrapper extends StatefulWidget {
  @override
  _MainWrapperState createState() => _MainWrapperState();
}

class _MainWrapperState extends State<MainWrapper> {
  int _currentIndex = 0;

  // قائمة الصفحات التي سيتنقل بينها المستخدم
  final List<Widget> _pages = [
    HomeList(),
    AddSkillScreen(),
    ProfileScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _pages[_currentIndex],
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: (index) {
          setState(() {
            _currentIndex = index;
          });
        },
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

// --- 1. شاشة القائمة الرئيسية ---
class HomeList extends StatelessWidget {
  final List<Map<String, dynamic>> skills = [
    {"name": "ياسين", "skill": "برمجة Dart", "time": "30", "dist": "1.2 كم"},
    {"name": "ليلى", "skill": "تصميم واجهات", "time": "45", "dist": "0.5 كم"},
    {"name": "عمر", "skill": "لغة إنجليزية", "time": "20", "dist": "3.0 كم"},
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('مُقايضة'),
        centerTitle: true,
        actions: [
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 10),
            child: ActionChip(
              label: Text('120 دقيقة', style: TextStyle(color: Colors.white)),
              backgroundColor: Colors.orange[700],
              onPressed: () {},
            ),
          )
        ],
      ),
      body: ListView.builder(
        itemCount: skills.length,
        itemBuilder: (context, index) {
          return Card(
            margin: EdgeInsets.symmetric(horizontal: 15, vertical: 8),
            child: ListTile(
              leading: CircleAvatar(child: Text(skills[index]['name'][0])),
              title: Text(skills[index]['skill']),
              subtitle: Text("${skills[index]['name']} • ${skills[index]['dist']}"),
              trailing: ElevatedButton(
                onPressed: () {},
                child: Text("اطلب ${skills[index]['time']} د"),
              ),
            ),
          );
        },
      ),
    );
  }
}

// --- 2. شاشة إضافة مهارة ---
class AddSkillScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("نشر مهارة جديدة")),
      body: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          children: [
            TextField(decoration: InputDecoration(labelText: "ماذا ستعلمنا؟", border: OutlineInputBorder())),
            SizedBox(height: 20),
            TextField(decoration: InputDecoration(labelText: "المدة المتوقعة (دقائق)", border: OutlineInputBorder())),
            SizedBox(height: 30),
            ElevatedButton(
              onPressed: () {},
              child: Text("نشر المهارة الآن"),
              style: ElevatedButton.styleFrom(minimumSize: Size(double.infinity, 50)),
            )
          ],
        ),
      ),
    );
  }
}

// --- 3. شاشة الملف الشخصي ---
class ProfileScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        children: [
          Container(
            height: 180, width: double.infinity, color: Colors.indigo,
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                CircleAvatar(radius: 40, iconColor: Colors.indigo, child: Icon(Icons.person, size: 50)),
                Text("أحمد محمد", style: TextStyle(color: Colors.white, fontSize: 18)),
              ],
            ),
          ),
          ListTile(leading: Icon(Icons.history), title: Text("سجل المقايضات")),
          ListTile(leading: Icon(Icons.wallet), title: Text("المحفظة الزمنية")),
          ListTile(leading: Icon(Icons.logout), title: Text("تسجيل الخروج")),
        ],
      ),
    );
  }
}
