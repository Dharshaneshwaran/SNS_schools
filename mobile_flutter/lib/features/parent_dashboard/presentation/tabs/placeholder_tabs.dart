import 'package:flutter/material.dart';

class PlaceholderTab extends StatelessWidget {
  final String title;
  final IconData icon;

  const PlaceholderTab({super.key, required this.title, required this.icon});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(icon, size: 80, color: const Color(0xFFFF7F50).withValues(alpha: 0.5)),
          const SizedBox(height: 24),
          Text(
            title,
            style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                  fontWeight: FontWeight.bold,
                  color: Colors.grey[800],
                ),
          ),
          const SizedBox(height: 12),
          Text(
            'This feature is currently under development.',
            style: TextStyle(color: Colors.grey[600]),
          ),
        ],
      ),
    );
  }
}

class ProfileTab extends StatelessWidget {
  const ProfileTab({super.key});
  @override
  Widget build(BuildContext context) => const PlaceholderTab(title: 'Profile', icon: Icons.person_outline);
}

class DiaryTab extends StatelessWidget {
  const DiaryTab({super.key});
  @override
  Widget build(BuildContext context) => const PlaceholderTab(title: 'Diary', icon: Icons.menu_book_outlined);
}

class AcademicTab extends StatelessWidget {
  const AcademicTab({super.key});
  @override
  Widget build(BuildContext context) => const PlaceholderTab(title: 'Academic', icon: Icons.bar_chart_outlined);
}

class TransportTab extends StatelessWidget {
  const TransportTab({super.key});
  @override
  Widget build(BuildContext context) => const PlaceholderTab(title: 'Transport', icon: Icons.directions_bus_outlined);
}

class SettingsTab extends StatelessWidget {
  const SettingsTab({super.key});
  @override
  Widget build(BuildContext context) => const PlaceholderTab(title: 'Settings', icon: Icons.settings_outlined);
}
