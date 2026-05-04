import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'core/theme/app_theme.dart';
import 'core/providers/auth_provider.dart';
import 'core/providers/theme_provider.dart';
import 'core/models/user_model.dart';
import 'features/auth/presentation/screens/role_selection_screen.dart';
import 'features/home/presentation/screens/home_screen.dart';
import 'features/home/presentation/screens/teacher_home_screen.dart';
import 'features/home/presentation/screens/admin_home_screen.dart';
import 'features/splash/presentation/screens/splash_screen.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  GoogleFonts.config.allowRuntimeFetching = false;
  runApp(const ProviderScope(child: SNSErpApp()));
}

class SNSErpApp extends ConsumerWidget {
  const SNSErpApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final themeMode = ref.watch(themeProvider);

    return MaterialApp(
      title: 'SNS ERP',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: themeMode,
      home: const SplashScreen(),
    );
  }
}

class AuthGate extends ConsumerStatefulWidget {
  const AuthGate({super.key});

  @override
  ConsumerState<AuthGate> createState() => _AuthGateState();
}

class _AuthGateState extends ConsumerState<AuthGate> {
  @override
  void initState() {
    super.initState();
    Future.microtask(() => ref.read(authStateProvider.notifier).checkAuth());
  }

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authStateProvider);

    if (authState.status == AuthStatus.initial || authState.status == AuthStatus.loading) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }

    if (authState.status == AuthStatus.authenticated && authState.user != null) {
      final user = authState.user!;
      switch (user.role) {
        case UserRole.admin:
          return const AdminHomeScreen();
        case UserRole.staff:
          return const TeacherHomeScreen();
        case UserRole.parent:
          return const HomeScreen();
      }
    }

    return const RoleSelectionScreen();
  }
}
