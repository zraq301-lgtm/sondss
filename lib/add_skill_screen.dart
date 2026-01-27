import 'package:flutter/material.dart';

class AddSkillScreen extends StatefulWidget {
  @override
  _AddSkillScreenState createState() => _AddSkillScreenState();
}

class _AddSkillScreenState extends State<AddSkillScreen> {
  final _formKey = GlobalKey<FormState>();
  String skillName = '';
  int duration = 15;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("أضف مهارة للتبادل")),
      body: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Form(
          key: _formKey,
          child: Column(
            children: [
              TextFormField(
                decoration: InputDecoration(
                  labelText: "ما المهارة التي ستقدمها؟",
                  border: OutlineInputBorder(),
                  prefixIcon: Icon(Icons.star),
                ),
                onChanged: (val) => skillName = val,
              ),
              SizedBox(height: 20),
              Text("مدة الجلسة (بالدقائق):"),
              Slider(
                value: duration.toDouble(),
                min: 15,
                max: 120,
                divisions: 7,
                label: "$duration دقيقة",
                onChanged: (val) => setState(() => duration = val.toInt()),
              ),
              SizedBox(height: 30),
              ElevatedButton(
                style: ElevatedButton.styleFrom(
                  minimumSize: Size(double.infinity, 50),
                  backgroundColor: Colors.indigo,
                ),
                onPressed: () {
                  // هنا سيتم الربط مع قاعدة البيانات لاحقاً
                  Navigator.pop(context);
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text("تم نشر مهارة $skillName بنجاح!")),
                  );
                },
                child: Text("انشر المهارة الآن", style: TextStyle(color: Colors.white)),
              )
            ],
          ),
        ),
      ),
    );
  }
}
