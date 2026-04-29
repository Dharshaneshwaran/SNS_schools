import 'package:flutter/foundation.dart';

class AppConfig {
  static const _envUrl = String.fromEnvironment('API_BASE_URL');

  static String get apiBaseUrl {
    if (_envUrl.isNotEmpty) return _envUrl;
    
    if (kIsWeb) {
      return 'http://127.0.0.1:5000';
    } else {
      // 172.20.10.5 is the current LAN IP of the host computer.
      // This allows physical devices and emulators on the same network to connect.
      return 'http://172.20.10.5:5000';
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
