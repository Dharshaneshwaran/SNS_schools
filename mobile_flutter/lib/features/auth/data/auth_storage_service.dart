import 'dart:convert';

import 'package:flutter_secure_storage/flutter_secure_storage.dart';

import '../../../core/models/auth_session.dart';

class AuthStorageService {
  AuthStorageService()
    : _storage = const FlutterSecureStorage(),
      _sessionKey = 'sns_erp_auth_session';

  final FlutterSecureStorage _storage;
  final String _sessionKey;

  Future<void> saveSession(AuthSession session) async {
    await _storage.write(
      key: _sessionKey,
      value: jsonEncode(session.toJson()),
    );
  }

  Future<AuthSession?> readSession() async {
    final rawValue = await _storage.read(key: _sessionKey);

    if (rawValue == null || rawValue.isEmpty) {
      return null;
    }

    return AuthSession.fromJson(jsonDecode(rawValue) as Map<String, dynamic>);
  }

  Future<void> clearSession() {
    return _storage.delete(key: _sessionKey);
  }
}
