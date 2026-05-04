import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../../core/models/user_model.dart';

class ProfileScreen extends StatelessWidget {
  final UserModel user;
  const ProfileScreen({super.key, required this.user});

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        children: [
          // Avatar Card
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(32),
            decoration: BoxDecoration(
              color: AppColors.card,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: AppColors.border),
            ),
            child: Column(
              children: [
                Container(
                  width: 100,
                  height: 100,
                  decoration: BoxDecoration(
                    gradient: const LinearGradient(colors: [Color(0xFFFF7F50), Color(0xFFE66A3E)]),
                    borderRadius: BorderRadius.circular(28),
                    boxShadow: [BoxShadow(color: const Color(0xFFFF7F50).withValues(alpha: 0.25), blurRadius: 20, offset: const Offset(0, 10))],
                  ),
                  child: Center(
                    child: Text(user.name.isNotEmpty ? user.name[0].toUpperCase() : '?', style: GoogleFonts.poppins(fontSize: 40, fontWeight: FontWeight.w900, color: Colors.white)),
                  ),
                ),
                const SizedBox(height: 16),
                Text(user.name, style: GoogleFonts.poppins(fontSize: 22, fontWeight: FontWeight.w800, color: AppColors.textPrimary)),
                Text('Class 8-A', style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w700, color: AppColors.primary)),
                const SizedBox(height: 16),
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: AppColors.surface,
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(color: AppColors.border),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('PERMANENT ADDRESS', style: GoogleFonts.inter(fontSize: 10, fontWeight: FontWeight.w800, color: AppColors.textSecondary, letterSpacing: 0.5)),
                      const SizedBox(height: 6),
                      Text('123 School Street, Coimbatore, Tamil Nadu - 641001', style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.textPrimary, height: 1.5)),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 16),
          // Student Info
          _SectionCard(
            title: 'Student Information',
            items: [
              _InfoItem(icon: Icons.person_outline, label: 'Full Name', value: user.name),
              _InfoItem(icon: Icons.school_outlined, label: 'Class', value: 'Class 8 – Section A'),
              _InfoItem(icon: Icons.location_on_outlined, label: 'School', value: 'SNS Academy, Coimbatore'),
              _InfoItem(icon: Icons.phone_outlined, label: 'Guardian Mobile', value: '+91 98765 43210'),
            ],
          ),
          const SizedBox(height: 16),
          // Parent Info
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: AppColors.card,
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: AppColors.border),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Container(width: 6, height: 6, decoration: const BoxDecoration(shape: BoxShape.circle, color: AppColors.primary)),
                    const SizedBox(width: 10),
                    Text('Parent Information', style: GoogleFonts.poppins(fontSize: 15, fontWeight: FontWeight.w700, color: AppColors.textPrimary)),
                  ],
                ),
                const SizedBox(height: 16),
                _ParentCard(type: 'Father', name: 'Mr. Sharma', mobile: '+91 98765 43210', email: 'father@email.com'),
                const SizedBox(height: 12),
                _ParentCard(type: 'Mother', name: 'Mrs. Sharma', mobile: '+91 98765 43211', email: 'mother@email.com'),
              ],
            ),
          ),
          const SizedBox(height: 16),
          // Academic Contact
          _SectionCard(
            title: 'Academic Contact',
            items: [
              _InfoItem(icon: Icons.person_outline, label: 'Class Teacher', value: 'Mrs. Sarah Jenkins'),
              _InfoItem(icon: Icons.email_outlined, label: 'Teacher Email', value: 'sarah.j@snsacademy.org'),
            ],
          ),
        ],
      ),
    );
  }
}

class _SectionCard extends StatelessWidget {
  final String title;
  final List<_InfoItem> items;

  const _SectionCard({required this.title, required this.items});

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: AppColors.card,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(width: 6, height: 6, decoration: const BoxDecoration(shape: BoxShape.circle, color: AppColors.primary)),
              const SizedBox(width: 10),
              Text(title, style: GoogleFonts.poppins(fontSize: 15, fontWeight: FontWeight.w700, color: AppColors.textPrimary)),
            ],
          ),
          const SizedBox(height: 16),
          ...items.map((item) => Padding(
            padding: const EdgeInsets.only(bottom: 10),
            child: Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: AppColors.surface,
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: AppColors.border),
              ),
              child: Row(
                children: [
                  Icon(item.icon, size: 20, color: AppColors.primary),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(item.label.toUpperCase(), style: GoogleFonts.inter(fontSize: 9, fontWeight: FontWeight.w800, color: AppColors.textSecondary, letterSpacing: 0.5)),
                        Text(item.value, style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.textPrimary)),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          )),
        ],
      ),
    );
  }
}

class _InfoItem {
  final IconData icon;
  final String label;
  final String value;
  _InfoItem({required this.icon, required this.label, required this.value});
}

class _ParentCard extends StatelessWidget {
  final String type;
  final String name;
  final String mobile;
  final String email;

  const _ParentCard({required this.type, required this.name, required this.mobile, required this.email});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.border),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(Icons.person, size: 14, color: AppColors.primary),
              const SizedBox(width: 6),
              Text("$type's Details", style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.w800, color: AppColors.primary, letterSpacing: 0.3)),
            ],
          ),
          const SizedBox(height: 10),
          Row(
            children: [
              Icon(Icons.phone, size: 14, color: AppColors.textSecondary),
              const SizedBox(width: 8),
              Text(mobile, style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.textPrimary)),
            ],
          ),
          const SizedBox(height: 6),
          Row(
            children: [
              Icon(Icons.email, size: 14, color: AppColors.textSecondary),
              const SizedBox(width: 8),
              Text(email, style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w600, color: AppColors.textPrimary)),
            ],
          ),
        ],
      ),
    );
  }
}
