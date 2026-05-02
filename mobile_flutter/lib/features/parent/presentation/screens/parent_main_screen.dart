import 'package:flutter/material.dart';
import 'student_profile_screen.dart';
import 'academics_screen.dart';
import 'fee_management_screen.dart';
import '../../../../core/theme/app_theme.dart';

class ParentMainScreen extends StatefulWidget {
  const ParentMainScreen({super.key});

  @override
  State<ParentMainScreen> createState() => _ParentMainScreenState();
}

class _ParentMainScreenState extends State<ParentMainScreen> {
  int _selectedIndex = 0;

  final List<Widget> _screens = [
    const StudentProfileScreen(),
    const AcademicsScreen(),
    const FeeManagementScreen(),
    const Center(child: Text('Messages (Coming Soon)')),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _screens[_selectedIndex],
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _selectedIndex,
        onTap: (index) => setState(() => _selectedIndex = index),
        type: BottomNavigationBarType.fixed,
        backgroundColor: AppColors.surface,
        selectedItemColor: AppColors.primaryOrange,
        unselectedItemColor: Colors.white38,
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.person_outline), label: 'Profile'),
          BottomNavigationBarItem(icon: Icon(Icons.school_outlined), label: 'Academics'),
          BottomNavigationBarItem(icon: Icon(Icons.payments_outlined), label: 'Fees'),
          BottomNavigationBarItem(icon: Icon(Icons.message_outlined), label: 'Chat'),
        ],
      ),
    );
  }
}
