import '../../../../core/services/api_service.dart';

class AppNotification {
  final String id;
  final String title;
  final String message;
  final String type;
  final bool isRead;
  final DateTime createdAt;

  AppNotification({
    required this.id,
    required this.title,
    required this.message,
    required this.type,
    required this.isRead,
    required this.createdAt,
  });

  factory AppNotification.fromJson(Map<String, dynamic> json) {
    return AppNotification(
      id: json['id'],
      title: json['title'],
      message: json['message'],
      type: json['type'],
      isRead: json['isRead'],
      createdAt: DateTime.parse(json['createdAt']),
    );
  }
}

class NotificationService {
  final ApiService _apiService = ApiService();

  Future<List<AppNotification>> getNotifications() async {
    try {
      final response = await _apiService.get('/notifications');
      final List<dynamic> data = response.data;
      return data.map((json) => AppNotification.fromJson(json)).toList();
    } catch (e) {
      rethrow;
    }
  }

  Future<void> markAsRead(String id) async {
    try {
      await _apiService.patch('/notifications/$id/read');
    } catch (e) {
      rethrow;
    }
  }

  Future<void> markAllAsRead() async {
    try {
      await _apiService.post('/notifications/read-all');
    } catch (e) {
      rethrow;
    }
  }
}
