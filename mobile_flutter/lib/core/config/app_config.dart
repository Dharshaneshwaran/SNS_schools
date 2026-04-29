class AppConfig {
  static const apiBaseUrl = String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: 'http://10.0.2.2:5000',
  );

  static const defaultEmail = String.fromEnvironment(
    'DEMO_USER_EMAIL',
    defaultValue: 'teacher@sns-erp.local',
  );

  static const defaultPassword = String.fromEnvironment(
    'DEMO_USER_PASSWORD',
    defaultValue: 'ChangeMe123!',
  );
}
