import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'core/theme/app_theme.dart';
import 'core/providers/auth_provider.dart';
import 'core/models/user_model.dart';
import 'features/auth/presentation/screens/login_screen.dart';
import 'features/admin/presentation/screens/admin_main_screen.dart';
import 'features/parent/presentation/screens/parent_main_screen.dart';

import 'features/auth/presentation/screens/splash_screen.dart';

import 'features/teacher/presentation/screens/teacher_main_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  // Disable runtime fetching to prevent 'Failed to fetch' errors if offline/blocked
  GoogleFonts.config.allowRuntimeFetching = false;
  runApp(const ProviderScope(child: SNSErpApp()));
}

class SNSErpApp extends ConsumerStatefulWidget {
  const SNSErpApp({super.key});

  @override
  ConsumerState<SNSErpApp> createState() => _SNSErpAppState();
}

class _SNSErpAppState extends ConsumerState<SNSErpApp> {
  bool _showSplash = true;

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authStateProvider);

    if (_showSplash) {
      return MaterialApp(
        title: 'SNS ERP',
        debugShowCheckedModeBanner: false,
        theme: AppTheme.darkTheme,
        home: SplashScreen(onComplete: () {
          if (mounted) setState(() => _showSplash = false);
        }),
      );
    }

    return MaterialApp(
      title: 'SNS ERP',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.darkTheme,
      home: _getHome(authState),
    );
  }

  Widget _getHome(AuthState authState) {
    if (authState.status == AuthStatus.authenticated) {
      if (authState.user?.role == UserRole.admin) {
        return const AdminMainScreen();
      } else if (authState.user?.role == UserRole.staff) {
        return const TeacherMainScreen();
      } else {
        return const ParentMainScreen();
      }
    }
    return const LoginScreen();
  }
}
