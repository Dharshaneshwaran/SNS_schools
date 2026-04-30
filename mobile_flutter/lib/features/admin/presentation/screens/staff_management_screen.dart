import 'package:flutter/material.dart';
import '../../../../core/theme/app_theme.dart';

class StaffManagementScreen extends StatefulWidget {
  const StaffManagementScreen({super.key});

  @override
  State<StaffManagementScreen> createState() => _StaffManagementScreenState();
}

class _StaffManagementScreenState extends State<StaffManagementScreen> {
  final _searchController = TextEditingController();
  
  // Mock data for demonstration
  final List<Map<String, dynamic>> _staffList = [
    {'name': 'Dr. Sarah Wilson', 'role': 'Principal', 'dept': 'Administration', 'id': 'SNS-001'},
    {'name': 'James Miller', 'role': 'Teacher', 'dept': 'Mathematics', 'id': 'SNS-042'},
    {'name': 'Elena Rodriguez', 'role': 'Teacher', 'dept': 'Science', 'id': 'SNS-015'},
    {'name': 'Robert Brown', 'role': 'Support', 'dept': 'IT Support', 'id': 'SNS-102'},
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Staff Management'),
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {},
        backgroundColor: AppColors.primaryOrange,
        child: const Icon(Icons.add, color: Colors.white),
      ),
      body: Padding(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          children: [
            // Search Bar
            TextField(
              controller: _searchController,
              decoration: InputDecoration(
                hintText: 'Search staff by name or ID...',
                prefixIcon: const Icon(Icons.search, color: Colors.white54),
                fillColor: AppColors.surface,
              ),
              onChanged: (val) => setState(() {}),
            ),
            const SizedBox(height: 24),

            // Staff List
            Expanded(
              child: ListView.separated(
                itemCount: _staffList.length,
                separatorBuilder: (context, index) => const SizedBox(height: 12),
                itemBuilder: (context, index) {
                  final staff = _staffList[index];
                  return Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: AppColors.surface,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: Colors.white.withOpacity(0.05)),
                    ),
                    child: Row(
                      children: [
                        CircleAvatar(
                          radius: 24,
                          backgroundColor: AppColors.primaryOrange.withOpacity(0.1),
                          child: Text(staff['name'][0], style: const TextStyle(color: AppColors.primaryOrange, fontWeight: FontWeight.bold)),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(staff['name'], style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                              Text('${staff['role']} • ${staff['dept']}', style: const TextStyle(color: Colors.white54, fontSize: 12)),
                              Text(staff['id'], style: const TextStyle(color: AppColors.primaryOrange, fontSize: 11, fontWeight: FontWeight.bold)),
                            ],
                          ),
                        ),
                        IconButton(
                          icon: const Icon(Icons.edit_outlined, color: Colors.white38, size: 20),
                          onPressed: () {},
                        ),
                        IconButton(
                          icon: const Icon(Icons.delete_outline, color: AppColors.error, size: 20),
                          onPressed: () {},
                        ),
                      ],
                    ),
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
