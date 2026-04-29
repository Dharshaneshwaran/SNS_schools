import 'package:flutter/material.dart';

class AcademicTab extends StatelessWidget {
  const AcademicTab({super.key});

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        // Overview Grid
        Row(
          children: [
            Expanded(
              child: _buildMetricCard(
                'Current CGPA',
                '8.4',
                '+0.2',
                Icons.school,
                const Color(0xFF6C63FF),
              ),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: _buildMetricCard(
                'Attendance',
                '92%',
                '-1%',
                Icons.calendar_today,
                const Color(0xFF10B981),
              ),
            ),
          ],
        ),
        const SizedBox(height: 24),

        const Text(
          'Recent Examinations',
          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
        ),
        const SizedBox(height: 16),

        _buildExamTile(
          'Term 1 Examination',
          'Oct 2026',
          '84.5%',
          [
            {'subject': 'Mathematics', 'score': '88', 'grade': 'A'},
            {'subject': 'Science', 'score': '92', 'grade': 'A+'},
            {'subject': 'English', 'score': '78', 'grade': 'B+'},
            {'subject': 'Social Studies', 'score': '80', 'grade': 'A'},
          ],
        ),
        const SizedBox(height: 12),
        _buildExamTile(
          'Unit Test 2',
          'Aug 2026',
          '82.0%',
          [
            {'subject': 'Mathematics', 'score': '85', 'grade': 'A'},
            {'subject': 'Science', 'score': '88', 'grade': 'A'},
            {'subject': 'English', 'score': '75', 'grade': 'B+'},
            {'subject': 'Social Studies', 'score': '80', 'grade': 'A'},
          ],
        ),
      ],
    );
  }

  Widget _buildMetricCard(String title, String value, String trend, IconData icon, Color color) {
    final isPositive = trend.startsWith('+');
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            blurRadius: 10,
            offset: const Offset(0, 4),
          )
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: color.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(icon, color: color, size: 24),
          ),
          const SizedBox(height: 16),
          Text(
            title,
            style: TextStyle(color: Colors.grey[600], fontSize: 13),
          ),
          const SizedBox(height: 4),
          Row(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(
                value,
                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 24),
              ),
              const SizedBox(width: 8),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                decoration: BoxDecoration(
                  color: isPositive ? Colors.green.withValues(alpha: 0.1) : Colors.red.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(4),
                ),
                child: Text(
                  trend,
                  style: TextStyle(
                    color: isPositive ? Colors.green : Colors.red,
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ],
          )
        ],
      ),
    );
  }

  Widget _buildExamTile(String title, String date, String overall, List<Map<String, String>> subjects) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.03),
            blurRadius: 8,
            offset: const Offset(0, 2),
          )
        ],
      ),
      child: ExpansionTile(
        shape: const Border(),
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.bold)),
        subtitle: Text(date, style: const TextStyle(fontSize: 12)),
        trailing: Container(
          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
          decoration: BoxDecoration(
            color: const Color(0xFFFFF5F0),
            borderRadius: BorderRadius.circular(10),
          ),
          child: Text(
            overall,
            style: const TextStyle(
              color: Color(0xFFFF7F50),
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.grey[50],
              borderRadius: const BorderRadius.vertical(bottom: Radius.circular(16)),
            ),
            child: Column(
              children: subjects.map((subj) {
                return Padding(
                  padding: const EdgeInsets.only(bottom: 12),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(subj['subject']!, style: const TextStyle(fontWeight: FontWeight.w500)),
                      Row(
                        children: [
                          Text('${subj['score']}/100', style: TextStyle(color: Colors.grey[700])),
                          const SizedBox(width: 16),
                          Container(
                            width: 32,
                            alignment: Alignment.center,
                            padding: const EdgeInsets.symmetric(vertical: 2),
                            decoration: BoxDecoration(
                              color: subj['grade']!.startsWith('A') ? Colors.green[100] : Colors.blue[100],
                              borderRadius: BorderRadius.circular(4),
                            ),
                            child: Text(
                              subj['grade']!,
                              style: TextStyle(
                                color: subj['grade']!.startsWith('A') ? Colors.green[800] : Colors.blue[800],
                                fontWeight: FontWeight.bold,
                                fontSize: 12,
                              ),
                            ),
                          )
                        ],
                      )
                    ],
                  ),
                );
              }).toList(),
            ),
          )
        ],
      ),
    );
  }
}
