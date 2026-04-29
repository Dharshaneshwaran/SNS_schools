import 'dart:convert';

import 'package:http/http.dart' as http;

import '../../../core/config/app_config.dart';
import '../../../core/models/auth_session.dart';

class AuthApiService {
  const AuthApiService();

  Future<AuthSession> login({
    required String email,
    required String password,
  }) async {
    final response = await http.post(
      Uri.parse('${AppConfig.apiBaseUrl}/auth/login'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'email': email,
        'password': password,
      }),
    );

    final decoded = jsonDecode(response.body) as Map<String, dynamic>;

    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw Exception(_extractMessage(decoded));
    }

    return AuthSession.fromJson(decoded);
  }

  Future<AuthSession> refresh({
    required String refreshToken,
  }) async {
    final response = await http.post(
      Uri.parse('${AppConfig.apiBaseUrl}/auth/refresh'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'refreshToken': refreshToken,
      }),
    );

    final decoded = jsonDecode(response.body) as Map<String, dynamic>;

    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw Exception(_extractMessage(decoded));
    }

    return AuthSession.fromJson(decoded);
  }

  Future<AuthUser> me({
    required String accessToken,
  }) async {
    final response = await http.get(
      Uri.parse('${AppConfig.apiBaseUrl}/auth/me'),
      headers: {
        'Authorization': 'Bearer $accessToken',
      },
    );

    final decoded = jsonDecode(response.body) as Map<String, dynamic>;

    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw Exception(_extractMessage(decoded));
    }

    return AuthUser.fromJson(decoded);
  }

  Future<void> changePassword({
    required String accessToken,
    required String currentPassword,
    required String newPassword,
  }) async {
    final response = await http.post(
      Uri.parse('${AppConfig.apiBaseUrl}/auth/change-password'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $accessToken',
      },
      body: jsonEncode({
        'currentPassword': currentPassword,
        'newPassword': newPassword,
      }),
    );

    if (response.statusCode < 200 || response.statusCode >= 300) {
      final decoded = jsonDecode(response.body) as Map<String, dynamic>;
      throw Exception(_extractMessage(decoded));
    }
  }

  Future<AuthUser> updateProfile({
    required String accessToken,
    required String email,
    required String phone,
  }) async {
    final response = await http.patch(
      Uri.parse('${AppConfig.apiBaseUrl}/auth/profile'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $accessToken',
      },
      body: jsonEncode({
        'email': email,
        'phone': phone,
      }),
    );

    final decoded = jsonDecode(response.body) as Map<String, dynamic>;

    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw Exception(_extractMessage(decoded));
    }

    return AuthUser.fromJson(decoded);
  }

  String _extractMessage(Map<String, dynamic> decoded) {
    final message = decoded['message'];
    if (message is String && message.isNotEmpty) {
      return message;
    }

    return 'Request failed.';
  }
}
