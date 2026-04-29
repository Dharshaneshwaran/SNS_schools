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

  Future<void> setBiometricsEnabled(bool enabled) async {
    await _storage.write(key: 'biometrics_enabled', value: enabled.toString());
  }

  Future<bool> getBiometricsEnabled() async {
    final value = await _storage.read(key: 'biometrics_enabled');
    return value == 'true';
  }

  Future<void> setDarkModeEnabled(bool enabled) async {
    await _storage.write(key: 'dark_mode_enabled', value: enabled.toString());
  }

  Future<bool> getDarkModeEnabled() async {
    final value = await _storage.read(key: 'dark_mode_enabled');
    return value == 'true';
  }

  Future<void> setLanguage(String language) async {
    await _storage.write(key: 'preferred_language', value: language);
  }

  Future<String> getLanguage() async {
    final value = await _storage.read(key: 'preferred_language');
    return value ?? 'English';
  }
}
