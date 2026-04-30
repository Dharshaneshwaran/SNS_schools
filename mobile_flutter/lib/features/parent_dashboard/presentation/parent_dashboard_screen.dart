import 'package:flutter/material.dart';

import '../../../core/models/auth_session.dart';
import '../../../core/models/student.dart';
import 'tabs/events_gallery_tab.dart';
import 'tabs/profile_tab.dart';
import 'tabs/diary_tab.dart';
import 'tabs/academic_tab.dart';
import 'tabs/transport_tab.dart';
import 'tabs/settings_tab.dart';

class ParentDashboardScreen extends StatefulWidget {
  const ParentDashboardScreen({
    required this.session,
    required this.onLogout,
    this.isDarkMode = false,
    this.onThemeChanged,
    super.key,
  });

  final AuthSession session;
  final VoidCallback onLogout;
  final bool isDarkMode;
  final ValueChanged<bool>? onThemeChanged;

  @override
  State<ParentDashboardScreen> createState() => _ParentDashboardScreenState();
}

class _ParentDashboardScreenState extends State<ParentDashboardScreen> {
  int _currentIndex = 0;
  bool _isStudentDropdownOpen = false;
  late AuthSession _currentSession;
  int _selectedStudentIndex = 0;

  final List<Student> _students = const [
    Student(
      id: '1',
      name: 'Yuvraj Sharma',
      className: 'Class X',
      section: 'Sec A',
      initials: 'YS',
    ),
    Student(
      id: '2',
      name: 'Arjun Sharma',
      className: 'Class VII',
      section: 'Sec B',
      initials: 'AS',
    ),
  ];

  @override
  void initState() {
    super.initState();
    _currentSession = widget.session;
  }

  final List<String> _pageTitles = [
    'Events Gallery',
    'Profile',
    'Diary',
    'Academic',
    'Transport',
    'Settings',
  ];

  void _selectTab(int index) {
    setState(() {
      _currentIndex = index;
    });
    Navigator.pop(context);
  }

  void _selectStudent(int index) {
    setState(() {
      _selectedStudentIndex = index;
      _isStudentDropdownOpen = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final selectedStudent = _students[_selectedStudentIndex];

    return Scaffold(
      backgroundColor: theme.scaffoldBackgroundColor,
      appBar: AppBar(
        title: Text(
          _pageTitles[_currentIndex],
          style: theme.textTheme.titleLarge?.copyWith(
            fontWeight: FontWeight.w700,
            color: theme.colorScheme.onSurface,
          ),
        ),
        backgroundColor: theme.cardColor,
        elevation: 0,
        surfaceTintColor: Colors.transparent,
        iconTheme: IconThemeData(color: theme.colorScheme.onSurface),
      ),
      drawer: _buildDrawer(theme),
      body: [
        const EventsGalleryTab(),
        ProfileTab(student: selectedStudent),
        DiaryTab(student: selectedStudent),
        AcademicTab(student: selectedStudent),
        TransportTab(student: selectedStudent),
        SettingsTab(
          session: _currentSession,
          isDarkMode: widget.isDarkMode,
          onThemeChanged: widget.onThemeChanged,
          onSessionUpdated: (newSession) {
            setState(() {
              _currentSession = newSession;
            });
          },
        ),
      ][_currentIndex],
    );
  }

  Widget _buildDrawer(ThemeData theme) {
    final selectedStudent = _students[_selectedStudentIndex];
    final otherStudents = _students.asMap().entries.where((e) => e.key != _selectedStudentIndex).toList();

    return Drawer(
      backgroundColor: theme.cardColor,
      child: SafeArea(
        child: Column(
          children: [
            // Logo Header
            Container(
              padding: const EdgeInsets.only(top: 16, bottom: 20, left: 24, right: 24),
              decoration: BoxDecoration(
                border: Border(bottom: BorderSide(color: Colors.grey[200]!)),
              ),
              child: Row(
                children: [
                  Container(
                    width: 38,
                    height: 38,
                    decoration: BoxDecoration(
                      color: const Color(0xFFFF7F50),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: const Icon(Icons.school, color: Colors.white, size: 22),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'SNS Academy',
                          style: TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 16,
                            color: theme.colorScheme.onSurface,
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          'PARENT PORTAL',
                          style: TextStyle(
                            fontSize: 10,
                            fontWeight: FontWeight.bold,
                            color: const Color(0xFFFF7F50),
                            letterSpacing: 1.2,
                          ),
                        ),
                      ],
                    ),
                  )
                ],
              ),
            ),

            // Student Switcher
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                border: Border(bottom: BorderSide(color: Colors.grey[200]!)),
              ),
              child: Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: theme.brightness == Brightness.light 
                        ? [const Color(0xFFFFF5F0), Colors.white]
                        : [const Color(0xFF2D2D2D), const Color(0xFF1E1E1E)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: const Color(0xFFFF7F50).withValues(alpha: 0.2)),
                ),
                child: Column(
                  children: [
                    InkWell(
                      onTap: () {
                        setState(() {
                          _isStudentDropdownOpen = !_isStudentDropdownOpen;
                        });
                      },
                      borderRadius: BorderRadius.circular(14),
                      child: Padding(
                        padding: const EdgeInsets.all(12),
                        child: Row(
                          children: [
                            Container(
                              width: 42,
                              height: 42,
                              decoration: const BoxDecoration(
                                shape: BoxShape.circle,
                                gradient: LinearGradient(
                                  colors: [Color(0xFFFF7F50), Color(0xFFE66A3E)],
                                ),
                                boxShadow: [
                                  BoxShadow(
                                    color: Color(0x59FF7F50),
                                    blurRadius: 8,
                                    offset: Offset(0, 4),
                                  ),
                                ],
                              ),
                              alignment: Alignment.center,
                              child: Text(
                                selectedStudent.initials,
                                style: const TextStyle(
                                  color: Colors.white,
                                  fontWeight: FontWeight.bold,
                                  fontSize: 16,
                                ),
                              ),
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    selectedStudent.name,
                                    style: TextStyle(
                                      fontWeight: FontWeight.bold,
                                      fontSize: 14,
                                      color: theme.colorScheme.onSurface,
                                    ),
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                  const SizedBox(height: 2),
                                  Text(
                                    '${selectedStudent.className} - ${selectedStudent.section}',
                                    style: TextStyle(
                                      fontSize: 11,
                                      color: Colors.grey[600],
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            Icon(
                              _isStudentDropdownOpen
                                  ? Icons.keyboard_arrow_up
                                  : Icons.keyboard_arrow_down,
                              color: const Color(0xFFFF7F50),
                            ),
                          ],
                        ),
                      ),
                    ),
                    if (_isStudentDropdownOpen && otherStudents.isNotEmpty) ...[
                      Divider(color: Colors.grey[200], height: 1),
                      ...otherStudents.map((entry) {
                        final student = entry.value;
                        final index = entry.key;
                        return InkWell(
                          onTap: () => _selectStudent(index),
                          child: Padding(
                            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                            child: Row(
                              children: [
                                Container(
                                  width: 30,
                                  height: 30,
                                  decoration: const BoxDecoration(
                                    shape: BoxShape.circle,
                                    color: Color(0xFFFF7F50),
                                  ),
                                  alignment: Alignment.center,
                                  child: Text(
                                    student.initials,
                                    style: const TextStyle(
                                      color: Colors.white,
                                      fontWeight: FontWeight.bold,
                                      fontSize: 11,
                                    ),
                                  ),
                                ),
                                const SizedBox(width: 10),
                                Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      student.name,
                                      style: TextStyle(
                                        fontWeight: FontWeight.w600,
                                        fontSize: 13,
                                        color: theme.colorScheme.onSurface,
                                      ),
                                    ),
                                    Text(
                                      '${student.className} - ${student.section}',
                                      style: TextStyle(
                                        fontSize: 11,
                                        color: Colors.grey[600],
                                      ),
                                    ),
                                  ],
                                )
                              ],
                            ),
                          ),
                        );
                      }).toList(),
                    ]
                  ],
                ),
              ),
            ),

            // Navigation Links
            Expanded(
              child: ListView(
                padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 12),
                children: [
                  Padding(
                    padding: const EdgeInsets.only(left: 12, bottom: 8),
                    child: Text(
                      'NAVIGATION',
                      style: TextStyle(
                        fontSize: 10,
                        fontWeight: FontWeight.bold,
                        color: Colors.grey[500],
                        letterSpacing: 1.2,
                      ),
                    ),
                  ),
                  _buildNavItem(0, 'Events Gallery', Icons.photo_library_outlined, Icons.photo_library),
                  _buildNavItem(1, 'Profile', Icons.person_outline, Icons.person),
                  _buildNavItem(2, 'Diary', Icons.menu_book_outlined, Icons.menu_book, badge: '3'),
                  _buildNavItem(3, 'Academic', Icons.bar_chart_outlined, Icons.bar_chart),
                  _buildNavItem(4, 'Transport', Icons.directions_bus_outlined, Icons.directions_bus),
                  _buildNavItem(5, 'Settings', Icons.settings_outlined, Icons.settings),
                ],
              ),
            ),

            // Logout
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                border: Border(top: BorderSide(color: Colors.grey[200]!)),
              ),
              child: InkWell(
                onTap: widget.onLogout,
                borderRadius: BorderRadius.circular(12),
                child: Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                  child: Row(
                    children: [
                      Icon(Icons.logout, color: Colors.grey[600], size: 20),
                      const SizedBox(width: 16),
                      Text(
                        'Sign Out',
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w600,
                          color: Colors.grey[700],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            )
          ],
        ),
      ),
    );
  }

  Widget _buildNavItem(int index, String title, IconData outlineIcon, IconData filledIcon, {String? badge}) {
    final isActive = _currentIndex == index;
    final theme = Theme.of(context);

    return Container(
      margin: const EdgeInsets.only(bottom: 4),
      decoration: BoxDecoration(
        gradient: isActive
            ? const LinearGradient(colors: [Color(0xFFFF7F50), Color(0xFFE66A3E)])
            : null,
        borderRadius: BorderRadius.circular(12),
        boxShadow: isActive
            ? [
                const BoxShadow(
                  color: Color(0x4DFF7F50),
                  blurRadius: 12,
                  offset: Offset(0, 4),
                )
              ]
            : [],
      ),
      child: ListTile(
        onTap: () => _selectTab(index),
        leading: Icon(
          isActive ? filledIcon : outlineIcon,
          color: isActive ? Colors.white : Colors.grey[600],
          size: 22,
        ),
        title: Text(
          title,
          style: TextStyle(
            fontWeight: isActive ? FontWeight.bold : FontWeight.w600,
            color: isActive ? Colors.white : theme.colorScheme.onSurface,
            fontSize: 14,
          ),
        ),
        trailing: badge != null
            ? Container(
                padding: const EdgeInsets.all(4),
                decoration: BoxDecoration(
                  color: isActive ? Colors.white.withValues(alpha: 0.3) : const Color(0xFFFF7F50),
                  shape: BoxShape.circle,
                ),
                alignment: Alignment.center,
                width: 20,
                height: 20,
                child: Text(
                  badge,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              )
            : null,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 0),
        dense: true,
      ),
    );
  }
}
