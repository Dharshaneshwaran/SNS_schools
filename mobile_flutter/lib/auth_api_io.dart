import 'dart:convert';
import 'dart:io';

import 'auth_api.dart';

Future<LoginResponse> loginRequest({
  required String apiBaseUrl,
  required String email,
  required String password,
}) async {
  final client = HttpClient();

  try {
    final request = await client.postUrl(Uri.parse('$apiBaseUrl/auth/login'));
    request.headers.contentType = ContentType.json;
    request.write(jsonEncode({
      'email': email,
      'password': password,
    }));

    final response = await request.close();
    final responseBody = await utf8.decodeStream(response);
    final decoded = jsonDecode(responseBody);

    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw Exception(_extractErrorMessage(decoded));
    }

    return LoginResponse(
      accessToken: decoded['accessToken'] as String? ?? '',
      userEmail: decoded['user']?['email'] as String? ?? email,
      userName: decoded['user']?['name'] as String? ?? 'User',
    );
  } finally {
    client.close();
  }
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
