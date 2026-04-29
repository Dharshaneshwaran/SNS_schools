import 'package:flutter/material.dart';

import 'core/constants/app_roles.dart';
import 'core/models/auth_session.dart';
import 'features/auth/data/auth_api_service.dart';
import 'features/auth/data/auth_storage_service.dart';
import 'features/auth/presentation/login_screen.dart';
import 'features/dashboard/presentation/dashboard_screen.dart';

class SnsErpApp extends StatefulWidget {
  const SnsErpApp({super.key});

  @override
  State<SnsErpApp> createState() => _SnsErpAppState();
}

class _SnsErpAppState extends State<SnsErpApp> {
  final AuthApiService _authApiService = const AuthApiService();
  final AuthStorageService _authStorageService = AuthStorageService();

  AuthSession? _session;
  bool _isBootstrapping = true;
  bool _isSubmitting = false;
  String _message =
      'Use the teacher account to access the mobile dashboard foundation.';

  @override
  void initState() {
    super.initState();
    _bootstrapSession();
  }

  Future<void> _bootstrapSession() async {
    final storedSession = await _authStorageService.readSession();

    if (storedSession == null) {
      setState(() {
        _isBootstrapping = false;
      });
      return;
    }

    try {
      final user = await _authApiService.me(
        accessToken: storedSession.accessToken,
      );

      setState(() {
        _session = AuthSession(
          accessToken: storedSession.accessToken,
          refreshToken: storedSession.refreshToken,
          expiresIn: storedSession.expiresIn,
          user: user,
        );
        _isBootstrapping = false;
      });
    } catch (_) {
      try {
        final refreshedSession = await _authApiService.refresh(
          refreshToken: storedSession.refreshToken,
        );
        await _authStorageService.saveSession(refreshedSession);
        setState(() {
          _session = refreshedSession;
          _isBootstrapping = false;
        });
      } catch (_) {
        await _authStorageService.clearSession();
        setState(() {
          _session = null;
          _isBootstrapping = false;
        });
      }
    }
  }

  Future<void> _handleLogin(String email, String password) async {
    setState(() {
      _isSubmitting = true;
      _message = 'Signing in...';
    });

    try {
      final nextSession = await _authApiService.login(
        email: email,
        password: password,
      );

      if (nextSession.user.role != AppRoles.teacher) {
        throw Exception(
          'This account belongs to the web dashboard. Please use a teacher login for the mobile app.',
        );
      }

      await _authStorageService.saveSession(nextSession);
      setState(() {
        _session = nextSession;
        _message = 'Welcome back, ${nextSession.user.name}.';
      });
    } catch (error) {
      setState(() {
        _message = error.toString().replaceFirst('Exception: ', '');
      });
    } finally {
      setState(() {
        _isSubmitting = false;
      });
    }
  }

  Future<void> _logout() async {
    await _authStorageService.clearSession();
    setState(() {
      _session = null;
      _message =
          'Use the teacher account to access the mobile dashboard foundation.';
    });
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'SNS ERP',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF0F766E),
          brightness: Brightness.light,
        ),
        scaffoldBackgroundColor: const Color(0xFFF4EFE6),
        useMaterial3: true,
      ),
      home: _isBootstrapping
          ? const _BootScreen()
          : _session == null
              ? LoginScreen(
                  isSubmitting: _isSubmitting,
                  message: _message,
                  onSubmit: _handleLogin,
                )
              : DashboardScreen(
                  session: _session!,
                  onLogout: () {
                    void _logout();
                  },
                ),
    );
  }
}

class _BootScreen extends StatelessWidget {
  const _BootScreen();

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: Center(
        child: CircularProgressIndicator(),
      ),
    );
  }
}
