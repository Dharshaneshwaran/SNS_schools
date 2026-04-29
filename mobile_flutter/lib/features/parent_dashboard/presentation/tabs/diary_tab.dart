import 'package:flutter/material.dart';

class DiaryTab extends StatelessWidget {
  const DiaryTab({super.key});

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 3,
      child: Column(
        children: [
          Container(
            color: Colors.white,
            child: const TabBar(
              indicatorColor: Color(0xFFFF7F50),
              labelColor: Color(0xFFFF7F50),
              unselectedLabelColor: Colors.grey,
              tabs: [
                Tab(text: 'Homework'),
                Tab(text: 'Remarks'),
                Tab(text: 'Circulars'),
              ],
            ),
          ),
          Expanded(
            child: TabBarView(
              children: [
                _buildHomeworkList(),
                _buildRemarksList(),
                _buildCircularsList(),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildHomeworkList() {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        _buildHomeworkCard(
          subject: 'Mathematics',
          title: 'Algebra Worksheet',
          desc: 'Complete problems 1 to 15 on page 42.',
          dueDate: 'Tomorrow',
          color: const Color(0xFF6C63FF),
        ),
        _buildHomeworkCard(
          subject: 'Science',
          title: 'Physics Lab Report',
          desc: 'Submit the final draft of the pendulum experiment.',
          dueDate: 'Friday',
          color: const Color(0xFF10B981),
        ),
        _buildHomeworkCard(
          subject: 'English',
          title: 'Essay Draft',
          desc: 'Write a 500-word essay on climate change.',
          dueDate: 'Next Monday',
          color: const Color(0xFFF59E0B),
        ),
      ],
    );
  }

  Widget _buildHomeworkCard({
    required String subject,
    required String title,
    required String desc,
    required String dueDate,
    required Color color,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            blurRadius: 10,
            offset: const Offset(0, 4),
          )
        ],
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
                  color: color.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  subject,
                  style: TextStyle(
                    color: color,
                    fontWeight: FontWeight.bold,
                    fontSize: 12,
                  ),
                ),
              ),
              Row(
                children: [
                  const Icon(Icons.calendar_today, size: 14, color: Colors.grey),
                  const SizedBox(width: 4),
                  Text(
                    'Due: $dueDate',
                    style: const TextStyle(
                      color: Colors.grey,
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              )
            ],
          ),
          const SizedBox(height: 12),
          Text(
            title,
            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
          ),
          const SizedBox(height: 4),
          Text(
            desc,
            style: TextStyle(color: Colors.grey[700], height: 1.4),
          ),
        ],
      ),
    );
  }

  Widget _buildRemarksList() {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        _buildRemarkCard(
          teacher: 'Mr. Rajesh',
          subject: 'Mathematics',
          type: 'Positive',
          remark: 'Excellent performance in the algebra surprise test. Keep it up!',
          date: 'Oct 24',
        ),
        _buildRemarkCard(
          teacher: 'Mrs. Priya',
          subject: 'Science',
          type: 'Needs Improvement',
          remark: 'Please ensure lab records are submitted on time.',
          date: 'Oct 20',
        ),
      ],
    );
  }

  Widget _buildRemarkCard({
    required String teacher,
    required String subject,
    required String type,
    required String remark,
    required String date,
  }) {
    final isPositive = type == 'Positive';
    final color = isPositive ? const Color(0xFF4CAF50) : const Color(0xFFFF9800);

    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border(left: BorderSide(color: color, width: 4)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            blurRadius: 10,
            offset: const Offset(0, 4),
          )
        ],
      ),
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                '$teacher • $subject',
                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
              ),
              Text(
                date,
                style: const TextStyle(color: Colors.grey, fontSize: 12),
              ),
            ],
          ),
          const SizedBox(height: 12),
          Text(
            remark,
            style: TextStyle(color: Colors.grey[800], height: 1.4),
          ),
        ],
      ),
    );
  }

  Widget _buildCircularsList() {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        _buildCircularCard('Diwali Holidays Announcement', 'Oct 22', true),
        _buildCircularCard('Term 1 Examination Schedule', 'Oct 15', false),
        _buildCircularCard('Fee Payment Reminder', 'Oct 10', false),
      ],
    );
  }

  Widget _buildCircularCard(String title, String date, bool isNew) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.grey[200]!),
      ),
      child: ListTile(
        leading: Container(
          padding: const EdgeInsets.all(10),
          decoration: BoxDecoration(
            color: const Color(0xFFFFF5F0),
            borderRadius: BorderRadius.circular(10),
          ),
          child: const Icon(Icons.picture_as_pdf, color: Color(0xFFFF7F50)),
        ),
        title: Row(
          children: [
            Expanded(
              child: Text(
                title,
                style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14),
              ),
            ),
            if (isNew)
              Container(
                margin: const EdgeInsets.only(left: 8),
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                decoration: BoxDecoration(
                  color: Colors.red,
                  borderRadius: BorderRadius.circular(4),
                ),
                child: const Text('NEW', style: TextStyle(color: Colors.white, fontSize: 10, fontWeight: FontWeight.bold)),
              )
          ],
        ),
        subtitle: Text(date, style: const TextStyle(fontSize: 12)),
        trailing: const Icon(Icons.download, color: Colors.grey),
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      ),
    );
  }
}
