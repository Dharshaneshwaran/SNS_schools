import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../../../core/theme/app_theme.dart';
import '../../../../../core/providers/services_providers.dart';

class SubstitutionsScreen extends ConsumerStatefulWidget {
  const SubstitutionsScreen({super.key});

  @override
  ConsumerState<SubstitutionsScreen> createState() => _SubstitutionsScreenState();
}

class _SubstitutionsScreenState extends ConsumerState<SubstitutionsScreen> with SingleTickerProviderStateMixin {
  late TabController _tabs;

  @override
  void initState() {
    super.initState();
    _tabs = TabController(length: 3, vsync: this);
  }

  @override
  void dispose() {
    _tabs.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final textColor = isDark ? DarkAppColors.textPrimary : AppColors.textPrimary;
    final bg = isDark ? DarkAppColors.background : AppColors.background;
    final cardColor = isDark ? DarkAppColors.card : AppColors.card;
    final borderColor = isDark ? DarkAppColors.border : AppColors.border;
    final subsAsync = ref.watch(substitutionsDataProvider);

    return Scaffold(
      backgroundColor: bg,
      appBar: AppBar(
        backgroundColor: cardColor,
        elevation: 0,
        title: Text('Substitutions', style: GoogleFonts.poppins(fontSize: 18, fontWeight: FontWeight.w800, color: textColor)),
        actions: [
          IconButton(icon: Icon(Icons.refresh, color: AppColors.primary), onPressed: () => ref.invalidate(substitutionsDataProvider)),
        ],
        bottom: TabBar(
          controller: _tabs,
          labelColor: AppColors.primary,
          unselectedLabelColor: isDark ? DarkAppColors.textSecondary : AppColors.textSecondary,
          indicatorColor: AppColors.primary,
          labelStyle: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w700),
          tabs: const [Tab(text: 'Pending'), Tab(text: 'Emergency'), Tab(text: 'Assigned')],
        ),
      ),
      body: subsAsync.when(
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (_, __) => _buildFallback(isDark, textColor, cardColor, borderColor),
        data: (data) => _buildTabViews(data.pending, data.emergency, data.autoAssigned, isDark, textColor, cardColor, borderColor),
      ),
    );
  }

  Widget _buildFallback(bool isDark, Color textColor, Color cardColor, Color borderColor) {
    final pending = [
      {'absent': 'Mrs. Lakshmi', 'class': '8-A', 'period': '3rd Period', 'subject': 'Mathematics', 'substitute': 'Mr. Rajan'},
      {'absent': 'Mr. Kumar', 'class': '9-B', 'period': '5th Period', 'subject': 'Science', 'substitute': 'Mrs. Priya'},
    ];
    final emergency = [
      {'absent': 'Ms. Meena', 'class': '10-A', 'period': '1st Period', 'subject': 'English', 'substitute': null},
    ];
    final assigned = [
      {'absent': 'Mr. Vimal', 'class': '7-C', 'period': '2nd Period', 'subject': 'Social', 'substitute': 'Ms. Kavitha'},
    ];
    return _buildTabViews(pending, emergency, assigned, isDark, textColor, cardColor, borderColor);
  }

  Widget _buildTabViews(List pending, List emergency, List assigned, bool isDark, Color textColor, Color cardColor, Color borderColor) {
    return TabBarView(
      controller: _tabs,
      children: [
        _SubList(items: pending, type: 'pending', isDark: isDark, textColor: textColor, cardColor: cardColor, borderColor: borderColor),
        _SubList(items: emergency, type: 'emergency', isDark: isDark, textColor: textColor, cardColor: cardColor, borderColor: borderColor),
        _SubList(items: assigned, type: 'assigned', isDark: isDark, textColor: textColor, cardColor: cardColor, borderColor: borderColor),
      ],
    );
  }
}

class _SubList extends StatelessWidget {
  final List items;
  final String type;
  final bool isDark;
  final Color textColor, cardColor, borderColor;

  const _SubList({required this.items, required this.type, required this.isDark, required this.textColor, required this.cardColor, required this.borderColor});

  @override
  Widget build(BuildContext context) {
    final textSecondary = isDark ? DarkAppColors.textSecondary : AppColors.textSecondary;
    if (items.isEmpty) {
      return Center(child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.swap_horiz, size: 48, color: textSecondary),
          const SizedBox(height: 12),
          Text('No ${type} substitutions', style: GoogleFonts.inter(fontSize: 14, color: textSecondary)),
        ],
      ));
    }

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: items.length,
      itemBuilder: (_, i) {
        final sub = items[i] as Map<String, dynamic>;
        final color = type == 'emergency' ? AppColors.error : type == 'pending' ? const Color(0xFFF59E0B) : AppColors.success;
        final substitute = sub['substitute'];

        return Container(
          margin: const EdgeInsets.only(bottom: 10),
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            color: cardColor,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: color.withValues(alpha: 0.2)),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                    decoration: BoxDecoration(color: color.withValues(alpha: 0.12), borderRadius: BorderRadius.circular(8)),
                    child: Text(type.toUpperCase(), style: GoogleFonts.inter(fontSize: 10, fontWeight: FontWeight.w800, color: color)),
                  ),
                  const Spacer(),
                  Text(sub['period'] as String? ?? '', style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w700, color: textColor)),
                ],
              ),
              const SizedBox(height: 10),
              Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Absent: ${sub['absent'] ?? ''}', style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w700, color: textColor)),
                        Text('${sub['class'] ?? ''} • ${sub['subject'] ?? ''}', style: GoogleFonts.inter(fontSize: 12, color: textSecondary)),
                      ],
                    ),
                  ),
                  if (substitute != null)
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        Text('Sub:', style: GoogleFonts.inter(fontSize: 11, color: textSecondary)),
                        Text(substitute as String, style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w700, color: AppColors.success)),
                      ],
                    )
                  else if (type != 'assigned')
                    ElevatedButton(
                      onPressed: () {},
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.primary,
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                        minimumSize: Size.zero,
                      ),
                      child: Text('Assign', style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w700, color: Colors.white)),
                    ),
                ],
              ),
            ],
          ),
        );
      },
    );
  }
}
