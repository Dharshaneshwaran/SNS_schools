import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../../../core/theme/app_theme.dart';

class ResultsScreen extends ConsumerStatefulWidget {
  const ResultsScreen({super.key});

  @override
  ConsumerState<ResultsScreen> createState() => _ResultsScreenState();
}

class _ResultsScreenState extends ConsumerState<ResultsScreen> {
  String _selectedClass = 'All';
  String _selectedTerm = 'Term 1';

  static final _results = [
    {'student': 'Ananya M', 'class': '10-A', 'maths': 92, 'science': 88, 'english': 85, 'social': 90, 'tamil': 78, 'grade': 'A'},
    {'student': 'Bala K', 'class': '10-A', 'maths': 75, 'science': 80, 'english': 70, 'social': 68, 'tamil': 72, 'grade': 'B'},
    {'student': 'Chitra V', 'class': '9-B', 'maths': 95, 'science': 91, 'english': 88, 'social': 82, 'tamil': 86, 'grade': 'A+'},
    {'student': 'Dinesh R', 'class': '9-B', 'maths': 60, 'science': 65, 'english': 58, 'social': 62, 'tamil': 70, 'grade': 'C'},
    {'student': 'Ezhil S', 'class': '8-C', 'maths': 82, 'science': 78, 'english': 80, 'social': 75, 'tamil': 88, 'grade': 'B+'},
  ];

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final textColor = isDark ? DarkAppColors.textPrimary : AppColors.textPrimary;
    final bg = isDark ? DarkAppColors.background : AppColors.background;
    final cardColor = isDark ? DarkAppColors.card : AppColors.card;
    final borderColor = isDark ? DarkAppColors.border : AppColors.border;
    final textSecondary = isDark ? DarkAppColors.textSecondary : AppColors.textSecondary;

    final classes = ['All', ..._results.map((r) => r['class'] as String).toSet().toList()..sort()];
    final filtered = _results.where((r) => _selectedClass == 'All' || r['class'] == _selectedClass).toList();

    return Scaffold(
      backgroundColor: bg,
      appBar: AppBar(
        backgroundColor: cardColor,
        elevation: 0,
        title: Text('Results & Grades', style: GoogleFonts.poppins(fontSize: 18, fontWeight: FontWeight.w800, color: textColor)),
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 12, 16, 8),
            child: Column(
              children: [
                // Term filter
                Row(
                  children: ['Term 1', 'Term 2', 'Term 3'].map((t) {
                    final isSelected = _selectedTerm == t;
                    return GestureDetector(
                      onTap: () => setState(() => _selectedTerm = t),
                      child: Container(
                        margin: const EdgeInsets.only(right: 8),
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                        decoration: BoxDecoration(
                          color: isSelected ? AppColors.primary : (isDark ? DarkAppColors.surface : AppColors.surface),
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: Text(t, style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w700, color: isSelected ? Colors.white : textSecondary)),
                      ),
                    );
                  }).toList(),
                ),
                const SizedBox(height: 10),
                // Class filter
                SizedBox(
                  height: 36,
                  child: ListView(
                    scrollDirection: Axis.horizontal,
                    children: classes.map((c) {
                      final isSelected = _selectedClass == c;
                      return GestureDetector(
                        onTap: () => setState(() => _selectedClass = c),
                        child: Container(
                          margin: const EdgeInsets.only(right: 8),
                          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                          decoration: BoxDecoration(
                            color: isSelected ? AppColors.primary : (isDark ? DarkAppColors.surface : AppColors.surface),
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(color: isSelected ? AppColors.primary : borderColor),
                          ),
                          child: Text(c == 'All' ? 'All Classes' : 'Class $c',
                              style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w600, color: isSelected ? Colors.white : textSecondary)),
                        ),
                      );
                    }).toList(),
                  ),
                ),
              ],
            ),
          ),
          // Results table header
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
              decoration: BoxDecoration(color: AppColors.primary, borderRadius: BorderRadius.circular(12)),
              child: Row(
                children: [
                  Expanded(flex: 3, child: Text('Student', style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w700, color: Colors.white))),
                  Expanded(child: Text('Math', style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.w700, color: Colors.white), textAlign: TextAlign.center)),
                  Expanded(child: Text('Sci', style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.w700, color: Colors.white), textAlign: TextAlign.center)),
                  Expanded(child: Text('Eng', style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.w700, color: Colors.white), textAlign: TextAlign.center)),
                  Expanded(child: Text('Grade', style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.w700, color: Colors.white), textAlign: TextAlign.center)),
                ],
              ),
            ),
          ),
          const SizedBox(height: 8),
          Expanded(
            child: ListView.builder(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              itemCount: filtered.length,
              itemBuilder: (_, i) {
                final r = filtered[i];
                final grade = r['grade'] as String;
                final gradeColor = grade.startsWith('A') ? AppColors.success : grade == 'B+' || grade == 'B' ? const Color(0xFF4F46E5) : const Color(0xFFF59E0B);
                return Container(
                  margin: const EdgeInsets.only(bottom: 6),
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                  decoration: BoxDecoration(color: cardColor, borderRadius: BorderRadius.circular(12), border: Border.all(color: borderColor)),
                  child: Row(
                    children: [
                      Expanded(
                        flex: 3,
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(r['student'] as String, style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w700, color: textColor)),
                            Text('Class ${r['class']}', style: GoogleFonts.inter(fontSize: 10, color: textSecondary)),
                          ],
                        ),
                      ),
                      Expanded(child: Text('${r['maths']}', style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w600, color: textColor), textAlign: TextAlign.center)),
                      Expanded(child: Text('${r['science']}', style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w600, color: textColor), textAlign: TextAlign.center)),
                      Expanded(child: Text('${r['english']}', style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w600, color: textColor), textAlign: TextAlign.center)),
                      Expanded(
                        child: Container(
                          padding: const EdgeInsets.symmetric(vertical: 4),
                          decoration: BoxDecoration(color: gradeColor.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(8)),
                          child: Text(grade, style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w800, color: gradeColor), textAlign: TextAlign.center),
                        ),
                      ),
                    ],
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
