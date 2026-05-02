import 'package:flutter/material.dart';

import '../../../../core/models/student.dart';

class AcademicTab extends StatefulWidget {
  final Student student;
  const AcademicTab({required this.student, super.key});

  @override
  State<AcademicTab> createState() => _AcademicTabState();
}

class _AcademicTabState extends State<AcademicTab> with SingleTickerProviderStateMixin {
  late TabController _subTabController;

  final List<String> _tabs = [
    'Attendance',
    'Exam Report',
    'Academic Calendar',
    'Exam Schedule',
    'Leave Application',
  ];

  // Leave Form Controllers
  final _leaveFormKey = GlobalKey<FormState>();
  final _fromDateCtrl = TextEditingController();
  final _toDateCtrl = TextEditingController();
  final _reasonCtrl = TextEditingController();
  bool _leaveSubmitted = false;

  @override
  void initState() {
    super.initState();
    _subTabController = TabController(length: _tabs.length, vsync: this);
  }

  @override
  void dispose() {
    _subTabController.dispose();
    _fromDateCtrl.dispose();
    _toDateCtrl.dispose();
    _reasonCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Column(
      children: [
        // Student Info Banner
        Container(
          width: double.infinity,
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          color: const Color(0xFFFF7F50).withValues(alpha: 0.1),
          child: Text(
            'Academic Records: ${widget.student.name}',
            style: const TextStyle(
              color: Color(0xFFFF7F50),
              fontWeight: FontWeight.bold,
              fontSize: 12,
            ),
          ),
        ),
        Container(
          color: theme.cardColor,
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
              _buildAttendanceView(theme),
              _buildExamReportView(theme),
              _buildCalendarView(theme),
              _buildScheduleView(theme),
              _buildLeaveView(theme),
            ],
          ),
        ),
      ],
    );
  }

  // 1. Attendance View
  Widget _buildAttendanceView(ThemeData theme) {
    const attended = 82;
    const total = 90;
    const pct = (attended / total) * 100;

    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Row(
          children: [
            Expanded(child: _buildAttendanceMetric(theme, 'Days Present', '$attended', Colors.green)),
            const SizedBox(width: 12),
            Expanded(child: _buildAttendanceMetric(theme, 'Days Absent', '${total - attended}', Colors.red)),
            const SizedBox(width: 12),
            Expanded(child: _buildAttendanceMetric(theme, 'Attendance %', '${pct.toStringAsFixed(1)}%', const Color(0xFFFF7F50))),
          ],
        ),
        const SizedBox(height: 24),
        Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: theme.cardColor,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: Colors.grey[200]!),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text('Overall Attendance', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: theme.colorScheme.onSurface)),
                  Text('${pct.toStringAsFixed(1)}%', style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.green, fontSize: 16)),
                ],
              ),
              const SizedBox(height: 12),
              ClipRRect(
                borderRadius: BorderRadius.circular(10),
                child: LinearProgressIndicator(
                  value: pct / 100,
                  backgroundColor: Colors.grey[200],
                  color: Colors.green,
                  minHeight: 10,
                ),
              ),
              const SizedBox(height: 8),
              Text('Minimum required: 75%', style: TextStyle(fontSize: 12, color: Colors.grey[600])),
            ],
          ),
        )
      ],
    );
  }

  Widget _buildAttendanceMetric(ThemeData theme, String label, String value, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 8),
      decoration: BoxDecoration(
        color: theme.cardColor,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: Colors.grey[200]!),
      ),
      child: Column(
        children: [
          Text(value, style: TextStyle(color: color, fontSize: 26, fontWeight: FontWeight.bold)),
          const SizedBox(height: 4),
          Text(label, style: TextStyle(fontSize: 12, color: Colors.grey[600]), textAlign: TextAlign.center),
        ],
      ),
    );
  }

  // 2. Exam Report
  Widget _buildExamReportView(ThemeData theme) {
    final subjects = [
      {'name': 'Mathematics', 'marks': 92, 'max': 100, 'grade': 'A+'},
      {'name': 'Science', 'marks': 85, 'max': 100, 'grade': 'A'},
      {'name': 'English', 'marks': 88, 'max': 100, 'grade': 'A'},
      {'name': 'Hindi', 'marks': 78, 'max': 100, 'grade': 'B+'},
      {'name': 'Social', 'marks': 82, 'max': 100, 'grade': 'A-'},
    ];

    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        Container(
          decoration: BoxDecoration(
            color: theme.cardColor,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: Colors.grey[200]!),
          ),
          child: Column(
            children: subjects.map((s) {
              final score = s['marks'] as int;
              return ListTile(
                title: Text(s['name'] as String, style: TextStyle(fontWeight: FontWeight.bold, color: theme.colorScheme.onSurface)),
                subtitle: Text('Score: $score/${s['max']}', style: TextStyle(color: Colors.grey[600])),
                trailing: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                  decoration: BoxDecoration(color: const Color(0xFFFF7F50).withValues(alpha: 0.1), borderRadius: BorderRadius.circular(20)),
                  child: Text(s['grade'] as String, style: const TextStyle(color: Color(0xFFFF7F50), fontWeight: FontWeight.bold)),
                ),
              );
            }).toList(),
          ),
        ),
      ],
    );
  }

  // 3. Academic Calendar
  Widget _buildCalendarView(ThemeData theme) {
    final events = [
      {'month': 'April', 'list': ['Apr 20 – Sports Day', 'Apr 30 – Unit Test']},
      {'month': 'May', 'list': ['May 1 – Labour Day Holiday', 'May 10-16 – Term Exams', 'May 20 – Results Day']},
      {'month': 'June', 'list': ['Jun 1 – Summer Break Begins', 'Jun 20 – New Term Starts']},
    ];

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: events.length,
      itemBuilder: (context, i) {
        final ev = events[i];
        return Card(
          color: theme.cardColor,
          margin: const EdgeInsets.only(bottom: 16),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(ev['month'] as String, style: const TextStyle(color: Color(0xFFFF7F50), fontSize: 16, fontWeight: FontWeight.bold)),
                const Divider(),
                ... (ev['list'] as List<String>).map((item) => Padding(
                  padding: const EdgeInsets.symmetric(vertical: 4),
                  child: Row(
                    children: [
                      const Icon(Icons.circle, size: 8, color: Color(0xFFFF7F50)),
                      const SizedBox(width: 8),
                      Text(item, style: TextStyle(fontSize: 14, color: theme.colorScheme.onSurface)),
                    ],
                  ),
                )),
              ],
            ),
          ),
        );
      },
    );
  }

  // 4. Exam Schedule
  Widget _buildScheduleView(ThemeData theme) {
    final schedule = [
      {'subject': 'Mathematics', 'date': 'May 10', 'hall': 'Hall A', 'seat': '25'},
      {'subject': 'Science', 'date': 'May 12', 'hall': 'Hall B', 'seat': '12'},
      {'subject': 'English', 'date': 'May 14', 'hall': 'Hall A', 'seat': '25'},
      {'subject': 'Hindi', 'date': 'May 15', 'hall': 'Hall C', 'seat': '8'},
      {'subject': 'Social', 'date': 'May 16', 'hall': 'Hall B', 'seat': '12'},
    ];

    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          child: DataTable(
            columns: [
              DataColumn(label: Text('Subject', style: TextStyle(color: theme.colorScheme.onSurface))),
              DataColumn(label: Text('Date', style: TextStyle(color: theme.colorScheme.onSurface))),
              DataColumn(label: Text('Hall', style: TextStyle(color: theme.colorScheme.onSurface))),
              DataColumn(label: Text('Seat', style: TextStyle(color: theme.colorScheme.onSurface))),
            ],
            rows: schedule.map((e) {
              return DataRow(cells: [
                DataCell(Text(e['subject']!, style: TextStyle(fontWeight: FontWeight.bold, color: theme.colorScheme.onSurface))),
                DataCell(Text(e['date']!, style: TextStyle(color: theme.colorScheme.onSurface))),
                DataCell(Text(e['hall']!, style: TextStyle(color: theme.colorScheme.onSurface))),
                DataCell(Text(e['seat']!, style: TextStyle(color: theme.colorScheme.onSurface))),
              ]);
            }).toList(),
          ),
        ),
      ],
    );
  }

  // 5. Leave View
  Widget _buildLeaveView(ThemeData theme) {
    if (_leaveSubmitted) {
      return Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.check_circle, color: Colors.green, size: 64),
            const SizedBox(height: 16),
            const Text('Application Submitted!', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: () => setState(() => _leaveSubmitted = false),
              style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFFFF7F50), foregroundColor: Colors.white),
              child: const Text('Apply Again'),
            ),
          ],
        ),
      );
    }

    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Form(
        key: _leaveFormKey,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Apply for Leave', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 24),
            TextFormField(
              controller: _fromDateCtrl,
              decoration: const InputDecoration(labelText: 'From Date', border: OutlineInputBorder()),
              validator: (v) => v == null || v.isEmpty ? 'Required' : null,
            ),
            const SizedBox(height: 16),
            TextFormField(
              controller: _toDateCtrl,
              decoration: const InputDecoration(labelText: 'To Date', border: OutlineInputBorder()),
              validator: (v) => v == null || v.isEmpty ? 'Required' : null,
            ),
            const SizedBox(height: 16),
            TextFormField(
              controller: _reasonCtrl,
              maxLines: 4,
              decoration: const InputDecoration(labelText: 'Reason for Leave', border: OutlineInputBorder()),
              validator: (v) => v == null || v.isEmpty ? 'Required' : null,
            ),
            const SizedBox(height: 24),
            SizedBox(
              width: double.infinity,
              height: 48,
              child: ElevatedButton(
                onPressed: () {
                  if (_leaveFormKey.currentState!.validate()) {
                    setState(() => _leaveSubmitted = true);
                  }
                },
                style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFFFF7F50), foregroundColor: Colors.white),
                child: const Text('Submit Application'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
