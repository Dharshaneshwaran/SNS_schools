import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../../core/providers/auth_provider.dart';
import '../../../../core/models/user_model.dart';
import '../../../auth/presentation/screens/login_screen.dart';
import 'events_screen.dart';
import 'profile_screen.dart';
import 'diary_screen.dart';
import 'academic_screen.dart';
import 'transport_screen.dart';
import 'messages_screen.dart';
import 'settings_screen.dart';

class HomeScreen extends ConsumerStatefulWidget {
  const HomeScreen({super.key});

  @override
  ConsumerState<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends ConsumerState<HomeScreen> {
  int _currentIndex = 1; // Start on Dashboard

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authStateProvider);
    final user = authState.user;
    final isDark = Theme.of(context).brightness == Brightness.dark;

    if (user == null) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }

    final screens = [
      const EventsScreen(),
      _DashboardTab(user: user, onNavigate: (i) => setState(() => _currentIndex = i)),
      const DiaryScreen(),
      const MessagesScreen(),
      const AcademicScreen(),
      const TransportScreen(),
      const SettingsScreen(),
      ProfileScreen(user: user),
    ];

    final menuItems = [
      _MenuItem(Icons.celebration, 'Events Gallery', 0),
      _MenuItem(Icons.home_filled, 'Dashboard', 1),
      _MenuItem(Icons.book, 'Diary & Homework', 2, badge: 3),
      _MenuItem(Icons.mail, 'Messages', 3),
    ];

    final toolItems = [
      _MenuItem(Icons.bar_chart, 'Academic Reports', 4),
      _MenuItem(Icons.directions_bus, 'Transport Tracking', 5),
      _MenuItem(Icons.settings, 'Settings', 6),
    ];

    return Scaffold(
      backgroundColor: isDark ? DarkAppColors.background : AppColors.background,
      drawer: _buildDrawer(user, menuItems, toolItems, isDark),
      body: SafeArea(
        child: Column(
          children: [
            _buildHeader(user, isDark),
            Expanded(child: screens[_currentIndex]),
          ],
        ),
      ),
    );
  }

  Widget _buildDrawer(UserModel user, List<_MenuItem> menuItems, List<_MenuItem> toolItems, bool isDark) {
    final textColor = isDark ? DarkAppColors.textPrimary : AppColors.textPrimary;
    final textSecondaryColor = isDark ? DarkAppColors.textSecondary : AppColors.textSecondary;
    final cardColor = isDark ? DarkAppColors.card : AppColors.card;
    final borderColor = isDark ? DarkAppColors.border : AppColors.border;

    return Drawer(
      backgroundColor: cardColor,
      child: SafeArea(
        child: Column(
          children: [
            // Logo Section - matching frontend exactly
            Padding(
              padding: const EdgeInsets.fromLTRB(24, 28, 24, 20),
              child: Row(
                children: [
                  Container(
                    width: 40,
                    height: 40,
                    decoration: BoxDecoration(
                      color: AppColors.primary,
                      borderRadius: BorderRadius.circular(12),
                      boxShadow: [BoxShadow(color: AppColors.primary.withValues(alpha: 0.3), blurRadius: 12, offset: const Offset(0, 4))],
                    ),
                    child: const Icon(Icons.school, color: Colors.white, size: 24),
                  ),
                  const SizedBox(width: 12),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('SNS Academy', style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.w800, color: textColor, height: 1.1)),
                      Text('PARENT PORTAL', style: GoogleFonts.inter(fontSize: 9, fontWeight: FontWeight.w800, color: AppColors.primary, letterSpacing: 0.8)),
                    ],
                  ),
                ],
              ),
            ),
            // Student Switcher - matching frontend exactly
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 0, 16, 24),
              child: Container(
                decoration: BoxDecoration(
                  color: isDark ? AppColors.primary.withValues(alpha: 0.1) : AppColors.primary.withValues(alpha: 0.05),
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: isDark ? AppColors.primary.withValues(alpha: 0.2) : AppColors.primary.withValues(alpha: 0.1)),
                ),
                child: Row(
                  children: [
                    Expanded(
                      child: GestureDetector(
                        onTap: () { setState(() => _currentIndex = 7); Navigator.pop(context); },
                        child: Padding(
                          padding: const EdgeInsets.fromLTRB(16, 12, 0, 12),
                          child: Row(
                            children: [
                              Container(
                                width: 32,
                                height: 32,
                                decoration: BoxDecoration(
                                  gradient: const LinearGradient(colors: [Color(0xFFFF7F50), Color(0xFFE66A3E)]),
                                  borderRadius: BorderRadius.circular(10),
                                ),
                                child: Center(
                                  child: Text(user.name.isNotEmpty ? user.name[0].toUpperCase() : '?',
                                      style: GoogleFonts.poppins(fontSize: 12, fontWeight: FontWeight.w800, color: Colors.white)),
                                ),
                              ),
                              const SizedBox(width: 10),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(user.name, style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w700, color: textColor),
                                        overflow: TextOverflow.ellipsis),
                                    Text('Class 8-A', style: GoogleFonts.inter(fontSize: 10, color: textSecondaryColor)),
                                  ],
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                    Container(
                      decoration: BoxDecoration(
                        border: Border(left: BorderSide(color: isDark ? AppColors.primary.withValues(alpha: 0.2) : AppColors.primary.withValues(alpha: 0.1))),
                      ),
                      child: Padding(
                        padding: const EdgeInsets.all(12),
                        child: Icon(Icons.keyboard_arrow_down, size: 14, color: AppColors.primary),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            // Navigation Sections
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 12),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _buildSection('MENU', menuItems, textColor, textSecondaryColor, isDark),
                    const SizedBox(height: 24),
                    _buildSection('TOOLS', toolItems, textColor, textSecondaryColor, isDark),
                  ],
                ),
              ),
            ),
            // Sign Out - matching frontend
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(border: Border(top: BorderSide(color: borderColor))),
              child: GestureDetector(
                onTap: () async {
                  await ref.read(authStateProvider.notifier).logout();
                  if (mounted) {
                    Navigator.of(context).pushAndRemoveUntil(
                      MaterialPageRoute(builder: (_) => const LoginScreen()),
                      (route) => false,
                    );
                  }
                },
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.logout, size: 20, color: textSecondaryColor),
                    const SizedBox(width: 10),
                    Text('Sign Out', style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w700, color: textSecondaryColor)),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSection(String title, List<_MenuItem> items, Color textColor, Color textSecondary, bool isDark) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 0, 16, 14),
          child: Text(title, style: GoogleFonts.inter(fontSize: 10, fontWeight: FontWeight.w800, color: textSecondary, letterSpacing: 1.2)),
        ),
        ...items.map((item) {
          final isActive = _currentIndex == item.index;
          return Padding(
            padding: const EdgeInsets.only(bottom: 4),
            child: GestureDetector(
              onTap: () { setState(() => _currentIndex = item.index); Navigator.pop(context); },
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 200),
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                decoration: BoxDecoration(
                  gradient: isActive ? const LinearGradient(colors: [Color(0xFFFF7F50), Color(0xFFE66A3E)]) : null,
                  color: isActive ? null : Colors.transparent,
                  borderRadius: BorderRadius.circular(12),
                  boxShadow: isActive ? [BoxShadow(color: AppColors.primary.withValues(alpha: 0.3), blurRadius: 8, offset: const Offset(0, 2))] : null,
                ),
                child: Row(
                  children: [
                    Icon(item.icon, size: 20, color: isActive ? Colors.white : textSecondary),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Text(item.label,
                          style: GoogleFonts.inter(fontSize: 14.5, fontWeight: isActive ? FontWeight.w700 : FontWeight.w600,
                              color: isActive ? Colors.white : textSecondary)),
                    ),
                    if (item.badge != null && !isActive)
                      Container(
                        width: 18,
                        height: 18,
                        decoration: BoxDecoration(color: AppColors.primary, shape: BoxShape.circle),
                        child: Center(
                          child: Text('${item.badge}', style: GoogleFonts.inter(fontSize: 10, fontWeight: FontWeight.w700, color: Colors.white)),
                        ),
                      ),
                  ],
                ),
              ),
            ),
          );
        }),
      ],
    );
  }

  Widget _buildHeader(UserModel user, bool isDark) {
    final textColor = isDark ? DarkAppColors.textPrimary : AppColors.textPrimary;

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
          const Spacer(),
          Container(
            width: 38,
            height: 38,
            decoration: BoxDecoration(
              gradient: const LinearGradient(colors: [Color(0xFFFF7F50), Color(0xFFE66A3E)]),
              shape: BoxShape.circle,
              boxShadow: [BoxShadow(color: AppColors.primary.withValues(alpha: 0.3), blurRadius: 8, offset: const Offset(0, 2))],
            ),
            child: Center(
              child: Text(user.name.isNotEmpty ? user.name[0].toUpperCase() : '?',
                  style: GoogleFonts.poppins(fontSize: 14, fontWeight: FontWeight.w800, color: Colors.white)),
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
  final int index;
  final int? badge;
  _MenuItem(this.icon, this.label, this.index, {this.badge});
}

class _DashboardTab extends StatelessWidget {
  final UserModel user;
  final ValueChanged<int> onNavigate;

  const _DashboardTab({required this.user, required this.onNavigate});

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final textColor = isDark ? DarkAppColors.textPrimary : AppColors.textPrimary;
    final textSecondaryColor = isDark ? DarkAppColors.textSecondary : AppColors.textSecondary;
    final cardColor = isDark ? DarkAppColors.card : AppColors.card;
    final borderColor = isDark ? DarkAppColors.border : AppColors.border;

    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Quick action cards - matching frontend exactly
          Row(
            children: [
              _quickAction(context, 'Attendance', '96.2%', 'Month of April', Icons.people, AppColors.primary, cardColor, borderColor, textColor, () => onNavigate(4)),
              const SizedBox(width: 16),
              _quickAction(context, 'Exam Reports', 'A Grade', 'Term 1 Result', Icons.bar_chart, const Color(0xFF4F46E5), cardColor, borderColor, textColor, () => onNavigate(4)),
              const SizedBox(width: 16),
              _quickAction(context, 'Leave', 'Apply Now', 'Quick Request', Icons.send, AppColors.success, cardColor, borderColor, textColor, () => onNavigate(4)),
            ],
          ),
          const SizedBox(height: 24),
          // Today's Schedule - matching frontend
          _sectionTitle('Today\'s Schedule', Icons.calendar_today, textColor),
          const SizedBox(height: 12),
          _scheduleItem(context, '09:00 AM', 'Advanced Mathematics', 'In Progress', true, cardColor, borderColor, textColor),
          _scheduleItem(context, '11:30 AM', 'Quantum Physics', 'Upcoming', false, cardColor, borderColor, textColor),
          _scheduleItem(context, '02:00 PM', 'English Literature', 'Upcoming', false, cardColor, borderColor, textColor),
          const SizedBox(height: 24),
          // Important Note - matching frontend
          _sectionTitle('Important Note', Icons.info_outline, textColor),
          const SizedBox(height: 12),
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              color: cardColor,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: borderColor),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('The Annual Cultural Fest preparations are in full swing. Please ensure students carry their performance kits.',
                    style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w600, color: textColor, height: 1.6)),
                const SizedBox(height: 10),
                Row(
                  children: [
                    Text('Read More', style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w700, color: AppColors.primary)),
                    const SizedBox(width: 4),
                    Icon(Icons.arrow_forward, size: 14, color: AppColors.primary),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),
          // Upcoming Holiday
          Text('Upcoming Holiday', style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.w800, color: textSecondaryColor, letterSpacing: 0.5)),
          const SizedBox(height: 8),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            decoration: BoxDecoration(
              color: isDark ? DarkAppColors.surface : AppColors.surface,
              borderRadius: BorderRadius.circular(12),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text('Labour Day', style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w700, color: textColor)),
                Text('May 1', style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w800, color: AppColors.primary)),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _quickAction(BuildContext context, String label, String value, String sub, IconData icon, Color color,
      Color cardColor, Color borderColor, Color textColor, VoidCallback onTap) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final textSecondaryColor = isDark ? DarkAppColors.textSecondary : AppColors.textSecondary;
    return Expanded(
      child: GestureDetector(
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: cardColor,
            borderRadius: BorderRadius.circular(24),
            border: Border.all(color: borderColor),
            boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.03), blurRadius: 12, offset: const Offset(0, 4))],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
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
                  Container(
                    width: 28,
                    height: 28,
                    decoration: BoxDecoration(
                      color: isDark ? DarkAppColors.surface : AppColors.surface,
                      shape: BoxShape.circle,
                    ),
                    child: Icon(Icons.arrow_forward_ios, size: 12, color: textSecondaryColor),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              Text(label.toUpperCase(), style: GoogleFonts.inter(fontSize: 10, fontWeight: FontWeight.w800, color: textSecondaryColor, letterSpacing: 0.5)),
              const SizedBox(height: 4),
              Text(value, style: GoogleFonts.poppins(fontSize: 22, fontWeight: FontWeight.w900, color: textColor, letterSpacing: -0.5)),
              Text(sub, style: GoogleFonts.inter(fontSize: 10, fontWeight: FontWeight.w700, color: color)),
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

  Widget _scheduleItem(BuildContext context, String time, String subject, String status, bool isActive,
      Color cardColor, Color borderColor, Color textColor) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: isActive ? AppColors.primary.withValues(alpha: 0.08) : cardColor,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: isActive ? AppColors.primary.withValues(alpha: 0.3) : borderColor),
      ),
      child: Row(
        children: [
          Container(
            width: 48,
            height: 48,
            decoration: BoxDecoration(
              color: isActive ? AppColors.primary : (isDark ? DarkAppColors.surface : AppColors.surface),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(Icons.access_time, size: 20, color: isActive ? Colors.white : AppColors.textSecondary),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(subject, style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w700, color: textColor)),
                Text('Class 8-A', style: GoogleFonts.inter(fontSize: 12, color: AppColors.textSecondary)),
              ],
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(time, style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w800,
                  color: isActive ? AppColors.primary : AppColors.textSecondary)),
              Text(status, style: GoogleFonts.inter(fontSize: 10, fontWeight: FontWeight.w800,
                  color: isActive ? AppColors.primary : AppColors.textSecondary, letterSpacing: 0.3)),
            ],
          ),
        ],
      ),
    );
  }
}
