import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../services/api_service.dart';
import '../services/auth_service.dart';
import '../services/biometric_service.dart';
import '../models/user_model.dart';
import '../services/notification_service.dart';

final apiServiceProvider = Provider((ref) => ApiService());
final biometricServiceProvider = Provider((ref) => BiometricService());

final authServiceProvider = Provider((ref) {
  final apiService = ref.watch(apiServiceProvider);
  return AuthService(apiService);
});

final notificationServiceProvider = Provider((ref) {
  final apiService = ref.watch(apiServiceProvider);
  return NotificationService(apiService);
});

final authStateProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  final authService = ref.watch(authServiceProvider);
  final biometricService = ref.watch(biometricServiceProvider);
  final notificationService = ref.watch(notificationServiceProvider);
  return AuthNotifier(authService, biometricService, notificationService);
});

enum AuthStatus { initial, loading, authenticated, unauthenticated, error }

class AuthState {
  final AuthStatus status;
  final UserModel? user;
  final String? errorMessage;

  AuthState({required this.status, this.user, this.errorMessage});

  factory AuthState.initial() => AuthState(status: AuthStatus.initial);
}

class AuthNotifier extends StateNotifier<AuthState> {
  final AuthService _authService;
  final BiometricService _biometricService;
  final NotificationService _notificationService;

  AuthNotifier(this._authService, this._biometricService, this._notificationService) : super(AuthState.initial());

  Future<void> login(String email, String password) async {
    state = AuthState(status: AuthStatus.loading);
    try {
      final user = await _authService.login(email, password);
      if (user.role == UserRole.admin) {
        state = AuthState(
          status: AuthStatus.error,
          errorMessage: 'Admin accounts must use the web dashboard. Please use a teacher or parent login.',
        );
        return;
      }
      state = AuthState(status: AuthStatus.authenticated, user: user);
      await _notificationService.initialize();
      await _notificationService.registerToken();
    } catch (e) {
      state = AuthState(status: AuthStatus.error, errorMessage: e.toString());
    }
  }

  Future<void> logout() async {
    await _authService.logout();
    state = AuthState(status: AuthStatus.unauthenticated);
  }

  Future<void> checkAuth() async {
    final user = await _authService.getCurrentUser();
    if (user != null) {
      state = AuthState(status: AuthStatus.authenticated, user: user);
      await _notificationService.initialize();
      await _notificationService.registerToken();
    } else {
      state = AuthState(status: AuthStatus.unauthenticated);
    }
  }

  Future<void> authenticateWithBiometrics() async {
    final isAvailable = await _biometricService.isAvailable();
    if (!isAvailable) return;

    final success = await _biometricService.authenticate();
    if (success) {
      // If biometrics succeed, we still need a valid session
      final user = await _authService.getCurrentUser();
      if (user != null) {
        state = AuthState(status: AuthStatus.authenticated, user: user);
      }
    }
  }
}
