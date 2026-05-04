import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../../core/providers/auth_provider.dart';
import '../../../../core/providers/theme_provider.dart';
import '../../../auth/presentation/screens/role_selection_screen.dart';

class SettingsScreen extends ConsumerStatefulWidget {
  const SettingsScreen({super.key});

  @override
  ConsumerState<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends ConsumerState<SettingsScreen> {
  String _language = 'English';
  final _nameController = TextEditingController(text: 'Parent Name');
  final _emailController = TextEditingController(text: 'parent@email.com');
  final _mobileController = TextEditingController(text: '+91 9876543210');
  final _cityController = TextEditingController(text: 'Coimbatore');
  final _currentPasswordController = TextEditingController();
  final _newPasswordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _mobileController.dispose();
    _cityController.dispose();
    _currentPasswordController.dispose();
    _newPasswordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final themeMode = ref.watch(themeProvider);
    final showSplash = ref.watch(showSplashProvider);
    final textColor = isDark ? DarkAppColors.textPrimary : AppColors.textPrimary;
    final textSecondaryColor = isDark ? DarkAppColors.textSecondary : AppColors.textSecondary;
    final cardColor = isDark ? DarkAppColors.card : AppColors.card;
    final surfaceColor = isDark ? DarkAppColors.surface : AppColors.surface;
    final borderColor = isDark ? DarkAppColors.border : AppColors.border;

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header
          Row(
            children: [
              Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  color: AppColors.primary.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: const Icon(Icons.settings, size: 22, color: AppColors.primary),
              ),
              const SizedBox(width: 12),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Settings', style: GoogleFonts.poppins(fontSize: 22, fontWeight: FontWeight.w700, color: textColor)),
                  Text('Manage your account preferences', style: GoogleFonts.inter(fontSize: 13, color: textSecondaryColor)),
                ],
              ),
            ],
          ),
          const SizedBox(height: 24),
          // Edit Profile
          _sectionCard(
            title: 'Edit Profile',
            icon: Icons.edit,
            cardColor: cardColor,
            borderColor: borderColor,
            textColor: textColor,
            child: Column(
              children: [
                _buildTextField('Full Name', _nameController, surfaceColor, borderColor, textColor),
                _buildTextField('Email', _emailController, surfaceColor, borderColor, textColor),
                _buildTextField('Mobile', _mobileController, surfaceColor, borderColor, textColor),
                _buildTextField('City', _cityController, surfaceColor, borderColor, textColor),
              ],
            ),
          ),
          const SizedBox(height: 16),
          // Preferences
          _sectionCard(
            title: 'Preferences',
            icon: Icons.wb_sunny,
            cardColor: cardColor,
            borderColor: borderColor,
            textColor: textColor,
            child: Column(
              children: [
                _settingsRow(
                  icon: isDark ? Icons.dark_mode : Icons.light_mode,
                  iconColor: isDark ? const Color(0xFF6C63FF) : const Color(0xFFF59E0B),
                  title: 'Dark Mode',
                  subtitle: 'Switch between light and dark theme',
                  textColor: textColor,
                  textSecondaryColor: textSecondaryColor,
                  trailing: Switch(
                    value: themeMode == ThemeMode.dark,
                    onChanged: (v) => ref.read(themeProvider.notifier).setDarkMode(v),
                    activeColor: AppColors.primary,
                  ),
                ),
                _settingsRow(
                  icon: Icons.animation,
                  iconColor: const Color(0xFF8B5CF6),
                  title: 'Startup Animation',
                  subtitle: 'Show splash screen on app start',
                  textColor: textColor,
                  textSecondaryColor: textSecondaryColor,
                  trailing: Switch(
                    value: showSplash,
                    onChanged: (v) => ref.read(showSplashProvider.notifier).setSplash(v),
                    activeColor: AppColors.primary,
                  ),
                ),
                _settingsRow(
                  icon: Icons.language,
                  iconColor: AppColors.success,
                  title: 'Language',
                  subtitle: 'Choose your preferred language',
                  textColor: textColor,
                  textSecondaryColor: textSecondaryColor,
                  trailing: DropdownButton<String>(
                    value: _language,
                    underline: const SizedBox(),
                    dropdownColor: cardColor,
                    items: ['English', 'Tamil', 'Hindi'].map((l) => DropdownMenuItem(value: l, child: Text(l, style: GoogleFonts.inter(fontSize: 13, color: textColor)))).toList(),
                    onChanged: (v) => setState(() => _language = v!),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),
          // Change Password
          _sectionCard(
            title: 'Change Password',
            icon: Icons.lock,
            cardColor: cardColor,
            borderColor: borderColor,
            textColor: textColor,
            child: Column(
              children: [
                _buildTextField('Current Password', _currentPasswordController, surfaceColor, borderColor, textColor, isPassword: true),
                _buildTextField('New Password', _newPasswordController, surfaceColor, borderColor, textColor, isPassword: true),
                _buildTextField('Confirm New Password', _confirmPasswordController, surfaceColor, borderColor, textColor, isPassword: true),
                const SizedBox(height: 8),
                Align(
                  alignment: Alignment.centerLeft,
                  child: Text('Forgot Password?', style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.primary)),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),
          // Logout
          SizedBox(
            width: double.infinity,
            child: OutlinedButton.icon(
              onPressed: () async {
                await ref.read(authStateProvider.notifier).logout();
                if (context.mounted) {
                  Navigator.of(context).pushAndRemoveUntil(
                    MaterialPageRoute(builder: (_) => const RoleSelectionScreen()),
                    (route) => false,
                  );
                }
              },
              icon: const Icon(Icons.logout, size: 20),
              label: Text('Sign Out', style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w600)),
              style: OutlinedButton.styleFrom(
                foregroundColor: AppColors.error,
                side: BorderSide(color: AppColors.error.withValues(alpha: 0.3)),
                padding: const EdgeInsets.symmetric(vertical: 14),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _sectionCard({
    required String title,
    required IconData icon,
    required Widget child,
    required Color cardColor,
    required Color borderColor,
    required Color textColor,
  }) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: cardColor,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: borderColor),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(icon, size: 18, color: AppColors.primary),
              const SizedBox(width: 8),
              Text(title, style: GoogleFonts.poppins(fontSize: 15, fontWeight: FontWeight.w700, color: textColor)),
            ],
          ),
          const SizedBox(height: 16),
          child,
        ],
      ),
    );
  }

  Widget _buildTextField(String label, TextEditingController controller, Color surfaceColor, Color borderColor, Color textColor, {bool isPassword = false}) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 14),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label.toUpperCase(), style: GoogleFonts.inter(fontSize: 10, fontWeight: FontWeight.w800, color: AppColors.textSecondary, letterSpacing: 0.5)),
          const SizedBox(height: 6),
          Container(
            decoration: BoxDecoration(
              color: surfaceColor,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: borderColor),
            ),
            child: TextField(
              controller: controller,
              obscureText: isPassword,
              style: GoogleFonts.inter(fontSize: 14, color: textColor),
              decoration: InputDecoration(
                border: InputBorder.none,
                contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                hintStyle: GoogleFonts.inter(color: AppColors.textSecondary),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _settingsRow({
    required IconData icon,
    required Color iconColor,
    required String title,
    required String subtitle,
    required Widget trailing,
    required Color textColor,
    required Color textSecondaryColor,
  }) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 10),
      child: Row(
        children: [
          Icon(icon, size: 20, color: iconColor),
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
          trailing,
        ],
      ),
    );
  }
}
