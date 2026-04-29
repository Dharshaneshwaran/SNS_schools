import 'package:flutter/material.dart';

import '../../../core/models/auth_session.dart';

class DashboardScreen extends StatelessWidget {
  const DashboardScreen({
    required this.session,
    required this.onLogout,
    super.key,
  });

  final AuthSession session;
  final VoidCallback onLogout;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.all(20),
          children: [
            DecoratedBox(
              decoration: BoxDecoration(
                color: const Color(0xFF0F766E),
                borderRadius: BorderRadius.circular(28),
              ),
              child: Padding(
                padding: const EdgeInsets.all(24),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      session.user.role.toUpperCase(),
                      style: theme.textTheme.labelLarge?.copyWith(
                        color: const Color(0xFFCCFBF1),
                        letterSpacing: 2.5,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                    const SizedBox(height: 14),
                    Text(
                      'Welcome, ${session.user.name}',
                      style: theme.textTheme.headlineMedium?.copyWith(
                        color: Colors.white,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                    const SizedBox(height: 10),
                    Text(
                      'Your mobile workspace is ready for timetable, substitutions, and attendance actions.',
                      style: theme.textTheme.bodyMedium?.copyWith(
                        color: Colors.white.withValues(alpha: 0.85),
                        height: 1.5,
                      ),
                    ),
                    const SizedBox(height: 18),
                    OutlinedButton(
                      onPressed: onLogout,
                      style: OutlinedButton.styleFrom(
                        side: const BorderSide(color: Color(0x66FFFFFF)),
                        foregroundColor: Colors.white,
                      ),
                      child: const Text('Logout'),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 20),
            const _SectionTitle(
              eyebrow: 'Today',
              title: 'Quick summary',
            ),
            const SizedBox(height: 14),
            const _MetricGrid(),
            const SizedBox(height: 20),
            const _SectionTitle(
              eyebrow: 'Schedule',
              title: 'Today timetable',
            ),
            const SizedBox(height: 14),
            const _ScheduleCard(
              period: '08:45 - 09:30',
              subject: 'Class VIII Mathematics',
              meta: 'Room 204',
            ),
            const SizedBox(height: 12),
            const _ScheduleCard(
              period: '10:30 - 11:15',
              subject: 'Class IX Algebra',
              meta: 'Room 112',
            ),
            const SizedBox(height: 20),
            const _SectionTitle(
              eyebrow: 'Substitutions',
              title: 'Pending acknowledgement',
            ),
            const SizedBox(height: 14),
            const _ActionCard(
              title: 'Period 5 replacement',
              body: 'Acknowledge the science block substitution assigned for Grade 7.',
            ),
            const SizedBox(height: 12),
            const _ActionCard(
              title: 'Attendance status',
              body: 'Mark your arrival and review leave updates before first period.',
            ),
          ],
        ),
      ),
    );
  }
}

class _SectionTitle extends StatelessWidget {
  const _SectionTitle({
    required this.eyebrow,
    required this.title,
  });

  final String eyebrow;
  final String title;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          eyebrow.toUpperCase(),
          style: theme.textTheme.labelSmall?.copyWith(
            color: const Color(0xFF0F766E),
            letterSpacing: 2,
            fontWeight: FontWeight.w700,
          ),
        ),
        const SizedBox(height: 6),
        Text(
          title,
          style: theme.textTheme.titleLarge?.copyWith(
            fontWeight: FontWeight.w700,
          ),
        ),
      ],
    );
  }
}

class _MetricGrid extends StatelessWidget {
  const _MetricGrid();

  @override
  Widget build(BuildContext context) {
    return GridView.count(
      physics: const NeverScrollableScrollPhysics(),
      shrinkWrap: true,
      crossAxisCount: 2,
      crossAxisSpacing: 12,
      mainAxisSpacing: 12,
      childAspectRatio: 1.2,
      children: const [
        _MetricCard(title: 'Periods Today', value: '05', hint: '2 completed'),
        _MetricCard(title: 'Pending Substitutions', value: '01', hint: 'Needs acknowledgement'),
        _MetricCard(title: 'Attendance Status', value: 'Ready', hint: 'Mark before 8:30 AM'),
        _MetricCard(title: 'Leave Updates', value: '02', hint: 'New notices from admin'),
      ],
    );
  }
}

class _MetricCard extends StatelessWidget {
  const _MetricCard({
    required this.title,
    required this.value,
    required this.hint,
  });

  final String title;
  final String value;
  final String hint;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return DecoratedBox(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
      ),
      child: Padding(
        padding: const EdgeInsets.all(18),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              title,
              style: theme.textTheme.bodyMedium?.copyWith(
                color: const Color(0xFF5B6470),
              ),
            ),
            Text(
              value,
              style: theme.textTheme.headlineSmall?.copyWith(
                fontWeight: FontWeight.w700,
              ),
            ),
            Text(
              hint,
              style: theme.textTheme.bodySmall?.copyWith(
                color: const Color(0xFF5B6470),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _ScheduleCard extends StatelessWidget {
  const _ScheduleCard({
    required this.period,
    required this.subject,
    required this.meta,
  });

  final String period;
  final String subject;
  final String meta;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return DecoratedBox(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
      ),
      child: Padding(
        padding: const EdgeInsets.all(18),
        child: Row(
          children: [
            Container(
              width: 10,
              height: 56,
              decoration: BoxDecoration(
                color: const Color(0xFF0F766E),
                borderRadius: BorderRadius.circular(999),
              ),
            ),
            const SizedBox(width: 14),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    period,
                    style: theme.textTheme.labelMedium?.copyWith(
                      color: const Color(0xFF0F766E),
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    subject,
                    style: theme.textTheme.titleMedium?.copyWith(
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    meta,
                    style: theme.textTheme.bodySmall?.copyWith(
                      color: const Color(0xFF5B6470),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _ActionCard extends StatelessWidget {
  const _ActionCard({
    required this.title,
    required this.body,
  });

  final String title;
  final String body;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return DecoratedBox(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
      ),
      child: Padding(
        padding: const EdgeInsets.all(18),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              title,
              style: theme.textTheme.titleMedium?.copyWith(
                fontWeight: FontWeight.w700,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              body,
              style: theme.textTheme.bodyMedium?.copyWith(
                color: const Color(0xFF5B6470),
                height: 1.5,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
