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
      id: json['id'],
      email: json['email'],
      name: json['name'],
      role: _parseRole(json['role']),
      status: _parseStatus(json['status']),
      photoUrl: json['photoUrl'],
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

  static UserRole _parseRole(String role) {
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

  static AccountStatus _parseStatus(String status) {
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
