import 'package:flutter/material.dart';
import '../../../../core/theme/app_theme.dart';

class AddStaffScreen extends StatefulWidget {
  const AddStaffScreen({super.key});

  @override
  State<AddStaffScreen> createState() => _AddStaffScreenState();
}

class _AddStaffScreenState extends State<AddStaffScreen> {
  final _formKey = GlobalKey<FormState>();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Add New Staff'),
        backgroundColor: Colors.transparent,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildSectionHeader('Professional Details'),
              _buildTextField('Full Name *', Icons.person_outline),
              _buildDropdownField('Role', ['Teacher', 'Admin Staff', 'Principal', 'Support Staff']),
              _buildDropdownField('Department', ['Mathematics', 'Science', 'Languages', 'Administration']),
              _buildTextField('Staff ID (Auto-generated)', Icons.badge_outlined, enabled: false),
              _buildTextField('Date of Joining', Icons.calendar_today),
              
              const SizedBox(height: 32),
              _buildSectionHeader('Contact Information'),
              _buildTextField('Mobile Number *', Icons.phone_android),
              _buildTextField('Email Address *', Icons.email_outlined),
              _buildTextField('Emergency Contact', Icons.contact_emergency_outlined),
              
              const SizedBox(height: 32),
              _buildSectionHeader('Academic Background'),
              _buildTextField('Qualifications', Icons.history_edu_outlined),
              _buildTextField('Experience (Years)', Icons.timeline),
              _buildTextField('Subject Specialization', Icons.subject_outlined),

              const SizedBox(height: 48),
              ElevatedButton(
                onPressed: () {},
                child: const Text('Register Staff Member'),
              ),
              const SizedBox(height: 32),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSectionHeader(String title) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16.0),
      child: Text(
        title,
        style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.primaryOrange),
      ),
    );
  }

  Widget _buildTextField(String label, IconData icon, {int maxLines = 1, bool enabled = true}) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16.0),
      child: TextFormField(
        maxLines: maxLines,
        enabled: enabled,
        decoration: InputDecoration(
          labelText: label,
          prefixIcon: Icon(icon, size: 20, color: Colors.white54),
        ),
      ),
    );
  }

  Widget _buildDropdownField(String label, List<String> items) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16.0),
      child: DropdownButtonFormField<String>(
        decoration: InputDecoration(
          labelText: label,
          prefixIcon: const Icon(Icons.arrow_drop_down_circle_outlined, size: 20, color: Colors.white54),
        ),
        items: items.map((e) => DropdownMenuItem(value: e, child: Text(e))).toList(),
        onChanged: (val) {},
      ),
    );
  }
}
