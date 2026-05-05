import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../services/messaging_service.dart';
import '../services/notifications_service.dart';
import '../services/dashboard_service.dart';
import '../services/users_service.dart';
import 'auth_provider.dart';

// Service providers
final messagingServiceProvider = Provider((ref) {
  final api = ref.watch(apiServiceProvider);
  return MessagingService(api);
});

final notificationsServiceProvider = Provider((ref) {
  final api = ref.watch(apiServiceProvider);
  return NotificationsService(api);
});

final dashboardServiceProvider = Provider((ref) {
  final api = ref.watch(apiServiceProvider);
  return DashboardService(api);
});

final usersServiceProvider = Provider((ref) {
  final api = ref.watch(apiServiceProvider);
  return UsersService(api);
});

// Notifications state
class NotificationsNotifier extends StateNotifier<AsyncValue<List<AppNotification>>> {
  final NotificationsService _service;
  NotificationsNotifier(this._service) : super(const AsyncValue.loading()) {
    load();
  }

  Future<void> load() async {
    state = const AsyncValue.loading();
    try {
      final items = await _service.getNotifications();
      state = AsyncValue.data(items);
    } catch (e, st) {
      state = AsyncValue.error(e, st);
    }
  }

  Future<void> markAsRead(String id) async {
    try {
      await _service.markAsRead(id);
      state = state.whenData((list) =>
        list.map((n) => n.id == id ? n.copyWith(isRead: true) : n).toList());
    } catch (_) {}
  }

  Future<void> markAllRead() async {
    try {
      await _service.markAllRead();
      state = state.whenData((list) => list.map((n) => n.copyWith(isRead: true)).toList());
    } catch (_) {}
  }
}

final notificationsProvider = StateNotifierProvider<NotificationsNotifier, AsyncValue<List<AppNotification>>>((ref) {
  final service = ref.watch(notificationsServiceProvider);
  return NotificationsNotifier(service);
});

// Conversations state
final conversationsProvider = FutureProvider<List<Contact>>((ref) async {
  final service = ref.watch(messagingServiceProvider);
  return service.getConversations();
});

// Message history state
final messageHistoryProvider = FutureProvider.family<List<Message>, String>((ref, recipientId) async {
  final service = ref.watch(messagingServiceProvider);
  return service.getHistory(recipientId);
});

// Groups state
final groupsProvider = FutureProvider<List<Group>>((ref) async {
  final service = ref.watch(messagingServiceProvider);
  return service.getGroups();
});

// Users state
final usersListProvider = FutureProvider<List<DashboardUser>>((ref) async {
  final service = ref.watch(usersServiceProvider);
  return service.getUsers();
});

// Dashboard overview
final dashboardOverviewProvider = FutureProvider((ref) async {
  final service = ref.watch(dashboardServiceProvider);
  return service.getOverview();
});

// Teachers data
final teachersDataProvider = FutureProvider((ref) async {
  final service = ref.watch(dashboardServiceProvider);
  return service.getTeachers();
});

// Timetable data
final timetableDataProvider = FutureProvider((ref) async {
  final service = ref.watch(dashboardServiceProvider);
  return service.getTimetable();
});

// Attendance data
final attendanceDataProvider = FutureProvider((ref) async {
  final service = ref.watch(dashboardServiceProvider);
  return service.getAttendance();
});

// Substitutions data
final substitutionsDataProvider = FutureProvider((ref) async {
  final service = ref.watch(dashboardServiceProvider);
  return service.getSubstitutions();
});

// Reports data
final reportsDataProvider = FutureProvider((ref) async {
  final service = ref.watch(dashboardServiceProvider);
  return service.getReports();
});
