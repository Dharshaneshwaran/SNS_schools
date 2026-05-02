import 'package:flutter/material.dart';
import '../../../../core/theme/app_theme.dart';

class ApprovalWorkflowScreen extends StatefulWidget {
  const ApprovalWorkflowScreen({super.key});

  @override
  State<ApprovalWorkflowScreen> createState() => _ApprovalWorkflowScreenState();
}

class _ApprovalWorkflowScreenState extends State<ApprovalWorkflowScreen> {
  final List<Map<String, dynamic>> _pendingRequests = [
    {
      'id': 'REQ-101',
      'type': 'Staff Account',
      'name': 'Prof. Robert Wilson',
      'date': '30 Apr, 09:15 AM',
      'status': 'Pending',
    },
    {
      'id': 'REQ-102',
      'type': 'Parent Account',
      'name': 'Meera Krishnan',
      'date': '29 Apr, 04:30 PM',
      'status': 'Pending',
    },
    {
      'id': 'REQ-103',
      'type': 'Leave Request',
      'name': 'John Doe (Teacher)',
      'date': '28 Apr, 11:00 AM',
      'status': 'Pending',
    },
  ];

  void _handleApproval(int index, bool approved) {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(approved ? 'Approve Request' : 'Reject Request'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text('Are you sure you want to ${approved ? 'approve' : 'reject'} this request?'),
            const SizedBox(height: 16),
            const TextField(
              decoration: InputDecoration(
                hintText: 'Reason (Optional)',
                fillColor: Colors.black12,
              ),
            ),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: const Text('Cancel')),
          ElevatedButton(
            onPressed: () {
              setState(() {
                _pendingRequests.removeAt(index);
              });
              Navigator.pop(context);
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: approved ? AppColors.success : AppColors.error,
              minimumSize: const Size(100, 40),
            ),
            child: Text(approved ? 'Approve' : 'Reject'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Pending Approvals'),
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: _pendingRequests.isEmpty
          ? const Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.check_circle_outline, size: 64, color: Colors.white24),
                  SizedBox(height: 16),
                  Text('All caught up!', style: TextStyle(color: Colors.white38)),
                ],
              ),
            )
          : ListView.separated(
              padding: const EdgeInsets.all(20),
              itemCount: _pendingRequests.length,
              separatorBuilder: (context, index) => const SizedBox(height: 16),
              itemBuilder: (context, index) {
                final req = _pendingRequests[index];
                return Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: AppColors.surface,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: Colors.white.withOpacity(0.05)),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              color: AppColors.primaryOrange.withOpacity(0.1),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Text(
                              req['type'],
                              style: const TextStyle(color: AppColors.primaryOrange, fontSize: 11, fontWeight: FontWeight.bold),
                            ),
                          ),
                          Text(req['date'], style: const TextStyle(color: Colors.white38, fontSize: 11)),
                        ],
                      ),
                      const SizedBox(height: 12),
                      Text(req['name'], style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                      Text('ID: ${req['id']}', style: const TextStyle(color: Colors.white38, fontSize: 12)),
                      const SizedBox(height: 20),
                      Row(
                        children: [
                          Expanded(
                            child: OutlinedButton(
                              onPressed: () => _handleApproval(index, false),
                              style: OutlinedButton.styleFrom(
                                side: const BorderSide(color: AppColors.error),
                                foregroundColor: AppColors.error,
                                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                              ),
                              child: const Text('Reject'),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: ElevatedButton(
                              onPressed: () => _handleApproval(index, true),
                              style: ElevatedButton.styleFrom(
                                backgroundColor: AppColors.success,
                                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
                                minimumSize: const Size(double.infinity, 40),
                              ),
                              child: const Text('Approve'),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                );
              },
            ),
    );
  }
}
