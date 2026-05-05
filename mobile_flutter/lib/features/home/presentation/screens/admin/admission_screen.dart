import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../../../core/theme/app_theme.dart';

class AdmissionScreen extends ConsumerStatefulWidget {
  const AdmissionScreen({super.key});

  @override
  ConsumerState<AdmissionScreen> createState() => _AdmissionScreenState();
}

class _AdmissionScreenState extends ConsumerState<AdmissionScreen> with SingleTickerProviderStateMixin {
  late TabController _tabs;
  final _formKey = GlobalKey<FormState>();
  final _nameCtrl = TextEditingController();
  final _dobCtrl = TextEditingController();
  final _classCtrl = TextEditingController();
  final _parentNameCtrl = TextEditingController();
  final _phoneCtrl = TextEditingController();
  final _emailCtrl = TextEditingController();
  final _addressCtrl = TextEditingController();
  bool _isSubmitting = false;
  bool _submitted = false;

  static final _pendingAdmissions = [
    {'name': 'Arjun Sharma', 'class': '8-A', 'date': '2026-04-28', 'status': 'pending'},
    {'name': 'Priya Patel', 'class': '9-B', 'date': '2026-04-29', 'status': 'pending'},
    {'name': 'Rahul Kumar', 'class': '6-C', 'date': '2026-04-30', 'status': 'review'},
    {'name': 'Meena Iyer', 'class': '10-A', 'date': '2026-05-01', 'status': 'pending'},
    {'name': 'Sathish Vel', 'class': '7-B', 'date': '2026-05-02', 'status': 'approved'},
  ];

  @override
  void initState() {
    super.initState();
    _tabs = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _tabs.dispose();
    _nameCtrl.dispose();
    _dobCtrl.dispose();
    _classCtrl.dispose();
    _parentNameCtrl.dispose();
    _phoneCtrl.dispose();
    _emailCtrl.dispose();
    _addressCtrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final textColor = isDark ? DarkAppColors.textPrimary : AppColors.textPrimary;
    final bg = isDark ? DarkAppColors.background : AppColors.background;
    final cardColor = isDark ? DarkAppColors.card : AppColors.card;
    final borderColor = isDark ? DarkAppColors.border : AppColors.border;

    return Scaffold(
      backgroundColor: bg,
      appBar: AppBar(
        backgroundColor: cardColor,
        elevation: 0,
        title: Text('Admissions', style: GoogleFonts.poppins(fontSize: 18, fontWeight: FontWeight.w800, color: textColor)),
        bottom: TabBar(
          controller: _tabs,
          labelColor: AppColors.primary,
          unselectedLabelColor: isDark ? DarkAppColors.textSecondary : AppColors.textSecondary,
          indicatorColor: AppColors.primary,
          labelStyle: GoogleFonts.inter(fontSize: 13, fontWeight: FontWeight.w700),
          tabs: const [Tab(text: 'Applications'), Tab(text: 'New Admission')],
        ),
      ),
      body: TabBarView(
        controller: _tabs,
        children: [
          // Applications list
          RefreshIndicator(
            onRefresh: () async {},
            color: AppColors.primary,
            child: ListView(
              padding: const EdgeInsets.all(16),
              children: [
                // Stats row
                Row(
                  children: [
                    _statPill('Total', '${_pendingAdmissions.length}', AppColors.primary, cardColor, borderColor, textColor),
                    const SizedBox(width: 8),
                    _statPill('Pending', '${_pendingAdmissions.where((a) => a['status'] == 'pending').length}', const Color(0xFFF59E0B), cardColor, borderColor, textColor),
                    const SizedBox(width: 8),
                    _statPill('Approved', '${_pendingAdmissions.where((a) => a['status'] == 'approved').length}', AppColors.success, cardColor, borderColor, textColor),
                  ],
                ),
                const SizedBox(height: 16),
                ..._pendingAdmissions.map((a) => _AdmissionTile(admission: a, isDark: isDark, textColor: textColor, cardColor: cardColor, borderColor: borderColor)),
              ],
            ),
          ),
          // New admission form
          _submitted
              ? _buildSuccessView(isDark, textColor)
              : SingleChildScrollView(
                  padding: EdgeInsets.fromLTRB(16, 16, 16, MediaQuery.of(context).viewInsets.bottom + 16),
                  child: Form(
                    key: _formKey,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        _sectionLabel('Student Information', textColor),
                        _Field(label: 'Full Name', ctrl: _nameCtrl, isDark: isDark, validator: (v) => v!.isEmpty ? 'Required' : null),
                        _Field(label: 'Date of Birth (DD/MM/YYYY)', ctrl: _dobCtrl, isDark: isDark, keyboardType: TextInputType.datetime),
                        _Field(label: 'Class Applying For (e.g. 8-A)', ctrl: _classCtrl, isDark: isDark),
                        const SizedBox(height: 16),
                        _sectionLabel('Parent/Guardian Information', textColor),
                        _Field(label: 'Parent/Guardian Name', ctrl: _parentNameCtrl, isDark: isDark, validator: (v) => v!.isEmpty ? 'Required' : null),
                        _Field(label: 'Phone Number', ctrl: _phoneCtrl, isDark: isDark, keyboardType: TextInputType.phone, validator: (v) => v!.isEmpty ? 'Required' : null),
                        _Field(label: 'Email Address', ctrl: _emailCtrl, isDark: isDark, keyboardType: TextInputType.emailAddress),
                        _Field(label: 'Address', ctrl: _addressCtrl, isDark: isDark, maxLines: 3),
                        const SizedBox(height: 24),
                        SizedBox(
                          width: double.infinity,
                          child: ElevatedButton(
                            style: ElevatedButton.styleFrom(
                              backgroundColor: AppColors.primary,
                              padding: const EdgeInsets.symmetric(vertical: 16),
                              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                            ),
                            onPressed: _isSubmitting ? null : _submit,
                            child: _isSubmitting
                                ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                                : Text('Submit Application', style: GoogleFonts.inter(fontSize: 15, fontWeight: FontWeight.w700, color: Colors.white)),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
        ],
      ),
    );
  }

  Widget _statPill(String label, String value, Color color, Color cardColor, Color borderColor, Color textColor) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(color: cardColor, borderRadius: BorderRadius.circular(12), border: Border.all(color: borderColor)),
        child: Column(
          children: [
            Text(value, style: GoogleFonts.poppins(fontSize: 20, fontWeight: FontWeight.w900, color: color)),
            Text(label, style: GoogleFonts.inter(fontSize: 11, color: AppColors.textSecondary)),
          ],
        ),
      ),
    );
  }

  Widget _sectionLabel(String label, Color textColor) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Text(label, style: GoogleFonts.poppins(fontSize: 15, fontWeight: FontWeight.w700, color: textColor)),
    );
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _isSubmitting = true);
    await Future.delayed(const Duration(seconds: 1));
    setState(() { _isSubmitting = false; _submitted = true; });
  }

  Widget _buildSuccessView(bool isDark, Color textColor) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            width: 80, height: 80,
            decoration: BoxDecoration(color: AppColors.success.withValues(alpha: 0.12), shape: BoxShape.circle),
            child: Icon(Icons.check_circle_outline, size: 48, color: AppColors.success),
          ),
          const SizedBox(height: 16),
          Text('Application Submitted!', style: GoogleFonts.poppins(fontSize: 20, fontWeight: FontWeight.w800, color: textColor)),
          const SizedBox(height: 8),
          Text('The admission application has been submitted\nand will be reviewed shortly.',
              textAlign: TextAlign.center, style: GoogleFonts.inter(fontSize: 14, color: isDark ? DarkAppColors.textSecondary : AppColors.textSecondary)),
          const SizedBox(height: 24),
          ElevatedButton(
            onPressed: () => setState(() { _submitted = false; _nameCtrl.clear(); _parentNameCtrl.clear(); _phoneCtrl.clear(); }),
            style: ElevatedButton.styleFrom(backgroundColor: AppColors.primary, padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12))),
            child: Text('New Application', style: GoogleFonts.inter(fontWeight: FontWeight.w700, color: Colors.white)),
          ),
        ],
      ),
    );
  }
}

class _AdmissionTile extends StatelessWidget {
  final Map<String, dynamic> admission;
  final bool isDark;
  final Color textColor, cardColor, borderColor;

  const _AdmissionTile({required this.admission, required this.isDark, required this.textColor, required this.cardColor, required this.borderColor});

  Color get _statusColor {
    switch (admission['status']) {
      case 'approved': return AppColors.success;
      case 'review': return const Color(0xFF4F46E5);
      default: return const Color(0xFFF59E0B);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(color: cardColor, borderRadius: BorderRadius.circular(16), border: Border.all(color: borderColor)),
      child: Row(
        children: [
          Container(
            width: 44, height: 44,
            decoration: BoxDecoration(color: AppColors.primary.withValues(alpha: 0.12), borderRadius: BorderRadius.circular(12)),
            child: Icon(Icons.person_add_outlined, color: AppColors.primary, size: 22),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(admission['name']!, style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w700, color: textColor)),
                Text('Class ${admission['class']}  •  ${admission['date']}',
                    style: GoogleFonts.inter(fontSize: 12, color: isDark ? DarkAppColors.textSecondary : AppColors.textSecondary)),
              ],
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(color: _statusColor.withValues(alpha: 0.12), borderRadius: BorderRadius.circular(8)),
                child: Text(admission['status']!, style: GoogleFonts.inter(fontSize: 11, fontWeight: FontWeight.w700, color: _statusColor)),
              ),
              if (admission['status'] == 'pending') ...[
                const SizedBox(height: 6),
                Row(
                  children: [
                    _ActionBtn(label: 'Approve', color: AppColors.success, onTap: () {}),
                    const SizedBox(width: 6),
                    _ActionBtn(label: 'Reject', color: AppColors.error, onTap: () {}),
                  ],
                ),
              ],
            ],
          ),
        ],
      ),
    );
  }
}

class _ActionBtn extends StatelessWidget {
  final String label;
  final Color color;
  final VoidCallback onTap;
  const _ActionBtn({required this.label, required this.color, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
        decoration: BoxDecoration(color: color.withValues(alpha: 0.12), borderRadius: BorderRadius.circular(6)),
        child: Text(label, style: GoogleFonts.inter(fontSize: 10, fontWeight: FontWeight.w700, color: color)),
      ),
    );
  }
}

class _Field extends StatelessWidget {
  final String label;
  final TextEditingController ctrl;
  final bool isDark;
  final TextInputType keyboardType;
  final String? Function(String?)? validator;
  final int maxLines;

  const _Field({required this.label, required this.ctrl, required this.isDark, this.keyboardType = TextInputType.text, this.validator, this.maxLines = 1});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: TextFormField(
        controller: ctrl,
        keyboardType: keyboardType,
        maxLines: maxLines,
        validator: validator,
        style: GoogleFonts.inter(fontSize: 14),
        decoration: InputDecoration(
          labelText: label,
          filled: true,
          fillColor: isDark ? DarkAppColors.surface : AppColors.surface,
          border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: BorderSide.none),
          contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
        ),
      ),
    );
  }
}
