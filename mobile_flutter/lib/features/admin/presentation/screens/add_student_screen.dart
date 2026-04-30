import 'package:flutter/material.dart';
import '../../../../core/theme/app_theme.dart';

class AddStudentScreen extends StatefulWidget {
  const AddStudentScreen({super.key});

  @override
  State<AddStudentScreen> createState() => _AddStudentScreenState();
}

class _AddStudentScreenState extends State<AddStudentScreen> {
  final _formKey = GlobalKey<FormState>();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Add New Student'),
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
              // Photo & Basic Section
              Center(
                child: Column(
                  children: [
                    Container(
                      width: 120,
                      height: 140,
                      decoration: BoxDecoration(
                        color: AppColors.surface,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(color: Colors.white10),
                      ),
                      child: const Icon(Icons.add_a_photo, color: Colors.white24, size: 40),
                    ),
                    TextButton(onPressed: () {}, child: const Text('Upload Photo')),
                  ],
                ),
              ),
              const SizedBox(height: 32),

              _buildSectionHeader('Personal Information'),
              _buildTextField('First Name *', Icons.person_outline),
              _buildTextField('Middle Name', Icons.person_outline),
              _buildTextField('Last Name', Icons.person_outline),
              _buildTextField('Date of Birth (DD/MM/YYYY) *', Icons.calendar_today),
              _buildDropdownField('Gender', ['Male', 'Female', 'Other']),
              _buildDropdownField('Nationality', ['Indian', 'Other']),
              _buildDropdownField('Religion', ['Hindu', 'Muslim', 'Christian', 'Sikh', 'Other']),
              _buildTextField('Aadhar Number', Icons.fingerprint),
              
              const SizedBox(height: 32),
              _buildSectionHeader('Guardian Information'),
              _buildTextField("Father's Name *", Icons.family_restroom),
              _buildTextField("Mother's Name *", Icons.family_restroom),
              _buildTextField('Occupation', Icons.work_outline),
              _buildTextField('Mobile Number *', Icons.phone_android),
              _buildTextField('Email Address', Icons.email_outlined),
              _buildTextField('Full Address', Icons.location_on_outlined, maxLines: 3),

              const SizedBox(height: 32),
              _buildSectionHeader('School & Transport'),
              _buildTextField('Admission Number', Icons.badge_outlined),
              _buildDropdownField('Class', ['Grade I', 'Grade II', 'Grade X', 'Grade XII']),
              _buildDropdownField('Section', ['A', 'B', 'C']),
              _buildDropdownField('Bus Route', ['Route 12', 'Route 14', 'Route 15']),
              _buildTextField('Bus Stop', Icons.bus_alert_outlined),

              const SizedBox(height: 48),
              ElevatedButton(
                onPressed: () {},
                child: const Text('Save Student Record'),
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

  Widget _buildTextField(String label, IconData icon, {int maxLines = 1}) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16.0),
      child: TextFormField(
        maxLines: maxLines,
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
