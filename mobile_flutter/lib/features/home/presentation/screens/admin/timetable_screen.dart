import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../../../core/theme/app_theme.dart';
import '../../../../../core/providers/services_providers.dart';

class TimetableScreen extends ConsumerStatefulWidget {
  const TimetableScreen({super.key});

  @override
  ConsumerState<TimetableScreen> createState() => _TimetableScreenState();
}

class _TimetableScreenState extends ConsumerState<TimetableScreen> {
  int _selectedDay = DateTime.now().weekday - 1;

  static const _days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  static const _periods = [
    {'time': '08:00 - 08:45', 'subject': 'Morning Assembly', 'teacher': '-', 'room': 'Ground'},
    {'time': '08:45 - 09:30', 'subject': 'Mathematics', 'teacher': 'Mr. Rajan', 'room': 'A101'},
    {'time': '09:30 - 10:15', 'subject': 'Science', 'teacher': 'Mrs. Priya', 'room': 'Lab 1'},
    {'time': '10:30 - 11:15', 'subject': 'English', 'teacher': 'Ms. Meena', 'room': 'A102'},
    {'time': '11:15 - 12:00', 'subject': 'Social Studies', 'teacher': 'Mr. Vimal', 'room': 'A103'},
    {'time': '12:45 - 13:30', 'subject': 'Tamil', 'teacher': 'Mrs. Lakshmi', 'room': 'A104'},
    {'time': '13:30 - 14:15', 'subject': 'Computer Science', 'teacher': 'Mr. Karthik', 'room': 'Lab 2'},
    {'time': '14:15 - 15:00', 'subject': 'Physical Education', 'teacher': 'Mr. Suresh', 'room': 'Ground'},
  ];

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final textColor = isDark ? DarkAppColors.textPrimary : AppColors.textPrimary;
    final bg = isDark ? DarkAppColors.background : AppColors.background;
    final cardColor = isDark ? DarkAppColors.card : AppColors.card;
    final borderColor = isDark ? DarkAppColors.border : AppColors.border;
    final timetableAsync = ref.watch(timetableDataProvider);

    return Scaffold(
      backgroundColor: bg,
      appBar: AppBar(
        backgroundColor: cardColor,
        elevation: 0,
        title: Text('Timetable', style: GoogleFonts.poppins(fontSize: 18, fontWeight: FontWeight.w800, color: textColor)),
        actions: [
          IconButton(icon: Icon(Icons.refresh, color: AppColors.primary), onPressed: () => ref.invalidate(timetableDataProvider)),
        ],
      ),
      body: Column(
        children: [
          // Day selector
          SizedBox(
            height: 60,
            child: ListView.builder(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
              itemCount: _days.length,
              itemBuilder: (_, i) {
                final isSelected = _selectedDay == i;
                return GestureDetector(
                  onTap: () => setState(() => _selectedDay = i),
                  child: AnimatedContainer(
                    duration: const Duration(milliseconds: 200),
                    margin: const EdgeInsets.only(right: 8),
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                    decoration: BoxDecoration(
                      color: isSelected ? AppColors.primary : (isDark ? DarkAppColors.surface : AppColors.surface),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Text(_days[i].substring(0, 3),
                        style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w700,
                            color: isSelected ? Colors.white : (isDark ? DarkAppColors.textSecondary : AppColors.textSecondary))),
                  ),
                );
              },
            ),
          ),
          // Periods list - show API data if available, fallback to static
          Expanded(
            child: timetableAsync.when(
              loading: () => _buildPeriodsList(null, textColor, cardColor, borderColor, isDark),
              error: (_, __) => _buildPeriodsList(null, textColor, cardColor, borderColor, isDark),
              data: (data) => _buildPeriodsList(data.data, textColor, cardColor, borderColor, isDark),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPeriodsList(Map<String, dynamic>? apiData, Color textColor, Color cardColor, Color borderColor, bool isDark) {
    // Try to extract day data from API, fallback to static
    List<Map<String, String>> periods = _periods.map((p) => Map<String, String>.from(p)).toList();

    if (apiData != null) {
      final dayData = apiData[_days[_selectedDay].toLowerCase()];
      if (dayData is List && dayData.isNotEmpty) {
        periods = dayData.map((p) => Map<String, String>.from(p as Map)).toList();
      }
    }

    return ListView.builder(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      itemCount: periods.length,
      itemBuilder: (_, i) {
        final period = periods[i];
        final subjectLower = (period['subject'] ?? '').toLowerCase();
        final isBreak = subjectLower.contains('break') || subjectLower.contains('lunch');
        final periodColors = [AppColors.primary, const Color(0xFF4F46E5), AppColors.success, const Color(0xFFF59E0B), const Color(0xFFEC4899)];
        final color = isBreak ? (isDark ? DarkAppColors.surface : AppColors.surface).withValues(alpha: 0.5) : periodColors[i % periodColors.length];

        return Container(
          margin: const EdgeInsets.only(bottom: 8),
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: isBreak ? (isDark ? DarkAppColors.surface : AppColors.surface) : cardColor,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: isBreak ? borderColor : color.withValues(alpha: 0.3)),
          ),
          child: Row(
            children: [
              Container(
                width: 4, height: 48,
                decoration: BoxDecoration(color: isBreak ? borderColor : color, borderRadius: BorderRadius.circular(2)),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(period['subject'] ?? '', style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w700, color: textColor)),
                    Text(period['teacher'] ?? '', style: GoogleFonts.inter(fontSize: 12, color: isDark ? DarkAppColors.textSecondary : AppColors.textSecondary)),
                    Text('Room: ${period['room'] ?? ''}', style: GoogleFonts.inter(fontSize: 11, color: isDark ? DarkAppColors.textSecondary : AppColors.textSecondary)),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                decoration: BoxDecoration(
                  color: isBreak ? borderColor : color.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Text(period['time'] ?? '', style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.w700, color: isBreak ? (isDark ? DarkAppColors.textSecondary : AppColors.textSecondary) : color)),
              ),
            ],
          ),
        );
      },
    );
  }
}
