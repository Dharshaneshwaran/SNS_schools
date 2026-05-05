import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../../../core/theme/app_theme.dart';
import '../../../../../core/providers/services_providers.dart';

class StaffScreen extends ConsumerWidget {
  const StaffScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final textColor = isDark ? DarkAppColors.textPrimary : AppColors.textPrimary;
    final bg = isDark ? DarkAppColors.background : AppColors.background;
    final cardColor = isDark ? DarkAppColors.card : AppColors.card;
    final borderColor = isDark ? DarkAppColors.border : AppColors.border;
    final teachersAsync = ref.watch(teachersDataProvider);

    return Scaffold(
      backgroundColor: bg,
      appBar: AppBar(
        backgroundColor: cardColor,
        elevation: 0,
        title: Text('Staff & Teachers', style: GoogleFonts.poppins(fontSize: 18, fontWeight: FontWeight.w800, color: textColor)),
        actions: [
          IconButton(icon: Icon(Icons.refresh, color: AppColors.primary), onPressed: () => ref.invalidate(teachersDataProvider)),
        ],
      ),
      body: teachersAsync.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => _buildError(ref),
        data: (data) {
          final teachers = data.teachers;
          final summary = data.summary;

          return RefreshIndicator(
            onRefresh: () async => ref.invalidate(teachersDataProvider),
            color: AppColors.primary,
            child: CustomScrollView(
              slivers: [
                SliverToBoxAdapter(
                  child: Padding(
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Summary cards
                        Row(
                          children: [
                            _SummaryCard(label: 'Total Staff', value: '${summary['total'] ?? teachers.length}', color: AppColors.primary, icon: Icons.people, cardColor: cardColor, borderColor: borderColor, textColor: textColor),
                            const SizedBox(width: 12),
                            _SummaryCard(label: 'Active', value: '${summary['active'] ?? '-'}', color: AppColors.success, icon: Icons.check_circle_outline, cardColor: cardColor, borderColor: borderColor, textColor: textColor),
                          ],
                        ),
                        const SizedBox(height: 12),
                        Row(
                          children: [
                            _SummaryCard(label: 'Departments', value: '${summary['departments'] ?? '-'}', color: const Color(0xFF4F46E5), icon: Icons.domain, cardColor: cardColor, borderColor: borderColor, textColor: textColor),
                            const SizedBox(width: 12),
                            _SummaryCard(label: 'On Leave', value: '${summary['onLeave'] ?? '-'}', color: const Color(0xFFF59E0B), icon: Icons.event_busy, cardColor: cardColor, borderColor: borderColor, textColor: textColor),
                          ],
                        ),
                        const SizedBox(height: 20),
                        Text('All Staff', style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.w700, color: textColor)),
                        const SizedBox(height: 12),
                      ],
                    ),
                  ),
                ),
                if (teachers.isEmpty)
                  SliverToBoxAdapter(
                    child: Center(child: Padding(
                      padding: const EdgeInsets.all(32),
                      child: Text('No staff data found', style: GoogleFonts.inter(color: isDark ? DarkAppColors.textSecondary : AppColors.textSecondary)),
                    )),
                  )
                else
                  SliverList(
                    delegate: SliverChildBuilderDelegate(
                      (_, i) {
                        final t = teachers[i] as Map<String, dynamic>;
                        return _StaffTile(teacher: t, isDark: isDark, textColor: textColor, cardColor: cardColor, borderColor: borderColor);
                      },
                      childCount: teachers.length,
                    ),
                  ),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildError(WidgetRef ref) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.error_outline, size: 48, color: AppColors.error),
          const SizedBox(height: 12),
          Text('Failed to load staff data', style: GoogleFonts.inter(color: AppColors.error)),
          const SizedBox(height: 16),
          ElevatedButton(
            onPressed: () => ref.invalidate(teachersDataProvider),
            style: ElevatedButton.styleFrom(backgroundColor: AppColors.primary),
            child: const Text('Retry', style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
    );
  }
}

class _SummaryCard extends StatelessWidget {
  final String label, value;
  final Color color, cardColor, borderColor, textColor;
  final IconData icon;

  const _SummaryCard({required this.label, required this.value, required this.color, required this.icon, required this.cardColor, required this.borderColor, required this.textColor});

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(color: cardColor, borderRadius: BorderRadius.circular(16), border: Border.all(color: borderColor)),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Container(width: 36, height: 36, decoration: BoxDecoration(color: color.withValues(alpha: 0.12), borderRadius: BorderRadius.circular(10)), child: Icon(icon, size: 18, color: color)),
            const SizedBox(height: 10),
            Text(value, style: GoogleFonts.poppins(fontSize: 22, fontWeight: FontWeight.w900, color: textColor)),
            Text(label, style: GoogleFonts.inter(fontSize: 11, color: AppColors.textSecondary)),
          ],
        ),
      ),
    );
  }
}

class _StaffTile extends StatelessWidget {
  final Map<String, dynamic> teacher;
  final bool isDark;
  final Color textColor, cardColor, borderColor;

  const _StaffTile({required this.teacher, required this.isDark, required this.textColor, required this.cardColor, required this.borderColor});

  @override
  Widget build(BuildContext context) {
    final textSecondary = isDark ? DarkAppColors.textSecondary : AppColors.textSecondary;
    final name = teacher['name'] ?? '';
    final dept = teacher['department'] ?? '';
    final subjects = (teacher['subjects'] as List?)?.join(', ') ?? '';
    final status = teacher['status'] ?? 'active';
    final workload = teacher['workload'] ?? '';

    return Container(
      margin: const EdgeInsets.fromLTRB(16, 0, 16, 8),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(color: cardColor, borderRadius: BorderRadius.circular(16), border: Border.all(color: borderColor)),
      child: Row(
        children: [
          Container(
            width: 44, height: 44,
            decoration: BoxDecoration(
              gradient: const LinearGradient(colors: [Color(0xFFFF7F50), Color(0xFFE66A3E)]),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Center(child: Text(name.isNotEmpty ? name[0].toUpperCase() : '?',
                style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.w800, color: Colors.white))),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(name, style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w700, color: textColor)),
                if (dept.isNotEmpty) Text(dept, style: GoogleFonts.inter(fontSize: 12, color: AppColors.primary, fontWeight: FontWeight.w600)),
                if (subjects.isNotEmpty) Text(subjects, style: GoogleFonts.inter(fontSize: 11, color: textSecondary), maxLines: 1, overflow: TextOverflow.ellipsis),
                if (workload.isNotEmpty) Text(workload, style: GoogleFonts.inter(fontSize: 11, color: textSecondary)),
              ],
            ),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
            decoration: BoxDecoration(
              color: status == 'active' ? AppColors.success.withValues(alpha: 0.12) : AppColors.error.withValues(alpha: 0.12),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Text(status, style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.w700, color: status == 'active' ? AppColors.success : AppColors.error)),
          ),
        ],
      ),
    );
  }
}
