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
      backgroundColor: Colors.white,
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
                      const Icon(Icons.school, color: Color(0xFFFF7F50), size: 34),
                      const SizedBox(width: 10),
                      Text(
                        'SNS',
                        style: theme.textTheme.headlineMedium?.copyWith(
                          color: const Color(0xFF2D3436),
                          fontWeight: FontWeight.w900,
                        ),
                      ),
                      const SizedBox(width: 4),
                      Text(
                        'Academy',
                        style: theme.textTheme.headlineMedium?.copyWith(
                          color: const Color(0xFFFF7F50),
                          fontWeight: FontWeight.w900,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 48),

                  // Card
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 36),
                    decoration: BoxDecoration(
                      color: Colors.white,
                      borderRadius: BorderRadius.circular(24),
                      border: Border.all(color: const Color(0xFFECEFF1)),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withValues(alpha: 0.06),
                          blurRadius: 30,
                          offset: const Offset(0, 12),
                        ),
                      ],
                    ),
                    child: Column(
                      children: [
                        Text(
                          'Access Dashboard',
                          style: theme.textTheme.headlineSmall?.copyWith(
                            color: const Color(0xFF2D3436),
                            fontWeight: FontWeight.bold,
                            letterSpacing: -0.5,
                          ),
                        ),
                        const SizedBox(height: 8),
                        const Text(
                          'Welcome back! Please select your role to continue.',
                          textAlign: TextAlign.center,
                          style: TextStyle(color: Color(0xFF636E72), fontSize: 14),
                        ),
                        const SizedBox(height: 32),

                        Row(
                          children: [
                            Expanded(
                              child: _WhiteRoleCard(
                                title: 'Teacher',
                                icon: Icons.present_to_all_outlined,
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
                      ],
                    ),
                  ),
                  const SizedBox(height: 40),

                  const Text(
                    '© 2026 SNS Academy ERP.\nEmpowering Education Through Design Thinking.',
                    textAlign: TextAlign.center,
                    style: TextStyle(color: Color(0xFFB0BEC5), fontSize: 10),
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
      body: Container(
        width: double.infinity,
        height: double.infinity,
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomRight,
            colors: [
              Color(0xFFFFFFFF),
              Color(0xFFFFF5F0),
              Color(0xFFFF7F50),
              Color(0xFF1A1A1A),
              Color(0xFF121212),
            ],
            stops: [0.0, 0.2, 0.45, 0.75, 1.0],
          ),
        ),
        child: SafeArea(
          child: Center(
            child: SingleChildScrollView(
              padding: const EdgeInsets.symmetric(horizontal: 24),
              child: ConstrainedBox(
                constraints: const BoxConstraints(maxWidth: 420),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    // Logo
                    Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Icon(Icons.school, color: Color(0xFFFF7F50), size: 34),
                        const SizedBox(width: 10),
                        Text(
                          'SNS',
                          style: theme.textTheme.headlineMedium?.copyWith(
                            color: const Color(0xFF2D3436),
                            fontWeight: FontWeight.w900,
                          ),
                        ),
                        const SizedBox(width: 4),
                        Text(
                          'Academy',
                          style: theme.textTheme.headlineMedium?.copyWith(
                            color: const Color(0xFFFF7F50),
                            fontWeight: FontWeight.w900,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 36),

                    // Glassmorphic card
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 22, vertical: 28),
                      decoration: BoxDecoration(
                        color: Colors.white.withValues(alpha: 0.92),
                        borderRadius: BorderRadius.circular(24),
                        border: Border.all(color: Colors.white.withValues(alpha: 0.6)),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withValues(alpha: 0.12),
                            blurRadius: 30,
                            offset: const Offset(0, 12),
                          ),
                        ],
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // Back button
                          GestureDetector(
                            onTap: onBack,
                            child: const Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Icon(Icons.arrow_back_rounded, color: Color(0xFF636E72), size: 18),
                                SizedBox(width: 6),
                                Text(
                                  'Back',
                                  style: TextStyle(
                                    color: Color(0xFF636E72),
                                    fontSize: 13,
                                    fontWeight: FontWeight.w500,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(height: 20),

                          // Title
                          Text(
                            selectedRole == 'teacher' ? 'Teacher Login' : 'Parent Login',
                            style: theme.textTheme.headlineSmall?.copyWith(
                              color: const Color(0xFF2D3436),
                              fontWeight: FontWeight.bold,
                              letterSpacing: -0.5,
                            ),
                          ),
                          const SizedBox(height: 6),
                          Text(
                            selectedRole == 'teacher'
                                ? 'Enter your email and password'
                                : 'Enter your mobile number and password',
                            style: const TextStyle(color: Color(0xFF636E72), fontSize: 13),
                          ),
                          const SizedBox(height: 28),

                          // Email/Mobile
                          Text(
                            selectedRole == 'teacher' ? 'Email Address' : 'Mobile Number',
                            style: const TextStyle(
                              color: Color(0xFF4A5568),
                              fontWeight: FontWeight.w600,
                              fontSize: 12,
                            ),
                          ),
                          const SizedBox(height: 6),
                          TextField(
                            controller: emailController,
                            style: const TextStyle(color: Color(0xFF2D3436), fontSize: 14),
                            keyboardType: selectedRole == 'teacher'
                                ? TextInputType.emailAddress
                                : TextInputType.phone,
                            decoration: InputDecoration(
                              hintText: selectedRole == 'teacher'
                                  ? 'teacher@sns-erp.local'
                                  : 'Enter mobile number',
                              hintStyle: const TextStyle(color: Color(0xFFB0BEC5), fontSize: 14),
                              filled: true,
                              fillColor: const Color(0xFFF8FAFC),
                              contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                              enabledBorder: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(10),
                                borderSide: const BorderSide(color: Color(0xFFE2E8F0)),
                              ),
                              focusedBorder: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(10),
                                borderSide: const BorderSide(color: Color(0xFFFF7F50), width: 1.5),
                              ),
                            ),
                          ),
                          const SizedBox(height: 20),

                          // Password
                          const Text(
                            'Password',
                            style: TextStyle(
                              color: Color(0xFF4A5568),
                              fontWeight: FontWeight.w600,
                              fontSize: 12,
                            ),
                          ),
                          const SizedBox(height: 6),
                          TextField(
                            controller: passwordController,
                            style: const TextStyle(color: Color(0xFF2D3436), fontSize: 14),
                            obscureText: obscurePassword,
                            decoration: InputDecoration(
                              hintText: '••••••••',
                              hintStyle: const TextStyle(color: Color(0xFFB0BEC5), fontSize: 14),
                              filled: true,
                              fillColor: const Color(0xFFF8FAFC),
                              contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                              suffixIcon: IconButton(
                                icon: Icon(
                                  obscurePassword
                                      ? Icons.visibility_off_outlined
                                      : Icons.visibility_outlined,
                                  color: const Color(0xFF94A3B8),
                                  size: 18,
                                ),
                                onPressed: onTogglePassword,
                              ),
                              enabledBorder: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(10),
                                borderSide: const BorderSide(color: Color(0xFFE2E8F0)),
                              ),
                              focusedBorder: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(10),
                                borderSide: const BorderSide(color: Color(0xFFFF7F50), width: 1.5),
                              ),
                            ),
                          ),
                          const SizedBox(height: 24),

                          // Sign In
                          SizedBox(
                            width: double.infinity,
                            height: 46,
                            child: ElevatedButton(
                              style: ElevatedButton.styleFrom(
                                backgroundColor: isSubmitting
                                    ? const Color(0xAAFF7F50)
                                    : const Color(0xFFFF7F50),
                                elevation: 3,
                                shadowColor: const Color(0xFFFF7F50).withValues(alpha: 0.3),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(12),
                                ),
                              ),
                              onPressed: isSubmitting ? null : onSubmit,
                              child: isSubmitting
                                  ? const SizedBox(
                                      width: 20,
                                      height: 20,
                                      child: CircularProgressIndicator(
                                        color: Colors.white,
                                        strokeWidth: 2,
                                      ),
                                    )
                                  : const Text(
                                      'Sign In',
                                      style: TextStyle(
                                        color: Colors.white,
                                        fontSize: 15,
                                        fontWeight: FontWeight.bold,
                                        letterSpacing: 0.5,
                                      ),
                                    ),
                            ),
                          ),

                          if (message.isNotEmpty) ...[
                            const SizedBox(height: 18),
                            Container(
                              width: double.infinity,
                              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                              decoration: BoxDecoration(
                                color: message.toLowerCase().contains('welcome')
                                    ? const Color(0xFFE8F5E9)
                                    : const Color(0xFFFEF2F2),
                                borderRadius: BorderRadius.circular(10),
                                border: Border.all(
                                  color: message.toLowerCase().contains('welcome')
                                      ? const Color(0xFF81C784)
                                      : const Color(0xFFFCA5A5),
                                ),
                              ),
                              child: Text(
                                message,
                                style: TextStyle(
                                  color: message.toLowerCase().contains('welcome')
                                      ? const Color(0xFF2E7D32)
                                      : const Color(0xFFC62828),
                                  fontSize: 12,
                                ),
                              ),
                            ),
                          ],
                        ],
                      ),
                    ),
                    const SizedBox(height: 32),

                    Text(
                      '© 2026 SNS Academy ERP.\nEmpowering Education Through Design Thinking.',
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        color: Colors.white.withValues(alpha: 0.6),
                        fontSize: 10,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
