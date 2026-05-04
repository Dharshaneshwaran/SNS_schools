import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../../core/theme/app_theme.dart';

class DiaryScreen extends StatefulWidget {
  const DiaryScreen({super.key});

  @override
  State<DiaryScreen> createState() => _DiaryScreenState();
}

class _DiaryScreenState extends State<DiaryScreen> {
  int _activeTab = 0;
  String _hwFilter = 'All';

  final _tabs = ['Homework', 'Class TT', 'Exam TT', 'Events'];
  final _subjects = ['All', 'Mathematics', 'Science', 'English', 'Social'];

  final _hwData = [
    {'subject': 'Mathematics', 'task': 'Complete Exercise 5.3 – Trigonometry', 'due': 'Tomorrow'},
    {'subject': 'Science', 'task': 'Draw diagram of the human digestive system', 'due': 'Apr 30'},
    {'subject': 'English', 'task': 'Write a 200-word essay on \'My School\'', 'due': 'May 1'},
    {'subject': 'Mathematics', 'task': 'Solve Linear Equations worksheet', 'due': 'May 5'},
    {'subject': 'Social', 'task': 'Map work: Identify major rivers in India', 'due': 'May 3'},
  ];

  final _classTT = [
    {'day': 'Monday', 'periods': ['Math', 'Science', 'English', 'Hindi', 'Social', 'PT']},
    {'day': 'Tuesday', 'periods': ['English', 'Math', 'Science', 'Art', 'Hindi', 'Library']},
    {'day': 'Wednesday', 'periods': ['Science', 'Social', 'Math', 'English', 'PT', 'Hindi']},
    {'day': 'Thursday', 'periods': ['Hindi', 'Math', 'Art', 'Science', 'English', 'Social']},
    {'day': 'Friday', 'periods': ['Math', 'English', 'Science', 'Social', 'Hindi', 'Music']},
  ];

  final _examTT = [
    {'subject': 'Mathematics', 'date': 'May 10, 2026', 'time': '9:00 AM', 'duration': '2.5 hrs', 'hall': 'Hall A'},
    {'subject': 'Science', 'date': 'May 12, 2026', 'time': '9:00 AM', 'duration': '2 hrs', 'hall': 'Hall B'},
    {'subject': 'English', 'date': 'May 14, 2026', 'time': '9:00 AM', 'duration': '2 hrs', 'hall': 'Hall A'},
    {'subject': 'Social', 'date': 'May 16, 2026', 'time': '9:00 AM', 'duration': '2 hrs', 'hall': 'Hall C'},
  ];

  final _upcomingEvents = [
    {'name': 'Unit Test – Math', 'date': 'Apr 30', 'type': 'Exam'},
    {'name': 'Sports Day Practice', 'date': 'May 2', 'type': 'Activity'},
    {'name': 'Holiday – Labour Day', 'date': 'May 1', 'type': 'Holiday'},
  ];

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        // Tabs
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          child: SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: List.generate(_tabs.length, (i) {
                final isActive = _activeTab == i;
                return Padding(
                  padding: const EdgeInsets.only(right: 8),
                  child: GestureDetector(
                    onTap: () => setState(() => _activeTab = i),
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                      decoration: BoxDecoration(
                        color: isActive ? AppColors.primary.withValues(alpha: 0.1) : Colors.transparent,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: isActive ? AppColors.primary : AppColors.border),
                      ),
                      child: Text(_tabs[i], style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w700, color: isActive ? AppColors.primary : AppColors.textSecondary)),
                    ),
                  ),
                );
              }),
            ),
          ),
        ),
        Expanded(
          child: IndexedStack(
            index: _activeTab,
            children: [
              _buildHomework(),
              _buildClassTimetable(),
              _buildExamTimetable(),
              _buildEvents(),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildHomework() {
    final filtered = _hwFilter == 'All' ? _hwData : _hwData.where((h) => h['subject'] == _hwFilter).toList();
    return Column(
      children: [
        // Filter pills
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          child: SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: _subjects.map((s) {
                final isActive = _hwFilter == s;
                return Padding(
                  padding: const EdgeInsets.only(right: 8),
                  child: GestureDetector(
                    onTap: () => setState(() => _hwFilter = s),
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                      decoration: BoxDecoration(
                        color: isActive ? AppColors.primary.withValues(alpha: 0.1) : Colors.transparent,
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: isActive ? AppColors.primary : AppColors.border),
                      ),
                      child: Text(s, style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w600, color: isActive ? AppColors.primary : AppColors.textSecondary)),
                    ),
                  ),
                );
              }).toList(),
            ),
          ),
        ),
        Expanded(
          child: ListView.builder(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            itemCount: filtered.length,
            itemBuilder: (_, i) {
              final hw = filtered[i];
              return Container(
                margin: const EdgeInsets.only(bottom: 12),
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: AppColors.card,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppColors.border),
                ),
                child: Row(
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                            decoration: BoxDecoration(
                              color: AppColors.primary.withValues(alpha: 0.1),
                              borderRadius: BorderRadius.circular(6),
                            ),
                            child: Text(hw['subject']!, style: GoogleFonts.inter(fontSize: 10, fontWeight: FontWeight.w800, color: AppColors.primary, letterSpacing: 0.5)),
                          ),
                          const SizedBox(height: 8),
                          Text(hw['task']!, style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w700, color: AppColors.textPrimary)),
                          const SizedBox(height: 6),
                          Row(
                            children: [
                              Icon(Icons.calendar_today, size: 14, color: AppColors.textSecondary),
                              const SizedBox(width: 6),
                              Text('Due: ${hw['due']}', style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.textSecondary)),
                            ],
                          ),
                        ],
                      ),
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                      decoration: BoxDecoration(
                        color: AppColors.textPrimary,
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Text('View', style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w700, color: AppColors.background)),
                    ),
                  ],
                ),
              );
            },
          ),
        ),
      ],
    );
  }

  Widget _buildClassTimetable() {
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: _classTT.length,
      itemBuilder: (_, i) {
        final day = _classTT[i];
        return Container(
          margin: const EdgeInsets.only(bottom: 16),
          decoration: BoxDecoration(
            color: AppColors.card,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: AppColors.border),
          ),
          child: Column(
            children: [
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: AppColors.primary.withValues(alpha: 0.08),
                  borderRadius: const BorderRadius.vertical(top: Radius.circular(16)),
                  border: Border(bottom: BorderSide(color: AppColors.border)),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(day['day'] as String, style: GoogleFonts.poppins(fontSize: 15, fontWeight: FontWeight.w700, color: AppColors.primary)),
                    Icon(Icons.access_time, size: 18, color: AppColors.primary),
                  ],
                ),
              ),
              ...(day['periods'] as List<String>).asMap().entries.map((entry) {
                final isLast = entry.key == (day['periods'] as List).length - 1;
                return Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                  decoration: BoxDecoration(
                    border: isLast ? null : Border(bottom: BorderSide(color: AppColors.border)),
                  ),
                  child: Row(
                    children: [
                      SizedBox(width: 30, child: Text('P${entry.key + 1}', style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.w800, color: AppColors.textSecondary))),
                      Text(entry.value, style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.textPrimary)),
                    ],
                  ),
                );
              }),
            ],
          ),
        );
      },
    );
  }

  Widget _buildExamTimetable() {
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: _examTT.length,
      itemBuilder: (_, i) {
        final exam = _examTT[i];
        return Container(
          margin: const EdgeInsets.only(bottom: 16),
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: AppColors.card,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: AppColors.border),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Container(
                    width: 44,
                    height: 44,
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(colors: [Color(0xFFFF7F50), Color(0xFFE66A3E)]),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Center(
                      child: Text(exam['subject']![0], style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.w900, color: Colors.white)),
                    ),
                  ),
                  const Spacer(),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                    decoration: BoxDecoration(color: AppColors.surface, borderRadius: BorderRadius.circular(8)),
                    child: Text('Box No: ${100 + i}', style: GoogleFonts.inter(fontSize: 10, fontWeight: FontWeight.w800, color: AppColors.textSecondary)),
                  ),
                ],
              ),
              const SizedBox(height: 14),
              Text(exam['subject']!, style: GoogleFonts.poppins(fontSize: 18, fontWeight: FontWeight.w800, color: AppColors.textPrimary)),
              const SizedBox(height: 10),
              _infoRow(Icons.calendar_today, exam['date']!),
              const SizedBox(height: 6),
              _infoRow(Icons.access_time, '${exam['time']} (${exam['duration']})'),
              const SizedBox(height: 6),
              _infoRow(Icons.location_on, 'Location: ${exam['hall']}'),
            ],
          ),
        );
      },
    );
  }

  Widget _buildEvents() {
    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: _upcomingEvents.length,
      itemBuilder: (_, i) {
        final ev = _upcomingEvents[i];
        return Container(
          margin: const EdgeInsets.only(bottom: 12),
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: AppColors.card,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: AppColors.border),
          ),
          child: Row(
            children: [
              Container(
                width: 44,
                height: 44,
                decoration: BoxDecoration(
                  color: AppColors.primary.withValues(alpha: 0.08),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(Icons.calendar_today, color: AppColors.primary, size: 22),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(ev['name']!, style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w700, color: AppColors.textPrimary)),
                    Text(ev['date']!, style: GoogleFonts.inter(fontSize: 12, color: AppColors.textSecondary)),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(color: AppColors.surface, borderRadius: BorderRadius.circular(10)),
                child: Text(ev['type']!, style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w700, color: AppColors.primary)),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _infoRow(IconData icon, String text) {
    return Row(
      children: [
        Icon(icon, size: 16, color: AppColors.primary),
        const SizedBox(width: 8),
        Text(text, style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.textSecondary)),
      ],
    );
  }
}
