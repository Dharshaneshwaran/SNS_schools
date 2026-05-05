import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../../../core/theme/app_theme.dart';
import '../../../../../core/providers/services_providers.dart';

class ReportsScreen extends ConsumerWidget {
  const ReportsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final textColor = isDark ? DarkAppColors.textPrimary : AppColors.textPrimary;
    final bg = isDark ? DarkAppColors.background : AppColors.background;
    final cardColor = isDark ? DarkAppColors.card : AppColors.card;
    final borderColor = isDark ? DarkAppColors.border : AppColors.border;
    final textSecondary = isDark ? DarkAppColors.textSecondary : AppColors.textSecondary;
    final reportsAsync = ref.watch(reportsDataProvider);

    final staticReports = [
      {'title': 'Attendance Report', 'desc': 'Monthly attendance summary', 'icon': Icons.people_outline, 'color': AppColors.primary, 'type': 'PDF'},
      {'title': 'Academic Performance', 'desc': 'Term-wise results analysis', 'icon': Icons.bar_chart, 'color': const Color(0xFF4F46E5), 'type': 'XLS'},
      {'title': 'Fee Collection Report', 'desc': 'Payment records & dues', 'icon': Icons.account_balance_wallet_outlined, 'color': AppColors.success, 'type': 'PDF'},
      {'title': 'Staff Report', 'desc': 'Teacher attendance & performance', 'icon': Icons.school_outlined, 'color': const Color(0xFFF59E0B), 'type': 'PDF'},
      {'title': 'Transport Report', 'desc': 'Bus routes & utilization', 'icon': Icons.directions_bus_outlined, 'color': const Color(0xFFEC4899), 'type': 'PDF'},
      {'title': 'Admission Report', 'desc': 'New admissions this year', 'icon': Icons.person_add_outlined, 'color': const Color(0xFF8B5CF6), 'type': 'PDF'},
    ];

    return Scaffold(
      backgroundColor: bg,
      appBar: AppBar(
        backgroundColor: cardColor,
        elevation: 0,
        title: Text('Reports', style: GoogleFonts.poppins(fontSize: 18, fontWeight: FontWeight.w800, color: textColor)),
        actions: [
          IconButton(icon: Icon(Icons.refresh, color: AppColors.primary), onPressed: () => ref.invalidate(reportsDataProvider)),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Highlights from API or static
            reportsAsync.when(
              loading: () => const SizedBox(),
              error: (_, __) => const SizedBox(),
              data: (data) {
                if (data.highlights.isEmpty) return const SizedBox();
                return Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Highlights', style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.w700, color: textColor)),
                    const SizedBox(height: 12),
                    ...data.highlights.take(3).map((h) {
                      final highlight = h as Map<String, dynamic>;
                      return Container(
                        margin: const EdgeInsets.only(bottom: 8),
                        padding: const EdgeInsets.all(14),
                        decoration: BoxDecoration(
                          color: AppColors.primary.withValues(alpha: 0.05),
                          borderRadius: BorderRadius.circular(14),
                          border: Border.all(color: AppColors.primary.withValues(alpha: 0.2)),
                        ),
                        child: Row(
                          children: [
                            Icon(Icons.trending_up, color: AppColors.primary),
                            const SizedBox(width: 10),
                            Expanded(child: Text('${highlight['text'] ?? highlight}', style: GoogleFonts.inter(fontSize: 13, color: textColor))),
                          ],
                        ),
                      );
                    }),
                    const SizedBox(height: 20),
                  ],
                );
              },
            ),
            Text('Available Reports', style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.w700, color: textColor)),
            const SizedBox(height: 12),
            ...staticReports.map((r) => _ReportTile(
              title: r['title'] as String,
              desc: r['desc'] as String,
              icon: r['icon'] as IconData,
              color: r['color'] as Color,
              type: r['type'] as String,
              isDark: isDark,
              textColor: textColor,
              cardColor: cardColor,
              borderColor: borderColor,
              textSecondary: textSecondary,
            )),
          ],
        ),
      ),
    );
  }
}

class _ReportTile extends StatelessWidget {
  final String title, desc, type;
  final IconData icon;
  final Color color, textColor, cardColor, borderColor, textSecondary;
  final bool isDark;

  const _ReportTile({required this.title, required this.desc, required this.icon, required this.color, required this.type, required this.isDark, required this.textColor, required this.cardColor, required this.borderColor, required this.textSecondary});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Generating $title...'), backgroundColor: color, duration: const Duration(seconds: 2)),
        );
      },
      child: Container(
        margin: const EdgeInsets.only(bottom: 10),
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(color: cardColor, borderRadius: BorderRadius.circular(16), border: Border.all(color: borderColor)),
        child: Row(
          children: [
            Container(
              width: 46, height: 46,
              decoration: BoxDecoration(color: color.withValues(alpha: 0.12), borderRadius: BorderRadius.circular(13)),
              child: Icon(icon, color: color, size: 22),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(title, style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w700, color: textColor)),
                  Text(desc, style: GoogleFonts.inter(fontSize: 12, color: textSecondary)),
                ],
              ),
            ),
            Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(color: color.withValues(alpha: 0.1), borderRadius: BorderRadius.circular(6)),
                  child: Text(type, style: GoogleFonts.inter(fontSize: 10, fontWeight: FontWeight.w700, color: color)),
                ),
                const SizedBox(height: 6),
                Icon(Icons.download_outlined, size: 18, color: color),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
