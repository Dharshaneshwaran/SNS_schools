import 'api_service.dart';

class AppNotification {
  final String id;
  final String title;
  final String message;
  final String type;
  final bool isRead;
  final String createdAt;

  AppNotification({required this.id, required this.title, required this.message, required this.type, required this.isRead, required this.createdAt});

  factory AppNotification.fromJson(Map<String, dynamic> j) => AppNotification(
    id: j['id']?.toString() ?? '',
    title: j['title'] ?? '',
    message: j['message'] ?? '',
    type: j['type'] ?? 'info',
    isRead: j['isRead'] ?? false,
    createdAt: j['createdAt'] ?? '',
  );

  AppNotification copyWith({bool? isRead}) => AppNotification(
    id: id, title: title, message: message, type: type,
    isRead: isRead ?? this.isRead, createdAt: createdAt,
  );
}

class NotificationsService {
  final ApiService _api;
  NotificationsService(this._api);

  Future<List<AppNotification>> getNotifications() async {
    final res = await _api.get('/notifications');
    final data = res.data;
    if (data is List) return data.map((e) => AppNotification.fromJson(e)).toList();
    return [];
  }

  Future<void> markAsRead(String id) async {
    await _api.patch('/notifications/$id/read');
  }

  Future<void> markAllRead() async {
    await _api.post('/notifications/read-all');
  }
}
