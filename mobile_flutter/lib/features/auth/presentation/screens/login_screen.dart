import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../../core/providers/auth_provider.dart';
import '../../../../core/models/user_model.dart';
import '../../../home/presentation/screens/home_screen.dart';
import '../../../home/presentation/screens/teacher_home_screen.dart';
import '../../../home/presentation/screens/admin_home_screen.dart';

class LoginScreen extends ConsumerStatefulWidget {
  const LoginScreen({super.key});

  @override
  ConsumerState<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends ConsumerState<LoginScreen> with SingleTickerProviderStateMixin {
  String? _selectedRole;
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _showPassword = false;
  bool _isLoading = false;
  String? _error;
  late AnimationController _animController;
  late Animation<double> _fadeAnim;
  late Animation<Offset> _slideAnim;

  @override
  void initState() {
    super.initState();
    _animController = AnimationController(vsync: this, duration: const Duration(milliseconds: 400));
    _fadeAnim = CurvedAnimation(parent: _animController, curve: Curves.easeOut);
    _slideAnim = Tween<Offset>(begin: const Offset(0.2, 0), end: Offset.zero)
        .animate(CurvedAnimation(parent: _animController, curve: Curves.easeOutCubic));
    _animController.forward();
  }

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    _animController.dispose();
    super.dispose();
  }

  void _selectRole(String role) {
    setState(() {
      _selectedRole = role;
      _error = null;
      _emailController.clear();
      _passwordController.clear();
    });
    _animController.reset();
    _animController.forward();
  }

  void _backToRoles() {
    setState(() {
      _selectedRole = null;
      _error = null;
    });
    _animController.reset();
    _animController.forward();
  }

  Future<void> _handleLogin() async {
    setState(() { _error = null; _isLoading = true; });
    await ref.read(authStateProvider.notifier).login(
      _emailController.text.trim(),
      _passwordController.text,
    );
    if (!mounted) return;
    final authState = ref.read(authStateProvider);
    setState(() => _isLoading = false);
    
    if (authState.status == AuthStatus.authenticated && authState.user != null) {
      final user = authState.user!;
      Widget destination;
      switch (user.role) {
        case UserRole.admin:
          destination = const AdminHomeScreen();
          break;
        case UserRole.staff:
          destination = const TeacherHomeScreen();
          break;
        case UserRole.parent:
          destination = const HomeScreen();
          break;
      }
      Navigator.of(context).pushAndRemoveUntil(
        MaterialPageRoute(builder: (_) => destination),
        (route) => false,
      );
    } else if (authState.status == AuthStatus.error) {
      setState(() => _error = authState.errorMessage ?? 'Failed to sign in');
    }
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final textColor = isDark ? DarkAppColors.textPrimary : AppColors.textPrimary;
    final textSecondaryColor = isDark ? DarkAppColors.textSecondary : AppColors.textSecondary;
    final cardColor = isDark ? DarkAppColors.card : AppColors.card;
    final borderColor = isDark ? DarkAppColors.border : AppColors.border;
    final inputBg = isDark ? DarkAppColors.inputBg : const Color(0xFFF1F5F9);

    return Scaffold(
      backgroundColor: isDark ? DarkAppColors.background : AppColors.background,
      body: SafeArea(
        child: Column(
          children: [
            // Logo header
            Padding(
              padding: const EdgeInsets.fromLTRB(24, 20, 24, 0),
              child: Row(
                children: [
                  Container(
                    width: 36,
                    height: 36,
                    decoration: BoxDecoration(borderRadius: BorderRadius.circular(8)),
                    child: ClipRRect(
                      borderRadius: BorderRadius.circular(8),
                      child: Image.asset('assets/logo.png', fit: BoxFit.contain,
                        errorBuilder: (_, __, ___) => const Icon(Icons.school, color: AppColors.primary, size: 24)),
                    ),
                  ),
                  const SizedBox(width: 10),
                  RichText(
                    text: TextSpan(children: [
                      TextSpan(text: 'SNS ', style: GoogleFonts.poppins(fontSize: 20, fontWeight: FontWeight.w800, color: textColor)),
                      TextSpan(text: 'Academy', style: GoogleFonts.poppins(fontSize: 20, fontWeight: FontWeight.w800, color: AppColors.primary)),
                    ]),
                  ),
                ],
              ),
            ),
            // Body
            Expanded(
              child: FadeTransition(
                opacity: _fadeAnim,
                child: SlideTransition(
                  position: _slideAnim,
                  child: SingleChildScrollView(
                    padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 24),
                    child: _selectedRole == null
                        ? _buildRoleSelection(textColor, textSecondaryColor, cardColor, borderColor)
                        : _buildLoginForm(textColor, textSecondaryColor, cardColor, borderColor, inputBg),
                  ),
                ),
              ),
            ),
            // Footer
            Padding(
              padding: const EdgeInsets.only(bottom: 20),
              child: Text('© 2026 SNS Academy ERP · Empowering Education',
                  style: GoogleFonts.inter(fontSize: 11.5, color: textSecondaryColor)),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildRoleSelection(Color textColor, Color textSecondary, Color cardColor, Color borderColor) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const SizedBox(height: 32),
        // Welcome card - matching frontend exactly
        Container(
          width: double.infinity,
          padding: const EdgeInsets.all(32),
          decoration: BoxDecoration(
            color: cardColor,
            borderRadius: BorderRadius.circular(24),
            border: Border.all(color: borderColor),
            boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.04), blurRadius: 32, offset: const Offset(0, 16))],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Welcome Back', style: GoogleFonts.poppins(fontSize: 26, fontWeight: FontWeight.w700, color: textColor, letterSpacing: -0.5)),
              const SizedBox(height: 6),
              Text('Select your role to access the SNS Academy ERP portal.',
                  style: GoogleFonts.inter(fontSize: 14, color: textSecondary, height: 1.6)),
              const SizedBox(height: 28),
              // Role cards - matching frontend 3-column grid
              Row(
                children: [
                  Expanded(child: _roleCard(Icons.shield_outlined, 'Admin', 'admin', textColor, cardColor, borderColor)),
                  const SizedBox(width: 12),
                  Expanded(child: _roleCard(Icons.school_outlined, 'Teacher', 'teacher', textColor, cardColor, borderColor)),
                  const SizedBox(width: 12),
                  Expanded(child: _roleCard(Icons.people_outline, 'Parent', 'parent', textColor, cardColor, borderColor)),
                ],
              ),
              const SizedBox(height: 24),
              // Security notice
              Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: AppColors.securityBg,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: AppColors.securityBorder),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.shield, size: 18, color: AppColors.primary),
                    const SizedBox(width: 10),
                    Expanded(
                      child: Text('Secured with end-to-end encryption. Your data is safe.',
                          style: GoogleFonts.inter(fontSize: 12.5, color: textSecondary, height: 1.5)),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _roleCard(IconData icon, String label, String role, Color textColor, Color cardColor, Color borderColor) {
    return GestureDetector(
      onTap: () => _selectRole(role),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(vertical: 28, horizontal: 12),
        decoration: BoxDecoration(
          color: cardColor,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: borderColor, width: 1),
          boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.03), blurRadius: 12, offset: const Offset(0, 4))],
        ),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 56,
              height: 56,
              decoration: BoxDecoration(
                color: AppColors.primary.withValues(alpha: 0.1),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Icon(icon, size: 28, color: AppColors.primary),
            ),
            const SizedBox(height: 14),
            Text(label, style: GoogleFonts.poppins(fontSize: 15, fontWeight: FontWeight.w700, color: textColor)),
          ],
        ),
      ),
    );
  }

  Widget _buildLoginForm(Color textColor, Color textSecondary, Color cardColor, Color borderColor, Color inputBg) {
    final roleLabel = _selectedRole![0].toUpperCase() + _selectedRole!.substring(1);
    final roleIcon = _selectedRole == 'admin' ? Icons.shield_outlined
        : _selectedRole == 'teacher' ? Icons.school_outlined : Icons.people_outline;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Back button
        GestureDetector(
          onTap: _backToRoles,
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(Icons.arrow_back, size: 16, color: textSecondary),
              const SizedBox(width: 6),
              Text('Back to role selection', style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w500, color: textSecondary)),
            ],
          ),
        ),
        const SizedBox(height: 28),
        // Form card
        Container(
          width: double.infinity,
          padding: const EdgeInsets.all(32),
          decoration: BoxDecoration(
            color: cardColor,
            borderRadius: BorderRadius.circular(24),
            border: Border.all(color: borderColor),
            boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.04), blurRadius: 32, offset: const Offset(0, 16))],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Role header
              Row(
                children: [
                  Container(
                    width: 40,
                    height: 40,
                    decoration: BoxDecoration(
                      color: AppColors.primary.withValues(alpha: 0.1),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Icon(roleIcon, size: 22, color: AppColors.primary),
                  ),
                  const SizedBox(width: 10),
                  Text('$roleLabel Login', style: GoogleFonts.poppins(fontSize: 24, fontWeight: FontWeight.w700, color: textColor, letterSpacing: -0.5)),
                ],
              ),
              const SizedBox(height: 6),
              Text('Enter your ${_selectedRole == "parent" ? "mobile number" : "email address"} and password',
                  style: GoogleFonts.inter(fontSize: 13.5, color: textSecondary)),
              const SizedBox(height: 24),
              // Error banner
              if (_error != null) ...[
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: AppColors.error.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(10),
                    border: Border.all(color: AppColors.error.withValues(alpha: 0.28)),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.warning, size: 18, color: AppColors.error),
                      const SizedBox(width: 10),
                      Expanded(child: Text(_error!.replaceFirst('Exception: ', ''),
                          style: GoogleFonts.inter(fontSize: 13, color: AppColors.error))),
                    ],
                  ),
                ),
                const SizedBox(height: 20),
              ],
              // Email/Mobile field
              Text(_selectedRole == 'parent' ? 'MOBILE NUMBER' : 'EMAIL ADDRESS',
                  style: GoogleFonts.poppins(fontSize: 12, fontWeight: FontWeight.w700, color: textColor, letterSpacing: 0.5)),
              const SizedBox(height: 7),
              _buildInputField(
                controller: _emailController,
                hint: _selectedRole == 'admin' ? 'admin@sns-erp.local'
                    : _selectedRole == 'parent' ? '+91 9XXXXXXXXX' : 'teacher@sns-erp.local',
                keyboardType: _selectedRole == 'parent' ? TextInputType.phone : TextInputType.emailAddress,
                inputBg: inputBg, borderColor: borderColor, textColor: textColor,
              ),
              const SizedBox(height: 16),
              // Password field
              Text('PASSWORD', style: GoogleFonts.poppins(fontSize: 12, fontWeight: FontWeight.w700, color: textColor, letterSpacing: 0.5)),
              const SizedBox(height: 7),
              _buildInputField(
                controller: _passwordController,
                hint: '••••••••',
                isPassword: true,
                inputBg: inputBg, borderColor: borderColor, textColor: textColor,
              ),
              const SizedBox(height: 12),
              // Forgot password
              Align(
                alignment: Alignment.centerRight,
                child: GestureDetector(
                  onTap: () {},
                  child: Text('Forgot Password?', style: GoogleFonts.inter(fontSize: 12.5, fontWeight: FontWeight.w500, color: AppColors.primary)),
                ),
              ),
              const SizedBox(height: 24),
              // Sign In button - matching frontend exactly
              SizedBox(
                width: double.infinity,
                height: 54,
                child: ElevatedButton(
                  onPressed: _isLoading ? null : _handleLogin,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: _isLoading ? AppColors.primary.withValues(alpha: 0.5) : AppColors.primary,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                    elevation: 0,
                  ),
                  child: _isLoading
                      ? const SizedBox(width: 22, height: 22, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                      : Row(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text('SIGN IN', style: GoogleFonts.poppins(fontSize: 14, fontWeight: FontWeight.w700, letterSpacing: 0.8)),
                            const SizedBox(width: 10),
                            const Icon(Icons.arrow_forward, size: 18),
                          ],
                        ),
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildInputField({
    required TextEditingController controller,
    required String hint,
    required Color inputBg,
    required Color borderColor,
    required Color textColor,
    TextInputType? keyboardType,
    bool isPassword = false,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: inputBg,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: borderColor),
      ),
      child: TextField(
        controller: controller,
        obscureText: isPassword && !_showPassword,
        keyboardType: keyboardType,
        style: GoogleFonts.inter(fontSize: 15, fontWeight: FontWeight.w500, color: textColor),
        decoration: InputDecoration(
          hintText: hint,
          suffixIcon: isPassword
              ? IconButton(
                  icon: Icon(_showPassword ? Icons.visibility_off_outlined : Icons.visibility_outlined,
                      color: AppColors.textSecondary, size: 20),
                  onPressed: () => setState(() => _showPassword = !_showPassword),
                )
              : null,
          border: InputBorder.none,
          enabledBorder: InputBorder.none,
          focusedBorder: InputBorder.none,
        ),
      ),
    );
  }
}
