import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../../../core/theme/app_theme.dart';

class AlumniScreen extends ConsumerStatefulWidget {
  const AlumniScreen({super.key});

  @override
  ConsumerState<AlumniScreen> createState() => _AlumniScreenState();
}

class _AlumniScreenState extends ConsumerState<AlumniScreen> {
  String _search = '';
  String _yearFilter = 'All';

  static final _alumni = [
    {'name': 'Ananya Krishnan', 'batch': '2020', 'degree': 'B.Tech CS', 'college': 'IIT Madras', 'city': 'Chennai'},
    {'name': 'Vikram Rajan', 'batch': '2021', 'degree': 'MBBS', 'college': 'AIIMS Delhi', 'city': 'Delhi'},
    {'name': 'Sneha Pillai', 'batch': '2019', 'degree': 'B.Com', 'college': 'Loyola College', 'city': 'Chennai'},
    {'name': 'Karthik Murugan', 'batch': '2022', 'degree': 'B.E EEE', 'college': 'PSG Tech', 'city': 'Coimbatore'},
    {'name': 'Divya Nair', 'batch': '2020', 'degree': 'BBA', 'college': 'SRM Institute', 'city': 'Chennai'},
    {'name': 'Praveen Kumar', 'batch': '2021', 'degree': 'B.Sc Physics', 'college': 'Presidency', 'city': 'Chennai'},
    {'name': 'Lavanya Suresh', 'batch': '2023', 'degree': 'B.Tech IT', 'college': 'VIT', 'city': 'Vellore'},
    {'name': 'Arun Prakash', 'batch': '2019', 'degree': 'CA', 'college': 'ICAI', 'city': 'Bangalore'},
  ];

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final textColor = isDark ? DarkAppColors.textPrimary : AppColors.textPrimary;
    final bg = isDark ? DarkAppColors.background : AppColors.background;
    final cardColor = isDark ? DarkAppColors.card : AppColors.card;
    final borderColor = isDark ? DarkAppColors.border : AppColors.border;
    final textSecondary = isDark ? DarkAppColors.textSecondary : AppColors.textSecondary;

    final batches = ['All', ..._alumni.map((a) => a['batch']!).toSet().toList()..sort()];
    final filtered = _alumni.where((a) {
      final matchSearch = _search.isEmpty || a['name']!.toLowerCase().contains(_search.toLowerCase());
      final matchYear = _yearFilter == 'All' || a['batch'] == _yearFilter;
      return matchSearch && matchYear;
    }).toList();

    return Scaffold(
      backgroundColor: bg,
      appBar: AppBar(
        backgroundColor: cardColor,
        elevation: 0,
        title: Text('Alumni Directory', style: GoogleFonts.poppins(fontSize: 18, fontWeight: FontWeight.w800, color: textColor)),
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 12, 16, 8),
            child: Column(
              children: [
                TextField(
                  onChanged: (v) => setState(() => _search = v),
                  style: GoogleFonts.inter(fontSize: 14, color: textColor),
                  decoration: InputDecoration(
                    hintText: 'Search alumni...',
                    hintStyle: GoogleFonts.inter(fontSize: 14, color: textSecondary),
                    prefixIcon: Icon(Icons.search, color: AppColors.primary, size: 20),
                    filled: true,
                    fillColor: isDark ? DarkAppColors.surface : AppColors.surface,
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: BorderSide.none),
                    contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                  ),
                ),
                const SizedBox(height: 10),
                SizedBox(
                  height: 36,
                  child: ListView(
                    scrollDirection: Axis.horizontal,
                    children: batches.map((b) {
                      final isSelected = _yearFilter == b;
                      return GestureDetector(
                        onTap: () => setState(() => _yearFilter = b),
                        child: Container(
                          margin: const EdgeInsets.only(right: 8),
                          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                          decoration: BoxDecoration(
                            color: isSelected ? AppColors.primary : (isDark ? DarkAppColors.surface : AppColors.surface),
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(color: isSelected ? AppColors.primary : borderColor),
                          ),
                          child: Text('Batch $b', style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w600, color: isSelected ? Colors.white : textSecondary)),
                        ),
                      );
                    }).toList(),
                  ),
                ),
              ],
            ),
          ),
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 0, 16, 8),
            child: Row(
              children: [
                Text('${filtered.length} alumni', style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w600, color: textSecondary)),
              ],
            ),
          ),
          Expanded(
            child: filtered.isEmpty
                ? Center(child: Text('No alumni found', style: GoogleFonts.inter(color: textSecondary)))
                : ListView.builder(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    itemCount: filtered.length,
                    itemBuilder: (_, i) => _AlumniTile(alumni: filtered[i], isDark: isDark, textColor: textColor, cardColor: cardColor, borderColor: borderColor),
                  ),
          ),
        ],
      ),
    );
  }
}

class _AlumniTile extends StatelessWidget {
  final Map<String, String> alumni;
  final bool isDark;
  final Color textColor, cardColor, borderColor;

  const _AlumniTile({required this.alumni, required this.isDark, required this.textColor, required this.cardColor, required this.borderColor});

  @override
  Widget build(BuildContext context) {
    final textSecondary = isDark ? DarkAppColors.textSecondary : AppColors.textSecondary;
    final name = alumni['name']!;
    final colors = [AppColors.primary, const Color(0xFF4F46E5), AppColors.success, const Color(0xFFF59E0B)];
    final color = colors[name.codeUnitAt(0) % colors.length];

    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(color: cardColor, borderRadius: BorderRadius.circular(16), border: Border.all(color: borderColor)),
      child: Row(
        children: [
          Container(
            width: 44, height: 44,
            decoration: BoxDecoration(color: color.withValues(alpha: 0.12), borderRadius: BorderRadius.circular(12)),
            child: Center(child: Text(name[0].toUpperCase(), style: GoogleFonts.poppins(fontSize: 18, fontWeight: FontWeight.w800, color: color))),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(name, style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w700, color: textColor)),
                Text('${alumni['college']} • ${alumni['degree']}', style: GoogleFonts.inter(fontSize: 12, color: textSecondary), maxLines: 1, overflow: TextOverflow.ellipsis),
                Text('${alumni['city']}', style: GoogleFonts.inter(fontSize: 11, color: textSecondary)),
              ],
            ),
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
            decoration: BoxDecoration(
              color: AppColors.primary.withValues(alpha: 0.1),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Column(
              children: [
                Text('BATCH', style: GoogleFonts.inter(fontSize: 8, fontWeight: FontWeight.w800, color: AppColors.primary)),
                Text(alumni['batch']!, style: GoogleFonts.poppins(fontSize: 13, fontWeight: FontWeight.w900, color: AppColors.primary)),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
