import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../../core/providers/auth_provider.dart';
import '../../../../core/providers/services_providers.dart';
import '../../../../core/providers/theme_provider.dart';
import '../../../../core/models/user_model.dart';
import '../../../auth/presentation/screens/role_selection_screen.dart';
import 'events_screen.dart';
import 'settings_screen.dart';
import 'notifications_screen.dart';
import 'chat_screen.dart';
import 'admin/users_screen.dart';
import 'admin/staff_screen.dart';
import 'admin/admission_screen.dart';
import 'admin/alumni_screen.dart';
import 'admin/timetable_screen.dart';
import 'admin/attendance_admin_screen.dart';
import 'admin/results_screen.dart';
import 'admin/transport_admin_screen.dart';
import 'admin/reports_screen.dart';
import 'admin/substitutions_screen.dart';

class AdminHomeScreen extends ConsumerStatefulWidget {
  const AdminHomeScreen({super.key});

  @override
  ConsumerState<AdminHomeScreen> createState() => _AdminHomeScreenState();
}

class _AdminHomeScreenState extends ConsumerState<AdminHomeScreen> {
  int _currentIndex = 0;

  final _menuItems = [
    _MenuItem(Icons.dashboard, 'Dashboard', 0),
    _MenuItem(Icons.notifications_outlined, 'Notifications', 1),
    _MenuItem(Icons.people_outline, 'Attendance', 2),
    _MenuItem(Icons.calendar_month, 'Timetable', 3),
    _MenuItem(Icons.calendar_today, 'Events', 4),
  ];

  final _managementItems = [
    _MenuItem(Icons.manage_accounts, 'Users', 5),
    _MenuItem(Icons.school_outlined, 'Staff', 6),
    _MenuItem(Icons.person_add_outlined, 'Admission', 7),
  ];

  final _toolItems = [
    _MenuItem(Icons.celebration_outlined, 'Alumni', 8),
    _MenuItem(Icons.bar_chart, 'Results', 9),
    _MenuItem(Icons.directions_bus_outlined, 'Transport', 10),
    _MenuItem(Icons.assessment_outlined, 'Reports', 11),
    _MenuItem(Icons.chat_bubble_outline, 'Chat', 12),
    _MenuItem(Icons.swap_horiz, 'Substitutions', 13),
    _MenuItem(Icons.settings_outlined, 'Settings', 14),
  ];

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authStateProvider);
    final user = authState.user;
    final isDark = Theme.of(context).brightness == Brightness.dark;

    if (user == null) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }

    final screens = [
      _AdminDashboardTab(user: user, onNavigate: (i) => setState(() => _currentIndex = i)),
      const NotificationsScreen(),
      const AttendanceAdminScreen(),
      const TimetableScreen(),
      const EventsScreen(),
      const UsersScreen(),
      const StaffScreen(),
      const AdmissionScreen(),
      const AlumniScreen(),
      const ResultsScreen(),
      const TransportAdminScreen(),
      const ReportsScreen(),
      const ChatScreen(),
      const SubstitutionsScreen(),
      const SettingsScreen(),
    ];

    final allMenuItems = [..._menuItems, ..._managementItems, ..._toolItems];

    return Scaffold(
      backgroundColor: isDark ? DarkAppColors.background : AppColors.background,
      drawer: _buildDrawer(user, allMenuItems, isDark),
      body: SafeArea(
        child: Column(
          children: [
            _buildHeader(user, allMenuItems, isDark),
            Expanded(child: screens[_currentIndex]),
          ],
        ),
      ),
    );
  }

  Widget _buildDrawer(UserModel user, List<_MenuItem> allItems, bool isDark) {
    final textColor = isDark ? DarkAppColors.textPrimary : AppColors.textPrimary;
    final textSecondary = isDark ? DarkAppColors.textSecondary : AppColors.textSecondary;
    final cardColor = isDark ? DarkAppColors.card : AppColors.card;
    final borderColor = isDark ? DarkAppColors.border : AppColors.border;

    return Drawer(
      backgroundColor: cardColor,
      child: SafeArea(
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 24, 20, 20),
              child: Column(
                children: [
                  Row(
                    children: [
                      Container(
                        width: 40, height: 40,
                        decoration: BoxDecoration(color: AppColors.primary, borderRadius: BorderRadius.circular(12),
                            boxShadow: [BoxShadow(color: AppColors.primary.withValues(alpha: 0.3), blurRadius: 12, offset: const Offset(0, 4))]),
                        child: const Icon(Icons.school, color: Colors.white, size: 22),
                      ),
                      const SizedBox(width: 12),
                      Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                        Text('SNS Academy', style: GoogleFonts.poppins(fontSize: 15, fontWeight: FontWeight.w800, color: textColor, height: 1.1)),
                        Text('ADMIN PORTAL', style: GoogleFonts.inter(fontSize: 9, fontWeight: FontWeight.w800, color: AppColors.primary, letterSpacing: 0.8)),
                      ]),
                    ],
                  ),
                  const SizedBox(height: 16),
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: isDark ? AppColors.primary.withValues(alpha: 0.08) : AppColors.primary.withValues(alpha: 0.05),
                      borderRadius: BorderRadius.circular(14),
                      border: Border.all(color: AppColors.primary.withValues(alpha: 0.15)),
                    ),
                    child: Row(children: [
                      Container(
                        width: 36, height: 36,
                        decoration: BoxDecoration(gradient: const LinearGradient(colors: [Color(0xFFFF7F50), Color(0xFFE66A3E)]), borderRadius: BorderRadius.circular(10)),
                        child: Center(child: Text(user.name.isNotEmpty ? user.name[0].toUpperCase() : '?',
                            style: GoogleFonts.poppins(fontSize: 14, fontWeight: FontWeight.w800, color: Colors.white))),
                      ),
                      const SizedBox(width: 10),
                      Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                        Text(user.name, style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w700, color: textColor), overflow: TextOverflow.ellipsis),
                        Text(user.role == UserRole.admin ? 'Administrator' : 'Leader', style: GoogleFonts.inter(fontSize: 10, color: textSecondary)),
                      ])),
                    ]),
                  ),
                ],
              ),
            ),
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.symmetric(horizontal: 12),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _drawerSection('MENU', _menuItems, textColor, textSecondary, isDark),
                    const SizedBox(height: 16),
                    _drawerSection('MANAGEMENT', _managementItems, textColor, textSecondary, isDark),
                    const SizedBox(height: 16),
                    _drawerSection('TOOLS', _toolItems, textColor, textSecondary, isDark),
                  ],
                ),
              ),
            ),
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(border: Border(top: BorderSide(color: borderColor))),
              child: Column(
                children: [
                  Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
                    Text('Dark Mode', style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w600, color: textColor)),
                    Switch(value: isDark, onChanged: (_) => ref.read(themeProvider.notifier).toggleTheme(), activeColor: AppColors.primary),
                  ]),
                  const SizedBox(height: 8),
                  GestureDetector(
                    onTap: () async {
                      await ref.read(authStateProvider.notifier).logout();
                      if (mounted) {
                        Navigator.of(context).pushAndRemoveUntil(MaterialPageRoute(builder: (_) => const RoleSelectionScreen()), (r) => false);
                      }
                    },
                    child: Container(
                      padding: const EdgeInsets.symmetric(vertical: 12),
                      decoration: BoxDecoration(
                        color: AppColors.error.withValues(alpha: 0.08),
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: AppColors.error.withValues(alpha: 0.2)),
                      ),
                      child: Row(mainAxisAlignment: MainAxisAlignment.center, children: [
                        Icon(Icons.logout, size: 18, color: AppColors.error),
                        const SizedBox(width: 8),
                        Text('Sign Out', style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w700, color: AppColors.error)),
                      ]),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _drawerSection(String title, List<_MenuItem> items, Color textColor, Color textSecondary, bool isDark) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(16, 0, 16, 10),
          child: Text(title, style: GoogleFonts.inter(fontSize: 10, fontWeight: FontWeight.w800, color: textSecondary, letterSpacing: 1.2)),
        ),
        ...items.map((item) {
          final isActive = _currentIndex == item.index;
          return Padding(
            padding: const EdgeInsets.only(bottom: 2),
            child: GestureDetector(
              onTap: () { setState(() => _currentIndex = item.index); Navigator.pop(context); },
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 200),
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 11),
                decoration: BoxDecoration(
                  gradient: isActive ? const LinearGradient(colors: [Color(0xFFFF7F50), Color(0xFFE66A3E)]) : null,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Row(children: [
                  Icon(item.icon, size: 20, color: isActive ? Colors.white : textSecondary),
                  const SizedBox(width: 12),
                  Text(item.label, style: GoogleFonts.inter(fontSize: 14, fontWeight: isActive ? FontWeight.w700 : FontWeight.w600, color: isActive ? Colors.white : textSecondary)),
                ]),
              ),
            ),
          );
        }),
      ],
    );
  }

  Widget _buildHeader(UserModel user, List<_MenuItem> allItems, bool isDark) {
    final textColor = isDark ? DarkAppColors.textPrimary : AppColors.textPrimary;
    final textSecondary = isDark ? DarkAppColors.textSecondary : AppColors.textSecondary;
    final title = allItems.firstWhere((m) => m.index == _currentIndex, orElse: () => allItems[0]).label;

    return Padding(
      padding: const EdgeInsets.fromLTRB(8, 12, 16, 8),
      child: Row(
        children: [
          Builder(builder: (ctx) => IconButton(
            onPressed: () => Scaffold.of(ctx).openDrawer(),
            icon: const Icon(Icons.menu, size: 26),
            color: AppColors.primary,
          )),
          Expanded(
            child: Column(crossAxisAlignment: CrossAxisAlignment.center, children: [
              Text('SNS Academy', style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.w800, color: textColor)),
              Text(title, style: GoogleFonts.inter(fontSize: 11, color: textSecondary)),
            ]),
          ),
          Consumer(builder: (_, ref, __) {
            final notificationsAsync = ref.watch(notificationsProvider);
            final unreadCount = notificationsAsync.whenData((list) => list.where((n) => !n.isRead).length).value ?? 0;
            return Stack(children: [
              GestureDetector(
                onTap: () => setState(() => _currentIndex = 1),
                child: Container(
                  width: 38, height: 38,
                  decoration: BoxDecoration(gradient: const LinearGradient(colors: [Color(0xFFFF7F50), Color(0xFFE66A3E)]), shape: BoxShape.circle),
                  child: Center(child: Text(user.name.isNotEmpty ? user.name[0].toUpperCase() : '?',
                      style: GoogleFonts.poppins(fontSize: 14, fontWeight: FontWeight.w800, color: Colors.white))),
                ),
              ),
              if (unreadCount > 0)
                Positioned(right: 0, top: 0, child: Container(
                  width: 16, height: 16,
                  decoration: BoxDecoration(color: AppColors.error, shape: BoxShape.circle, border: Border.all(color: Colors.white, width: 1.5)),
                  child: Center(child: Text('$unreadCount', style: GoogleFonts.inter(fontSize: 8, fontWeight: FontWeight.w800, color: Colors.white))),
                )),
            ]);
          }),
        ],
      ),
    );
  }
}

class _MenuItem {
  final IconData icon;
  final String label;
  final int index;
  _MenuItem(this.icon, this.label, this.index);
}

class _AdminDashboardTab extends ConsumerWidget {
  final UserModel user;
  final ValueChanged<int> onNavigate;

  const _AdminDashboardTab({required this.user, required this.onNavigate});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final textColor = isDark ? DarkAppColors.textPrimary : AppColors.textPrimary;
    final textSecondary = isDark ? DarkAppColors.textSecondary : AppColors.textSecondary;
    final cardColor = isDark ? DarkAppColors.card : AppColors.card;
    final borderColor = isDark ? DarkAppColors.border : AppColors.border;

    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Hello, ${user.name.split(' ').first}!', style: GoogleFonts.poppins(fontSize: 22, fontWeight: FontWeight.w800, color: textColor)),
          Text('Administrator Dashboard', style: GoogleFonts.inter(fontSize: 13, color: textSecondary)),
          const SizedBox(height: 20),

          // Stats cards
          Row(children: [
            _statCard('Students', '1,245', Icons.people, AppColors.primary, cardColor, borderColor, textColor, textSecondary, () => onNavigate(5)),
            const SizedBox(width: 12),
            _statCard('Teachers', '86', Icons.school, const Color(0xFF4F46E5), cardColor, borderColor, textColor, textSecondary, () => onNavigate(6)),
          ]),
          const SizedBox(height: 12),
          Row(children: [
            _statCard('Classes', '32', Icons.class_, AppColors.success, cardColor, borderColor, textColor, textSecondary, () => onNavigate(3)),
            const SizedBox(width: 12),
            _statCard('Revenue', '₹12.5L', Icons.account_balance, const Color(0xFFF59E0B), cardColor, borderColor, textColor, textSecondary, () => onNavigate(11)),
          ]),
          const SizedBox(height: 24),

          // Quick actions
          _sectionTitle('Quick Actions', Icons.dashboard, textColor),
          const SizedBox(height: 12),
          Row(children: [
            _quickAction(Icons.person_add, 'Add Student', AppColors.primary, cardColor, borderColor, textColor, () => onNavigate(7)),
            const SizedBox(width: 10),
            _quickAction(Icons.manage_accounts, 'Users', const Color(0xFF4F46E5), cardColor, borderColor, textColor, () => onNavigate(5)),
            const SizedBox(width: 10),
            _quickAction(Icons.announcement, 'Notice', AppColors.success, cardColor, borderColor, textColor, () => onNavigate(12)),
          ]),
          const SizedBox(height: 12),
          Row(children: [
            _quickAction(Icons.assessment_outlined, 'Reports', const Color(0xFFF59E0B), cardColor, borderColor, textColor, () => onNavigate(11)),
            const SizedBox(width: 10),
            _quickAction(Icons.event, 'Events', const Color(0xFF8B5CF6), cardColor, borderColor, textColor, () => onNavigate(4)),
            const SizedBox(width: 10),
            _quickAction(Icons.settings, 'Settings', const Color(0xFFEC4899), cardColor, borderColor, textColor, () => onNavigate(14)),
          ]),
          const SizedBox(height: 24),

          // Recent Activity
          _sectionTitle('Recent Activity', Icons.access_time, textColor),
          const SizedBox(height: 12),
          _activityCard('New admission', 'Arjun Sharma - Class 8-A', '2 hours ago', Icons.person_add, AppColors.primary, cardColor, borderColor, textColor, textSecondary),
          _activityCard('Fee payment received', '₹15,000 from Priya\'s parent', '4 hours ago', Icons.payment, AppColors.success, cardColor, borderColor, textColor, textSecondary),
          _activityCard('Leave request', 'Mrs. Lakshmi - Tomorrow', '5 hours ago', Icons.event_busy, const Color(0xFFF59E0B), cardColor, borderColor, textColor, textSecondary),
          _activityCard('Exam results published', 'Class 10 - Term 1', '1 day ago', Icons.assessment, const Color(0xFF4F46E5), cardColor, borderColor, textColor, textSecondary),
          const SizedBox(height: 24),

          // Pending Approvals
          _sectionTitle('Pending Approvals', Icons.pending_actions, textColor),
          const SizedBox(height: 12),
          _approvalCard('3 Leave Requests', 'Teachers', Icons.event_busy, const Color(0xFFF59E0B), cardColor, borderColor, textColor, textSecondary, () => onNavigate(2)),
          _approvalCard('5 New Admissions', 'Students', Icons.person_add, AppColors.primary, cardColor, borderColor, textColor, textSecondary, () => onNavigate(7)),
          _approvalCard('2 Fee Concessions', 'Finance', Icons.money_off, AppColors.success, cardColor, borderColor, textColor, textSecondary, () => onNavigate(11)),
          const SizedBox(height: 16),
        ],
      ),
    );
  }

  Widget _sectionTitle(String title, IconData icon, Color textColor) {
    return Row(children: [
      Icon(icon, size: 18, color: AppColors.primary),
      const SizedBox(width: 8),
      Text(title, style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.w700, color: textColor)),
    ]);
  }

  Widget _statCard(String label, String value, IconData icon, Color color, Color cardColor, Color borderColor, Color textColor, Color textSecondary, VoidCallback onTap) {
    return Expanded(
      child: GestureDetector(
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.all(18),
          decoration: BoxDecoration(color: cardColor, borderRadius: BorderRadius.circular(18), border: Border.all(color: borderColor)),
          child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
            Row(mainAxisAlignment: MainAxisAlignment.spaceBetween, children: [
              Container(width: 40, height: 40, decoration: BoxDecoration(color: color.withValues(alpha: 0.12), borderRadius: BorderRadius.circular(10)), child: Icon(icon, size: 20, color: color)),
              Icon(Icons.arrow_forward_ios, size: 14, color: AppColors.textSecondary),
            ]),
            const SizedBox(height: 14),
            Text(value, style: GoogleFonts.poppins(fontSize: 24, fontWeight: FontWeight.w900, color: textColor)),
            Text(label, style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.textSecondary)),
          ]),
        ),
      ),
    );
  }

  Widget _quickAction(IconData icon, String label, Color color, Color cardColor, Color borderColor, Color textColor, VoidCallback onTap) {
    return Expanded(
      child: GestureDetector(
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(color: cardColor, borderRadius: BorderRadius.circular(14), border: Border.all(color: borderColor)),
          child: Column(children: [
            Container(width: 44, height: 44, decoration: BoxDecoration(color: color.withValues(alpha: 0.12), borderRadius: BorderRadius.circular(12)), child: Icon(icon, size: 22, color: color)),
            const SizedBox(height: 8),
            Text(label, textAlign: TextAlign.center, style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.w600, color: textColor)),
          ]),
        ),
      ),
    );
  }

  Widget _activityCard(String title, String subtitle, String time, IconData icon, Color color, Color cardColor, Color borderColor, Color textColor, Color textSecondary) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(color: cardColor, borderRadius: BorderRadius.circular(14), border: Border.all(color: borderColor)),
      child: Row(children: [
        Container(width: 40, height: 40, decoration: BoxDecoration(color: color.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(10)), child: Icon(icon, size: 20, color: color)),
        const SizedBox(width: 12),
        Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text(title, style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w600, color: textColor)),
          Text(subtitle, style: GoogleFonts.inter(fontSize: 12, color: textSecondary)),
        ])),
        Text(time, style: GoogleFonts.inter(fontSize: 11, color: textSecondary)),
      ]),
    );
  }

  Widget _approvalCard(String title, String type, IconData icon, Color color, Color cardColor, Color borderColor, Color textColor, Color textSecondary, VoidCallback onTap) {
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(color: cardColor, borderRadius: BorderRadius.circular(14), border: Border.all(color: borderColor)),
      child: Row(children: [
        Container(width: 40, height: 40, decoration: BoxDecoration(color: color.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(10)), child: Icon(icon, size: 20, color: color)),
        const SizedBox(width: 12),
        Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Text(title, style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w600, color: textColor)),
          Text(type, style: GoogleFonts.inter(fontSize: 12, color: textSecondary)),
        ])),
        GestureDetector(
          onTap: onTap,
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            decoration: BoxDecoration(color: color.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(8)),
            child: Text('Review', style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w700, color: color)),
          ),
        ),
      ]),
    );
  }
}
