import 'package:flutter/material.dart';
import '../../../../core/theme/app_theme.dart';
import 'package:fl_chart/fl_chart.dart';
import 'add_student_screen.dart';
import 'add_staff_screen.dart';
import 'attendance_management_screen.dart';

class AdminDashboardHome extends StatelessWidget {
  const AdminDashboardHome({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            const Icon(Icons.school, color: AppColors.primaryOrange),
            const SizedBox(width: 12),
            Text('eSchool ERP', style: Theme.of(context).textTheme.displayMedium),
          ],
        ),
        backgroundColor: Colors.transparent,
        elevation: 0,
        actions: [
          IconButton(icon: const Icon(Icons.notifications_none), onPressed: () {}),
          const CircleAvatar(
            radius: 16,
            backgroundColor: AppColors.surfaceLight,
            child: Icon(Icons.person, size: 20, color: Colors.white),
          ),
          const SizedBox(width: 16),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header Stats / "Fun Facts" Title
            _buildSectionTitle(context, 'Dashboard Overview'),
            const SizedBox(height: 16),
            
            // Colored Info Cards (Based on reference image admin4.jpeg)
            GridView.count(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              crossAxisCount: 2,
              crossAxisSpacing: 12,
              mainAxisSpacing: 12,
              childAspectRatio: 1.4,
              children: [
                _buildInfoCard('Student Birthdays', '03 Today', Icons.cake, const Color(0xFF4CAF50)),
                _buildInfoCard('Staff Birthdays', 'None', Icons.celebration, const Color(0xFFFF9800)),
                _buildInfoCard('Student Attendance', '94.6%', Icons.person_search, const Color(0xFFE91E63)),
                _buildInfoCard('Staff Leave', '05 Pending', Icons.event_busy, const Color(0xFF673AB7)),
                _buildInfoCard('SMS Balance', '₹ 4,200', Icons.account_balance_wallet, const Color(0xFF795548)),
                _buildInfoCard('Scholar Leave', '02 Pending', Icons.school, const Color(0xFFF44336)),
              ],
            ),
            const SizedBox(height: 32),

            // Charts Section (Based on reference image admin3.jpeg)
            _buildSectionTitle(context, 'School Statistics'),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(child: _buildChartCard('Teacher Mix', _buildTeacherChart())),
                const SizedBox(width: 16),
                Expanded(child: _buildChartCard('Student Mix', _buildStudentChart())),
              ],
            ),
            const SizedBox(height: 32),

            // Quick Actions Grid (Based on icons in admin2.jpeg)
            _buildSectionTitle(context, 'Quick Management'),
            const SizedBox(height: 16),
            GridView.count(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              crossAxisCount: 4,
              crossAxisSpacing: 16,
              mainAxisSpacing: 24,
              children: [
                _buildActionButton(context, Icons.people, 'Students', () {
                  Navigator.push(context, MaterialPageRoute(builder: (context) => const AddStudentScreen()));
                }),
                _buildActionButton(context, Icons.badge, 'Staff', () {
                  Navigator.push(context, MaterialPageRoute(builder: (context) => const AddStaffScreen()));
                }),
                _buildActionButton(context, Icons.payments, 'Fees', () {}),
                _buildActionButton(context, Icons.event_available, 'Attendance', () {
                  Navigator.push(context, MaterialPageRoute(builder: (context) => const AttendanceManagementScreen()));
                }),
                _buildActionButton(context, Icons.description, 'Results', () {}),
                _buildActionButton(context, Icons.directions_bus, 'Transport', () {}),
                _buildActionButton(context, Icons.menu_book, 'Library', () {}),
                _buildActionButton(context, Icons.calendar_month, 'Timetable', () {}),
              ],
            ),
            const SizedBox(height: 32),
          ],
        ),
      ),
    );
  }

  Widget _buildSectionTitle(BuildContext context, String title) {
    return Text(title, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.white70));
  }

  Widget _buildInfoCard(String title, String value, IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: color.withOpacity(0.15),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: color.withOpacity(0.3)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Icon(icon, color: color, size: 24),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(value, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
              Text(title, style: const TextStyle(color: Colors.white60, fontSize: 10, overflow: TextOverflow.ellipsis)),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildChartCard(String title, Widget chart) {
    return Container(
      padding: const EdgeInsets.all(16),
      height: 200,
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.white.withOpacity(0.05)),
      ),
      child: Column(
        children: [
          Text(title, style: const TextStyle(fontSize: 12, color: Colors.white54)),
          const SizedBox(height: 12),
          Expanded(child: chart),
        ],
      ),
    );
  }

  Widget _buildTeacherChart() {
    return PieChart(
      PieChartData(
        sections: [
          PieChartSectionData(value: 73, color: Colors.purple, radius: 25, showTitle: false),
          PieChartSectionData(value: 47, color: Colors.blue, radius: 25, showTitle: false),
        ],
        centerSpaceRadius: 30,
        sectionsSpace: 2,
      ),
    );
  }

  Widget _buildStudentChart() {
    return PieChart(
      PieChartData(
        sections: [
          PieChartSectionData(value: 520, color: Colors.orange, radius: 25, showTitle: false),
          PieChartSectionData(value: 444, color: Colors.teal, radius: 25, showTitle: false),
        ],
        centerSpaceRadius: 30,
        sectionsSpace: 2,
      ),
    );
  }

  Widget _buildActionButton(BuildContext context, IconData icon, String label, VoidCallback onTap) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(12),
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: AppColors.surfaceLight,
              borderRadius: BorderRadius.circular(12),
              boxShadow: [
                BoxShadow(
                  color: Colors.black.withOpacity(0.2),
                  blurRadius: 10,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: Icon(icon, color: AppColors.primaryOrange, size: 28),
          ),
          const SizedBox(height: 8),
          Text(label, style: const TextStyle(fontSize: 11, color: Colors.white70)),
        ],
      ),
    );
  }
}
