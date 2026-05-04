import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../../core/providers/auth_provider.dart';
import '../../../../core/models/user_model.dart';
import '../../../auth/presentation/screens/role_selection_screen.dart';
import 'events_screen.dart';
import 'messages_screen.dart';
import 'settings_screen.dart';

class AdminHomeScreen extends ConsumerStatefulWidget {
  const AdminHomeScreen({super.key});

  @override
  ConsumerState<AdminHomeScreen> createState() => _AdminHomeScreenState();
}

class _AdminHomeScreenState extends ConsumerState<AdminHomeScreen> {
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
      _AdminDashboardTab(user: user, onNavigate: (i) => setState(() => _currentIndex = i)),
      const EventsScreen(),
      const MessagesScreen(),
      const SettingsScreen(),
    ];

    final menuItems = [
      _MenuItem(Icons.dashboard, 'Dashboard'),
      _MenuItem(Icons.celebration, 'Events'),
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
                        Text('Administrator', style: GoogleFonts.inter(fontSize: 13, color: textSecondaryColor)),
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

class _AdminDashboardTab extends StatelessWidget {
  final UserModel user;
  final ValueChanged<int> onNavigate;

  const _AdminDashboardTab({required this.user, required this.onNavigate});

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
          Text('Administrator Dashboard', style: GoogleFonts.inter(fontSize: 14, color: textSecondaryColor)),
          const SizedBox(height: 20),
          // Stats cards
          Row(
            children: [
              _statCard('Students', '1,245', Icons.people, AppColors.primary, cardColor, borderColor, textColor),
              const SizedBox(width: 12),
              _statCard('Teachers', '86', Icons.school, const Color(0xFF4F46E5), cardColor, borderColor, textColor),
            ],
          ),
          const SizedBox(height: 12),
          Row(
            children: [
              _statCard('Classes', '32', Icons.class_, AppColors.success, cardColor, borderColor, textColor),
              const SizedBox(width: 12),
              _statCard('Revenue', '₹12.5L', Icons.account_balance, const Color(0xFFF59E0B), cardColor, borderColor, textColor),
            ],
          ),
          const SizedBox(height: 24),
          // Quick actions
          _sectionTitle('Quick Actions', Icons.dashboard, textColor),
          const SizedBox(height: 12),
          Row(
            children: [
              _quickAction(Icons.person_add, 'Add Student', AppColors.primary, cardColor, borderColor, textColor, () {}),
              const SizedBox(width: 12),
              _quickAction(Icons.person_add_alt_1, 'Add Teacher', const Color(0xFF4F46E5), cardColor, borderColor, textColor, () {}),
              const SizedBox(width: 12),
              _quickAction(Icons.announcement, 'Notice', AppColors.success, cardColor, borderColor, textColor, () => onNavigate(2)),
            ],
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              _quickAction(Icons.payment, 'Fee Report', const Color(0xFFF59E0B), cardColor, borderColor, textColor, () {}),
              const SizedBox(width: 12),
              _quickAction(Icons.event, 'Events', const Color(0xFF8B5CF6), cardColor, borderColor, textColor, () => onNavigate(1)),
              const SizedBox(width: 12),
              _quickAction(Icons.settings, 'Settings', const Color(0xFFEC4899), cardColor, borderColor, textColor, () => onNavigate(3)),
            ],
          ),
          const SizedBox(height: 24),
          // Recent Activity
          _sectionTitle('Recent Activity', Icons.access_time, textColor),
          const SizedBox(height: 12),
          _activityCard('New admission', 'Arjun Sharma - Class 8-A', '2 hours ago', Icons.person_add, AppColors.primary, cardColor, borderColor, textColor, textSecondaryColor),
          _activityCard('Fee payment received', '₹15,000 from Priya\'s parent', '4 hours ago', Icons.payment, AppColors.success, cardColor, borderColor, textColor, textSecondaryColor),
          _activityCard('Leave request', 'Mrs. Lakshmi - Tomorrow', '5 hours ago', Icons.event_busy, const Color(0xFFF59E0B), cardColor, borderColor, textColor, textSecondaryColor),
          _activityCard('Exam results published', 'Class 10 - Term 1', '1 day ago', Icons.assessment, const Color(0xFF4F46E5), cardColor, borderColor, textColor, textSecondaryColor),
          const SizedBox(height: 24),
          // Pending Approvals
          _sectionTitle('Pending Approvals', Icons.pending_actions, textColor),
          const SizedBox(height: 12),
          _approvalCard('3 Leave Requests', 'Teachers', Icons.event_busy, const Color(0xFFF59E0B), cardColor, borderColor, textColor, textSecondaryColor),
          _approvalCard('5 New Admissions', 'Students', Icons.person_add, AppColors.primary, cardColor, borderColor, textColor, textSecondaryColor),
          _approvalCard('2 Fee Concessions', 'Finance', Icons.money_off, AppColors.success, cardColor, borderColor, textColor, textSecondaryColor),
        ],
      ),
    );
  }

  Widget _statCard(String label, String value, IconData icon, Color color, Color cardColor, Color borderColor, Color textColor) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(18),
        decoration: BoxDecoration(
          color: cardColor,
          borderRadius: BorderRadius.circular(18),
          border: Border.all(color: borderColor),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Container(
                  width: 40,
                  height: 40,
                  decoration: BoxDecoration(
                    color: color.withValues(alpha: 0.12),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Icon(icon, size: 20, color: color),
                ),
                Icon(Icons.arrow_forward_ios, size: 14, color: AppColors.textSecondary),
              ],
            ),
            const SizedBox(height: 14),
            Text(value, style: GoogleFonts.poppins(fontSize: 24, fontWeight: FontWeight.w900, color: textColor)),
            Text(label, style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w600, color: AppColors.textSecondary)),
          ],
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
          decoration: BoxDecoration(
            color: cardColor,
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: borderColor),
          ),
          child: Column(
            children: [
              Container(
                width: 44,
                height: 44,
                decoration: BoxDecoration(
                  color: color.withValues(alpha: 0.12),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(icon, size: 22, color: color),
              ),
              const SizedBox(height: 8),
              Text(label, textAlign: TextAlign.center, style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.w600, color: textColor)),
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

  Widget _activityCard(String title, String subtitle, String time, IconData icon, Color color, Color cardColor, Color borderColor, Color textColor, Color textSecondaryColor) {
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
          Text(time, style: GoogleFonts.inter(fontSize: 11, color: textSecondaryColor)),
        ],
      ),
    );
  }

  Widget _approvalCard(String title, String type, IconData icon, Color color, Color cardColor, Color borderColor, Color textColor, Color textSecondaryColor) {
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
                Text(type, style: GoogleFonts.inter(fontSize: 12, color: textSecondaryColor)),
              ],
            ),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            decoration: BoxDecoration(
              color: color.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Text('Review', style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w700, color: color)),
          ),
        ],
      ),
    );
  }
}
