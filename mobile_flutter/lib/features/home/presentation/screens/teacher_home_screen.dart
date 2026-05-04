import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../../core/providers/auth_provider.dart';
import '../../../../core/models/user_model.dart';
import '../../../auth/presentation/screens/role_selection_screen.dart';
import 'events_screen.dart';
import 'diary_screen.dart';
import 'messages_screen.dart';
import 'settings_screen.dart';

class TeacherHomeScreen extends ConsumerStatefulWidget {
  const TeacherHomeScreen({super.key});

  @override
  ConsumerState<TeacherHomeScreen> createState() => _TeacherHomeScreenState();
}

class _TeacherHomeScreenState extends ConsumerState<TeacherHomeScreen> {
  int _currentIndex = 0;

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authStateProvider);
    final user = authState.user;
    final isDark = Theme.of(context).brightness == Brightness.dark;

    if (user == null) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }

    final screens = [
      _TeacherDashboardTab(user: user, onNavigate: (i) => setState(() => _currentIndex = i)),
      const EventsScreen(),
      const DiaryScreen(),
      const MessagesScreen(),
      const SettingsScreen(),
    ];

    final menuItems = [
      _MenuItem(Icons.home_filled, 'Dashboard'),
      _MenuItem(Icons.celebration, 'Events'),
      _MenuItem(Icons.book, 'Diary'),
      _MenuItem(Icons.mail, 'Messages'),
      _MenuItem(Icons.settings, 'Settings'),
    ];

    return Scaffold(
      backgroundColor: isDark ? DarkAppColors.background : AppColors.background,
      drawer: _buildDrawer(user, menuItems, isDark),
      body: SafeArea(
        child: Column(
          children: [
            _buildHeader(user, menuItems, isDark),
            Expanded(child: screens[_currentIndex]),
          ],
        ),
      ),
    );
  }

  Widget _buildDrawer(UserModel user, List<_MenuItem> menuItems, bool isDark) {
    final textColor = isDark ? DarkAppColors.textPrimary : AppColors.textPrimary;
    final textSecondaryColor = isDark ? DarkAppColors.textSecondary : AppColors.textSecondary;
    final cardColor = isDark ? DarkAppColors.card : AppColors.card;

    return Drawer(
      backgroundColor: cardColor,
      child: SafeArea(
        child: Column(
          children: [
            Container(
              padding: const EdgeInsets.all(20),
              child: Row(
                children: [
                  Container(
                    width: 48,
                    height: 48,
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(colors: [Color(0xFFFF7F50), Color(0xFFE66A3E)]),
                      borderRadius: BorderRadius.circular(14),
                    ),
                    child: Center(
                      child: Text(user.name.isNotEmpty ? user.name[0].toUpperCase() : '?', style: GoogleFonts.poppins(fontSize: 20, fontWeight: FontWeight.w900, color: Colors.white)),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(user.name, style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.w700, color: textColor)),
                        Text('Teacher', style: GoogleFonts.inter(fontSize: 13, color: textSecondaryColor)),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const Divider(),
            Expanded(
              child: ListView.builder(
                padding: const EdgeInsets.symmetric(horizontal: 12),
                itemCount: menuItems.length,
                itemBuilder: (_, i) {
                  final item = menuItems[i];
                  final isActive = _currentIndex == i;
                  return ListTile(
                    leading: Icon(item.icon, color: isActive ? AppColors.primary : textSecondaryColor, size: 22),
                    title: Text(item.label, style: GoogleFonts.inter(fontSize: 14, fontWeight: isActive ? FontWeight.w700 : FontWeight.w500, color: isActive ? AppColors.primary : textColor)),
                    selected: isActive,
                    selectedTileColor: AppColors.primary.withValues(alpha: 0.08),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                    onTap: () {
                      setState(() => _currentIndex = i);
                      Navigator.pop(context);
                    },
                  );
                },
              ),
            ),
            const Divider(),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
              child: ListTile(
                leading: const Icon(Icons.logout, color: AppColors.error, size: 22),
                title: Text('Sign Out', style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.error)),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                onTap: () async {
                  await ref.read(authStateProvider.notifier).logout();
                  if (mounted) {
                    Navigator.of(context).pushAndRemoveUntil(
                      MaterialPageRoute(builder: (_) => const RoleSelectionScreen()),
                      (route) => false,
                    );
                  }
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildHeader(UserModel user, List<_MenuItem> menuItems, bool isDark) {
    final textColor = isDark ? DarkAppColors.textPrimary : AppColors.textPrimary;
    final textSecondaryColor = isDark ? DarkAppColors.textSecondary : AppColors.textSecondary;

    return Padding(
      padding: const EdgeInsets.fromLTRB(8, 12, 16, 8),
      child: Row(
        children: [
          Builder(
            builder: (ctx) => IconButton(
              onPressed: () => Scaffold.of(ctx).openDrawer(),
              icon: const Icon(Icons.menu, size: 26),
              color: AppColors.primary,
            ),
          ),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Text('SNS Academy', style: GoogleFonts.poppins(fontSize: 17, fontWeight: FontWeight.w800, color: textColor)),
                Text(menuItems[_currentIndex].label, style: GoogleFonts.inter(fontSize: 12, color: textSecondaryColor)),
              ],
            ),
          ),
          Container(
            width: 38,
            height: 38,
            decoration: BoxDecoration(
              gradient: const LinearGradient(colors: [Color(0xFFFF7F50), Color(0xFFE66A3E)]),
              shape: BoxShape.circle,
              boxShadow: [BoxShadow(color: const Color(0xFFFF7F50).withValues(alpha: 0.3), blurRadius: 8, offset: const Offset(0, 2))],
            ),
            child: Center(
              child: Text(user.name.isNotEmpty ? user.name[0].toUpperCase() : '?', style: GoogleFonts.poppins(fontSize: 14, fontWeight: FontWeight.w800, color: Colors.white)),
            ),
          ),
        ],
      ),
    );
  }
}

class _MenuItem {
  final IconData icon;
  final String label;
  _MenuItem(this.icon, this.label);
}

class _TeacherDashboardTab extends StatelessWidget {
  final UserModel user;
  final ValueChanged<int> onNavigate;

  const _TeacherDashboardTab({required this.user, required this.onNavigate});

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final textColor = isDark ? DarkAppColors.textPrimary : AppColors.textPrimary;
    final textSecondaryColor = isDark ? DarkAppColors.textSecondary : AppColors.textSecondary;
    final cardColor = isDark ? DarkAppColors.card : AppColors.card;
    final surfaceColor = isDark ? DarkAppColors.surface : AppColors.surface;
    final borderColor = isDark ? DarkAppColors.border : AppColors.border;

    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Hello, ${user.name.split(' ').first}!', style: GoogleFonts.poppins(fontSize: 22, fontWeight: FontWeight.w800, color: textColor)),
          Text('Welcome back, Teacher', style: GoogleFonts.inter(fontSize: 14, color: textSecondaryColor)),
          const SizedBox(height: 20),
          // Quick actions for teachers
          Row(
            children: [
              _quickAction(Icons.check_circle, 'Mark\nAttendance', AppColors.primary, cardColor, borderColor, textColor, () {}),
              const SizedBox(width: 12),
              _quickAction(Icons.swap_horiz, 'Substitutions', const Color(0xFF4F46E5), cardColor, borderColor, textColor, () {}),
              const SizedBox(width: 12),
              _quickAction(Icons.assignment, 'Homework', AppColors.success, cardColor, borderColor, textColor, () => onNavigate(2)),
            ],
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              _quickAction(Icons.calendar_today, 'Timetable', const Color(0xFFF59E0B), cardColor, borderColor, textColor, () {}),
              const SizedBox(width: 12),
              _quickAction(Icons.people, 'Students', const Color(0xFF8B5CF6), cardColor, borderColor, textColor, () {}),
              const SizedBox(width: 12),
              _quickAction(Icons.assessment, 'Reports', const Color(0xFFEC4899), cardColor, borderColor, textColor, () {}),
            ],
          ),
          const SizedBox(height: 24),
          // Today's Classes
          _sectionTitle('Today\'s Classes', Icons.calendar_today, textColor),
          const SizedBox(height: 12),
          _classCard('09:00 AM', 'Mathematics', 'Class 8-A', '42 students', AppColors.primary, cardColor, borderColor, textColor, textSecondaryColor),
          _classCard('10:30 AM', 'Science', 'Class 8-B', '40 students', const Color(0xFF4F46E5), cardColor, borderColor, textColor, textSecondaryColor),
          _classCard('01:00 PM', 'Mathematics', 'Class 7-A', '45 students', AppColors.success, cardColor, borderColor, textColor, textSecondaryColor),
          _classCard('02:30 PM', 'Science', 'Class 7-B', '38 students', const Color(0xFFF59E0B), cardColor, borderColor, textColor, textSecondaryColor),
          const SizedBox(height: 24),
          // Pending Tasks
          _sectionTitle('Pending Tasks', Icons.assignment, textColor),
          const SizedBox(height: 12),
          _taskCard('Grade Math Assignments', '12 submissions pending', Icons.assignment_turned_in, AppColors.primary, cardColor, borderColor, textColor, textSecondaryColor),
          _taskCard('Prepare Science Lab', 'Tomorrow - Class 8-B', Icons.science, const Color(0xFF4F46E5), cardColor, borderColor, textColor, textSecondaryColor),
          _taskCard('Update Attendance', 'Today - Class 8-A', Icons.check_circle, AppColors.success, cardColor, borderColor, textColor, textSecondaryColor),
          const SizedBox(height: 24),
          // Recent Messages
          _sectionTitle('Recent Messages', Icons.mail_outline, textColor),
          const SizedBox(height: 12),
          _messageCard('Staff Meeting Tomorrow', '10:00 AM - Conference Hall', cardColor, borderColor, textColor, textSecondaryColor),
          _messageCard('Exam Schedule Released', 'Check Academic section', cardColor, borderColor, textColor, textSecondaryColor),
        ],
      ),
    );
  }

  Widget _quickAction(IconData icon, String label, Color color, Color cardColor, Color borderColor, Color textColor, VoidCallback onTap) {
    return Expanded(
      child: GestureDetector(
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: cardColor,
            borderRadius: BorderRadius.circular(18),
            border: Border.all(color: borderColor),
          ),
          child: Column(
            children: [
              Container(
                width: 48,
                height: 48,
                decoration: BoxDecoration(
                  color: color.withValues(alpha: 0.12),
                  borderRadius: BorderRadius.circular(14),
                ),
                child: Icon(icon, size: 24, color: color),
              ),
              const SizedBox(height: 10),
              Text(label, textAlign: TextAlign.center, style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.w600, color: textColor, height: 1.2)),
            ],
          ),
        ),
      ),
    );
  }

  Widget _sectionTitle(String title, IconData icon, Color textColor) {
    return Row(
      children: [
        Icon(icon, size: 18, color: AppColors.primary),
        const SizedBox(width: 8),
        Text(title, style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.w700, color: textColor)),
      ],
    );
  }

  Widget _classCard(String time, String subject, String className, String students, Color color, Color cardColor, Color borderColor, Color textColor, Color textSecondaryColor) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: cardColor,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: borderColor),
      ),
      child: Row(
        children: [
          Container(
            width: 4,
            height: 50,
            decoration: BoxDecoration(
              color: color,
              borderRadius: BorderRadius.circular(2),
            ),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(subject, style: GoogleFonts.inter(fontSize: 15, fontWeight: FontWeight.w700, color: textColor)),
                Text('$className • $students', style: GoogleFonts.inter(fontSize: 12, color: textSecondaryColor)),
              ],
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(time, style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w700, color: color)),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: color.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(6),
                ),
                child: Text('Today', style: GoogleFonts.inter(fontSize: 10, fontWeight: FontWeight.w700, color: color)),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _taskCard(String title, String subtitle, IconData icon, Color color, Color cardColor, Color borderColor, Color textColor, Color textSecondaryColor) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: cardColor,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: borderColor),
      ),
      child: Row(
        children: [
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: color.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(icon, size: 20, color: color),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w600, color: textColor)),
                Text(subtitle, style: GoogleFonts.inter(fontSize: 12, color: textSecondaryColor)),
              ],
            ),
          ),
          Icon(Icons.chevron_right, size: 20, color: textSecondaryColor),
        ],
      ),
    );
  }

  Widget _messageCard(String title, String subtitle, Color cardColor, Color borderColor, Color textColor, Color textSecondaryColor) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: cardColor,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: borderColor),
      ),
      child: Row(
        children: [
          Container(
            width: 40,
            height: 40,
            decoration: BoxDecoration(
              color: AppColors.primary.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(10),
            ),
            child: const Icon(Icons.mail, size: 20, color: AppColors.primary),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(title, style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w600, color: textColor)),
                Text(subtitle, style: GoogleFonts.inter(fontSize: 11, color: textSecondaryColor)),
              ],
            ),
          ),
          Icon(Icons.chevron_right, size: 20, color: textSecondaryColor),
        ],
      ),
    );
  }
}
