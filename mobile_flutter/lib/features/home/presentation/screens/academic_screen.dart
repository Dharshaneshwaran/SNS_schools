import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../../core/theme/app_theme.dart';

class AcademicScreen extends StatefulWidget {
  const AcademicScreen({super.key});

  @override
  State<AcademicScreen> createState() => _AcademicScreenState();
}

class _AcademicScreenState extends State<AcademicScreen> {
  int _activeTab = 0;
  String _examType = 'term';
  DateTime _currentDate = DateTime(2026, 3, 1);
  bool _leaveSubmitted = false;

  final _tabs = ['Calendar', 'Attendance', 'Report Card', 'Exam Schedule', 'Leave'];

  final _reportData = {
    'term': {
      'term': 'Annual Examination 2025-26',
      'subjects': [
        {'name': 'Mathematics', 'internal': 18, 'exam': 74, 'total': 92, 'grade': 'A+'},
        {'name': 'Science', 'internal': 17, 'exam': 68, 'total': 85, 'grade': 'A'},
        {'name': 'English', 'internal': 19, 'exam': 69, 'total': 88, 'grade': 'A'},
        {'name': 'Hindi', 'internal': 16, 'exam': 62, 'total': 78, 'grade': 'B+'},
        {'name': 'Social', 'internal': 18, 'exam': 64, 'total': 82, 'grade': 'A-'},
      ],
      'percentage': '92.4%',
      'attendance': '96.4%',
      'remarks': 'Arjun is a dedicated student who shows great interest in Mathematics and Science.',
    },
  };

  final _attendanceData = {
    1: 'P', 2: 'P', 3: 'P', 6: 'P', 7: 'P', 8: 'A', 9: 'P', 10: 'P', 20: 'H', 25: 'H',
  };

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
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                      decoration: BoxDecoration(
                        color: isActive ? AppColors.primary.withValues(alpha: 0.1) : Colors.transparent,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: isActive ? AppColors.primary : AppColors.border),
                      ),
                      child: Text(_tabs[i], style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w700, color: isActive ? AppColors.primary : AppColors.textSecondary)),
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
              _buildCalendar(),
              _buildCalendar(),
              _buildReportCard(),
              _buildExamSchedule(),
              _buildLeaveForm(),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildCalendar() {
    final monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    final weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    final firstDay = DateTime(_currentDate.year, _currentDate.month, 1).weekday;
    final daysInMonth = DateTime(_currentDate.year, _currentDate.month + 1, 0).day;

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Container(
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: AppColors.card,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: AppColors.border),
        ),
        child: Column(
          children: [
            // Header
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    Icon(Icons.calendar_today, size: 20, color: AppColors.primary),
                    const SizedBox(width: 10),
                    Text('${monthNames[_currentDate.month - 1]} ${_currentDate.year}', style: GoogleFonts.poppins(fontSize: 18, fontWeight: FontWeight.w800, color: AppColors.textPrimary)),
                  ],
                ),
                Row(
                  children: [
                    _navButton(Icons.chevron_left, () => setState(() => _currentDate = DateTime(_currentDate.year, _currentDate.month - 1, 1))),
                    const SizedBox(width: 8),
                    _navButton(Icons.chevron_right, () => setState(() => _currentDate = DateTime(_currentDate.year, _currentDate.month + 1, 1))),
                  ],
                ),
              ],
            ),
            const SizedBox(height: 20),
            // Week days
            Row(
              children: weekDays.map((d) => Expanded(
                child: Center(child: Text(d, style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.w800, color: AppColors.textSecondary))),
              )).toList(),
            ),
            const SizedBox(height: 12),
            // Days grid
            GridView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(crossAxisCount: 7, childAspectRatio: 1),
              itemCount: (firstDay - 1) + daysInMonth,
              itemBuilder: (_, i) {
                if (i < firstDay - 1) return const SizedBox();
                final day = i - (firstDay - 1) + 1;
                final status = _attendanceData[day];
                Color? bg;
                Color? textColor;
                if (status == 'P') { bg = AppColors.success.withValues(alpha: 0.15); textColor = AppColors.success; }
                else if (status == 'A') { bg = AppColors.error.withValues(alpha: 0.15); textColor = AppColors.error; }
                else if (status == 'H') { bg = AppColors.surface; textColor = AppColors.textSecondary; }

                return Center(
                  child: Container(
                    width: 36,
                    height: 36,
                    decoration: BoxDecoration(color: bg, borderRadius: BorderRadius.circular(10)),
                    child: Center(
                      child: Text('$day', style: GoogleFonts.inter(fontSize: 13, fontWeight: status != null ? FontWeight.w800 : FontWeight.w600, color: textColor ?? AppColors.textPrimary)),
                    ),
                  ),
                );
              },
            ),
            const SizedBox(height: 20),
            // Legend
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                _legendDot(AppColors.success, 'Present'),
                const SizedBox(width: 16),
                _legendDot(AppColors.error, 'Absent'),
                const SizedBox(width: 16),
                _legendDot(const Color(0xFF3B82F6), 'Leave'),
                const SizedBox(width: 16),
                _legendDot(AppColors.textSecondary, 'Holiday'),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildReportCard() {
    final data = _reportData[_examType]!;
    final subjects = data['subjects'] as List<Map<String, dynamic>>;

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          // Exam type filter
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: ['periodic', 'cycle', 'term'].map((t) {
                final isActive = _examType == t;
                return Padding(
                  padding: const EdgeInsets.only(right: 8),
                  child: GestureDetector(
                    onTap: () => setState(() => _examType = t),
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                      decoration: BoxDecoration(
                        color: isActive ? AppColors.primary.withValues(alpha: 0.1) : Colors.transparent,
                        borderRadius: BorderRadius.circular(10),
                        border: Border.all(color: isActive ? AppColors.primary : AppColors.border),
                      ),
                      child: Text('${t[0].toUpperCase()}${t.substring(1)} Exam', style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w700, color: isActive ? AppColors.primary : AppColors.textSecondary)),
                    ),
                  ),
                );
              }).toList(),
            ),
          ),
          const SizedBox(height: 16),
          // Report card
          Container(
            decoration: BoxDecoration(
              color: AppColors.card,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: AppColors.border),
            ),
            child: Column(
              children: [
                // Header
                Container(
                  padding: const EdgeInsets.all(24),
                  decoration: BoxDecoration(
                    color: AppColors.surface,
                    borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
                    border: Border(bottom: BorderSide(color: AppColors.border)),
                  ),
                  child: Column(
                    children: [
                      Row(
                        children: [
                          Container(
                            width: 48,
                            height: 48,
                            decoration: BoxDecoration(color: Colors.white, borderRadius: BorderRadius.circular(12)),
                            child: const Icon(Icons.school, color: AppColors.primary, size: 28),
                          ),
                          const SizedBox(width: 14),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text('SNS ACADEMY', style: GoogleFonts.poppins(fontSize: 18, fontWeight: FontWeight.w900, color: AppColors.textPrimary)),
                                Text(data['term'] as String, style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.w700, color: AppColors.primary, letterSpacing: 0.5)),
                              ],
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 20),
                      Row(
                        children: [
                          _infoField(Icons.person, 'Student Name', 'Arjun Sharma'),
                          _infoField(Icons.badge, 'Roll No', 'SNS2024-1'),
                          _infoField(Icons.school, 'Grade', '8-A'),
                        ],
                      ),
                    ],
                  ),
                ),
                // Table header
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                  child: Row(
                    children: [
                      Expanded(flex: 3, child: Text('Subject', style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.w800, color: AppColors.textSecondary))),
                      Expanded(child: Center(child: Text('Int', style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.w800, color: AppColors.textSecondary)))),
                      Expanded(child: Center(child: Text('Exam', style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.w800, color: AppColors.textSecondary)))),
                      Expanded(child: Center(child: Text('Total', style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.w800, color: AppColors.textSecondary)))),
                      Expanded(child: Center(child: Text('Grade', style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.w800, color: AppColors.textSecondary)))),
                    ],
                  ),
                ),
                // Rows
                ...subjects.map((s) => Container(
                  padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
                  decoration: BoxDecoration(border: Border(top: BorderSide(color: AppColors.border))),
                  child: Row(
                    children: [
                      Expanded(flex: 3, child: Text(s['name'] as String, style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w700, color: AppColors.textPrimary))),
                      Expanded(child: Center(child: Text('${s['internal']}', style: GoogleFonts.inter(fontSize: 13, color: AppColors.textSecondary)))),
                      Expanded(child: Center(child: Text('${s['exam']}', style: GoogleFonts.inter(fontSize: 13, color: AppColors.textSecondary)))),
                      Expanded(child: Center(child: Text('${s['total']}', style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w800, color: AppColors.primary)))),
                      Expanded(child: Center(
                        child: Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(color: AppColors.primary.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(6)),
                          child: Text(s['grade'] as String, style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w800, color: AppColors.primary)),
                        ),
                      )),
                    ],
                  ),
                )),
                // Summary
                Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(border: Border(top: BorderSide(color: AppColors.border))),
                  child: Row(
                    children: [
                      _summaryCard('Percentage', data['percentage'] as String, Icons.trending_up),
                      const SizedBox(width: 12),
                      _summaryCard('Attendance', data['attendance'] as String, Icons.verified),
                    ],
                  ),
                ),
                // Remarks
                Container(
                  margin: const EdgeInsets.all(20),
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(color: AppColors.surface, borderRadius: BorderRadius.circular(14), border: Border.all(color: AppColors.border)),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text("TEACHER'S REMARKS", style: GoogleFonts.inter(fontSize: 10, fontWeight: FontWeight.w800, color: AppColors.textSecondary, letterSpacing: 0.5)),
                      const SizedBox(height: 8),
                      Text(data['remarks'] as String, style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.textPrimary, height: 1.6, fontStyle: FontStyle.italic)),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildExamSchedule() {
    final schedule = [
      {'subject': 'Mathematics', 'date': 'May 10', 'hall': 'Hall A', 'seat': '25'},
      {'subject': 'Science', 'date': 'May 12', 'hall': 'Hall B', 'seat': '12'},
      {'subject': 'English', 'date': 'May 14', 'hall': 'Hall A', 'seat': '25'},
      {'subject': 'Hindi', 'date': 'May 15', 'hall': 'Hall C', 'seat': '8'},
      {'subject': 'Social', 'date': 'May 16', 'hall': 'Hall B', 'seat': '12'},
    ];

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: schedule.length,
      itemBuilder: (_, i) {
        final e = schedule[i];
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
                  gradient: const LinearGradient(colors: [Color(0xFFFF7F50), Color(0xFFE66A3E)]),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Center(
                  child: Text(e['subject']![0], style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.w900, color: Colors.white)),
                ),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(e['subject']!, style: GoogleFonts.inter(fontSize: 15, fontWeight: FontWeight.w700, color: AppColors.textPrimary)),
                    const SizedBox(height: 4),
                    Row(
                      children: [
                        Text('Hall: ${e['hall']}', style: GoogleFonts.inter(fontSize: 12, color: AppColors.textSecondary)),
                        const SizedBox(width: 12),
                        Text('Seat: ${e['seat']}', style: GoogleFonts.inter(fontSize: 12, color: AppColors.textSecondary)),
                      ],
                    ),
                  ],
                ),
              ),
              Text(e['date']!, style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w700, color: AppColors.primary)),
            ],
          ),
        );
      },
    );
  }

  Widget _buildLeaveForm() {
    if (_leaveSubmitted) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(32),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                width: 64,
                height: 64,
                decoration: const BoxDecoration(shape: BoxShape.circle, color: Color(0xFFEEDFDF)),
                child: const Icon(Icons.check, size: 32, color: AppColors.success),
              ),
              const SizedBox(height: 20),
              Text('Application Submitted!', style: GoogleFonts.poppins(fontSize: 18, fontWeight: FontWeight.w800, color: AppColors.textPrimary)),
              const SizedBox(height: 8),
              Text('The leave request has been sent to the administrator.', textAlign: TextAlign.center, style: GoogleFonts.inter(fontSize: 14, color: AppColors.textSecondary)),
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: () => setState(() => _leaveSubmitted = false),
                child: const Text('Apply for Another'),
              ),
            ],
          ),
        ),
      );
    }

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Container(
        padding: const EdgeInsets.all(24),
        decoration: BoxDecoration(
          color: AppColors.card,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: AppColors.border),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Apply for Leave', style: GoogleFonts.poppins(fontSize: 18, fontWeight: FontWeight.w800, color: AppColors.textPrimary)),
            Text('Student: Arjun Sharma (8-A)', style: GoogleFonts.inter(fontSize: 13, color: AppColors.textSecondary)),
            const SizedBox(height: 24),
            Row(
              children: [
                Expanded(child: _dateField('Start Date')),
                const SizedBox(width: 12),
                Expanded(child: _dateField('End Date')),
              ],
            ),
            const SizedBox(height: 16),
            Text('REASON FOR LEAVE', style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.w800, color: AppColors.textSecondary, letterSpacing: 0.5)),
            const SizedBox(height: 8),
            Container(
              decoration: BoxDecoration(
                color: AppColors.surface,
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: AppColors.border),
              ),
              child: TextField(
                maxLines: 3,
                decoration: InputDecoration(
                  hintText: 'Please provide a valid reason...',
                  border: InputBorder.none,
                  contentPadding: const EdgeInsets.all(14),
                  hintStyle: GoogleFonts.inter(color: AppColors.textSecondary),
                ),
              ),
            ),
            const SizedBox(height: 16),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                border: Border.all(color: AppColors.border, style: BorderStyle.solid),
                borderRadius: BorderRadius.circular(14),
              ),
              child: Column(
                children: [
                  Icon(Icons.cloud_upload, size: 28, color: AppColors.textSecondary),
                  const SizedBox(height: 8),
                  Text('Click to upload attachment', style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.textSecondary)),
                ],
              ),
            ),
            const SizedBox(height: 24),
            SizedBox(
              width: double.infinity,
              height: 52,
              child: ElevatedButton(
                onPressed: () => setState(() => _leaveSubmitted = true),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primary,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                ),
                child: Text('Submit Leave Application', style: GoogleFonts.poppins(fontSize: 14, fontWeight: FontWeight.w700, color: Colors.white)),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _navButton(IconData icon, VoidCallback onTap) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        width: 36,
        height: 36,
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(10),
          border: Border.all(color: AppColors.border),
        ),
        child: Icon(icon, size: 18, color: AppColors.textPrimary),
      ),
    );
  }

  Widget _legendDot(Color color, String label) {
    return Row(
      children: [
        Container(width: 12, height: 12, decoration: BoxDecoration(shape: BoxShape.circle, color: color)),
        const SizedBox(width: 6),
        Text(label, style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.textSecondary)),
      ],
    );
  }

  Widget _infoField(IconData icon, String label, String value) {
    return Expanded(
      child: Row(
        children: [
          Container(
            width: 36,
            height: 36,
            decoration: BoxDecoration(color: AppColors.primary.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(10)),
            child: Icon(icon, size: 18, color: AppColors.primary),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(label.toUpperCase(), style: GoogleFonts.inter(fontSize: 9, fontWeight: FontWeight.w800, color: AppColors.textSecondary, letterSpacing: 0.3)),
                Text(value, style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w700, color: AppColors.textPrimary)),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _summaryCard(String label, String value, IconData icon) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(color: AppColors.surface, borderRadius: BorderRadius.circular(14), border: Border.all(color: AppColors.border)),
        child: Row(
          children: [
            Container(
              width: 44,
              height: 44,
              decoration: BoxDecoration(color: AppColors.primary.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(12)),
              child: Icon(icon, size: 22, color: AppColors.primary),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(label.toUpperCase(), style: GoogleFonts.inter(fontSize: 10, fontWeight: FontWeight.w800, color: AppColors.textSecondary)),
                  Text(value, style: GoogleFonts.poppins(fontSize: 20, fontWeight: FontWeight.w900, color: AppColors.textPrimary)),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _dateField(String label) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label.toUpperCase(), style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.w800, color: AppColors.textSecondary, letterSpacing: 0.5)),
        const SizedBox(height: 8),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
          decoration: BoxDecoration(
            color: AppColors.surface,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: AppColors.border),
          ),
          child: Row(
            children: [
              Icon(Icons.calendar_today, size: 16, color: AppColors.textSecondary),
              const SizedBox(width: 8),
              Text('Select date', style: GoogleFonts.inter(fontSize: 13, color: AppColors.textSecondary)),
            ],
          ),
        ),
      ],
    );
  }
}
