import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../../core/theme/app_theme.dart';

class MessagesScreen extends StatelessWidget {
  const MessagesScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final messages = [
      {
        'title': 'Annual Sports Day Announcement',
        'content': 'Dear Parents, We are excited to announce our Annual Sports Day on May 15th. All students are requested to participate. Please ensure your child is present by 8:00 AM.',
        'date': '2 hours ago',
        'type': 'general',
        'audience': 'All Parents',
      },
      {
        'title': 'Exam Results Published',
        'content': 'The results for the mid-term examinations have been published. You can view your child\'s performance in the Academic Reports section.',
        'date': 'Yesterday',
        'type': 'general',
        'audience': 'All Parents',
      },
      {
        'title': 'Parent-Teacher Meeting',
        'content': 'A parent-teacher meeting is scheduled for May 10th at 3:00 PM. Your presence is highly appreciated to discuss your child\'s progress.',
        'date': '2 days ago',
        'type': 'class',
        'audience': 'Class 8-A Parents',
      },
      {
        'title': 'School Closure Notice',
        'content': 'The school will remain closed on May 8th due to a public holiday. Regular classes will resume on May 9th.',
        'date': '3 days ago',
        'type': 'general',
        'audience': 'All Parents',
      },
      {
        'title': 'Homework Submission Reminder',
        'content': 'This is a reminder that all pending homework assignments must be submitted by May 5th. Please check the Diary section for details.',
        'date': '5 days ago',
        'type': 'class',
        'audience': 'Class 8-A Parents',
      },
    ];

    return ListView.builder(
      padding: const EdgeInsets.all(16),
      itemCount: messages.length,
      itemBuilder: (_, i) {
        final msg = messages[i];
        final isGeneral = msg['type'] == 'general';
        return Container(
          margin: const EdgeInsets.only(bottom: 16),
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            color: AppColors.card,
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: AppColors.border),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header
              Row(
                children: [
                  Container(
                    width: 40,
                    height: 40,
                    decoration: BoxDecoration(
                      color: isGeneral ? AppColors.primary.withValues(alpha: 0.1) : const Color(0xFF4F46E5).withValues(alpha: 0.1),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Icon(
                      isGeneral ? Icons.group : Icons.person,
                      size: 20,
                      color: isGeneral ? AppColors.primary : const Color(0xFF4F46E5),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(msg['title']!, style: GoogleFonts.inter(fontSize: 15, fontWeight: FontWeight.w700, color: AppColors.textPrimary)),
                        Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                              decoration: BoxDecoration(
                                color: AppColors.primary.withValues(alpha: 0.1),
                                borderRadius: BorderRadius.circular(20),
                              ),
                              child: Text(msg['type']!, style: GoogleFonts.inter(fontSize: 10, fontWeight: FontWeight.w700, color: AppColors.primary)),
                            ),
                            const SizedBox(width: 6),
                            Text('• ${msg['audience']}', style: GoogleFonts.inter(fontSize: 11, color: AppColors.textSecondary)),
                          ],
                        ),
                      ],
                    ),
                  ),
                  Row(
                    children: [
                      Icon(Icons.access_time, size: 14, color: AppColors.textSecondary),
                      const SizedBox(width: 4),
                      Text(msg['date']!, style: GoogleFonts.inter(fontSize: 11, color: AppColors.textSecondary)),
                    ],
                  ),
                ],
              ),
              const SizedBox(height: 14),
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: AppColors.surface,
                  borderRadius: BorderRadius.circular(14),
                ),
                child: Text(msg['content']!, style: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w500, color: AppColors.textPrimary, height: 1.6)),
              ),
            ],
          ),
        );
      },
    );
  }
}
