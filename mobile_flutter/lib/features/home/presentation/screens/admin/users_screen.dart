import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../../../../core/theme/app_theme.dart';
import '../../../../../core/providers/services_providers.dart';
import '../../../../../core/services/users_service.dart';

class UsersScreen extends ConsumerStatefulWidget {
  const UsersScreen({super.key});

  @override
  ConsumerState<UsersScreen> createState() => _UsersScreenState();
}

class _UsersScreenState extends ConsumerState<UsersScreen> {
  String _searchQuery = '';
  String _selectedRole = 'All';

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final textColor = isDark ? DarkAppColors.textPrimary : AppColors.textPrimary;
    final bg = isDark ? DarkAppColors.background : AppColors.background;
    final cardColor = isDark ? DarkAppColors.card : AppColors.card;
    final borderColor = isDark ? DarkAppColors.border : AppColors.border;
    final usersAsync = ref.watch(usersListProvider);

    return Scaffold(
      backgroundColor: bg,
      appBar: AppBar(
        backgroundColor: cardColor,
        elevation: 0,
        title: Text('User Management', style: GoogleFonts.poppins(fontSize: 18, fontWeight: FontWeight.w800, color: textColor)),
        actions: [
          IconButton(
            icon: Icon(Icons.person_add_outlined, color: AppColors.primary),
            onPressed: () => _showAddUserDialog(context),
          ),
        ],
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 12, 16, 8),
            child: Column(
              children: [
                // Search
                TextField(
                  onChanged: (v) => setState(() => _searchQuery = v.toLowerCase()),
                  style: GoogleFonts.inter(fontSize: 14, color: textColor),
                  decoration: InputDecoration(
                    hintText: 'Search users...',
                    hintStyle: GoogleFonts.inter(fontSize: 14, color: isDark ? DarkAppColors.textSecondary : AppColors.textSecondary),
                    prefixIcon: Icon(Icons.search, color: AppColors.primary, size: 20),
                    filled: true,
                    fillColor: isDark ? DarkAppColors.surface : AppColors.surface,
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(14), borderSide: BorderSide.none),
                    contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                  ),
                ),
                const SizedBox(height: 10),
                // Role filter
                SizedBox(
                  height: 36,
                  child: ListView(
                    scrollDirection: Axis.horizontal,
                    children: ['All', 'admin', 'teacher', 'parent', 'superadmin', 'leader'].map((role) {
                      final isSelected = _selectedRole == role;
                      return GestureDetector(
                        onTap: () => setState(() => _selectedRole = role),
                        child: Container(
                          margin: const EdgeInsets.only(right: 8),
                          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                          decoration: BoxDecoration(
                            color: isSelected ? AppColors.primary : (isDark ? DarkAppColors.surface : AppColors.surface),
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(color: isSelected ? AppColors.primary : borderColor),
                          ),
                          child: Text(role,
                              style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w600,
                                  color: isSelected ? Colors.white : (isDark ? DarkAppColors.textSecondary : AppColors.textSecondary))),
                        ),
                      );
                    }).toList(),
                  ),
                ),
              ],
            ),
          ),
          Expanded(
            child: usersAsync.when(
              loading: () => const Center(child: CircularProgressIndicator()),
              error: (e, _) => _ErrorWidget(onRetry: () => ref.invalidate(usersListProvider)),
              data: (users) {
                final filtered = users.where((u) {
                  final matchSearch = _searchQuery.isEmpty || u.name.toLowerCase().contains(_searchQuery) || u.email.toLowerCase().contains(_searchQuery);
                  final matchRole = _selectedRole == 'All' || u.role == _selectedRole;
                  return matchSearch && matchRole;
                }).toList();

                if (filtered.isEmpty) {
                  return Center(child: Text('No users found', style: GoogleFonts.inter(color: isDark ? DarkAppColors.textSecondary : AppColors.textSecondary)));
                }

                return RefreshIndicator(
                  onRefresh: () async => ref.invalidate(usersListProvider),
                  color: AppColors.primary,
                  child: ListView.builder(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
                    itemCount: filtered.length,
                    itemBuilder: (_, i) => _UserTile(
                      user: filtered[i],
                      isDark: isDark,
                      textColor: textColor,
                      cardColor: cardColor,
                      borderColor: borderColor,
                      onDelete: () => _confirmDelete(context, ref, filtered[i]),
                    ),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  void _confirmDelete(BuildContext context, WidgetRef ref, DashboardUser user) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: isDark ? DarkAppColors.card : AppColors.card,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: Text('Delete User', style: GoogleFonts.poppins(fontWeight: FontWeight.w700)),
        content: Text('Are you sure you want to delete ${user.name}?', style: GoogleFonts.inter()),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
          ElevatedButton(
            style: ElevatedButton.styleFrom(backgroundColor: AppColors.error),
            onPressed: () async {
              Navigator.pop(ctx);
              try {
                await ref.read(usersServiceProvider).deleteUser(user.id);
                ref.invalidate(usersListProvider);
                if (mounted) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text('${user.name} deleted'), backgroundColor: AppColors.success),
                  );
                }
              } catch (e) {
                if (mounted) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text('Error: $e'), backgroundColor: AppColors.error),
                  );
                }
              }
            },
            child: const Text('Delete', style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
    );
  }

  void _showAddUserDialog(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    String selectedType = 'teacher';
    final nameCtrl = TextEditingController();
    final emailCtrl = TextEditingController();
    final deptCtrl = TextEditingController();
    final empIdCtrl = TextEditingController();
    final desigCtrl = TextEditingController();
    final passCtrl = TextEditingController();

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setModalState) => Container(
          padding: EdgeInsets.fromLTRB(20, 20, 20, MediaQuery.of(ctx).viewInsets.bottom + 20),
          decoration: BoxDecoration(
            color: isDark ? DarkAppColors.card : AppColors.card,
            borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
          ),
          child: SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                Center(child: Container(width: 40, height: 4, decoration: BoxDecoration(color: Colors.grey.withValues(alpha: 0.3), borderRadius: BorderRadius.circular(2)))),
                const SizedBox(height: 16),
                Text('Add New User', style: GoogleFonts.poppins(fontSize: 18, fontWeight: FontWeight.w800)),
                const SizedBox(height: 16),
                // Type selector
                Row(
                  children: ['teacher', 'student'].map((type) {
                    final isSelected = selectedType == type;
                    return GestureDetector(
                      onTap: () => setModalState(() => selectedType = type),
                      child: Container(
                        margin: const EdgeInsets.only(right: 8),
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                        decoration: BoxDecoration(
                          color: isSelected ? AppColors.primary : (isDark ? DarkAppColors.surface : AppColors.surface),
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: Text(type.toUpperCase(), style: GoogleFonts.inter(fontSize: 12, fontWeight: FontWeight.w700, color: isSelected ? Colors.white : (isDark ? DarkAppColors.textSecondary : AppColors.textSecondary))),
                      ),
                    );
                  }).toList(),
                ),
                const SizedBox(height: 16),
                _FormField(label: 'Full Name', ctrl: nameCtrl, isDark: isDark),
                _FormField(label: 'Email', ctrl: emailCtrl, isDark: isDark, keyboardType: TextInputType.emailAddress),
                _FormField(label: 'Department', ctrl: deptCtrl, isDark: isDark),
                if (selectedType == 'teacher') ...[
                  _FormField(label: 'Employee ID', ctrl: empIdCtrl, isDark: isDark),
                  _FormField(label: 'Designation', ctrl: desigCtrl, isDark: isDark),
                ],
                _FormField(label: 'Password', ctrl: passCtrl, isDark: isDark, obscure: true),
                const SizedBox(height: 20),
                SizedBox(
                  width: double.infinity,
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: AppColors.primary,
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                    ),
                    onPressed: () async {
                      try {
                        final data = {
                          'name': nameCtrl.text,
                          'email': emailCtrl.text,
                          'department': deptCtrl.text,
                          'password': passCtrl.text,
                          if (selectedType == 'teacher') 'employeeId': empIdCtrl.text,
                          if (selectedType == 'teacher') 'designation': desigCtrl.text,
                        };
                        if (selectedType == 'teacher') {
                          await ref.read(usersServiceProvider).createTeacher(data);
                        } else {
                          await ref.read(usersServiceProvider).createStudent(data);
                        }
                        ref.invalidate(usersListProvider);
                        if (mounted) Navigator.pop(ctx);
                      } catch (e) {
                        if (mounted) {
                          ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Error: $e'), backgroundColor: AppColors.error));
                        }
                      }
                    },
                    child: Text('Add User', style: GoogleFonts.inter(fontSize: 15, fontWeight: FontWeight.w700, color: Colors.white)),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _UserTile extends StatelessWidget {
  final DashboardUser user;
  final bool isDark;
  final Color textColor, cardColor, borderColor;
  final VoidCallback onDelete;

  const _UserTile({required this.user, required this.isDark, required this.textColor, required this.cardColor, required this.borderColor, required this.onDelete});

  Color get _roleColor {
    switch (user.role) {
      case 'admin': case 'superadmin': return AppColors.error;
      case 'teacher': return const Color(0xFF4F46E5);
      case 'leader': return const Color(0xFFF59E0B);
      default: return AppColors.success;
    }
  }

  @override
  Widget build(BuildContext context) {
    final textSecondary = isDark ? DarkAppColors.textSecondary : AppColors.textSecondary;
    return Container(
      margin: const EdgeInsets.only(bottom: 8),
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(color: cardColor, borderRadius: BorderRadius.circular(16), border: Border.all(color: borderColor)),
      child: Row(
        children: [
          Container(
            width: 44, height: 44,
            decoration: BoxDecoration(
              color: _roleColor.withValues(alpha: 0.12),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Center(child: Text(user.name.isNotEmpty ? user.name[0].toUpperCase() : '?',
                style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.w800, color: _roleColor))),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(user.name, style: GoogleFonts.inter(fontSize: 14, fontWeight: FontWeight.w700, color: textColor)),
                Text(user.email, style: GoogleFonts.inter(fontSize: 12, color: textSecondary), overflow: TextOverflow.ellipsis),
                if (user.department.isNotEmpty)
                  Text(user.department, style: GoogleFonts.inter(fontSize: 11, color: textSecondary)),
              ],
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(color: _roleColor.withValues(alpha: 0.12), borderRadius: BorderRadius.circular(6)),
                child: Text(user.role, style: GoogleFonts.inter(fontSize: 10, fontWeight: FontWeight.w700, color: _roleColor)),
              ),
              const SizedBox(height: 6),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: user.status == 'active' ? AppColors.success.withValues(alpha: 0.12) : AppColors.error.withValues(alpha: 0.12),
                  borderRadius: BorderRadius.circular(6),
                ),
                child: Text(user.status, style: GoogleFonts.inter(fontSize: 10, fontWeight: FontWeight.w600, color: user.status == 'active' ? AppColors.success : AppColors.error)),
              ),
              const SizedBox(height: 4),
              GestureDetector(onTap: onDelete, child: Icon(Icons.delete_outline, color: AppColors.error, size: 20)),
            ],
          ),
        ],
      ),
    );
  }
}

class _FormField extends StatelessWidget {
  final String label;
  final TextEditingController ctrl;
  final bool isDark;
  final bool obscure;
  final TextInputType keyboardType;

  const _FormField({required this.label, required this.ctrl, required this.isDark, this.obscure = false, this.keyboardType = TextInputType.text});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: TextField(
        controller: ctrl,
        obscureText: obscure,
        keyboardType: keyboardType,
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

class _ErrorWidget extends StatelessWidget {
  final VoidCallback onRetry;
  const _ErrorWidget({required this.onRetry});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(Icons.error_outline, size: 48, color: AppColors.error),
          const SizedBox(height: 12),
          Text('Failed to load users', style: GoogleFonts.inter(color: AppColors.error)),
          const SizedBox(height: 16),
          ElevatedButton(onPressed: onRetry, style: ElevatedButton.styleFrom(backgroundColor: AppColors.primary),
              child: const Text('Retry', style: TextStyle(color: Colors.white))),
        ],
      ),
    );
  }
}
