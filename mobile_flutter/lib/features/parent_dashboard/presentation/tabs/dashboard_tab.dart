import 'package:flutter/material.dart';
import '../../../../core/models/student.dart';

class DashboardTab extends StatelessWidget {
  final Student student;
  const DashboardTab({required this.student, super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    return SingleChildScrollView(
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Student Header
          Text(
            student.name,
            style: TextStyle(
              fontSize: 28,
              fontWeight: FontWeight.w900,
              color: isDark ? Colors.white : const Color(0xFF1E293B),
              letterSpacing: -0.5,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            '${student.className} - ${student.section} Student',
            style: TextStyle(
              fontSize: 14,
              fontWeight: FontWeight.w600,
              color: isDark ? Colors.white60 : const Color(0xFF64748B),
            ),
          ),
          const SizedBox(height: 32),

          // Stats Grid - 3 items in a row (Scrollable on mobile)
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: [
                _buildStatCard(
                  context,
                  'Attendance',
                  '96.2%',
                  '+1.2%',
                  true,
                  Icons.people_alt_rounded,
                  const Color(0xFFFF7F50),
                ),
                const SizedBox(width: 16),
                _buildStatCard(
                  context,
                  'Performance',
                  '88.4%',
                  '+4.5%',
                  true,
                  Icons.check_circle_rounded,
                  const Color(0xFF4F46E5),
                ),
                const SizedBox(width: 16),
                _buildStatCard(
                  context,
                  'Pending Tasks',
                  '12',
                  '-2',
                  false,
                  Icons.access_time_filled_rounded,
                  const Color(0xFFEF4444),
                ),
              ],
            ),
          ),

          const SizedBox(height: 32),

          // Main Layout - Vertical on Mobile
          Column(
            children: [
              // Today's Schedule Section
              _buildSectionCard(
                context,
                title: "Today's Schedule",
                action: TextButton(
                  onPressed: () {},
                  child: Text(
                    'View All',
                    style: TextStyle(
                      color: theme.colorScheme.primary,
                      fontWeight: FontWeight.w700,
                      fontSize: 13,
                    ),
                  ),
                ),
                child: Column(
                  children: [
                    _buildScheduleItem(
                      context,
                      '09:00 AM',
                      'Advanced Mathematics',
                      'Grade 8-A',
                      true,
                    ),
                    _buildScheduleItem(
                      context,
                      '11:30 AM',
                      'Quantum Physics',
                      'Grade 8-A',
                      false,
                    ),
                    _buildScheduleItem(
                      context,
                      '02:00 PM',
                      'English Literature',
                      'Grade 8-A',
                      false,
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 24),

              // Student Tasks Section
              _buildSectionCard(
                context,
                title: "Student Tasks",
                action: Icon(
                  Icons.more_vert_rounded,
                  color: isDark ? Colors.white38 : const Color(0xFF64748B),
                  size: 20,
                ),
                child: Column(
                  children: [
                    _buildTaskItem(
                      context,
                      'Math Worksheet #4',
                      'Due Today, 5:00 PM',
                      const Color(0xFFFF7F50),
                      true,
                    ),
                    _buildTaskItem(
                      context,
                      'Science Project Draft',
                      'Due Tomorrow',
                      const Color(0xFF4F46E5),
                      false,
                    ),
                    _buildTaskItem(
                      context,
                      'History Quiz Prep',
                      'May 2, 10:00 AM',
                      const Color(0xFF10B981),
                      false,
                    ),
                  ],
                ),
              ),
              
              const SizedBox(height: 40),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildStatCard(BuildContext context, String label, String value, String change, bool isUp, IconData icon, Color color) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final successColor = const Color(0xFF10B981);
    final dangerColor = const Color(0xFFEF4444);

    return Container(
      width: 160,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: isDark ? const Color(0xFF1E1E1E) : Colors.white,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: isDark ? Colors.white10 : const Color(0xFFF1F5F9)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: isDark ? 0.2 : 0.03),
            blurRadius: 20,
            offset: const Offset(0, 10),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Container(
                width: 44,
                height: 44,
                decoration: BoxDecoration(
                  color: color.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(14),
                ),
                child: Icon(icon, color: color, size: 22),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 4),
                decoration: BoxDecoration(
                  color: (isUp ? successColor : dangerColor).withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Row(
                  children: [
                    Icon(
                      isUp ? Icons.arrow_outward_rounded : Icons.south_east_rounded,
                      size: 12,
                      color: isUp ? successColor : dangerColor,
                    ),
                    const SizedBox(width: 2),
                    Text(
                      change,
                      style: TextStyle(
                        fontSize: 10,
                        fontWeight: FontWeight.w800,
                        color: isUp ? successColor : dangerColor,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Text(
            label,
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w600,
              color: isDark ? Colors.white38 : const Color(0xFF64748B),
            ),
          ),
          const SizedBox(height: 4),
          Text(
            value,
            style: TextStyle(
              fontSize: 22,
              fontWeight: FontWeight.w900,
              color: isDark ? Colors.white : const Color(0xFF1E293B),
              letterSpacing: -0.5,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSectionCard(BuildContext context, {required String title, required Widget action, required Widget child}) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: isDark ? const Color(0xFF1E1E1E) : Colors.white,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: isDark ? Colors.white10 : const Color(0xFFF1F5F9)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: isDark ? 0.2 : 0.03),
            blurRadius: 20,
            offset: const Offset(0, 10),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                title,
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.w800,
                  color: isDark ? Colors.white : const Color(0xFF1E293B),
                ),
              ),
              action,
            ],
          ),
          const SizedBox(height: 24),
          child,
        ],
      ),
    );
  }

  Widget _buildScheduleItem(BuildContext context, String time, String subject, String className, bool isActive) {
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isActive 
          ? theme.colorScheme.primary.withValues(alpha: 0.1) 
          : (isDark ? Colors.white.withValues(alpha: 0.02) : const Color(0xFFF8FAFC)),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: isActive 
            ? theme.colorScheme.primary.withValues(alpha: 0.3) 
            : (isDark ? Colors.white10 : const Color(0xFFF1F5F9)),
        ),
      ),
      child: Row(
        children: [
          SizedBox(
            width: 70,
            child: Text(
              time,
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w800,
                color: isActive ? theme.colorScheme.primary : (isDark ? Colors.white38 : const Color(0xFF64748B)),
              ),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  subject,
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w800,
                    color: isDark ? Colors.white : const Color(0xFF1E293B),
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  className,
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w600,
                    color: isDark ? Colors.white38 : const Color(0xFF64748B),
                  ),
                ),
              ],
            ),
          ),
          if (isActive)
            Container(
              width: 8,
              height: 8,
              decoration: BoxDecoration(
                color: theme.colorScheme.primary,
                shape: BoxShape.circle,
                boxShadow: [
                  BoxShadow(
                    color: theme.colorScheme.primary.withValues(alpha: 0.5),
                    blurRadius: 8,
                    spreadRadius: 2,
                  ),
                ],
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildTaskItem(BuildContext context, String title, String due, Color color, bool isCompleted) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 22,
            height: 22,
            margin: const EdgeInsets.only(top: 2),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.circular(7),
              border: Border.all(color: color, width: 2),
              color: isCompleted ? color : Colors.transparent,
            ),
            child: isCompleted 
              ? const Icon(Icons.check, size: 14, color: Colors.white) 
              : null,
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: FontWeight.w800,
                    color: isDark ? Colors.white : const Color(0xFF1E293B),
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  due,
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                    color: isDark ? Colors.white38 : const Color(0xFF64748B),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
