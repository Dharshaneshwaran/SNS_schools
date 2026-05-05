import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../../../core/theme/app_theme.dart';

class TransportAdminScreen extends ConsumerStatefulWidget {
  const TransportAdminScreen({super.key});

  @override
  ConsumerState<TransportAdminScreen> createState() => _TransportAdminScreenState();
}

class _TransportAdminScreenState extends ConsumerState<TransportAdminScreen> {
  int _selectedRoute = 0;

  static final _routes = [
    {
      'id': '7B',
      'bus': 'TN 33 Z 9901',
      'driver': 'Rajesh Kumar',
      'phone': '+91 98765 43210',
      'capacity': 40,
      'students': 34,
      'status': 'On Route',
      'stops': ['Saibaba Colony', 'Gandhipuram', 'RS Puram', 'Peelamedu', 'School'],
      'pickup': '7:45 AM',
      'dropoff': '4:30 PM',
    },
    {
      'id': '3A',
      'bus': 'TN 33 Y 7742',
      'driver': 'Murugan K',
      'phone': '+91 87654 32109',
      'capacity': 45,
      'students': 40,
      'status': 'At School',
      'stops': ['Singanallur', 'Podanur', 'Ukkadam', 'Town Hall', 'School'],
      'pickup': '8:00 AM',
      'dropoff': '4:15 PM',
    },
    {
      'id': '5C',
      'bus': 'TN 33 X 5521',
      'driver': 'Senthil V',
      'phone': '+91 76543 21098',
      'capacity': 38,
      'students': 28,
      'status': 'Delayed',
      'stops': ['Vadavalli', 'Saravanampatti', 'Kalapatti', 'Vilankurichi', 'School'],
      'pickup': '7:30 AM',
      'dropoff': '4:45 PM',
    },
  ];

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final textColor = isDark ? DarkAppColors.textPrimary : AppColors.textPrimary;
    final bg = isDark ? DarkAppColors.background : AppColors.background;
    final cardColor = isDark ? DarkAppColors.card : AppColors.card;
    final borderColor = isDark ? DarkAppColors.border : AppColors.border;
    final textSecondary = isDark ? DarkAppColors.textSecondary : AppColors.textSecondary;

    final route = _routes[_selectedRoute];
    final statusColor = route['status'] == 'On Route' ? AppColors.success : route['status'] == 'Delayed' ? AppColors.error : const Color(0xFF4F46E5);

    return Scaffold(
      backgroundColor: bg,
      appBar: AppBar(
        backgroundColor: cardColor,
        elevation: 0,
        title: Text('Transport', style: GoogleFonts.poppins(fontSize: 18, fontWeight: FontWeight.w800, color: textColor)),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Route selector
            SizedBox(
              height: 44,
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                itemCount: _routes.length,
                itemBuilder: (_, i) {
                  final isSelected = _selectedRoute == i;
                  return GestureDetector(
                    onTap: () => setState(() => _selectedRoute = i),
                    child: Container(
                      margin: const EdgeInsets.only(right: 8),
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                      decoration: BoxDecoration(
                        color: isSelected ? AppColors.primary : (isDark ? DarkAppColors.surface : AppColors.surface),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: Text('Route ${_routes[i]['id']}', style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w700, color: isSelected ? Colors.white : textSecondary)),
                    ),
                  );
                },
              ),
            ),
            const SizedBox(height: 16),
            // Status banner
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: statusColor.withValues(alpha: 0.08),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: statusColor.withValues(alpha: 0.3)),
              ),
              child: Row(
                children: [
                  Icon(route['status'] == 'On Route' ? Icons.directions_bus : route['status'] == 'Delayed' ? Icons.warning_amber : Icons.school, color: statusColor, size: 28),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(route['status'] as String, style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.w800, color: statusColor)),
                        Text('Bus ${route['bus']} • Route ${route['id']}', style: GoogleFonts.inter(fontSize: 12, color: textSecondary)),
                      ],
                    ),
                  ),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      Text('${route['students']}/${route['capacity']}', style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.w800, color: textColor)),
                      Text('students', style: GoogleFonts.inter(fontSize: 11, color: textSecondary)),
                    ],
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),
            // Times
            Row(
              children: [
                _TimeCard(label: 'Pick-up', time: route['pickup'] as String, icon: Icons.wb_sunny_outlined, color: const Color(0xFFF59E0B), cardColor: cardColor, borderColor: borderColor, textColor: textColor),
                const SizedBox(width: 12),
                _TimeCard(label: 'Drop-off', time: route['dropoff'] as String, icon: Icons.wb_twilight, color: const Color(0xFF4F46E5), cardColor: cardColor, borderColor: borderColor, textColor: textColor),
              ],
            ),
            const SizedBox(height: 16),
            // Driver info
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(color: cardColor, borderRadius: BorderRadius.circular(16), border: Border.all(color: borderColor)),
              child: Row(
                children: [
                  Container(
                    width: 48, height: 48,
                    decoration: BoxDecoration(color: AppColors.primary.withValues(alpha: 0.12), shape: BoxShape.circle),
                    child: Icon(Icons.person, color: AppColors.primary, size: 24),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(route['driver'] as String, style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w700, color: textColor)),
                        Text('Driver', style: GoogleFonts.inter(fontSize: 12, color: textSecondary)),
                      ],
                    ),
                  ),
                  GestureDetector(
                    onTap: () {},
                    child: Container(
                      width: 40, height: 40,
                      decoration: BoxDecoration(color: AppColors.success.withValues(alpha: 0.12), shape: BoxShape.circle),
                      child: Icon(Icons.phone_outlined, color: AppColors.success, size: 20),
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),
            // Route stops
            Text('Route Stops', style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.w700, color: textColor)),
            const SizedBox(height: 12),
            ...(route['stops'] as List<String>).asMap().entries.map((e) {
              final isFirst = e.key == 0;
              final isLast = e.key == (route['stops'] as List).length - 1;
              return Row(
                children: [
                  SizedBox(
                    width: 24,
                    child: Column(
                      children: [
                        Container(
                          width: 12, height: 12,
                          decoration: BoxDecoration(
                            color: isLast ? AppColors.primary : (isFirst ? AppColors.success : Colors.grey.shade400),
                            shape: BoxShape.circle,
                          ),
                        ),
                        if (!isLast)
                          Container(width: 2, height: 32, color: Colors.grey.shade300),
                      ],
                    ),
                  ),
                  const SizedBox(width: 12),
                  Padding(
                    padding: EdgeInsets.only(bottom: isLast ? 0 : 20),
                    child: Text(e.value, style: GoogleFonts.inter(fontSize: 14, fontWeight: isLast ? FontWeight.w800 : FontWeight.w500, color: isLast ? AppColors.primary : textColor)),
                  ),
                ],
              );
            }),
            const SizedBox(height: 24),
            // Live tracking placeholder
            Container(
              height: 180,
              decoration: BoxDecoration(
                color: const Color(0xFF4F46E5).withValues(alpha: 0.08),
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: const Color(0xFF4F46E5).withValues(alpha: 0.2)),
              ),
              child: Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.map_outlined, size: 48, color: const Color(0xFF4F46E5).withValues(alpha: 0.5)),
                    const SizedBox(height: 8),
                    Text('Live Tracking Map', style: GoogleFonts.inter(fontSize: 15, fontWeight: FontWeight.w600, color: const Color(0xFF4F46E5))),
                    Text('GPS integration required', style: GoogleFonts.inter(fontSize: 12, color: textSecondary)),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _TimeCard extends StatelessWidget {
  final String label, time;
  final IconData icon;
  final Color color, cardColor, borderColor, textColor;

  const _TimeCard({required this.label, required this.time, required this.icon, required this.color, required this.cardColor, required this.borderColor, required this.textColor});

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(color: cardColor, borderRadius: BorderRadius.circular(14), border: Border.all(color: borderColor)),
        child: Row(
          children: [
            Container(width: 36, height: 36, decoration: BoxDecoration(color: color.withValues(alpha: 0.12), borderRadius: BorderRadius.circular(10)), child: Icon(icon, color: color, size: 18)),
            const SizedBox(width: 10),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(time, style: GoogleFonts.poppins(fontSize: 15, fontWeight: FontWeight.w800, color: textColor)),
                Text(label, style: GoogleFonts.inter(fontSize: 11, color: AppColors.textSecondary)),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
