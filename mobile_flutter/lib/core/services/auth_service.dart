
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'api_service.dart';
import '../models/user_model.dart';

class AuthService {
  final ApiService _apiService;
  final FlutterSecureStorage _storage = const FlutterSecureStorage();

  AuthService(this._apiService);

  Future<UserModel> login(String email, String password) async {
    try {
      final response = await _apiService.post('/auth/login', data: {
        'email': email,
        'password': password,
      });

      final String token = response.data['access_token'];
      await _storage.write(key: 'jwt_token', value: token);
      
      final user = UserModel.fromJson(response.data['user']);
      return user;
    } catch (e) {
      rethrow;
    }
  }

  Future<void> logout() async {
    await _storage.delete(key: 'jwt_token');
  }

  Future<UserModel?> getCurrentUser() async {
    try {
      final token = await _storage.read(key: 'jwt_token');
      if (token == null) return null;

      final response = await _apiService.get('/auth/profile');
      return UserModel.fromJson(response.data);
    } catch (e) {
      return null;
    }
  }
}
