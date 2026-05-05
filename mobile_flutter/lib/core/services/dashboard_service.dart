import 'api_service.dart';

class DashboardOverview {
  final Map<String, dynamic> data;
  DashboardOverview(this.data);
  factory DashboardOverview.fromJson(Map<String, dynamic> j) => DashboardOverview(j);
}

class TeachersData {
  final List<dynamic> teachers;
  final Map<String, dynamic> summary;
  TeachersData({required this.teachers, required this.summary});
  factory TeachersData.fromJson(Map<String, dynamic> j) => TeachersData(
    teachers: j['teachers'] ?? [],
    summary: j['summary'] ?? {},
  );
}

class TimetableData {
  final Map<String, dynamic> data;
  TimetableData(this.data);
  factory TimetableData.fromJson(Map<String, dynamic> j) => TimetableData(j);
}

class AttendanceData {
  final Map<String, dynamic> data;
  AttendanceData(this.data);
  factory AttendanceData.fromJson(Map<String, dynamic> j) => AttendanceData(j);
}

class SubstitutionsData {
  final List<dynamic> pending;
  final List<dynamic> emergency;
  final List<dynamic> autoAssigned;
  SubstitutionsData({required this.pending, required this.emergency, required this.autoAssigned});
  factory SubstitutionsData.fromJson(Map<String, dynamic> j) => SubstitutionsData(
    pending: j['pending'] ?? [],
    emergency: j['emergency'] ?? [],
    autoAssigned: j['autoAssigned'] ?? [],
  );
}

class ReportsData {
  final List<dynamic> reports;
  final List<dynamic> highlights;
  ReportsData({required this.reports, required this.highlights});
  factory ReportsData.fromJson(Map<String, dynamic> j) => ReportsData(
    reports: j['reports'] ?? [],
    highlights: j['highlights'] ?? [],
  );
}

class SettingsData {
  final Map<String, dynamic> data;
  SettingsData(this.data);
  factory SettingsData.fromJson(Map<String, dynamic> j) => SettingsData(j);
}

class DashboardService {
  final ApiService _api;
  DashboardService(this._api);

  Future<DashboardOverview> getOverview() async {
    final res = await _api.get('/dashboard/overview');
    return DashboardOverview.fromJson(res.data ?? {});
  }

  Future<TeachersData> getTeachers() async {
    final res = await _api.get('/teachers');
    return TeachersData.fromJson(res.data ?? {});
  }

  Future<TimetableData> getTimetable() async {
    final res = await _api.get('/timetable');
    return TimetableData.fromJson(res.data ?? {});
  }

  Future<AttendanceData> getAttendance() async {
    final res = await _api.get('/attendance');
    return AttendanceData.fromJson(res.data ?? {});
  }

  Future<SubstitutionsData> getSubstitutions() async {
    final res = await _api.get('/substitutions');
    return SubstitutionsData.fromJson(res.data ?? {});
  }

  Future<ReportsData> getReports() async {
    final res = await _api.get('/reports');
    return ReportsData.fromJson(res.data ?? {});
  }

  Future<SettingsData> getSettings() async {
    final res = await _api.get('/settings');
    return SettingsData.fromJson(res.data ?? {});
  }
}
