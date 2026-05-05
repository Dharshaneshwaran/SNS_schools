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
import 'admin/timetable_screen.dart';
import 'admin/attendance_admin_screen.dart';
import 'admin/results_screen.dart';
import 'admin/transport_admin_screen.dart';
import 'admin/reports_screen.dart';
import 'admin/substitutions_screen.dart';

class TeacherHomeScreen extends ConsumerStatefulWidget {
  const TeacherHomeScreen({super.key});

  @override
  ConsumerState<TeacherHomeScreen> createState() => _TeacherHomeScreenState();
}

class _TeacherHomeScreenState extends ConsumerState<TeacherHomeScreen> {
  int _currentIndex = 0;

  final _menuItems = [
    _MenuItem(Icons.home_filled, 'Dashboard', 0),
    _MenuItem(Icons.notifications_outlined, 'Notifications', 1),
    _MenuItem(Icons.people_outline, 'Attendance', 2),
    _MenuItem(Icons.calendar_month, 'Timetable', 3),
    _MenuItem(Icons.celebration, 'Events', 4),
    _MenuItem(Icons.bar_chart, 'Results', 5),
    _MenuItem(Icons.directions_bus_outlined, 'Transport', 6),
    _MenuItem(Icons.assessment_outlined, 'Reports', 7),
    _MenuItem(Icons.chat_bubble_outline, 'Chat', 8),
    _MenuItem(Icons.swap_horiz, 'Substitutions', 9),
    _MenuItem(Icons.settings_outlined, 'Settings', 10),
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
      _TeacherDashboardTab(user: user, onNavigate: (i) => setState(() => _currentIndex = i)),
      const NotificationsScreen(),
      const AttendanceAdminScreen(),
      const TimetableScreen(),
      const EventsScreen(),
      const ResultsScreen(),
      const TransportAdminScreen(),
      const ReportsScreen(),
      const ChatScreen(),
      const SubstitutionsScreen(),
      const SettingsScreen(),
    ];

    return Scaffold(
      backgroundColor: isDark ? DarkAppColors.background : AppColors.background,
      drawer: _buildDrawer(user, isDark),
      body: SafeArea(
        child: Column(
          children: [
            _buildHeader(user, isDark),
            Expanded(child: screens[_currentIndex]),
          ],
        ),
      ),
      bottomNavigationBar: _buildBottomNav(isDark),
    );
  }

  Widget _buildBottomNav(bool isDark) {
    final cardColor = isDark ? DarkAppColors.card : AppColors.card;
    final borderColor = isDark ? DarkAppColors.border : AppColors.border;
    final textSecondary = isDark ? DarkAppColors.textSecondary : AppColors.textSecondary;

    final bottomItems = [
      _MenuItem(Icons.home_filled, 'Home', 0),
      _MenuItem(Icons.notifications_outlined, 'Alerts', 1),
      _MenuItem(Icons.people_outline, 'Attend.', 2),
      _MenuItem(Icons.chat_bubble_outline, 'Chat', 8),
      _MenuItem(Icons.settings_outlined, 'Settings', 10),
    ];

    return Container(
      decoration: BoxDecoration(
        color: cardColor,
        border: Border(top: BorderSide(color: borderColor)),
        boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.04), blurRadius: 12, offset: const Offset(0, -4))],
      ),
      child: SafeArea(
        top: false,
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 8),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: bottomItems.map((item) {
              final isActive = _currentIndex == item.index;
              return GestureDetector(
                onTap: () => setState(() => _currentIndex = item.index),
                child: AnimatedContainer(
                  duration: const Duration(milliseconds: 200),
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                  decoration: BoxDecoration(
                    color: isActive ? AppColors.primary.withValues(alpha: 0.1) : Colors.transparent,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(item.icon, size: 22, color: isActive ? AppColors.primary : textSecondary),
                      const SizedBox(height: 4),
                      Text(item.label, style: GoogleFonts.inter(fontSize: 10, fontWeight: isActive ? FontWeight.w700 : FontWeight.w500, color: isActive ? AppColors.primary : textSecondary)),
                    ],
                  ),
                ),
              );
            }).toList(),
          ),
        ),
      ),
    );
  }

  Widget _buildDrawer(UserModel user, bool isDark) {
    final textColor = isDark ? DarkAppColors.textPrimary : AppColors.textPrimary;
    final textSecondary = isDark ? DarkAppColors.textSecondary : AppColors.textSecondary;
    final cardColor = isDark ? DarkAppColors.card : AppColors.card;
    final borderColor = isDark ? DarkAppColors.border : AppColors.border;

    return Drawer(
      backgroundColor: cardColor,
      child: SafeArea(
        child: Column(
          children: [
            // Logo & User
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
                        Text('TEACHER PORTAL', style: GoogleFonts.inter(fontSize: 9, fontWeight: FontWeight.w800, color: AppColors.primary, letterSpacing: 0.8)),
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
                    child: Row(
                      children: [
                        Container(
                          width: 36, height: 36,
                          decoration: BoxDecoration(gradient: const LinearGradient(colors: [Color(0xFFFF7F50), Color(0xFFE66A3E)]), borderRadius: BorderRadius.circular(10)),
                          child: Center(child: Text(user.name.isNotEmpty ? user.name[0].toUpperCase() : '?',
                              style: GoogleFonts.poppins(fontSize: 14, fontWeight: FontWeight.w800, color: Colors.white))),
                        ),
                        const SizedBox(width: 10),
                        Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                          Text(user.name, style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w700, color: textColor), overflow: TextOverflow.ellipsis),
                          Text('Teacher', style: GoogleFonts.inter(fontSize: 10, color: textSecondary)),
                        ])),
                      ],
                    ),
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
                    _drawerSection('MENU', _menuItems.sublist(0, 5), textColor, textSecondary, isDark),
                    const SizedBox(height: 16),
                    _drawerSection('ACADEMIC', _menuItems.sublist(5, 10), textColor, textSecondary, isDark),
                    const SizedBox(height: 16),
                    _drawerSection('TOOLS', [_menuItems.last], textColor, textSecondary, isDark),
                  ],
                ),
              ),
            ),
            // Dark mode + Logout
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(border: Border(top: BorderSide(color: borderColor))),
              child: Column(
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text('Dark Mode', style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w600, color: textColor)),
                      Switch(
                        value: isDark,
                        onChanged: (_) => ref.read(themeProvider.notifier).toggleTheme(),
                        activeColor: AppColors.primary,
                      ),
                    ],
                  ),
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

  Widget _buildHeader(UserModel user, bool isDark) {
    final textColor = isDark ? DarkAppColors.textPrimary : AppColors.textPrimary;
    final textSecondary = isDark ? DarkAppColors.textSecondary : AppColors.textSecondary;
    final title = _menuItems.firstWhere((m) => m.index == _currentIndex, orElse: () => _menuItems[0]).label;

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
            return Stack(
              children: [
                GestureDetector(
                  onTap: () => setState(() => _currentIndex = 1),
                  child: Container(
                    width: 38, height: 38,
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(colors: [Color(0xFFFF7F50), Color(0xFFE66A3E)]),
                      shape: BoxShape.circle,
                    ),
                    child: Center(child: Text(user.name.isNotEmpty ? user.name[0].toUpperCase() : '?',
                        style: GoogleFonts.poppins(fontSize: 14, fontWeight: FontWeight.w800, color: Colors.white))),
                  ),
                ),
                if (unreadCount > 0)
                  Positioned(
                    right: 0, top: 0,
                    child: Container(
                      width: 16, height: 16,
                      decoration: BoxDecoration(color: AppColors.error, shape: BoxShape.circle, border: Border.all(color: Colors.white, width: 1.5)),
                      child: Center(child: Text('$unreadCount', style: GoogleFonts.inter(fontSize: 8, fontWeight: FontWeight.w800, color: Colors.white))),
                    ),
                  ),
              ],
            );
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

class _TeacherDashboardTab extends ConsumerWidget {
  final UserModel user;
  final ValueChanged<int> onNavigate;

  const _TeacherDashboardTab({required this.user, required this.onNavigate});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final textColor = isDark ? DarkAppColors.textPrimary : AppColors.textPrimary;
    final textSecondary = isDark ? DarkAppColors.textSecondary : AppColors.textSecondary;
    final cardColor = isDark ? DarkAppColors.card : AppColors.card;
    final borderColor = isDark ? DarkAppColors.border : AppColors.border;
    final surfaceColor = isDark ? DarkAppColors.surface : AppColors.surface;

    return SingleChildScrollView(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Greeting
          Text('Hello, ${user.name.split(' ').first}!', style: GoogleFonts.poppins(fontSize: 22, fontWeight: FontWeight.w800, color: textColor)),
          Text('Teacher Dashboard', style: GoogleFonts.inter(fontSize: 13, color: textSecondary)),
          const SizedBox(height: 20),

          // Quick action grid
          _sectionTitle('Quick Actions', Icons.grid_view, textColor),
          const SizedBox(height: 12),
          GridView.count(
            crossAxisCount: 3,
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            crossAxisSpacing: 10,
            mainAxisSpacing: 10,
            childAspectRatio: 1.1,
            children: [
              _QuickAction(icon: Icons.people_outline, label: 'Mark Attend.', color: AppColors.primary, onTap: () => onNavigate(2)),
              _QuickAction(icon: Icons.swap_horiz, label: 'Substitutions', color: const Color(0xFF4F46E5), onTap: () => onNavigate(9)),
              _QuickAction(icon: Icons.assignment_outlined, label: 'Homework', color: AppColors.success, onTap: () => onNavigate(7)),
              _QuickAction(icon: Icons.calendar_today, label: 'Timetable', color: const Color(0xFFF59E0B), onTap: () => onNavigate(3)),
              _QuickAction(icon: Icons.school_outlined, label: 'Students', color: const Color(0xFFEC4899), onTap: () => onNavigate(5)),
              _QuickAction(icon: Icons.bar_chart, label: 'Reports', color: const Color(0xFF8B5CF6), onTap: () => onNavigate(7)),
            ],
          ),
          const SizedBox(height: 24),

          // Today's Classes
          _sectionTitle("Today's Classes", Icons.class_outlined, textColor),
          const SizedBox(height: 12),
          ..._todaysClasses.map((cls) => _ClassTile(cls: cls, isDark: isDark, textColor: textColor, cardColor: cardColor, borderColor: borderColor, textSecondary: textSecondary)),
          const SizedBox(height: 24),

          // Pending Tasks
          _sectionTitle('Pending Tasks', Icons.checklist, textColor),
          const SizedBox(height: 12),
          ..._pendingTasks.map((task) => _TaskTile(task: task, isDark: isDark, textColor: textColor, cardColor: cardColor, borderColor: borderColor, surfaceColor: surfaceColor)),
          const SizedBox(height: 24),

          // Recent Messages
          _sectionTitle('Recent Messages', Icons.chat_bubble_outline, textColor),
          const SizedBox(height: 12),
          GestureDetector(
            onTap: () => onNavigate(8),
            child: Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: AppColors.primary.withValues(alpha: 0.05),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppColors.primary.withValues(alpha: 0.2)),
              ),
              child: Row(
                children: [
                  Icon(Icons.chat_bubble_outline, color: AppColors.primary, size: 22),
                  const SizedBox(width: 12),
                  Expanded(child: Text('Open Messages & Chat', style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w700, color: AppColors.primary))),
                  Icon(Icons.chevron_right, color: AppColors.primary),
                ],
              ),
            ),
          ),
          const SizedBox(height: 24),
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

  static const _todaysClasses = [
    {'time': '08:45', 'subject': 'Mathematics', 'class': '10-A', 'students': 38, 'status': 'Completed'},
    {'time': '10:30', 'subject': 'Mathematics', 'class': '9-B', 'students': 35, 'status': 'In Progress'},
    {'time': '13:30', 'subject': 'Mathematics', 'class': '8-C', 'students': 32, 'status': 'Upcoming'},
  ];

  static const _pendingTasks = [
    {'label': 'Grade Term 1 Assignments', 'class': 'Class 10-A', 'due': 'Tomorrow', 'urgent': true},
    {'label': 'Update Attendance Records', 'class': 'Class 9-B', 'due': 'Today', 'urgent': true},
    {'label': 'Prepare Lab Experiment Notes', 'class': 'Class 8-C', 'due': 'May 6', 'urgent': false},
  ];
}

class _QuickAction extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color color;
  final VoidCallback onTap;

  const _QuickAction({required this.icon, required this.label, required this.color, required this.onTap});

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final cardColor = isDark ? DarkAppColors.card : AppColors.card;
    final borderColor = isDark ? DarkAppColors.border : AppColors.border;
    final textColor = isDark ? DarkAppColors.textPrimary : AppColors.textPrimary;

    return GestureDetector(
      onTap: onTap,
      child: Container(
        decoration: BoxDecoration(color: cardColor, borderRadius: BorderRadius.circular(16), border: Border.all(color: borderColor)),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(width: 42, height: 42, decoration: BoxDecoration(color: color.withValues(alpha: 0.12), borderRadius: BorderRadius.circular(12)), child: Icon(icon, size: 22, color: color)),
            const SizedBox(height: 8),
            Text(label, textAlign: TextAlign.center, style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.w600, color: textColor), maxLines: 2),
          ],
        ),
      ),
    );
  }
}

class _ClassTile extends StatelessWidget {
  final Map cls;
  final bool isDark;
  final Color textColor, cardColor, borderColor, textSecondary;

  const _ClassTile({required this.cls, required this.isDark, required this.textColor, required this.cardColor, required this.borderColor, required this.textSecondary});

  @override
  Widget build(BuildContext context) {
    final status = cls['status'] as String;
    final statusColor = status == 'Completed' ? AppColors.success : status == 'In Progress' ? AppColors.primary : textSecondary;

    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: status == 'In Progress' ? AppColors.primary.withValues(alpha: 0.05) : cardColor,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: status == 'In Progress' ? AppColors.primary.withValues(alpha: 0.2) : borderColor),
      ),
      child: Row(
        children: [
          Container(
            width: 48, height: 48,
            decoration: BoxDecoration(color: statusColor.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(12)),
            child: Center(child: Text(cls['time'] as String, style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.w800, color: statusColor))),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text(cls['subject'] as String, style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w700, color: textColor)),
              Text('Class ${cls['class']} • ${cls['students']} students', style: GoogleFonts.inter(fontSize: 12, color: textSecondary)),
            ]),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
            decoration: BoxDecoration(color: statusColor.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(8)),
            child: Text(status, style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.w700, color: statusColor)),
          ),
        ],
      ),
    );
  }
}

class _TaskTile extends StatefulWidget {
  final Map task;
  final bool isDark;
  final Color textColor, cardColor, borderColor, surfaceColor;

  const _TaskTile({required this.task, required this.isDark, required this.textColor, required this.cardColor, required this.borderColor, required this.surfaceColor});

  @override
  State<_TaskTile> createState() => _TaskTileState();
}

class _TaskTileState extends State<_TaskTile> {
  bool _done = false;

  @override
  Widget build(BuildContext context) {
    final textSecondary = widget.isDark ? DarkAppColors.textSecondary : AppColors.textSecondary;
    final isUrgent = widget.task['urgent'] as bool;

    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: _done ? (widget.isDark ? DarkAppColors.surface : AppColors.surface) : widget.cardColor,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: _done ? widget.borderColor : (isUrgent ? AppColors.error.withValues(alpha: 0.2) : widget.borderColor)),
      ),
      child: Row(
        children: [
          GestureDetector(
            onTap: () => setState(() => _done = !_done),
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 200),
              width: 24, height: 24,
              decoration: BoxDecoration(
                color: _done ? AppColors.success : Colors.transparent,
                borderRadius: BorderRadius.circular(7),
                border: Border.all(color: _done ? AppColors.success : (isUrgent ? AppColors.error : textSecondary), width: 2),
              ),
              child: _done ? const Icon(Icons.check, size: 14, color: Colors.white) : null,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text(widget.task['label'] as String,
                  style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w600, color: widget.textColor,
                      decoration: _done ? TextDecoration.lineThrough : null)),
              Text('${widget.task['class']} • Due: ${widget.task['due']}', style: GoogleFonts.inter(fontSize: 12, color: textSecondary)),
            ]),
          ),
          if (isUrgent && !_done)
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
              decoration: BoxDecoration(color: AppColors.error.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(6)),
              child: Text('Urgent', style: GoogleFonts.inter(fontSize: 10, fontWeight: FontWeight.w700, color: AppColors.error)),
            ),
        ],
      ),
    );
  }
}
