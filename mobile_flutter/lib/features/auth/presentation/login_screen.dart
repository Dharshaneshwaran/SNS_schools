import 'package:flutter/material.dart';

import '../../../core/config/app_config.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({
    required this.isSubmitting,
    required this.message,
    required this.onSubmit,
    super.key,
  });

  final bool isSubmitting;
  final String message;
  final Future<void> Function(String email, String password) onSubmit;

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  late final TextEditingController _emailController;
  late final TextEditingController _passwordController;
  bool _obscurePassword = true;
  String? _selectedRole;

  @override
  void initState() {
    super.initState();
    _emailController = TextEditingController(text: AppConfig.defaultEmail);
    _passwordController = TextEditingController(text: AppConfig.defaultPassword);
  }

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _handleSubmit() async {
    FocusScope.of(context).unfocus();
    await widget.onSubmit(
      _emailController.text.trim(),
      _passwordController.text,
    );
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedSwitcher(
      duration: const Duration(milliseconds: 350),
      transitionBuilder: (child, animation) {
        return FadeTransition(
          opacity: animation,
          child: SlideTransition(
            position: Tween<Offset>(
              begin: const Offset(0.05, 0),
              end: Offset.zero,
            ).animate(CurvedAnimation(parent: animation, curve: Curves.easeOut)),
            child: child,
          ),
        );
      },
      child: _selectedRole == null
          ? _RoleSelectionPage(
              key: const ValueKey('role'),
              onRoleSelected: (role) {
                setState(() {
                  _selectedRole = role;
                  if (role == 'parent') _emailController.clear();
                });
              },
            )
          : _LoginFormPage(
              key: const ValueKey('form'),
              selectedRole: _selectedRole!,
              emailController: _emailController,
              passwordController: _passwordController,
              obscurePassword: _obscurePassword,
              isSubmitting: widget.isSubmitting,
              message: widget.message,
              onTogglePassword: () {
                setState(() => _obscurePassword = !_obscurePassword);
              },
              onBack: () {
                setState(() {
                  _selectedRole = null;
                  _emailController.text = AppConfig.defaultEmail;
                  _passwordController.text = AppConfig.defaultPassword;
                });
              },
              onSubmit: _handleSubmit,
            ),
    );
  }
}

// ─────────────────────────────────────────────
// PAGE 1: Role Selection — White + Orange theme
// ─────────────────────────────────────────────
class _RoleSelectionPage extends StatelessWidget {
  const _RoleSelectionPage({super.key, required this.onRoleSelected});

  final void Function(String role) onRoleSelected;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      backgroundColor: const Color(0xFFF9FAFB),
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 28),
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 420),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  // Logo
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Image.asset(
                        'assets/logo.png',
                        height: 48,
                        errorBuilder: (context, error, stackTrace) =>
                            const Icon(Icons.school, color: Color(0xFFFF7F50), size: 34),
                      ),
                      const SizedBox(width: 12),
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'SNS',
                            style: GoogleFonts.poppins(
                              fontSize: 22,
                              fontWeight: FontWeight.w800,
                              color: const Color(0xFF121212),
                              height: 1.0,
                            ),
                          ),
                          Text(
                            'Academy',
                            style: GoogleFonts.poppins(
                              fontSize: 22,
                              fontWeight: FontWeight.w800,
                              color: const Color(0xFFFF7F50),
                              height: 1.0,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                  const SizedBox(height: 56),

                  // Card
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 40),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(28),
                      border: Border.all(color: const Color(0xFFECEFF1)),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.04),
                          blurRadius: 40,
                          offset: const Offset(0, 16),
                        ),
                      ],
                    ),
                    child: Column(
                      children: [
                        Text(
                          'Welcome Back',
                          style: GoogleFonts.poppins(
                            fontSize: 26,
                            fontWeight: FontWeight.w700,
                            color: const Color(0xFF121212),
                            letterSpacing: -0.5,
                          ),
                        ),
                        const SizedBox(height: 10),
                        Text(
                          'Select your role to access the SNS Academy ERP portal.',
                          textAlign: TextAlign.center,
                          style: GoogleFonts.inter(
                            color: const Color(0xFF636E72),
                            fontSize: 14,
                            lineHeight: 1.5,
                          ),
                        ),
                        const SizedBox(height: 36),

                        Row(
                          children: [
                            Expanded(
                              child: _WhiteRoleCard(
                                title: 'Teacher',
                                icon: Icons.assignment_ind_outlined,
                                onTap: () => onRoleSelected('teacher'),
                              ),
                            ),
                            const SizedBox(width: 16),
                            Expanded(
                              child: _WhiteRoleCard(
                                title: 'Parent',
                                icon: Icons.people_outline_rounded,
                                onTap: () => onRoleSelected('parent'),
                              ),
                            ),
                          ],
                        ),
                        
                        const SizedBox(height: 28),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                          decoration: BoxDecoration(
                            color: const Color(0xFFFF7F50).withOpacity(0.08),
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(color: const Color(0xFFFF7F50).withOpacity(0.2)),
                          ),
                          child: Row(
                            children: [
                              const Icon(Icons.security, size: 18, color: Color(0xFFFF7F50)),
                              const SizedBox(width: 10),
                              Expanded(
                                child: Text(
                                  'Secured with end-to-end encryption. Your data is safe.',
                                  style: GoogleFonts.inter(
                                    color: const Color(0xFF636E72),
                                    fontSize: 12,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 60),

                  Text(
                    '© 2026 SNS Academy ERP · Empowering Education Through Design Thinking',
                    textAlign: TextAlign.center,
                    style: GoogleFonts.inter(
                      color: const Color(0xFF94A3B8),
                      fontSize: 11,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _WhiteRoleCard extends StatefulWidget {
  const _WhiteRoleCard({
    required this.title,
    required this.icon,
    required this.onTap,
  });

  final String title;
  final IconData icon;
  final VoidCallback onTap;

  @override
  State<_WhiteRoleCard> createState() => _WhiteRoleCardState();
}

class _WhiteRoleCardState extends State<_WhiteRoleCard> {
  bool _pressed = false;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTapDown: (_) => setState(() => _pressed = true),
      onTapUp: (_) {
        setState(() => _pressed = false);
        widget.onTap();
      },
      onTapCancel: () => setState(() => _pressed = false),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 180),
        curve: Curves.easeOut,
        padding: const EdgeInsets.symmetric(vertical: 28),
        transform: _pressed
            ? (Matrix4.identity()..scale(0.96, 0.96, 1.0))
            : Matrix4.identity(),
        transformAlignment: Alignment.center,
        decoration: BoxDecoration(
          color: _pressed ? const Color(0xFFFF7F50) : const Color(0xFFF8FAFC),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: _pressed ? const Color(0xFFFF7F50) : const Color(0xFFE2E8F0),
          ),
          boxShadow: _pressed
              ? [
                  BoxShadow(
                    color: const Color(0xFFFF7F50).withValues(alpha: 0.3),
                    blurRadius: 16,
                    offset: const Offset(0, 6),
                  ),
                ]
              : [],
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              widget.icon,
              color: _pressed ? Colors.white : const Color(0xFFFF7F50),
              size: 36,
            ),
            const SizedBox(height: 12),
            Text(
              widget.title,
              style: TextStyle(
                color: _pressed ? Colors.white : const Color(0xFF2D3436),
                fontWeight: FontWeight.w600,
                fontSize: 14,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ─────────────────────────────────────────────
// PAGE 2: Login Form — Orange/White/Black gradient
// ─────────────────────────────────────────────
class _LoginFormPage extends StatelessWidget {
  const _LoginFormPage({
    super.key,
    required this.selectedRole,
    required this.emailController,
    required this.passwordController,
    required this.obscurePassword,
    required this.isSubmitting,
    required this.message,
    required this.onTogglePassword,
    required this.onBack,
    required this.onSubmit,
  });

  final String selectedRole;
  final TextEditingController emailController;
  final TextEditingController passwordController;
  final bool obscurePassword;
  final bool isSubmitting;
  final String message;
  final VoidCallback onTogglePassword;
  final VoidCallback onBack;
  final VoidCallback onSubmit;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      backgroundColor: const Color(0xFFF9FAFB),
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 24),
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 440),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  // Logo
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Image.asset(
                        'assets/logo.png',
                        height: 40,
                        errorBuilder: (context, error, stackTrace) =>
                            const Icon(Icons.school, color: Color(0xFFFF7F50), size: 30),
                      ),
                      const SizedBox(width: 10),
                      RichText(
                        text: TextSpan(
                          children: [
                            TextSpan(
                              text: 'SNS ',
                              style: GoogleFonts.poppins(
                                color: const Color(0xFF121212),
                                fontWeight: FontWeight.w800,
                                fontSize: 18,
                              ),
                            ),
                            TextSpan(
                              text: 'Academy',
                              style: GoogleFonts.poppins(
                                color: const Color(0xFFFF7F50),
                                fontWeight: FontWeight.w800,
                                fontSize: 18,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 36),

                  // Main Card
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 36),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(28),
                      border: Border.all(color: const Color(0xFFECEFF1)),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.05),
                          blurRadius: 40,
                          offset: const Offset(0, 20),
                        ),
                      ],
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Back button
                        GestureDetector(
                          onTap: onBack,
                          behavior: HitTestBehavior.opaque,
                          child: Padding(
                            padding: const EdgeInsets.only(bottom: 24),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                const Icon(Icons.arrow_back_rounded, color: Color(0xFF636E72), size: 16),
                                const SizedBox(width: 8),
                                Text(
                                  'Back to role selection',
                                  style: GoogleFonts.inter(
                                    color: const Color(0xFF636E72),
                                    fontSize: 13,
                                    fontWeight: FontWeight.w500,
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ),

                        // Title with Icon
                        Row(
                          children: [
                            Icon(
                              selectedRole == 'teacher' 
                                  ? Icons.assignment_ind_rounded 
                                  : Icons.people_alt_rounded,
                              color: const Color(0xFFFF7F50),
                              size: 24,
                            ),
                            const SizedBox(width: 12),
                            Text(
                              '${selectedRole[0].toUpperCase()}${selectedRole.substring(1)} Login',
                              style: GoogleFonts.poppins(
                                color: const Color(0xFF121212),
                                fontWeight: FontWeight.w700,
                                fontSize: 24,
                                letterSpacing: -0.5,
                              ),
                            ),
                          ],
                        ),
                        const SizedBox(height: 8),
                        Text(
                          'Enter your ${selectedRole == 'teacher' ? 'email address' : 'mobile number'} and password',
                          style: GoogleFonts.inter(
                            color: const Color(0xFF636E72),
                            fontSize: 14,
                          ),
                        ),
                        const SizedBox(height: 32),

                        // Input Labels and Fields
                        _buildLabel('EMAIL ADDRESS'),
                        const SizedBox(height: 8),
                        TextField(
                          controller: emailController,
                          keyboardType: selectedRole == 'teacher'
                              ? TextInputType.emailAddress
                              : TextInputType.phone,
                          style: GoogleFonts.inter(fontSize: 15, fontWeight: FontWeight.w500),
                          decoration: _buildInputDecoration(
                            selectedRole == 'teacher' ? 'teacher@sns-erp.local' : 'Enter mobile number',
                          ),
                        ),
                        const SizedBox(height: 24),

                        _buildLabel('PASSWORD'),
                        const SizedBox(height: 8),
                        TextField(
                          controller: passwordController,
                          obscureText: obscurePassword,
                          style: GoogleFonts.inter(fontSize: 15, fontWeight: FontWeight.w500),
                          decoration: _buildInputDecoration('••••••••').copyWith(
                            suffixIcon: IconButton(
                              icon: Icon(
                                obscurePassword ? Icons.visibility_off_outlined : Icons.visibility_outlined,
                                color: const Color(0xFF94A3B8),
                                size: 20,
                              ),
                              onPressed: onTogglePassword,
                            ),
                          ),
                        ),

                        // Forgot Password
                        Align(
                          alignment: Alignment.centerRight,
                          child: TextButton(
                            onPressed: () {},
                            style: TextButton.styleFrom(
                              padding: const EdgeInsets.symmetric(vertical: 12),
                            ),
                            child: Text(
                              'Forgot Password?',
                              style: GoogleFonts.inter(
                                color: const Color(0xFFFF7F50),
                                fontSize: 13,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(height: 16),

                        // Sign In Button
                        SizedBox(
                          width: double.infinity,
                          height: 56,
                          child: ElevatedButton(
                            onPressed: isSubmitting ? null : onSubmit,
                            style: ElevatedButton.styleFrom(
                              backgroundColor: const Color(0xFFFF7F50),
                              foregroundColor: Colors.white,
                              elevation: 0,
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(16),
                              ),
                            ),
                            child: isSubmitting
                                ? const SizedBox(
                                    width: 24,
                                    height: 24,
                                    child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2),
                                  )
                                : Row(
                                    mainAxisAlignment: MainAxisAlignment.center,
                                    children: [
                                      Text(
                                        'SIGN IN',
                                        style: GoogleFonts.poppins(
                                          fontWeight: FontWeight.w700,
                                          fontSize: 16,
                                          letterSpacing: 1.0,
                                        ),
                                      ),
                                      const SizedBox(width: 12),
                                      const Icon(Icons.arrow_forward_rounded, size: 20),
                                    ],
                                  ),
                          ),
                        ),

                        if (message.isNotEmpty) ...[
                          const SizedBox(height: 24),
                          Container(
                            width: double.infinity,
                            padding: const EdgeInsets.all(14),
                            decoration: BoxDecoration(
                              color: message.toLowerCase().contains('welcome')
                                  ? const Color(0xFFF0FDF4)
                                  : const Color(0xFFFEF2F2),
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(
                                color: message.toLowerCase().contains('welcome')
                                    ? const Color(0xFFBBF7D0)
                                    : const Color(0xFFFECACA),
                              ),
                            ),
                            child: Row(
                              children: [
                                Icon(
                                  message.toLowerCase().contains('welcome')
                                      ? Icons.check_circle_rounded
                                      : Icons.error_rounded,
                                  color: message.toLowerCase().contains('welcome')
                                      ? const Color(0xFF16A34A)
                                      : const Color(0xFFDC2626),
                                  size: 20,
                                ),
                                const SizedBox(width: 12),
                                Expanded(
                                  child: Text(
                                    message,
                                    style: GoogleFonts.inter(
                                      color: message.toLowerCase().contains('welcome')
                                          ? const Color(0xFF166534)
                                          : const Color(0xFF991B1B),
                                      fontSize: 13,
                                      fontWeight: FontWeight.w500,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ),
                        ],
                      ],
                    ),
                  ),
                  const SizedBox(height: 48),

                  Text(
                    '© 2026 SNS Academy ERP · Empowering Education Through Design Thinking',
                    textAlign: TextAlign.center,
                    style: GoogleFonts.inter(
                      color: const Color(0xFF94A3B8),
                      fontSize: 11,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                  const SizedBox(height: 24),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildLabel(String text) {
    return Text(
      text,
      style: GoogleFonts.inter(
        color: const Color(0xFF4A5568),
        fontWeight: FontWeight.w700,
        fontSize: 12,
        letterSpacing: 0.5,
      ),
    );
  }

  InputDecoration _buildInputDecoration(String hint) {
    return InputDecoration(
      hintText: hint,
      hintStyle: GoogleFonts.inter(color: const Color(0xFF94A3B8), fontSize: 15),
      filled: true,
      fillColor: const Color(0xFFF8FAFC),
      contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(16),
        borderSide: const BorderSide(color: Color(0xFFE2E8F0)),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(16),
        borderSide: const BorderSide(color: Color(0xFFFF7F50), width: 2),
      ),
      errorBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(16),
        borderSide: const BorderSide(color: Color(0xFFEF4444)),
      ),
    );
  }
}
