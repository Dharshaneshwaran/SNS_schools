import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../../core/providers/services_providers.dart';
import '../../../../core/services/notifications_service.dart';

class NotificationsScreen extends ConsumerWidget {
  const NotificationsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final textColor = isDark ? DarkAppColors.textPrimary : AppColors.textPrimary;
    final bg = isDark ? DarkAppColors.background : AppColors.background;
    final cardColor = isDark ? DarkAppColors.card : AppColors.card;
    final borderColor = isDark ? DarkAppColors.border : AppColors.border;
    final notificationsAsync = ref.watch(notificationsProvider);

    return Scaffold(
      backgroundColor: bg,
      body: SafeArea(
        child: Column(
          children: [
            // Header
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 12, 16, 8),
              child: Row(
                children: [
                  Text('Notifications', style: GoogleFonts.poppins(fontSize: 22, fontWeight: FontWeight.w800, color: textColor)),
                  const Spacer(),
                  if (notificationsAsync.valueOrNull?.any((n) => !n.isRead) == true)
                    TextButton(
                      onPressed: () => ref.read(notificationsProvider.notifier).markAllRead(),
                      child: Text('Mark all read', style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w700, color: AppColors.primary)),
                    ),
                ],
              ),
            ),
            Expanded(
              child: notificationsAsync.when(
                loading: () => const Center(child: CircularProgressIndicator()),
                error: (e, _) => _ErrorView(onRetry: () => ref.read(notificationsProvider.notifier).load()),
                data: (notifications) {
                  if (notifications.isEmpty) {
                    return _EmptyView(isDark: isDark);
                  }
                  return RefreshIndicator(
                    onRefresh: () => ref.read(notificationsProvider.notifier).load(),
                    color: AppColors.primary,
                    child: ListView.builder(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                      itemCount: notifications.length,
                      itemBuilder: (_, i) => _NotificationTile(
                        notification: notifications[i],
                        isDark: isDark,
                        textColor: textColor,
                        cardColor: cardColor,
                        borderColor: borderColor,
                        onTap: () {
                          if (!notifications[i].isRead) {
                            ref.read(notificationsProvider.notifier).markAsRead(notifications[i].id);
                          }
                        },
                      ),
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _NotificationTile extends StatelessWidget {
  final AppNotification notification;
  final bool isDark;
  final Color textColor, cardColor, borderColor;
  final VoidCallback onTap;

  const _NotificationTile({required this.notification, required this.isDark, required this.textColor, required this.cardColor, required this.borderColor, required this.onTap});

  Color get _typeColor {
    switch (notification.type) {
      case 'message': return AppColors.primary;
      case 'alert': return AppColors.error;
      default: return const Color(0xFF4F46E5);
    }
  }

  IconData get _typeIcon {
    switch (notification.type) {
      case 'message': return Icons.chat_bubble_outline;
      case 'alert': return Icons.warning_amber_outlined;
      default: return Icons.info_outline;
    }
  }

  @override
  Widget build(BuildContext context) {
    final textSecondary = isDark ? DarkAppColors.textSecondary : AppColors.textSecondary;
    final isRead = notification.isRead;

    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        margin: const EdgeInsets.only(bottom: 8),
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: isRead ? cardColor : _typeColor.withValues(alpha: 0.05),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: isRead ? borderColor : _typeColor.withValues(alpha: 0.2)),
          boxShadow: isRead ? null : [BoxShadow(color: _typeColor.withValues(alpha: 0.08), blurRadius: 8, offset: const Offset(0, 2))],
        ),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(
              width: 42, height: 42,
              decoration: BoxDecoration(color: _typeColor.withValues(alpha: 0.12), borderRadius: BorderRadius.circular(12)),
              child: Icon(_typeIcon, color: _typeColor, size: 20),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Expanded(
                        child: Text(notification.title,
                            style: GoogleFonts.inter(fontSize: 14, fontWeight: isRead ? FontWeight.w600 : FontWeight.w700, color: textColor)),
                      ),
                      if (!isRead)
                        Container(width: 8, height: 8, decoration: BoxDecoration(color: _typeColor, shape: BoxShape.circle)),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Text(notification.message, style: GoogleFonts.inter(fontSize: 12, color: textSecondary, height: 1.4)),
                  const SizedBox(height: 6),
                  Text(_formatTime(notification.createdAt), style: GoogleFonts.inter(fontSize: 11, color: textSecondary)),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  String _formatTime(String ts) {
    try {
      final dt = DateTime.parse(ts);
      final now = DateTime.now();
      final diff = now.difference(dt);
      if (diff.inMinutes < 60) return '${diff.inMinutes}m ago';
      if (diff.inHours < 24) return '${diff.inHours}h ago';
      return '${diff.inDays}d ago';
    } catch (_) {
      return ts;
    }
  }
}

class _EmptyView extends StatelessWidget {
  final bool isDark;
  const _EmptyView({required this.isDark});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.notifications_none, size: 64, color: isDark ? DarkAppColors.textSecondary : AppColors.textSecondary),
          const SizedBox(height: 12),
          Text('No notifications', style: GoogleFonts.inter(fontSize: 16, color: isDark ? DarkAppColors.textSecondary : AppColors.textSecondary)),
        ],
      ),
    );
  }
}

class _ErrorView extends StatelessWidget {
  final VoidCallback onRetry;
  const _ErrorView({required this.onRetry});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.error_outline, size: 48, color: AppColors.error),
          const SizedBox(height: 12),
          Text('Failed to load notifications', style: GoogleFonts.inter(color: AppColors.error)),
          const SizedBox(height: 16),
          ElevatedButton(onPressed: onRetry, style: ElevatedButton.styleFrom(backgroundColor: AppColors.primary),
              child: const Text('Retry', style: TextStyle(color: Colors.white))),
        ],
      ),
    );
  }
}
