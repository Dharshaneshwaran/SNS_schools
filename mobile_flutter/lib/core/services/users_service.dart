import 'api_service.dart';

class DashboardUser {
  final String id;
  final String name;
  final String email;
  final String role;
  final String department;
  final String status;

  DashboardUser({required this.id, required this.name, required this.email, required this.role, required this.department, required this.status});

  factory DashboardUser.fromJson(Map<String, dynamic> j) => DashboardUser(
    id: j['id']?.toString() ?? '',
    name: j['name'] ?? '',
    email: j['email'] ?? '',
    role: j['role'] ?? '',
    department: j['department'] ?? '',
    status: j['status'] ?? '',
  );
}

class UsersService {
  final ApiService _api;
  UsersService(this._api);

  Future<List<DashboardUser>> getUsers() async {
    final res = await _api.get('/users');
    final data = res.data;
    if (data is List) return data.map((e) => DashboardUser.fromJson(e)).toList();
    return [];
  }

  Future<void> createTeacher(Map<String, dynamic> data) async {
    await _api.post('/users/teacher', data: data);
  }

  Future<void> createStudent(Map<String, dynamic> data) async {
    await _api.post('/users/student', data: data);
  }

  Future<void> deleteUser(String id) async {
    await _api.delete('/users/$id');
  }
}
