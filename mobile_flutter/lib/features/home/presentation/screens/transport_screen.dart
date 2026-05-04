import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../../core/theme/app_theme.dart';

class TransportScreen extends StatelessWidget {
  const TransportScreen({super.key});

  @override
  Widget build(BuildContext context) {
    const routeNo = 'Route 7B';
    const busNo = 'TN 33 Z 9901';
    const pickup = '7:45 AM';
    const drop = '4:30 PM';
    const driverName = 'Ramesh Kumar';
    const driverPhone = '+91 94440 12345';
    const license = 'TN 33 AB 5678';
    final stops = ['SNS Academy', 'Saibaba Colony', 'Gandhipuram', 'RS Puram', 'Peelamedu'];

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          // Route Card
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: AppColors.card,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: AppColors.border),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(routeNo, style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.w700, color: AppColors.textPrimary)),
                        Text('Bus No: $busNo', style: GoogleFonts.inter(fontSize: 12, color: AppColors.textSecondary)),
                      ],
                    ),
                    Row(
                      children: [
                        _timeChip('Pick-up', pickup, AppColors.primary),
                        const SizedBox(width: 8),
                        _timeChip('Drop-off', drop, AppColors.primaryDark),
                      ],
                    ),
                  ],
                ),
                const SizedBox(height: 20),
                Text('ROUTE STOPS', style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.w800, color: AppColors.textSecondary, letterSpacing: 0.5)),
                const SizedBox(height: 12),
                ...stops.asMap().entries.map((entry) {
                  final isFirst = entry.key == 0;
                  final isLast = entry.key == stops.length - 1;
                  return Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Column(
                        children: [
                          Container(
                            width: 14,
                            height: 14,
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              color: isFirst ? AppColors.primary : isLast ? AppColors.success : AppColors.border,
                              border: Border.all(
                                color: isFirst ? AppColors.primary : isLast ? AppColors.success : AppColors.border,
                                width: 2,
                              ),
                            ),
                          ),
                          if (!isLast) Container(width: 2, height: 28, color: AppColors.border),
                        ],
                      ),
                      const SizedBox(width: 14),
                      Padding(
                        padding: const EdgeInsets.only(top: 0),
                        child: Text(
                          '${entry.value}${isFirst ? " (Start)" : isLast ? " (School)" : ""}',
                          style: GoogleFonts.inter(
                            fontSize: 14,
                            fontWeight: isFirst || isLast ? FontWeight.w700 : FontWeight.w500,
                            color: isFirst ? AppColors.primary : isLast ? AppColors.success : AppColors.textPrimary,
                          ),
                        ),
                      ),
                    ],
                  );
                }),
              ],
            ),
          ),
          const SizedBox(height: 16),
          // Driver Info
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: AppColors.card,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: AppColors.border),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Driver Information', style: GoogleFonts.poppins(fontSize: 15, fontWeight: FontWeight.w700, color: AppColors.textPrimary)),
                const SizedBox(height: 16),
                Row(
                  children: [
                    Container(
                      width: 52,
                      height: 52,
                      decoration: const BoxDecoration(
                        shape: BoxShape.circle,
                        gradient: LinearGradient(colors: [Color(0xFFFF7F50), Color(0xFFE66A3E)]),
                      ),
                      child: const Center(
                        child: Text('R', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w700, fontSize: 20)),
                      ),
                    ),
                    const SizedBox(width: 14),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(driverName, style: GoogleFonts.inter(fontSize: 15, fontWeight: FontWeight.w700, color: AppColors.textPrimary)),
                        Text('Licensed Driver', style: GoogleFonts.inter(fontSize: 12, color: AppColors.textSecondary)),
                      ],
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                _driverInfoRow(Icons.phone, 'Phone', driverPhone),
                _driverInfoRow(Icons.person, 'License', license),
              ],
            ),
          ),
          const SizedBox(height: 16),
          // Map placeholder
          Container(
            width: double.infinity,
            height: 180,
            decoration: BoxDecoration(
              color: AppColors.surface,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: AppColors.border),
            ),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(Icons.location_on, size: 40, color: AppColors.primary),
                const SizedBox(height: 10),
                Text('Live Tracking', style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w600, color: AppColors.textSecondary)),
                Text('Coming Soon', style: GoogleFonts.inter(fontSize: 12, color: AppColors.textSecondary)),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _timeChip(String label, String value, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(10),
        border: Border.all(color: color.withValues(alpha: 0.3)),
      ),
      child: Column(
        children: [
          Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(Icons.access_time, size: 12, color: color),
              const SizedBox(width: 4),
              Text(label, style: GoogleFonts.inter(fontSize: 10, fontWeight: FontWeight.w600, color: color)),
            ],
          ),
          Text(value, style: GoogleFonts.poppins(fontSize: 14, fontWeight: FontWeight.w700, color: AppColors.textPrimary)),
        ],
      ),
    );
  }

  Widget _driverInfoRow(IconData icon, String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(top: 12),
      child: Row(
        children: [
          Icon(icon, size: 16, color: AppColors.primary),
          const SizedBox(width: 12),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(label, style: GoogleFonts.inter(fontSize: 11, color: AppColors.textSecondary)),
              Text(value, style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w500, color: AppColors.textPrimary)),
            ],
          ),
        ],
      ),
    );
  }
}
