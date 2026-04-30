import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:local_auth/local_auth.dart';

import '../../../../core/models/auth_session.dart';
import '../../../auth/data/auth_api_service.dart';
import '../../../auth/data/auth_storage_service.dart';

class SettingsTab extends StatefulWidget {
  final AuthSession session;
  final Function(AuthSession) onSessionUpdated;
  final bool isDarkMode;
  final ValueChanged<bool>? onThemeChanged;

  const SettingsTab({
    super.key,
    required this.session,
    required this.onSessionUpdated,
    this.isDarkMode = false,
    this.onThemeChanged,
  });

  @override
  State<SettingsTab> createState() => _SettingsTabState();
}

class _SettingsTabState extends State<SettingsTab> {
  final _authApiService = const AuthApiService();
  final _authStorage = AuthStorageService();
  final _localAuth = LocalAuthentication();
  
  // Profile Form
  final _profileFormKey = GlobalKey<FormState>();
  late TextEditingController _emailCtrl;
  late TextEditingController _phoneCtrl;
  bool _isProfileLoading = false;

  // Password Form
  final _passwordFormKey = GlobalKey<FormState>();
  final _currentPasswordCtrl = TextEditingController();
  final _newPasswordCtrl = TextEditingController();
  final _confirmPasswordCtrl = TextEditingController();
  bool _isPasswordLoading = false;

  // Preferences
  bool _biometricsEnabled = false;
  String _selectedLanguage = 'English';

  @override
  void initState() {
    super.initState();
    _emailCtrl = TextEditingController(text: widget.session.user.email);
    _phoneCtrl = TextEditingController(text: '+91 98765 43210');
    _loadPrefs();
  }

  Future<void> _loadPrefs() async {
    final bioEnabled = await _authStorage.getBiometricsEnabled();
    final lang = await _authStorage.getLanguage();
    setState(() {
      _biometricsEnabled = bioEnabled;
      _selectedLanguage = lang;
    });
  }

  Future<void> _toggleBiometrics(bool value) async {
    if (value) {
      try {
        final canCheckBiometrics = await _localAuth.canCheckBiometrics;
        final isDeviceSupported = await _localAuth.isDeviceSupported();

        if (!canCheckBiometrics || !isDeviceSupported) {
          _showSnackBar('Biometric authentication is not supported or not set up on this device.', true);
          return;
        }

        final didAuthenticate = await _localAuth.authenticate(
          localizedReason: 'Please authenticate to enable App Lock',
          biometricOnly: false,
          persistAcrossBackgrounding: true,
        );

        if (didAuthenticate) {
          await _authStorage.setBiometricsEnabled(true);
          setState(() {
            _biometricsEnabled = true;
          });
          _showSnackBar('App Lock enabled successfully!', false);
        }
      } on PlatformException catch (e) {
        _showSnackBar('Error: ${e.message}', true);
      }
    } else {
      await _authStorage.setBiometricsEnabled(false);
      setState(() {
        _biometricsEnabled = false;
      });
      _showSnackBar('App Lock disabled.', false);
    }
  }

  @override
  void dispose() {
    _emailCtrl.dispose();
    _phoneCtrl.dispose();
    _currentPasswordCtrl.dispose();
    _newPasswordCtrl.dispose();
    _confirmPasswordCtrl.dispose();
    super.dispose();
  }

  void _showSnackBar(String message, bool isError) {
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: isError ? Colors.red : Colors.green,
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  Future<void> _updateProfile() async {
    if (!_profileFormKey.currentState!.validate()) return;

    setState(() => _isProfileLoading = true);
    try {
      final updatedUser = await _authApiService.updateProfile(
        accessToken: widget.session.accessToken,
        email: _emailCtrl.text.trim(),
        phone: _phoneCtrl.text.trim(),
      );

      final newSession = AuthSession(
        accessToken: widget.session.accessToken,
        refreshToken: widget.session.refreshToken,
        expiresIn: widget.session.expiresIn,
        user: updatedUser,
      );

      widget.onSessionUpdated(newSession);
      _showSnackBar('Profile updated successfully', false);
    } catch (e) {
      _showSnackBar(e.toString().replaceAll('Exception: ', ''), true);
    } finally {
      if (mounted) setState(() => _isProfileLoading = false);
    }
  }

  Future<void> _changePassword() async {
    if (!_passwordFormKey.currentState!.validate()) return;

    setState(() => _isPasswordLoading = true);
    try {
      await _authApiService.changePassword(
        accessToken: widget.session.accessToken,
        currentPassword: _currentPasswordCtrl.text,
        newPassword: _newPasswordCtrl.text,
      );

      _showSnackBar('Password changed successfully', false);
      _currentPasswordCtrl.clear();
      _newPasswordCtrl.clear();
      _confirmPasswordCtrl.clear();
    } catch (e) {
      _showSnackBar(e.toString().replaceAll('Exception: ', ''), true);
    } finally {
      if (mounted) setState(() => _isPasswordLoading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final isDark = widget.isDarkMode;

    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        // Preferences Section
        Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: theme.cardColor,
            borderRadius: BorderRadius.circular(16),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: isDark ? 0.2 : 0.05),
                blurRadius: 10,
                offset: const Offset(0, 4),
              )
            ],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Row(
                children: [
                  Icon(Icons.palette_outlined, color: Color(0xFFFF7F50)),
                  SizedBox(width: 8),
                  Text('Preferences', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                ],
              ),
              const SizedBox(height: 16),
              SwitchListTile(
                contentPadding: EdgeInsets.zero,
                title: const Text('Dark Mode', style: TextStyle(fontWeight: FontWeight.w600)),
                subtitle: const Text('Switch between light and dark theme'),
                value: widget.isDarkMode,
                onChanged: (val) {
                  if (widget.onThemeChanged != null) {
                    widget.onThemeChanged!(val);
                  }
                },
                activeColor: const Color(0xFFFF7F50),
              ),
              const Divider(height: 24),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Language', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 16)),
                      SizedBox(height: 4),
                      Text('Choose your preferred language', style: TextStyle(color: Colors.grey, fontSize: 13)),
                    ],
                  ),
                  DropdownButton<String>(
                    value: _selectedLanguage,
                    dropdownColor: theme.cardColor,
                    items: const [
                      DropdownMenuItem(value: 'English', child: Text('English')),
                      DropdownMenuItem(value: 'Hindi', child: Text('Hindi')),
                      DropdownMenuItem(value: 'Tamil', child: Text('Tamil')),
                    ],
                    onChanged: (val) async {
                      if (val != null) {
                        await _authStorage.setLanguage(val);
                        setState(() {
                          _selectedLanguage = val;
                        });
                        _showSnackBar('Language updated to $val', false);
                      }
                    },
                  )
                ],
              )
            ],
          ),
        ),

        const SizedBox(height: 24),

        // Security & App Lock Section
        Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: theme.cardColor,
            borderRadius: BorderRadius.circular(16),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: isDark ? 0.2 : 0.05),
                blurRadius: 10,
                offset: const Offset(0, 4),
              )
            ],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Row(
                children: [
                  Icon(Icons.security, color: Color(0xFFFF7F50)),
                  SizedBox(width: 8),
                  Text('Security & App Lock', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                ],
              ),
              const SizedBox(height: 8),
              const Text('Require fingerprint or device PIN to open the app.', style: TextStyle(color: Colors.grey, fontSize: 13)),
              const SizedBox(height: 16),
              
              SwitchListTile(
                contentPadding: EdgeInsets.zero,
                title: const Text('Enable App Lock (Biometrics)', style: TextStyle(fontWeight: FontWeight.w600)),
                subtitle: const Text('Ask for fingerprint on app start'),
                value: _biometricsEnabled,
                onChanged: _toggleBiometrics,
                activeColor: const Color(0xFFFF7F50),
              ),
            ],
          ),
        ),
        
        const SizedBox(height: 24),

        // Profile Section
        Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: theme.cardColor,
            borderRadius: BorderRadius.circular(16),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: isDark ? 0.2 : 0.05),
                blurRadius: 10,
                offset: const Offset(0, 4),
              )
            ],
          ),
          child: Form(
            key: _profileFormKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Row(
                  children: [
                    Icon(Icons.person_outline, color: Color(0xFFFF7F50)),
                    SizedBox(width: 8),
                    Text('Profile Information', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                  ],
                ),
                const SizedBox(height: 8),
                const Text('Update your account details and contact information.', style: TextStyle(color: Colors.grey, fontSize: 13)),
                const SizedBox(height: 24),
                
                TextFormField(
                  controller: _emailCtrl,
                  decoration: const InputDecoration(
                    labelText: 'Email Address',
                    border: OutlineInputBorder(borderRadius: BorderRadius.all(Radius.circular(12))),
                    prefixIcon: Icon(Icons.email_outlined),
                  ),
                  validator: (val) => val == null || !val.contains('@') ? 'Enter a valid email' : null,
                ),
                const SizedBox(height: 16),
                
                TextFormField(
                  controller: _phoneCtrl,
                  decoration: const InputDecoration(
                    labelText: 'Phone Number',
                    border: OutlineInputBorder(borderRadius: BorderRadius.all(Radius.circular(12))),
                    prefixIcon: Icon(Icons.phone_outlined),
                  ),
                  validator: (val) => val == null || val.length < 10 ? 'Enter a valid phone number' : null,
                ),
                const SizedBox(height: 24),
                
                SizedBox(
                  width: double.infinity,
                  height: 48,
                  child: ElevatedButton(
                    onPressed: _isProfileLoading ? null : _updateProfile,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFFFF7F50),
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    child: _isProfileLoading
                        ? const SizedBox(width: 24, height: 24, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                        : const Text('Save Changes', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                  ),
                ),
              ],
            ),
          ),
        ),
        
        const SizedBox(height: 24),

        // Password Section
        Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: theme.cardColor,
            borderRadius: BorderRadius.circular(16),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: isDark ? 0.2 : 0.05),
                blurRadius: 10,
                offset: const Offset(0, 4),
              )
            ],
          ),
          child: Form(
            key: _passwordFormKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Row(
                  children: [
                    Icon(Icons.lock_outline, color: Color(0xFFFF7F50)),
                    SizedBox(width: 8),
                    Text('Change Password', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                  ],
                ),
                const SizedBox(height: 8),
                const Text('Ensure your account is using a long, random password to stay secure.', style: TextStyle(color: Colors.grey, fontSize: 13)),
                const SizedBox(height: 24),
                
                TextFormField(
                  controller: _currentPasswordCtrl,
                  obscureText: true,
                  decoration: const InputDecoration(
                    labelText: 'Current Password',
                    border: OutlineInputBorder(borderRadius: BorderRadius.all(Radius.circular(12))),
                  ),
                  validator: (val) => val == null || val.isEmpty ? 'Required' : null,
                ),
                const SizedBox(height: 16),
                
                TextFormField(
                  controller: _newPasswordCtrl,
                  obscureText: true,
                  decoration: const InputDecoration(
                    labelText: 'New Password',
                    border: OutlineInputBorder(borderRadius: BorderRadius.all(Radius.circular(12))),
                  ),
                  validator: (val) => val == null || val.length < 6 ? 'Min 6 characters' : null,
                ),
                const SizedBox(height: 16),

                TextFormField(
                  controller: _confirmPasswordCtrl,
                  obscureText: true,
                  decoration: const InputDecoration(
                    labelText: 'Confirm New Password',
                    border: OutlineInputBorder(borderRadius: BorderRadius.all(Radius.circular(12))),
                  ),
                  validator: (val) {
                    if (val != _newPasswordCtrl.text) return 'Passwords do not match';
                    return null;
                  },
                ),
                const SizedBox(height: 24),
                
                SizedBox(
                  width: double.infinity,
                  height: 48,
                  child: ElevatedButton(
                    onPressed: _isPasswordLoading ? null : _changePassword,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Colors.grey[800],
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    ),
                    child: _isPasswordLoading
                        ? const SizedBox(width: 24, height: 24, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                        : const Text('Update Password', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                  ),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 32),
      ],
    );
  }
}
