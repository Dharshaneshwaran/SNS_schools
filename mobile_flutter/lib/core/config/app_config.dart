import 'package:flutter/foundation.dart';

class AppConfig {
  static const _envUrl = String.fromEnvironment('API_BASE_URL');

  static String get apiBaseUrl {
    if (_envUrl.isNotEmpty) return _envUrl;
    
    if (kIsWeb) {
      return 'http://localhost:5000';
    } else {
      // Physical device: use your computer's current LAN IP (192.168.23.127)
      // Note: On college WiFi, client isolation might block this. Use a mobile hotspot if it fails.
      return 'http://192.168.23.127:5000';
    }
  }


  static const defaultEmail = String.fromEnvironment(
    'DEMO_USER_EMAIL',
    defaultValue: 'teacher@sns-erp.local',
  );

  static const defaultPassword = String.fromEnvironment(
    'DEMO_USER_PASSWORD',
    defaultValue: 'ChangeMe123!',
  );
}
