import 'dart:convert';
import 'dart:html' as html;

import 'auth_api.dart';

Future<LoginResponse> loginRequest({
  required String apiBaseUrl,
  required String email,
  required String password,
}) async {
  final response = await html.HttpRequest.request(
    '$apiBaseUrl/auth/login',
    method: 'POST',
    sendData: jsonEncode({
      'email': email,
      'password': password,
    }),
    requestHeaders: {
      'Content-Type': 'application/json',
    },
  );

  final decoded = jsonDecode(response.responseText ?? '{}');

  if (response.status != 200) {
    throw Exception(_extractErrorMessage(decoded));
  }

  return LoginResponse(
    accessToken: decoded['accessToken'] as String? ?? '',
    userEmail: decoded['user']?['email'] as String? ?? email,
    userName: decoded['user']?['name'] as String? ?? 'User',
  );
}

String _extractErrorMessage(dynamic decoded) {
  if (decoded is Map<String, dynamic>) {
    final message = decoded['message'];

    if (message is String && message.isNotEmpty) {
      return message;
    }
  }

  return 'Login failed.';
}
