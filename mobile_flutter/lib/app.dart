import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:local_auth/local_auth.dart';

import 'core/constants/app_roles.dart';
import 'core/models/auth_session.dart';
import 'features/auth/data/auth_api_service.dart';
import 'features/auth/data/auth_storage_service.dart';
import 'features/auth/presentation/login_screen.dart';
import 'features/dashboard/presentation/dashboard_screen.dart';
import 'features/parent_dashboard/presentation/parent_dashboard_screen.dart';

class SnsErpApp extends StatefulWidget {
  const SnsErpApp({super.key});

  @override
  State<SnsErpApp> createState() => _SnsErpAppState();
}

class _SnsErpAppState extends State<SnsErpApp> {
  final AuthApiService _authApiService = const AuthApiService();
  final AuthStorageService _authStorageService = AuthStorageService();
  final LocalAuthentication _localAuth = LocalAuthentication();

  AuthSession? _session;
  bool _isBootstrapping = true;
  bool _isSubmitting = false;
  bool _isBiometricLocked = false;
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

      final isBiometricsEnabled = await _authStorageService.getBiometricsEnabled();

      setState(() {
        _session = AuthSession(
          accessToken: storedSession.accessToken,
          refreshToken: storedSession.refreshToken,
          expiresIn: storedSession.expiresIn,
          user: user,
        );
        _isBootstrapping = false;
        if (isBiometricsEnabled) {
          _isBiometricLocked = true;
        }
      });

      if (isBiometricsEnabled) {
        _promptBiometrics();
      }

    } catch (_) {
      try {
        final refreshedSession = await _authApiService.refresh(
          refreshToken: storedSession.refreshToken,
        );
        await _authStorageService.saveSession(refreshedSession);
        
        final isBiometricsEnabled = await _authStorageService.getBiometricsEnabled();

        setState(() {
          _session = refreshedSession;
          _isBootstrapping = false;
          if (isBiometricsEnabled) {
            _isBiometricLocked = true;
          }
        });

        if (isBiometricsEnabled) {
          _promptBiometrics();
        }

      } catch (_) {
        await _authStorageService.clearSession();
        setState(() {
          _session = null;
          _isBootstrapping = false;
        });
      }
    }
  }

  Future<void> _promptBiometrics() async {
    try {
      final didAuthenticate = await _localAuth.authenticate(
        localizedReason: 'Unlock SNS ERP',
        biometricOnly: false,
        persistAcrossBackgrounding: true,
      );
      if (didAuthenticate) {
        setState(() {
          _isBiometricLocked = false;
        });
      }
    } on PlatformException catch (_) {
      // Handle error quietly or let them retry
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

      if (nextSession.user.role != AppRoles.teacher && nextSession.user.role != AppRoles.parent) {
        throw Exception(
          'This account belongs to the web dashboard. Please use a teacher or parent login for the mobile app.',
        );
      }

      await _authStorageService.saveSession(nextSession);
      
      final isBiometricsEnabled = await _authStorageService.getBiometricsEnabled();

      setState(() {
        _session = nextSession;
        _message = 'Welcome back, ${nextSession.user.name}.';
        if (isBiometricsEnabled) {
          _isBiometricLocked = true;
        }
      });

      if (isBiometricsEnabled) {
        _promptBiometrics();
      }

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
          'Use the teacher or parent account to access the mobile app.';
      _isBiometricLocked = false;
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
              : _isBiometricLocked
                  ? _LockScreen(onUnlock: _promptBiometrics, onLogout: _logout)
                  : _session!.user.role == AppRoles.parent
                      ? ParentDashboardScreen(
                          session: _session!,
                          onLogout: _logout,
                        )
                      : DashboardScreen(
                          session: _session!,
                          onLogout: _logout,
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

class _LockScreen extends StatelessWidget {
  final VoidCallback onUnlock;
  final VoidCallback onLogout;

  const _LockScreen({required this.onUnlock, required this.onLogout});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.lock, size: 80, color: Color(0xFFFF7F50)),
            const SizedBox(height: 24),
            const Text(
              'App Locked',
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            const Text(
              'Verify your identity to continue',
              style: TextStyle(color: Colors.grey),
            ),
            const SizedBox(height: 48),
            ElevatedButton.icon(
              onPressed: onUnlock,
              icon: const Icon(Icons.fingerprint),
              label: const Text('Unlock'),
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFFFF7F50),
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 12),
              ),
            ),
            const SizedBox(height: 24),
            TextButton(
              onPressed: onLogout,
              child: const Text('Sign Out', style: TextStyle(color: Colors.grey)),
            )
          ],
        ),
      ),
    );
  }
}
