import 'package:flutter/material.dart';

class DiaryTab extends StatefulWidget {
  const DiaryTab({super.key});

  @override
  State<DiaryTab> createState() => _DiaryTabState();
}

class _DiaryTabState extends State<DiaryTab> with SingleTickerProviderStateMixin {
  late TabController _subTabController;

  final List<String> _tabs = [
    'Homework',
    'Class Timetable',
    'Exam Timetable',
    'Events',
    'Notifications',
  ];

  @override
  void initState() {
    super.initState();
    _subTabController = TabController(length: _tabs.length, vsync: this);
  }

  @override
  void dispose() {
    _subTabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Container(
          color: Colors.white,
          child: TabBar(
            controller: _subTabController,
            isScrollable: true,
            indicatorColor: const Color(0xFFFF7F50),
            labelColor: const Color(0xFFFF7F50),
            unselectedLabelColor: Colors.grey[600],
            tabs: _tabs.map((t) => Tab(text: t)).toList(),
          ),
        ),
        Expanded(
          child: TabBarView(
            controller: _subTabController,
            children: [
              _buildHomeworkView(),
              _buildClassTimetableView(),
              _buildExamTimetableView(),
              _buildEventsView(),
              _buildNotificationsView(),
            ],
          ),
        ),
      ],
    );
  }

  // 1. Homework
  Widget _buildHomeworkView() {
    final hwData = [
      {'subject': 'Mathematics', 'task': 'Complete Exercise 5.3 – Trigonometry', 'due': 'Tomorrow', 'status': 'Pending'},
      {'subject': 'Science', 'task': 'Draw diagram of the human digestive system', 'due': 'Apr 30', 'status': 'Pending'},
      {'subject': 'English', 'task': 'Write a 200-word essay on "My School"', 'due': 'May 1', 'status': 'Submitted'},
    ];

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: hwData.length,
      itemBuilder: (context, i) {
        final hw = hwData[i];
        final isSubmitted = hw['status'] == 'Submitted';
        return Card(
          margin: const EdgeInsets.only(bottom: 12),
          child: ListTile(
            title: Text(hw['subject']!, style: const TextStyle(fontWeight: FontWeight.bold, color: Color(0xFFFF7F50))),
            subtitle: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SizedBox(height: 4),
                Text(hw['task']!, style: const TextStyle(fontSize: 14)),
                const SizedBox(height: 4),
                Text('Due: ${hw['due']}', style: TextStyle(color: Colors.grey[600], fontSize: 12)),
              ],
            ),
            trailing: Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
              decoration: BoxDecoration(
                color: isSubmitted ? Colors.green.withOpacity(0.1) : const Color(0xFFFF7F50).withOpacity(0.1),
                borderRadius: BorderRadius.circular(20),
              ),
              child: Text(hw['status']!, style: TextStyle(color: isSubmitted ? Colors.green : const Color(0xFFFF7F50), fontWeight: FontWeight.bold, fontSize: 12)),
            ),
          ),
        );
      },
    );
  }

  // 2. Class Timetable
  Widget _buildClassTimetableView() {
    final classTT = [
      {'day': 'Monday', 'periods': ['Math', 'Science', 'English', 'Hindi', 'Social', 'PT']},
      {'day': 'Tuesday', 'periods': ['English', 'Math', 'Science', 'Art', 'Hindi', 'Library']},
      {'day': 'Wednesday', 'periods': ['Science', 'Social', 'Math', 'English', 'PT', 'Hindi']},
      {'day': 'Thursday', 'periods': ['Hindi', 'Math', 'Art', 'Science', 'English', 'Social']},
      {'day': 'Friday', 'periods': ['Math', 'English', 'Science', 'Social', 'Hindi', 'Music']},
    ];

    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          child: DataTable(
            columns: const [
              DataColumn(label: Text('Day')),
              DataColumn(label: Text('P1')),
              DataColumn(label: Text('P2')),
              DataColumn(label: Text('P3')),
              DataColumn(label: Text('P4')),
              DataColumn(label: Text('P5')),
              DataColumn(label: Text('P6')),
            ],
            rows: classTT.map((row) {
              final periods = row['periods'] as List<String>;
              return DataRow(cells: [
                DataCell(Text(row['day'] as String, style: const TextStyle(fontWeight: FontWeight.bold))),
                ...periods.map((p) => DataCell(Text(p))).toList(),
              ]);
            }).toList(),
          ),
        ),
      ],
    );
  }

  // 3. Exam Timetable
  Widget _buildExamTimetableView() {
    final examTT = [
      {'subject': 'Mathematics', 'date': 'May 10, 2026', 'time': '9:00 AM', 'duration': '2.5 hrs'},
      {'subject': 'Science', 'date': 'May 12, 2026', 'time': '9:00 AM', 'duration': '2 hrs'},
      {'subject': 'English', 'date': 'May 14, 2026', 'time': '9:00 AM', 'duration': '2 hrs'},
      {'subject': 'Social', 'date': 'May 16, 2026', 'time': '9:00 AM', 'duration': '2 hrs'},
    ];

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: examTT.length,
      itemBuilder: (context, i) {
        final e = examTT[i];
        return Card(
          margin: const EdgeInsets.only(bottom: 12),
          child: ListTile(
            leading: CircleAvatar(
              backgroundColor: const Color(0xFFFF7F50),
              foregroundColor: Colors.white,
              child: Text(e['subject']!.substring(0, 3)),
            ),
            title: Text(e['subject']!, style: const TextStyle(fontWeight: FontWeight.bold)),
            subtitle: Text('${e['date']} · ${e['time']}\nDuration: ${e['duration']}'),
          ),
        );
      },
    );
  }

  // 4. Events
  Widget _buildEventsView() {
    final upcomingEvents = [
      {'name': 'Unit Test – Math', 'date': 'Apr 30', 'type': 'Exam'},
      {'name': 'Sports Day Practice', 'date': 'May 2', 'type': 'Activity'},
      {'name': 'Holiday – Labour Day', 'date': 'May 1', 'type': 'Holiday'},
    ];

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: upcomingEvents.length,
      itemBuilder: (context, i) {
        final ev = upcomingEvents[i];
        return Card(
          margin: const EdgeInsets.only(bottom: 12),
          child: ListTile(
            leading: const Icon(Icons.event, color: Color(0xFFFF7F50)),
            title: Text(ev['name']!, style: const TextStyle(fontWeight: FontWeight.bold)),
            subtitle: Text(ev['date']!),
            trailing: Chip(
              label: Text(ev['type']!, style: const TextStyle(fontSize: 12)),
              backgroundColor: const Color(0xFFFF7F50).withOpacity(0.1),
            ),
          ),
        );
      },
    );
  }

  // 5. Notifications
  Widget _buildNotificationsView() {
    final notifications = [
      {'msg': 'Fee due date extended to May 15', 'time': '2 hrs ago'},
      {'msg': 'Parent-Teacher meeting on May 5 at 10 AM', 'time': '1 day ago'},
      {'msg': 'Science project submission reminder', 'time': '2 days ago'},
    ];

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: notifications.length,
      itemBuilder: (context, i) {
        final n = notifications[i];
        return Card(
          margin: const EdgeInsets.only(bottom: 12),
          child: ListTile(
            leading: const Icon(Icons.notifications_active, color: Color(0xFFFF7F50)),
            title: Text(n['msg']!),
            subtitle: Text(n['time']!, style: TextStyle(color: Colors.grey[600], fontSize: 12)),
          ),
        );
      },
    );
  }
}
