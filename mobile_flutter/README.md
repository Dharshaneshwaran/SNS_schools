# SNS ERP — Flutter Mobile App

A complete Flutter mobile application replicating the SNS School ERP web frontend, with full feature parity across Admin, Teacher, and Parent roles.

---

## Architecture

```
lib/
├── main.dart                          # App entry + AuthGate routing
├── core/
│   ├── config/
│   │   ├── app_config.dart            # Environment-based config
│   │   └── env.dart                   # API base URL
│   ├── models/
│   │   ├── user_model.dart            # UserModel with roles/status
│   │   ├── auth_session.dart          # AuthUser + AuthSession
│   │   └── student.dart               # Student model
│   ├── providers/
│   │   ├── auth_provider.dart         # Auth state (login/logout/checkAuth)
│   │   ├── theme_provider.dart        # Dark/light theme + splash state
│   │   └── services_providers.dart    # All service + state providers
│   ├── services/
│   │   ├── api_service.dart           # Dio client with JWT interceptor
│   │   ├── auth_service.dart          # Login/logout/getCurrentUser
│   │   ├── biometric_service.dart     # Fingerprint/face auth
│   │   ├── messaging_service.dart     # Chat + group messaging APIs
│   │   ├── notifications_service.dart # Notifications read/mark APIs
│   │   ├── dashboard_service.dart     # Overview/timetable/attendance APIs
│   │   └── users_service.dart         # User CRUD APIs
│   └── theme/
│       └── app_theme.dart             # Full light & dark themes (Poppins/Inter)
│
├── features/
│   ├── auth/presentation/screens/
│   │   ├── role_selection_screen.dart # Admin/Teacher/Parent role picker
│   │   ├── login_screen.dart          # Unified login form
│   │   ├── teacher_login_screen.dart  # Email-based teacher login
│   │   └── parent_login_screen.dart   # Mobile-based parent login
│   ├── splash/presentation/screens/
│   │   └── splash_screen.dart         # Animated splash with auto-routing
│   └── home/presentation/screens/
│       ├── admin_home_screen.dart      # Admin dashboard (15 screens)
│       ├── teacher_home_screen.dart    # Teacher dashboard (11 screens)
│       ├── home_screen.dart            # Parent dashboard (10 screens)
│       ├── events_screen.dart          # Instagram-style events feed
│       ├── diary_screen.dart           # Homework, timetable, exams tabs
│       ├── messages_screen.dart        # School announcements
│       ├── academic_screen.dart        # Calendar/attendance/results/leave
│       ├── transport_screen.dart       # Bus route & driver info
│       ├── profile_screen.dart         # Student/guardian profile
│       ├── settings_screen.dart        # Theme, language, password settings
│       ├── notifications_screen.dart   # Real-time notifications (API-backed)
│       ├── chat_screen.dart            # Direct + group chat (API-backed)
│       └── admin/
│           ├── users_screen.dart       # User CRUD (search, filter, delete, add)
│           ├── staff_screen.dart       # Staff/teachers directory (API)
│           ├── admission_screen.dart   # Applications list + new admission form
│           ├── alumni_screen.dart      # Alumni directory with batch filters
│           ├── timetable_screen.dart   # Day-wise period schedule (API)
│           ├── attendance_admin_screen.dart  # Attendance + leave approvals
│           ├── results_screen.dart     # Grade table with class/term filters
│           ├── transport_admin_screen.dart   # Multi-route bus management
│           ├── reports_screen.dart     # Report generation (API + static)
│           └── substitutions_screen.dart    # Pending/emergency substitutions
│
└── shared/
    └── widgets/
        └── primary_action_button.dart  # Reusable CTA button
```

---

## Setup Instructions

### Prerequisites

- Flutter 3.41+ (`flutter --version`)
- Dart 3.x
- Android Studio or VS Code with Flutter extension
- Backend running at `http://localhost:5000`

### 1. Install Dependencies

```bash
cd mobile_flutter
flutter pub get
```

### 2. Configure API URL

Edit `env.json` in the project root:

```json
{
  "API_BASE_URL": "http://<your-backend-ip>:5000",
  "DEMO_USER_EMAIL": "teacher@sns-erp.local",
  "DEMO_USER_PASSWORD": "ChangeMe123!"
}
```

> For physical devices, replace `127.0.0.1` with your machine's LAN IP (e.g., `192.168.1.7`).

### 3. Run the App

```bash
# Run on connected device/emulator
flutter run

# Build debug APK
flutter build apk --debug

# Build release APK
flutter build apk --release
```

---

## API Endpoints Mapped

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | Login with email + password → JWT |
| POST | `/auth/refresh` | Refresh access token |
| GET | `/auth/me` | Get current user profile |

### Dashboard / Modules
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/dashboard/overview` | Admin stats + panels + quick actions |
| GET | `/teachers` | Teachers list + department summary |
| GET | `/timetable` | Weekly class schedule |
| GET | `/attendance` | Attendance summary + leave requests |
| GET | `/substitutions` | Pending / emergency / auto-assigned |
| GET | `/reports` | Available reports + highlights |
| GET | `/settings` | Institution + notification settings |

### User Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users` | All users (admin only) |
| POST | `/users/teacher` | Create teacher account |
| POST | `/users/student` | Create student account |
| DELETE | `/users/{id}` | Delete user |

### Messaging
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/messaging/conversations` | Direct message contact list |
| GET | `/messaging/history/{id}` | Chat history with recipient |
| POST | `/messaging/send` | Send direct message |
| GET | `/messaging/groups` | Group chat list |
| POST | `/messaging/groups` | Create new group |
| POST | `/messaging/groups/{id}/members` | Add member to group |

### Notifications
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/notifications` | All notifications |
| PATCH | `/notifications/{id}/read` | Mark single notification read |
| POST | `/notifications/read-all` | Mark all notifications read |

---

## Screens by Role

### Admin (15 screens)
| Screen | Features |
|--------|----------|
| Dashboard | Stats cards, quick actions, activity feed, pending approvals |
| Notifications | Real API — unread badges, mark read/all-read |
| Attendance | Class-wise rates, progress bars, leave approvals |
| Timetable | Day-picker, period cards with teacher/room |
| Events | Instagram-style stories + feed |
| Users | Search, role filter, add teacher/student, delete |
| Staff | API-backed teacher directory with summary cards |
| Admission | Applications list (approve/reject) + submission form |
| Alumni | Search + batch-filter alumni directory |
| Results | Grade table with class/term filter |
| Transport | Multi-route bus management with stops & driver info |
| Reports | PDF/XLS report list with download trigger |
| Chat | Direct + group messaging (real API) |
| Substitutions | Pending/emergency/assigned tabs, assign button |
| Settings | App configuration |

### Teacher (11 screens)
Dashboard, Notifications, Attendance, Timetable, Events, Results, Transport, Reports, Chat, Substitutions, Settings

### Parent (10 screens)
Dashboard, Events, Diary, Messages, Academic (5 tabs), Transport, Notifications, Chat, Profile, Settings

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Flutter 3.41 / Dart 3.11 |
| State Management | Riverpod 2.x (StateNotifier + FutureProvider) |
| HTTP Client | Dio 5.x with JWT interceptor |
| Secure Storage | flutter_secure_storage 9.x |
| Local Storage | shared_preferences 2.x |
| Fonts | Google Fonts (Poppins + Inter) |
| Charts | fl_chart 0.66 |
| Loading Effects | shimmer + flutter_spinkit |
| Biometrics | local_auth 2.3 |
| Build | Kotlin 2.0.21 + AGP 8.6.0 + Gradle 8.10.2 |

---

## Design System (Web Parity)

| Token | Value |
|-------|-------|
| Primary | `#FF7F50` (Coral — exact match to web) |
| Dark Mode BG | `#0B0B0B` |
| Card (light) | `#FFFFFF` with `#E2E8F0` border |
| Card (dark) | `#1A1A1A` with `rgba(255,255,255,0.1)` border |
| Heading Font | Poppins (700/800/900) |
| Body Font | Inter (400/500/600/700) |
| Border Radius | 12–24px |
| Error | `#EF4444` |
| Success | `#10B981` |

---

## Notes

- All screens gracefully fall back to static demo data when the backend is unavailable
- JWT tokens are stored in `flutter_secure_storage` (not localStorage like the web app)
- Biometric authentication requires a valid session to already exist
- Dark mode persists across app restarts via `shared_preferences`
