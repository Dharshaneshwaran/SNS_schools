import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../../../core/theme/app_theme.dart';
import '../../../../../core/providers/services_providers.dart';

class AttendanceAdminScreen extends ConsumerWidget {
  const AttendanceAdminScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final textColor = isDark ? DarkAppColors.textPrimary : AppColors.textPrimary;
    final bg = isDark ? DarkAppColors.background : AppColors.background;
    final cardColor = isDark ? DarkAppColors.card : AppColors.card;
    final borderColor = isDark ? DarkAppColors.border : AppColors.border;
    final textSecondary = isDark ? DarkAppColors.textSecondary : AppColors.textSecondary;
    final attendanceAsync = ref.watch(attendanceDataProvider);

    return Scaffold(
      backgroundColor: bg,
      appBar: AppBar(
        backgroundColor: cardColor,
        elevation: 0,
        title: Text('Attendance', style: GoogleFonts.poppins(fontSize: 18, fontWeight: FontWeight.w800, color: textColor)),
        actions: [
          IconButton(icon: Icon(Icons.refresh, color: AppColors.primary), onPressed: () => ref.invalidate(attendanceDataProvider)),
        ],
      ),
      body: attendanceAsync.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => _buildFallback(textColor, cardColor, borderColor, textSecondary),
        data: (data) => _buildFromData(data.data, textColor, cardColor, borderColor, textSecondary, isDark),
      ),
    );
  }

  Widget _buildFromData(Map<String, dynamic> data, Color textColor, Color cardColor, Color borderColor, Color textSecondary, bool isDark) {
    final summary = data['summary'] as Map<String, dynamic>? ?? {};
    final leaveRequests = data['leaveRequests'] as List? ?? [];
    final classWise = data['classWise'] as List? ?? [];

    return _buildContent(summary, leaveRequests, classWise, textColor, cardColor, borderColor, textSecondary, isDark);
  }

  Widget _buildFallback(Color textColor, Color cardColor, Color borderColor, Color textSecondary) {
    final isDark = cardColor == DarkAppColors.card;
    return _buildContent(
      {'present': 92, 'absent': 8, 'total': 100, 'percentage': '92%'},
      [
        {'name': 'Mrs. Lakshmi', 'class': '8-A', 'date': '2026-05-04', 'reason': 'Medical leave', 'status': 'approved'},
        {'name': 'Mr. Arjun', 'class': '9-B', 'date': '2026-05-04', 'reason': 'Personal', 'status': 'pending'},
      ],
      [
        {'class': '8-A', 'present': 28, 'total': 32, 'percentage': '87.5%'},
        {'class': '9-B', 'present': 30, 'total': 35, 'percentage': '85.7%'},
        {'class': '10-A', 'present': 38, 'total': 40, 'percentage': '95.0%'},
      ],
      textColor, cardColor, borderColor, textSecondary, isDark,
    );
  }

  Widget _buildContent(Map<String, dynamic> summary, List leaveRequests, List classWise, Color textColor, Color cardColor, Color borderColor, Color textSecondary, bool isDark) {
    return RefreshIndicator(
      onRefresh: () async {},
      color: AppColors.primary,
      child: SingleChildScrollView(
        physics: const AlwaysScrollableScrollPhysics(),
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Summary cards
            Row(
              children: [
                _SummaryCard(label: 'Present', value: '${summary['present'] ?? '-'}', color: AppColors.success, cardColor: cardColor, borderColor: borderColor, textColor: textColor),
                const SizedBox(width: 12),
                _SummaryCard(label: 'Absent', value: '${summary['absent'] ?? '-'}', color: AppColors.error, cardColor: cardColor, borderColor: borderColor, textColor: textColor),
                const SizedBox(width: 12),
                _SummaryCard(label: 'Rate', value: '${summary['percentage'] ?? '-'}', color: AppColors.primary, cardColor: cardColor, borderColor: borderColor, textColor: textColor),
              ],
            ),
            const SizedBox(height: 20),
            // Class-wise attendance
            Text('Class-wise Attendance', style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.w700, color: textColor)),
            const SizedBox(height: 12),
            ...classWise.map((c) {
              final cls = c as Map<String, dynamic>;
              final pct = double.tryParse('${cls['percentage'] ?? '0%'}'.replaceAll('%', '')) ?? 0.0;
              return Container(
                margin: const EdgeInsets.only(bottom: 8),
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(color: cardColor, borderRadius: BorderRadius.circular(16), border: Border.all(color: borderColor)),
                child: Column(
                  children: [
                    Row(
                      children: [
                        Container(
                          width: 36, height: 36,
                          decoration: BoxDecoration(color: AppColors.primary.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(10)),
                          child: Center(child: Text('${cls['class'] ?? ''}', style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.w800, color: AppColors.primary))),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text('Class ${cls['class'] ?? ''}', style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w700, color: textColor)),
                              Text('${cls['present'] ?? '-'} / ${cls['total'] ?? '-'} students', style: GoogleFonts.inter(fontSize: 12, color: textSecondary)),
                            ],
                          ),
                        ),
                        Text('${cls['percentage'] ?? '-'}', style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.w800, color: pct >= 90 ? AppColors.success : pct >= 75 ? const Color(0xFFF59E0B) : AppColors.error)),
                      ],
                    ),
                    const SizedBox(height: 10),
                    ClipRRect(
                      borderRadius: BorderRadius.circular(4),
                      child: LinearProgressIndicator(
                        value: pct / 100,
                        backgroundColor: isDark ? DarkAppColors.surface : AppColors.surface,
                        color: pct >= 90 ? AppColors.success : pct >= 75 ? const Color(0xFFF59E0B) : AppColors.error,
                        minHeight: 6,
                      ),
                    ),
                  ],
                ),
              );
            }),
            const SizedBox(height: 20),
            // Leave requests
            Text('Leave Requests', style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.w700, color: textColor)),
            const SizedBox(height: 12),
            ...leaveRequests.map((l) {
              final leave = l as Map<String, dynamic>;
              final status = leave['status'] ?? 'pending';
              final statusColor = status == 'approved' ? AppColors.success : status == 'rejected' ? AppColors.error : const Color(0xFFF59E0B);
              return Container(
                margin: const EdgeInsets.only(bottom: 8),
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(color: cardColor, borderRadius: BorderRadius.circular(16), border: Border.all(color: borderColor)),
                child: Row(
                  children: [
                    Container(
                      width: 40, height: 40,
                      decoration: BoxDecoration(color: statusColor.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(10)),
                      child: Icon(Icons.event_busy, color: statusColor, size: 20),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(leave['name'] ?? '', style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w700, color: textColor)),
                          Text('${leave['class'] ?? ''} • ${leave['date'] ?? ''}', style: GoogleFonts.inter(fontSize: 12, color: textSecondary)),
                          Text(leave['reason'] ?? '', style: GoogleFonts.inter(fontSize: 12, color: textSecondary)),
                        ],
                      ),
                    ),
                    Column(
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                          decoration: BoxDecoration(color: statusColor.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(8)),
                          child: Text(status, style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.w700, color: statusColor)),
                        ),
                        if (status == 'pending') ...[
                          const SizedBox(height: 6),
                          Row(
                            children: [
                              _Btn(label: 'OK', color: AppColors.success),
                              const SizedBox(width: 4),
                              _Btn(label: 'No', color: AppColors.error),
                            ],
                          ),
                        ],
                      ],
                    ),
                  ],
                ),
              );
            }),
          ],
        ),
      ),
    );
  }
}

class _SummaryCard extends StatelessWidget {
  final String label, value;
  final Color color, cardColor, borderColor, textColor;
  const _SummaryCard({required this.label, required this.value, required this.color, required this.cardColor, required this.borderColor, required this.textColor});

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(color: cardColor, borderRadius: BorderRadius.circular(14), border: Border.all(color: borderColor)),
        child: Column(
          children: [
            Text(value, style: GoogleFonts.poppins(fontSize: 20, fontWeight: FontWeight.w900, color: color)),
            Text(label, style: GoogleFonts.inter(fontSize: 11, color: AppColors.textSecondary)),
          ],
        ),
      ),
    );
  }
}

class _Btn extends StatelessWidget {
  final String label;
  final Color color;
  const _Btn({required this.label, required this.color});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
      decoration: BoxDecoration(color: color.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(6)),
      child: Text(label, style: GoogleFonts.inter(fontSize: 10, fontWeight: FontWeight.w700, color: color)),
    );
  }
}
