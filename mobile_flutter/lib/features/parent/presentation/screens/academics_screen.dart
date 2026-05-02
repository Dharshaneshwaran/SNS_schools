import 'package:flutter/material.dart';
import '../../../../core/theme/app_theme.dart';

class AcademicsScreen extends StatelessWidget {
  const AcademicsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 3,
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Academics'),
          backgroundColor: Colors.transparent,
          elevation: 0,
          bottom: const TabBar(
            indicatorColor: AppColors.primaryOrange,
            labelColor: AppColors.primaryOrange,
            unselectedLabelColor: Colors.white38,
            tabs: [
              Tab(text: 'Timetable'),
              Tab(text: 'Attendance'),
              Tab(text: 'Grades'),
            ],
          ),
        ),
        body: const TabBarView(
          children: [
            _TimetableView(),
            _AttendanceView(),
            _GradesView(),
          ],
        ),
      ),
    );
  }
}

class _TimetableView extends StatelessWidget {
  const _TimetableView();

  @override
  Widget build(BuildContext context) {
    final List<Map<String, String>> schedule = [
      {'time': '09:00 AM', 'subject': 'Mathematics', 'teacher': 'James Miller'},
      {'time': '10:00 AM', 'subject': 'Physics', 'teacher': 'Dr. Sarah Wilson'},
      {'time': '11:00 AM', 'subject': 'Chemistry', 'teacher': 'Elena Rodriguez'},
      {'time': '12:00 PM', 'subject': 'Lunch Break', 'teacher': '-'},
      {'time': '01:00 PM', 'subject': 'Computer Science', 'teacher': 'Robert Brown'},
    ];

    return ListView.builder(
      padding: const EdgeInsets.all(20),
      itemCount: schedule.length,
      itemBuilder: (context, index) {
        final item = schedule[index];
        bool isBreak = item['subject'] == 'Lunch Break';
        return Container(
          margin: const EdgeInsets.only(bottom: 12),
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: isBreak ? AppColors.primaryOrange.withOpacity(0.05) : AppColors.surface,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: isBreak ? AppColors.primaryOrange.withOpacity(0.2) : Colors.white.withOpacity(0.05)),
          ),
          child: Row(
            children: [
              SizedBox(
                width: 80,
                child: Text(item['time']!, style: const TextStyle(color: AppColors.primaryOrange, fontWeight: FontWeight.bold, fontSize: 12)),
              ),
              const SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(item['subject']!, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                    Text(item['teacher']!, style: const TextStyle(color: Colors.white38, fontSize: 12)),
                  ],
                ),
              ),
            ],
          ),
        );
      },
    );
  }
}

class _AttendanceView extends StatelessWidget {
  const _AttendanceView();

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: AppColors.surface,
              borderRadius: BorderRadius.circular(20),
            ),
            child: const Row(
              mainAxisAlignment: MainAxisAlignment.spaceAround,
              children: [
                _StatItem('92%', 'Monthly'),
                _StatItem('95%', 'Overall'),
                _StatItem('2', 'Absents'),
              ],
            ),
          ),
          const SizedBox(height: 32),
          const Text('Attendance Log', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          const SizedBox(height: 16),
          _AttendanceTile('30 Apr 2026', 'Present', true),
          _AttendanceTile('29 Apr 2026', 'Present', true),
          _AttendanceTile('28 Apr 2026', 'Absent', false),
          _AttendanceTile('27 Apr 2026', 'Present', true),
        ],
      ),
    );
  }
}

class _GradesView extends StatelessWidget {
  const _GradesView();

  @override
  Widget build(BuildContext context) {
    return ListView.separated(
      padding: const EdgeInsets.all(20),
      itemCount: 4,
      separatorBuilder: (context, index) => const SizedBox(height: 16),
      itemBuilder: (context, index) {
        return Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: AppColors.surface,
            borderRadius: BorderRadius.circular(12),
          ),
          child: const Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Mathematics', style: TextStyle(fontWeight: FontWeight.bold)),
                  Text('Unit Test - II', style: TextStyle(color: Colors.white38, fontSize: 12)),
                ],
              ),
              Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Text('92/100', style: TextStyle(color: AppColors.primaryOrange, fontWeight: FontWeight.bold, fontSize: 18)),
                  Text('Grade: A+', style: TextStyle(color: AppColors.success, fontSize: 12)),
                ],
              ),
            ],
          ),
        );
      },
    );
  }
}

class _StatItem extends StatelessWidget {
  final String value;
  final String label;
  const _StatItem(this.value, this.label);

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text(value, style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: AppColors.primaryOrange)),
        Text(label, style: const TextStyle(color: Colors.white38, fontSize: 12)),
      ],
    );
  }
}

class _AttendanceTile extends StatelessWidget {
  final String date;
  final String status;
  final bool isPresent;
  const _AttendanceTile(this.date, this.status, this.isPresent);

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(date),
          Text(
            status,
            style: TextStyle(color: isPresent ? AppColors.success : AppColors.error, fontWeight: FontWeight.bold),
          ),
        ],
      ),
    );
  }
}
