import 'package:flutter/material.dart';

class ProfileTab extends StatelessWidget {
  const ProfileTab({super.key});

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        // Profile Header
        Container(
          padding: const EdgeInsets.all(24),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(20),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withValues(alpha: 0.05),
                blurRadius: 10,
                offset: const Offset(0, 4),
              )
            ],
          ),
          child: Column(
            children: [
              Container(
                width: 100,
                height: 100,
                decoration: const BoxDecoration(
                  shape: BoxShape.circle,
                  gradient: LinearGradient(
                    colors: [Color(0xFFFF7F50), Color(0xFFE66A3E)],
                  ),
                  boxShadow: [
                    BoxShadow(
                      color: Color(0x4DFF7F50),
                      blurRadius: 12,
                      offset: Offset(0, 6),
                    )
                  ],
                ),
                alignment: Alignment.center,
                child: const Text(
                  'YS',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 36,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
              const SizedBox(height: 16),
              Text(
                'Yashwanth S',
                style: theme.textTheme.headlineSmall?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                'Class X - Section A',
                style: theme.textTheme.titleMedium?.copyWith(
                  color: Colors.grey[600],
                ),
              ),
              const SizedBox(height: 16),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                decoration: BoxDecoration(
                  color: const Color(0xFFE8F5E9),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: const Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(Icons.check_circle, color: Color(0xFF4CAF50), size: 16),
                    SizedBox(width: 8),
                    Text(
                      'Active Status',
                      style: TextStyle(
                        color: Color(0xFF2E7D32),
                        fontWeight: FontWeight.bold,
                        fontSize: 12,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 24),

        // Personal Information
        _buildSectionHeader('Personal Information', Icons.person_outline),
        _buildInfoCard([
          _buildInfoRow('Admission No.', 'SNS-2018-4092'),
          _buildInfoRow('Date of Birth', '15 Oct 2008'),
          _buildInfoRow('Blood Group', 'O+'),
          _buildInfoRow('Gender', 'Male'),
        ]),

        const SizedBox(height: 24),

        // Emergency Contacts
        _buildSectionHeader('Emergency Contacts', Icons.phone_in_talk_outlined),
        _buildInfoCard([
          _buildContactRow('Father', 'Suresh Kumar', '+91 98765 43210'),
          _buildContactRow('Mother', 'Priya Suresh', '+91 98765 43211'),
        ]),

        const SizedBox(height: 24),

        // Medical Information
        _buildSectionHeader('Medical Information', Icons.medical_services_outlined),
        _buildInfoCard([
          _buildInfoRow('Allergies', 'None recorded'),
          _buildInfoRow('Regular Medication', 'None'),
          _buildInfoRow('Family Doctor', 'Dr. Ramesh (Apollo)'),
        ]),

        const SizedBox(height: 24),

        // Address
        _buildSectionHeader('Residential Address', Icons.home_outlined),
        _buildInfoCard([
          Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Icon(Icons.location_on, color: Colors.grey[400], size: 20),
                const SizedBox(width: 12),
                Expanded(
                  child: Text(
                    '123, Green Valley Enclave,\nSaravanampatti,\nCoimbatore - 641035',
                    style: TextStyle(
                      color: Colors.grey[800],
                      height: 1.5,
                    ),
                  ),
                ),
              ],
            ),
          )
        ], noPadding: true),
        
        const SizedBox(height: 32),
      ],
    );
  }

  Widget _buildSectionHeader(String title, IconData icon) {
    return Padding(
      padding: const EdgeInsets.only(left: 4, bottom: 12),
      child: Row(
        children: [
          Icon(icon, color: const Color(0xFFFF7F50), size: 20),
          const SizedBox(width: 8),
          Text(
            title,
            style: const TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
              color: Colors.black87,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildInfoCard(List<Widget> children, {bool noPadding = false}) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.03),
            blurRadius: 8,
            offset: const Offset(0, 2),
          )
        ],
      ),
      child: Column(
        children: children.map((child) {
          final isLast = children.last == child;
          return Column(
            children: [
              if (!noPadding && child is! Padding)
                Padding(padding: const EdgeInsets.all(16), child: child)
              else
                child,
              if (!isLast) Divider(height: 1, color: Colors.grey[100]),
            ],
          );
        }).toList(),
      ),
    );
  }

  Widget _buildInfoRow(String label, String value) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Text(
          label,
          style: TextStyle(color: Colors.grey[600], fontSize: 14),
        ),
        Text(
          value,
          style: const TextStyle(
            color: Colors.black87,
            fontWeight: FontWeight.w600,
            fontSize: 14,
          ),
        ),
      ],
    );
  }

  Widget _buildContactRow(String relation, String name, String phone) {
    return Row(
      children: [
        Container(
          width: 40,
          height: 40,
          decoration: BoxDecoration(
            color: const Color(0xFFFFF5F0),
            borderRadius: BorderRadius.circular(10),
          ),
          child: const Icon(Icons.person, color: Color(0xFFFF7F50), size: 20),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                name,
                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
              ),
              const SizedBox(height: 2),
              Text(
                relation,
                style: TextStyle(color: Colors.grey[500], fontSize: 12),
              ),
            ],
          ),
        ),
        IconButton(
          icon: const Icon(Icons.call, color: Color(0xFF4CAF50)),
          onPressed: () {},
        )
      ],
    );
  }
}
