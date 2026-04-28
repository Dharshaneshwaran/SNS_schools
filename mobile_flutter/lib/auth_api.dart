import 'auth_api_stub.dart'
    if (dart.library.io) 'auth_api_io.dart'
    if (dart.library.html) 'auth_api_web.dart' as impl;

class LoginResponse {
  const LoginResponse({
    required this.accessToken,
    required this.userEmail,
    required this.userName,
  });

  final String accessToken;
  final String userEmail;
  final String userName;
}

Future<LoginResponse> loginRequest({
  required String apiBaseUrl,
  required String email,
  required String password,
}) {
  return impl.loginRequest(
    apiBaseUrl: apiBaseUrl,
    email: email,
    password: password,
  );
}
