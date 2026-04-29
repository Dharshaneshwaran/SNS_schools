import 'package:flutter/foundation.dart';

class AppConfig {
  static const _envUrl = String.fromEnvironment('API_BASE_URL');

  static String get apiBaseUrl {
    if (_envUrl.isNotEmpty) return _envUrl;
    
    if (kIsWeb) {
      return 'http://localhost:5000';
    } else {
      // Use 10.0.2.2 for Android emulator (maps to host's localhost).
      // For physical devices, replace with your computer's LAN IP.
      return 'http://10.0.2.2:5000';
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
