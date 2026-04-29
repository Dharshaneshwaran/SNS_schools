import 'package:flutter/material.dart';

import '../../../core/config/app_config.dart';
import '../../../shared/widgets/primary_action_button.dart';

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
    final theme = Theme.of(context);

    return Scaffold(
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24),
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 520),
              child: DecoratedBox(
                decoration: BoxDecoration(
                  color: Colors.white.withValues(alpha: 0.95),
                  borderRadius: BorderRadius.circular(32),
                  boxShadow: const [
                    BoxShadow(
                      color: Color(0x1A0F172A),
                      blurRadius: 40,
                      offset: Offset(0, 20),
                    ),
                  ],
                ),
                child: Padding(
                  padding: const EdgeInsets.all(28),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        'SNS ERP',
                        style: theme.textTheme.labelLarge?.copyWith(
                          color: const Color(0xFF0F766E),
                          letterSpacing: 3,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      const SizedBox(height: 16),
                      Text(
                        'Teacher sign in',
                        style: theme.textTheme.headlineMedium?.copyWith(
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                      const SizedBox(height: 10),
                      Text(
                        'Phase 1 mobile access is focused on teacher users with secure session persistence and a dashboard base.',
                        style: theme.textTheme.bodyMedium?.copyWith(
                          color: const Color(0xFF5B6470),
                          height: 1.5,
                        ),
                      ),
                      const SizedBox(height: 24),
                      _InfoRow(label: 'API', value: AppConfig.apiBaseUrl),
                      const SizedBox(height: 8),
                      _InfoRow(label: 'Teacher demo', value: AppConfig.defaultEmail),
                      const SizedBox(height: 24),
                      TextField(
                        controller: _emailController,
                        keyboardType: TextInputType.emailAddress,
                        decoration: const InputDecoration(
                          labelText: 'Email',
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.all(Radius.circular(18)),
                          ),
                        ),
                      ),
                      const SizedBox(height: 16),
                      TextField(
                        controller: _passwordController,
                        obscureText: true,
                        decoration: const InputDecoration(
                          labelText: 'Password',
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.all(Radius.circular(18)),
                          ),
                        ),
                      ),
                      const SizedBox(height: 20),
                      PrimaryActionButton(
                        isLoading: widget.isSubmitting,
                        label: 'Login',
                        onPressed: widget.isSubmitting ? null : _handleSubmit,
                      ),
                      const SizedBox(height: 18),
                      DecoratedBox(
                        decoration: BoxDecoration(
                          color: widget.message.toLowerCase().contains('welcome')
                              ? const Color(0xFFE8F7F2)
                              : const Color(0xFFFFF4E5),
                          borderRadius: BorderRadius.circular(18),
                        ),
                        child: Padding(
                          padding: const EdgeInsets.all(14),
                          child: Text(
                            widget.message,
                            style: theme.textTheme.bodyMedium?.copyWith(
                              color: const Color(0xFF5B6470),
                              height: 1.45,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}

class _InfoRow extends StatelessWidget {
  const _InfoRow({
    required this.label,
    required this.value,
  });

  final String label;
  final String value;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return RichText(
      text: TextSpan(
        style: theme.textTheme.bodyMedium?.copyWith(
          color: const Color(0xFF5B6470),
        ),
        children: [
          TextSpan(
            text: '$label: ',
            style: const TextStyle(fontWeight: FontWeight.w700),
          ),
          TextSpan(text: value),
        ],
      ),
    );
  }
}
