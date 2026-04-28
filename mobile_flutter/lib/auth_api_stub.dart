import 'auth_api.dart';

Future<LoginResponse> loginRequest({
  required String apiBaseUrl,
  required String email,
  required String password,
}) {
  throw UnsupportedError('This platform does not support login requests.');
}
