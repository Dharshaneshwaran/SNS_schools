enum UserRole { admin, staff, parent }
enum AccountStatus { pending_approval, active, suspended, deactivated }

class UserModel {
  final String id;
  final String email;
  final String name;
  final UserRole role;
  final AccountStatus status;
  final String? photoUrl;

  UserModel({
    required this.id,
    required this.email,
    required this.name,
    required this.role,
    required this.status,
    this.photoUrl,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id'] as String? ?? '',
      email: json['email'] as String? ?? '',
      name: json['name'] as String? ?? '',
      role: _parseRole(json['role'] as String?),
      status: _parseStatus(json['status'] as String?),
      photoUrl: json['photoUrl'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'email': email,
      'name': name,
      'role': role.name,
      'status': status.name,
      'photoUrl': photoUrl,
    };
  }

  static UserRole _parseRole(String? role) {
    if (role == null) return UserRole.parent;
    switch (role.toLowerCase()) {
      case 'admin':
        return UserRole.admin;
      case 'staff':
      case 'teacher':
        return UserRole.staff;
      case 'parent':
        return UserRole.parent;
      default:
        return UserRole.parent;
    }
  }

  static AccountStatus _parseStatus(String? status) {
    if (status == null) return AccountStatus.pending_approval;
    switch (status.toLowerCase()) {
      case 'pending_approval':
        return AccountStatus.pending_approval;
      case 'active':
        return AccountStatus.active;
      case 'suspended':
        return AccountStatus.suspended;
      case 'deactivated':
        return AccountStatus.deactivated;
      default:
        return AccountStatus.pending_approval;
    }
  }
}
