# SNS Academy ERP - All Pages, Functions and On-Screen Text

Generated from the frontend source (frontend/src). Parts: 1 shared/public + admin home + notifications, 2 people and academic structure, 3 daily operations, 4 posts/results/settings, 5 teacher portal, 6 parent portal.

# Part 1: Shared and Public Pages

Frontend: `frontend/src` (Next.js). API base URL is `NEXT_PUBLIC_API_BASE_URL`, default `http://localhost:5000`. All calls go through `services/api-client.ts` (`apiRequest`), which adds `Authorization: Bearer <accessToken>` from the stored session. On any 401 outside `/auth/login`, `/auth/change-password` and `/auth/verify-student`, it clears the session and sends the browser to `/login`.

Roles in the code: `admin`, `leader`, `teacher`, `parent`. `lib/role-access.ts`: `getDashboardRoute` returns `/parent-dashboard` for parent, `/teacher-dashboard` for teacher, `/dashboard` for everyone else. `canAccessWebDashboard` is true for all four roles.

---

## 1. Landing page

- **Route:** `/` (`app/page.tsx`)
- **Who can access:** Everyone. No auth check.
- **Purpose:** Public marketing page for SNS Academy and the ERP. It links visitors to the login page.

### Functions
| Element | Action |
|---|---|
| Header "Login" button | Link to `/login` |
| Header nav links About / Features / Experience / Contact | Links to `/#about`, `/#features`, `/#experience`, `/#contact` (anchors on the same page; Contact is the Footer) |
| Header logo | Link to `/` |
| Hero "Access Dashboard" | Link to `/login` |
| Hero "Explore Features" | Link to `#features` |
| CTA "Access Dashboard" | Link to `/login` |
| Header | Becomes translucent and blurred after scrolling more than 50px |

No backend API calls. Scroll animations use framer-motion.

### Text on screen
- Hero badge: `SNS ACADEMY ERP · Innovation Focused`
- Hero title: `Smart School` / `Management with` / `SNS ERP`
- Hero text: `Simplifying communication between parents, teachers, and administration through innovation and design thinking — all in one powerful, unified platform.`
- Hero image alt: `SNS ERP Dashboard`
- Buttons: `Access Dashboard`, `Explore Features`
- Stats: `1000+` Happy Students; `200+` Expert Teachers; `Since` 2014
- Section "Why Parents Choose SNS Academy": `We don't just teach subjects—we redesign common minds through design thinking, preparing your child for tomorrow's challenges.`
  - SNS Innovation Hub: `Access to SNS iHub—India's Y-Combinator equivalent. Students work with AI, IoT, Robotics, AR/VR labs preparing them for future careers.`
  - World-Class SPINE Center: `5-level activity center with swimming pool, indoor cricket, gym, music studio, dance studio, theater, and more—everything under one roof.`
  - 5 Pillars Development: `Learning, Upskilling, Innovation, Networking, Character Building—comprehensive development for future leaders.`
  - 3P Culture Framework: `Purpose, Process, People—our holistic approach ensures every child develops academically, socially, emotionally, and ethically.`
  - Design Thinking Education: `India's first school with GenAI-Powered Design Thinking Framework (Patented). Built on Empathy, every child learns to solve problems creatively using AI-enhanced methodologies from an early age.`
  - 10:1 Personalized Care: `Ultra-low student-teacher ratio ensures every child receives individual attention. Over 60% of our faculty have 10+ years of teaching experience.`
- About section (`#about`): label `Who We Are`; title `Excellence in Education`; `Leading the digital transformation in Coimbatore's most progressive CBSE school.`
  - Academics: `Design Thinking integrated CBSE curriculum for holistic student development and global readiness.`
  - Experienced Teachers: `Well trained teachers providing a 10:1 student-teacher ratio with personalised mentorship.`
  - Achievements: `Consistently securing top ranks in national and international competitions year after year.`
- Features section (`#features`): label `ERP Capabilities`; title `Power Features`; `Everything you need to manage school life efficiently — in one place.`
  - Student Dashboard: `360-degree view of student progress and activities.`
  - Attendance Tracking: `Real-time updates and monthly attendance reports.`
  - Bus Tracking: `Live location updates and route management.`
  - Homework & Diary: `Daily assignments and teacher notes at your fingertips.`
  - Academic Reports: `Detailed performance analytics and exam results.`
  - Notifications: `Instant alerts for school events and emergencies.`
  - Timetable: `Easy access to class schedules and substitutions.`
  - Family Access: `Manage multiple children from a single parent login.`
- Experience section (`#experience`): label `Built for Everyone`; title `Tailored for Every Role`; image alt `Tailored for Every Role`; `Whether you're a parent tracking your child's growth or a teacher managing a classroom, SNS ERP adapts seamlessly to your needs.`
  - Parents: `Track Academic Progress`, `Track Attendance`, `Instant Notifications`
  - Teachers: `Manage Classes Easily`, `Upload Homework & Notes`, `Digital Attendance`
- CTA: label `Get Started Today`; title `Ready to transform your school management?`; `Join hundreds of educators already using SNS ERP to simplify their daily operations and focus on what matters most — the students.`; button `Access Dashboard`
- Header and Footer text: see section 7.

---

## 2. Login page

- **Route:** `/login` (`app/login/page.tsx`)
- **Who can access:** Everyone (public). After a successful sign-in the user is sent to `getDashboardRoute(role)`.
- **Purpose:** Two-step sign-in. The user picks a role card, then enters credentials.

### Functions
| Element | Action |
|---|---|
| Logo link (`SNS Academy`) | Link to `/` |
| Role cards Admin / Teacher / Parent | Set the selected role and show the login form. The role only changes labels, placeholder and input type. It is not sent to the backend. |
| "Back to role selection" | Returns to the role cards and clears error, email/ID and password |
| Email / Student ID field | Required. Type `email` for admin and teacher, `text` for parent |
| Password field | Required. Eye / eye-slash button toggles visibility (aria-label `Show password` / `Hide password`) |
| "Forgot Password?" | Link with `href="#"`. It does nothing. |
| "Sign In to Dashboard" (submit) | Calls `login({ email, password })` which sends `POST /auth/login`. On success it stores the session and routes by role: parent to `/parent-dashboard`, teacher to `/teacher-dashboard`, admin and leader to `/dashboard`. On failure it shows the error message in a red box. The button is disabled while loading. |

`useAuth().login` also throws `This account is reserved for the mobile teacher app. Please sign in with an admin or leader account.` if `canAccessWebDashboard` is false. All four roles pass that check, so this does not trigger.

### Text on screen
- Step 1: `Welcome Back`; `Select your role to access the SNS Academy ERP portal.`; cards `Admin`, `Teacher`, `Parent`; notice `Secured with end-to-end encryption. Your data is safe.`
- Step 2: `Back to role selection`; heading `{role} Login` (capitalised, e.g. `admin Login` shown as "Admin Login"); `Enter your student ID and password` (parent) or `Enter your email address and password` (others)
- Labels: `Student ID` (parent) / `Email Address`; `Password`
- Placeholders: `admin@sns-erp.local` (admin), `SNS-2026-XXXX` (parent), `teacher@sns-erp.local` (teacher); password `••••••••`
- Links and buttons: `Forgot Password?`, `Sign In to Dashboard`, loading text `Signing In...`
- Default error: `Failed to sign in. Please verify your credentials.` (the backend message is shown when there is one)
- Footer: `© 2026 SNS Academy ERP · Empowering Education Through Design Thinking`
- Right panel: badge `SNS Academy ERP`; `Empowering Education` / `Through Innovation`; `A unified platform for parents, teachers, and administrators — bridging the gap between school and home.`; badges `CBSE Affiliated`, `ISO Certified`, `Design Thinking Hub`; logo alt `Logo`

### `components/auth/login-panel.tsx` (`LoginPanel`)
No route renders this component (no import was found in the app). It is an older sign-in screen for admin and leader accounts. If used:
- Email defaults to `admin@sns-erp.local`. Password defaults to `NEXT_PUBLIC_DEMO_USER_PASSWORD` or `ChangeMe123!`.
- Demo account buttons (`Admin` / `admin@sns-erp.local`, `Leader` / `leader@sns-erp.local`) fill the email field.
- `Login` button (`LoadingButton`) calls `POST /auth/login`, then goes to `/dashboard`. Default error: `Unable to sign in right now.`
- Text: `SNS ERP`; `Attendance, timetable, and substitution control in one place.`; `Phase 1 now includes production-shaped authentication, session persistence, and a dashboard shell for admins, and assigned leaders.`; cards `API` (shows the base URL) and `Access` (`JWT session with persisted login and role-aware routing`); `Demo Accounts`; `Sign in`; `Use an admin or leader account to access the web dashboard.`; labels `Email`, `Password`; `Teacher logins are reserved for the mobile app.`; status line `Session persists locally and refresh support is wired in.`

---

## 3. Resources page

- **Route:** `/resources` (`app/resources/page.tsx`)
- **Who can access:** Everyone. No auth check.
- **Purpose:** Public page listing four school resources (handbook, holidays, exams, support). It is linked from the Footer.

### Functions
| Element | Action |
|---|---|
| "Back to Home" | Link to `/` |
| "Download / View" (one per card) | Button with no click handler. It does nothing. |

No backend API calls. The cards are hard-coded.

### Text on screen
- `Back to Home`
- Title: `School Resources`
- `Access important documents, calendars, and support channels in one place. These resources are updated regularly by the school administration.`
- Cards (each with button `Download / View`):
  - `Parent Handbook`: `Complete guide to school policies, dress codes, and academic standards.`
  - `Holiday List 2026`: `Annual calendar featuring all scheduled holidays and term breaks.`
  - `Exam Schedules`: `Stay updated with the latest timetable for Periodic, Term, and Final exams.`
  - `Contact Support`: `Technical assistance for the ERP portal and administrative queries.`
- Header and Footer are included (section 7).

---

## 4. Admin dashboard home

- **Route:** `/dashboard` (`app/dashboard/page.tsx`), inside the dashboard shell (section 5).
- **Who can access:** `admin` and `leader` see the dashboard. `teacher` is redirected with `router.replace` to `/teacher-dashboard`, `parent` to `/parent-dashboard`. While redirecting (or with no session) the page shows `Redirecting...`. Note that `GET /dashboard/overview` is restricted to `admin` on the backend, and `GET /users` is also admin-only. A `leader` therefore gets failed requests there, and the page falls back to defaults (see below).
- **Purpose:** Landing page of the web dashboard. It shows statistics, shortcuts and recent activity in one of two themes.

### Theme selection
`localStorage["sns_theme"]` decides the theme. `"modern"` renders `ModernDashboard`. Anything else renders `AdminDashboard`, which renders `ClassicDashboard` (it checks the same key again). The theme is set from Settings (`components/dashboard/settings-page.tsx`), which saves the key and reloads the page.

### 4a. Classic theme (`admin-dashboard.tsx`)

**Data loaded on mount** (both requests in parallel; either may fail without breaking the page):
- `GET /users` (`getAllUsers`): the list is filtered to `role === "parent"` for the roster. All users are scanned for today's birthdays and anniversaries.
- `GET /dashboard/overview` (`getDashboardOverview`, sent with no-cache headers): stats, recent registrations, monthly chart.

Birthdays and anniversaries: matched on today's month and day against `studentProfile.dob`, `teacherProfile.dateOfBirth` (birthdays) and `teacherProfile.weddingDate` (anniversaries).

**Functions**
| Element | Action |
|---|---|
| Stat card "Total Students" (or API label) | Link to `/dashboard/users` |
| Stat card "Active Staff" | Link to `/dashboard/staff` |
| Stat card "Unread Notifications" | Link to `/dashboard/notifications` |
| Stat card "New This Week" | No link |
| Quick Actions tiles | Links: Add Student `/dashboard/admission`; Manage Users `/dashboard/users`; Post Notice `/dashboard/notice-post`; Results `/dashboard/results`; Reports `/dashboard/reports`; Chat `/dashboard/chat` |
| System Modules tiles | Links: Notifications `/dashboard/notifications`; Attendance `/dashboard/attendance`; Users `/dashboard/users`; Results `/dashboard/results`; Transport `/dashboard/transport`; Timetable `/dashboard/timetable`; Calendar `/dashboard/calendar`; Admission `/dashboard/admission`; Staff `/dashboard/staff`; Alumni `/dashboard/alumni`; Reports `/dashboard/reports`; Chat `/dashboard/chat` |
| Student Roster search box | Filters the parent-role users by name or email (case-insensitive, client side) |
| Roster row "⋮" icon | Icon only, no handler |
| Enrollment chart bars | Hover shows a tooltip with the month number and the boys and girls counts |
| "View All Users" | Link to `/dashboard/users` |
| Pending Approvals items | Links: Leave Requests to `/dashboard/attendance`; New Admissions to `/dashboard/admission`; Staff Changes to `/dashboard/staff` (the counts in the labels are hard-coded) |

Stat cards use `overview.stats[0]`, `[1]` and `[3]` (label and value). Fallbacks when the API gives nothing: `Total Students` (value falls back to the roster count), `Active Staff` (`0`), `Unread Notifications` (`0`). The value shows `...` while loading. "New This Week" uses `overview.newUsersThisWeek`. Every card carries the badge `Live`.

**Text on screen**
- Stat labels: `Total Students`, `Active Staff`, `Unread Notifications`, `New This Week`; change text `Live`
- `Quick Actions`: `Add Student` (`New enrollment`), `Manage Users` (`All accounts`), `Post Notice` (`Announcement`), `Results` (`Publish marks`), `Reports` (`Generate data`), `Chat` (`Direct messaging`)
- `System Modules`: `Notifications`, `Attendance`, `Users`, `Results`, `Transport`, `Timetable`, `Calendar`, `Admission`, `Staff`, `Alumni`, `Reports`, `Chat`
- `Student Roster`; search placeholder `Search…`; columns `Student Name`, `Email`, `Department`, `Status`, `Action`
  - Loading: `Loading records from database…`
  - Empty with search: `No students match your search.`
  - Empty without search: `No students found. Use "Admission" to add one.`
- `Enrollment Trends` `(current year)`; legend `Boys`, `Girls`; tooltip `Month {n}`, `Boys`, `Girls`; axis `Jan`, `Mar`, `Jun`, `Sep`, `Dec`
- `Recent Registrations`; badge `{n} this week`; `Loading…`; empty `No recent registrations.`; button `View All Users`
- `Today's Birthdays`; `Loading…`; empty `No birthdays today`; entries show the name and `Student` or `Teacher`
- `Teacher Anniversaries`; `Loading…`; empty `No anniversaries today`; entries show `Wedding Anniversary`
- `Pending Approvals`: `3 Leave Requests` / `Teachers`; `5 New Admissions` / `Students`; `2 Staff Changes` / `Management`; each with a `Review` badge
- `System Pulse`: `Database Sync` `Operational`; `Staff Portal` `Active`; `Notification Hub` `Healthy`; `Parent Portal` `Online` (static text)

### 4b. Modern theme (`modern-dashboard.tsx`)
All content is hard-coded sample data. It makes **no API calls**. Only the period selector responds to clicks, and the other buttons have no handlers.

**Functions**
| Element | Action |
|---|---|
| Period selector `7D` / `30D` / `12M` | Stores the selected period in state (default `12M`). The data does not change. |
| `📅 May 2026`, `⋯` buttons, `⛛ Filter`, `View all ›`, `Full timetable ›`, `Mark all read`, `🎂`, `View queue ›`, `Review`, `Details`, quick-action tiles | Display only, no handler |

**Text on screen**
- `Control Center`; `Real-time snapshot · last sync 14:52 IST`
- KPI cards: `Total Students` (`Enrolled`, `1,284`, 4.2%); `Total Staff` (`Faculty`, `86`, 1.1%); `Fee Collected` (`Q2`, `₹38.4L`, 12.4%); `New This Week` (`Live`, `12`, 33.0%)
- `Enrollment Activity`: `Students vs. staff over the last 12 months`; legend `Students`, `Staff`; months `Jun` to `May`
- `Quick Actions`: `Common admin tasks · shortcuts in ⌘K`; tiles `Add Student` (`New enrollment`), `Manage Users` (`Roles & access`), `Post Notice` (`School-wide alert`), `Publish Results` (`Term scorecards`), `Generate Report` (`Attendance, fees…`), `Open Inbox` (`3 unread threads`)
- `Recent Registrations`: `12 added this week · 4 awaiting verification`; `Filter`, `View all ›`; columns `Person`, `Type`, `Class / Dept.`, `Status`, `Submitted`; status labels `New`, `Verify`, `Approved`; rows Yukesh Kanna, Sangeeth R, Dharshaneshwarn D, Priyadharshini M, Arjun Master, Karthick V
- `Today · May 9`; `4 sessions scheduled`; `Full timetable ›`; sessions `Grade 11 — Physics`, `Grade 9 — English`, `Staff Standup`, `Grade 12 — Calculus`
- `Notifications`: `17 unread · auto-marked after 24h`; `Mark all read`; items `Fee deadline approaching`, `Term marks uploaded`, `Leave request — Ms. Kavya`, `3 profile change requests`, `Library — 12 overdue books`
- `Upcoming Birthdays`: `Send a school-wide note`; Lakshmi P. (`Today`), Mr. Suresh (`Tomorrow`), Ravi Kumar (`May 12`)
- `Pending Approvals`: `View queue ›`; `Leave — Ms. Kavya R.`, `Profile — Arjun Master`, `Admission — Pranav S.`, `Refund — Mrs. Iyer (parent)`; button `Review`
- `Attendance — Today`: `All grades, taken at 09:15`; `94% present`; `Present` 1,207, `Absent` 52, `Late` 25
- `Fee Collection — Q2`: `Apr 1 → Jun 30`; `Details`; `₹38.4L`, `12.4%`, `of ₹52L target`; `Paid` 58%, `Partial` 16%, `Overdue` 7%

### 4c. `dashboard-overview.tsx` (`DashboardOverview`)
No route renders this component. It is referenced in the same file only; no import was found in the app. It uses `getDashboardOverview` from `services/mock-data-service` (a mock API). It shows `Overview` / `Operational dashboard` / `Attendance coverage, substitution queue, staff availability, and quick actions are all fed from the protected mock API.`, a banner (`Teacher Roster & Deployment`, `Staffing Overview`, `A denser control room for staffing, subject readiness, and teacher workload coordination across the week.`, chips `20 Teachers`, `11 Subjects`, `18 Ready for Scheduling`), three buttons with no handler (`Review approvals`, `Special classes`, `Manage absences`), stat cards, and the lists `Operational Snapshot` and `Quick Actions`. Loading and error states use `ResourceLoading` / `ResourceError` with the label `dashboard overview`.

---

## 5. Dashboard shell (shared layout)

- **Route:** wraps every `/dashboard/*` page (`app/dashboard/layout.tsx` renders `DashboardLayoutShell`).
- **Who can access:** A logged-in user whose role passes `canAccessWebDashboard` (all four roles). With no session, once bootstrapping ends, it calls `router.replace("/")`. If the role is not allowed, it calls `logout()` and then `router.replace("/")`. While the session loads, it shows `Restoring your workspace...`.
- **Purpose:** Sidebar, top bar and content area shared by dashboard pages. At startup `useAuth` reads the stored session and refreshes the profile with `GET /auth/me`. If that fails, it tries `POST /auth/refresh`. If that fails too, the session is cleared.

### Functions (`dashboard-layout-shell.tsx`)
| Element | Action |
|---|---|
| Sidebar toggle button (`Show Sidebar` / `Hide Sidebar` title) | Collapses or shows the desktop sidebar. Parents start collapsed. |
| Hamburger (small screens) | Opens the sidebar as an overlay. Clicking the dark backdrop closes it. |
| Sidebar resize handle (classic theme, desktop) | Drag to resize between 200 and 450px. The width is saved in `localStorage["sidebarWidth"]` (default 280). |
| Dark-mode toggle (`Toggle Theme` classic, `Toggle dark mode` modern) | Flips `data-theme` on `<html>` between `dark` and `light` and saves `localStorage["theme"]` |
| Notification bell | Classic: opens the `NotificationCenter` dropdown (section 6b). Modern: goes to `/dashboard/notifications`. |
| Chat icon (`Messages`) | Goes to `/dashboard/chat` |
| Avatar | Uses the photo saved locally for the user (`getProfilePhotoLocally`) or a DiceBear avatar built from the user's name |
| `Logout` (classic header) | `logout()`: clears the stored session and state. No API call. |
| Modern header `Export` | No handler |
| Modern header `Quick Add` | Goes to `/dashboard/notice-post` |
| Modern header sidebar toggle | Same as above |

The classic header shows the user name and the role in uppercase. The modern header shows a breadcrumb `Workspace / {page}`: `Dashboard` on `/dashboard`, otherwise the last path segment with dashes turned into spaces. The shell uses the same `sns_theme` key as section 4 (`modern` gives the modern header, otherwise classic). Page padding is removed on `/dashboard/chat` and in the modern theme.

### Sidebar (`sidebar-nav.tsx`)
- On load it calls `GET /dashboard/counts` (roles admin, leader, teacher on the backend) and uses `notifications`, `profileRequests`, `substitutions`, `leaves` and `admission` as count badges. Errors are ignored. A count of 0 shows no badge.
- Items are links; the active one is highlighted (exact path match).
- The search box is a static placeholder, not an input.
- The bottom gear button calls `logout()` (tooltip `Sign out`). The profile row above it shows initials, name and email.
- Section `WORKSPACE` (all roles): `Dashboard` (`/dashboard`, badge `Live`), `Notifications` (`/dashboard/notifications`, count), `Attendance` (`/dashboard/attendance`), `Timetable` (`/dashboard/timetable`), `Homework` (`/dashboard/homework`), `Calendar` (`/dashboard/calendar`), `New Post` (`/dashboard/notice-post`, highlighted), `Event Gallery` (`/dashboard/events-gallery`)
- Section `MANAGEMENT` (admin and leader only): `Users` (`/dashboard/users`), `Academic Structure` (`/dashboard/academics`), `Staff` (`/dashboard/staff`), `Role Assignment` (`/dashboard/roles`), `Admission` (`/dashboard/admission`, count), `Profile Requests` (`/dashboard/profile-requests`, count), `Leave Applications` (`/dashboard/leaves`, count), `Birthdays` (`/dashboard/birthdays`), `Substitutions` (`/dashboard/substitutions`, count)
- Section `TOOLS`: teacher only: `Teacher Portal` (`/teacher-dashboard`, highlighted), `My Profile` (`/dashboard/profile`), `Substitution` (`/dashboard/substitution`). All roles: `Alumni` (`/dashboard/alumni`), `Results` (`/dashboard/results`), `Transport` (`/dashboard/transport`), `Reports` (`/dashboard/reports`), `Chat` (`/dashboard/chat`), `Settings` (`/dashboard/settings`)

### Text on screen
- `Restoring your workspace...`
- Sidebar brand: `S`, `SNS Academy`, `ERP · {Admin | Leader | Teacher | Portal}`
- Search placeholder text: `Search...` with a `⌘ K` hint
- Section titles `WORKSPACE`, `MANAGEMENT`, `TOOLS`; item labels as listed above; badge `Live`
- Header: `Show Sidebar`, `Hide Sidebar`, `Toggle Theme`, `Toggle dark mode`, `Notifications`, `Messages`, `Workspace`, `Dashboard`, `Export`, `Quick Add`, `Logout`; avatar alt `avatar`

### Header and Footer components (`components/Header.tsx`, `components/Footer.tsx`)
These are the public site header and footer. They are used on `/` and `/resources`, not inside the dashboard shell.

**Header** (fixed at the top)
- Logo link to `/`; logo alt `Logo`; text `SNS Academy` and `A Fingerprint School`
- Nav links `About`, `Features`, `Experience`, `Contact` go to `/#about`, `/#features`, `/#experience`, `/#contact`
- `Login` button links to `/login`
- No API calls

**Footer** (`id="contact"`)
- Brand link `SNS Academy` to `/`; `Empowering students through Design Thinking and Innovation. Building the future, one student at a time.`
- Social icons (Facebook, Instagram, LinkedIn) are links with `href="#"`
- `CBSE Affiliation: 1930610`; `Established: 2014`; `Coimbatore, Tamil Nadu`
- `Quick Links`: `About Us` (`/#about`), `Features` (`/#features`), `Experience` (`/#experience`), `Admissions` (`#`)
- `Resources`: `Parent Handbook`, `Holiday List`, `Exam Schedules`, `Contact Support` (all to `/resources`)
- `Connect With Us`: `SNS Academy, Thudiyalur - Saravanampatti Road, Vellakinar Post, Coimbatore - 641029`; `Admission: 90036 55855`; `Office: 75300 93730`; `info@snsacademy.org`; `Career: job@snsgroups.com`
- Bottom: `© 2026 SNS Academy ERP. All rights reserved. Designed with ❤️ by SNS Innovation Hub.`

---

## 6. Notifications page

- **Route:** `/dashboard/notifications` (`app/dashboard/notifications/page.tsx` renders `NotificationsPage`). It sits inside the dashboard shell. The page reads `?action=new`.
- **Who can access:** Any logged-in user the shell admits. The sidebar shows the link to all web roles. The `POST /notifications/broadcast` endpoint is restricted to `admin` and `leader` on the backend, so other roles get the failure toast when they send. `GET /users/classes` allows admin, leader and teacher.
- **Purpose:** Admins compose and send a broadcast notification in a four-step wizard, and see the history of notifications.

### 6a. Notification Hub (`notifications-page.tsx`)

**Data loaded on mount**
- `GET /notifications` populates "Recent History" (`fetchHistory`)
- `GET /users/classes` populates the class list (`fetchClasses`)

**Functions**
| Element | Action |
|---|---|
| URL `?action=new` | Pre-selects audience `notice` and jumps to step 2 |
| Step 1 card "General Alert" | Sets audience `both` and goes to step 2 |
| Step 1 card "Class-wise" | Sets audience `parents` and goes to step 2 |
| Step 2 "Message Headline" input | Sets the title |
| Step 2 "Content" textarea | Sets the message |
| `Select All` (class-wise only) | Selects all classes from the API |
| `Clear` (class-wise only) | Clears the class selection |
| Class chips (class-wise only) | Toggle each class |
| Upload box (audience `notice` only) | Display only. There is no input or handler, so nothing is uploaded. |
| `Continue` | Goes to the next step. Disabled in step 2 until title and message are filled (and, for class-wise, at least one class is selected). |
| `Back` | Goes back one step. Disabled and invisible on step 1. |
| `Deliver Now` (step 3) | Sends `POST /notifications/broadcast` with `{ audience, title, message, targetClasses }` (`audience` falls back to `both`; `targetClasses` only for `parents`). On success it moves to step 4, clears the form, shows a success toast and reloads history. On failure it shows an error toast. If title or message is empty it shows an error toast and sends nothing. |
| `New Broadcast` (step 4) | Resets the wizard to step 1 |
| `See Full Archive` | No handler |

`handleDelete` (`POST /notifications/delete` with `{ id }`) exists in the code but no button on the page calls it.

**Text on screen**
- Eyebrow `SNS COMMUNICATION`; title `Notification Hub`; description `Manage and broadcast real-time updates to the school community.`
- Status strip: `System Online`; `{n} Broadcasts` (number of history items)
- Step 1: `Step 1: Select Notification Type`; `General Alert` / `Broadcast to everyone.`; `Class-wise` / `Target specific grades.`
- Step 2: `Step 2: Compose Message`; labels `Message Headline`, `Content`; placeholders `e.g. Annual Sports Meet 2026` and `What would you like to say to the community?`; `Select Target Class`; buttons `Select All`, `Clear`; empty `No classes found in database`; `Attach Media (Images/Videos)`; `Click to upload or drag & drop`
- Step 3: `Step 3: Review & Schedule`; `Broadcast Preview`; `Untitled Message` (when the title is empty); `To: {audience}` followed by `(All Classes)` or the selected class names; `"No content provided..."` (when the message is empty); `Ready for immediate delivery via Push Notification & Web Hub.`
- Step 4: `Broadcast Launched!`; `Your message has been delivered to all registered devices in the {audience} (All Classes | {n} Classes) group.`; `New Broadcast`
- Buttons: `Back`, `Continue`, `Deliver Now`, `Launching...` (while sending)
- Right panel: `Recent History`; each item shows `TO: {audience}`, a short date, the title and the message; empty `No Recent History`; `See Full Archive`
- Toasts (sonner): error `Please fill in both title and message`; success `Broadcast delivered successfully!`; error `Delivery failed. Please try again.`; success `Notification removed from archive` and error `Failed to delete notification` (only from the unused delete handler)

### 6b. Notification center dropdown (`notification-center.tsx`)
It appears as the bell in the classic dashboard header on every dashboard page. The modern header uses a plain bell button that goes to `/dashboard/notifications`.

**Functions**
- Polls `GET /notifications` every 5 seconds (sends the access token).
- The bell shows a count badge of unread items (`9+` above 9). Clicking it opens or closes the dropdown. Clicking outside closes it.
- `Mark all read` (shown only when there are unread items): `POST /notifications/read-all`, then marks all as read locally.
- Clicking a notification: `PATCH /notifications/{id}/read`, then closes the dropdown. For type `message` it also goes to `/dashboard/chat`.
- Icon by type: `message` chat (green), `alert` warning (red), other info (blue). Unread items have a highlighted background and left bar.
- `View All Activity` has no handler.
- Fetch and mark-read errors are only logged to the console.

**Text on screen:** `Notifications`; `Mark all read`; empty `No notifications yet`; each item shows the title, message and time (HH:MM); footer button `View All Activity`.


---

# Part 2 – People & Academic Structure (Admin Pages)

Source: `frontend/src/app/dashboard/<page>/page.tsx` (thin wrappers) and `frontend/src/components/dashboard/*.tsx`.

General notes (apply to all six pages):
- All pages live under `/dashboard/...`, which uses `DashboardLayoutShell`. The shell lets `admin`, `leader`, `teacher` and `parent` roles into the web dashboard (`lib/role-access.ts`).
- The sidebar shows the "MANAGEMENT" group (Users, Academic Structure, Staff, Role Assignment, Admission, ...) only when the session role is `admin` or `leader` (`sidebar-nav.tsx`: `isAdmin`).
- The backend `RolesGuard` treats `principal` as also satisfying `admin`/`leader`, and `coordinator` as `leader` (`backend/src/common/constants/roles.ts`).
- No page here has its own client-side role check. The real restriction is the sidebar visibility plus the backend `@Roles(...)` on each endpoint.
- `alert(...)` dialogs are used for errors on Users, Staff, Admission and Academics. Role Management uses an on-screen toast.

---

## 1. Users

**Route:** `/dashboard/users` (`app/dashboard/users/page.tsx` → `UsersPage` in `users-page.tsx`)

**Who can access:** Sidebar link "Users" is visible to `admin` and `leader`. Backend `GET /users`, `DELETE /users/:id`, `PATCH /users/:id/status` are `@Roles('admin')` (so `admin` and `principal`). `GET /role-groups` is `@Roles('admin')`. A `leader` can open the page but the user list request would be rejected by the backend.

**Purpose:** Directory of all student and staff accounts. Admins can search, filter, view a student's admission record, set a staff member's role group, inactivate or delete users, and export the list as CSV.

### Functions
| Control | What it does | API |
|---|---|---|
| On load | Fetches role groups and all users. Users are mapped to rows (ID = student ID, or teacher employee ID, or first 8 chars of the id; role `parent` is shown as "Student"; status `active` → "Active", otherwise "Inactive"; phone = father's or mother's contact, else "No Contact"). | `GET /role-groups`; `GET /users` (sent with no-cache headers) |
| Filter tabs: All / Students / Teachers / Alumni | Client-side filter. "All" = everyone; "Students" = role Student and Active; "Teachers" = role Teacher and Active; "Alumni" = every user with status Inactive. | none |
| Search box | Client-side filter on name or ID (case-insensitive). | none |
| "Enroll Student" button | Navigates to `/dashboard/admission`. | none |
| "Add Staff" button | Navigates to `/dashboard/staff`. | none |
| Download icon button | Builds a CSV (columns ID, Name, Role, Email, Status) from the currently filtered rows and downloads it as `sns_users_directory_<YYYY-MM-DD>.csv`. | none (client-side) |
| Password button (key icon) in the User Info cell | Toggles between `••••••••` and the user's stored `password` value from the API record. | none |
| Double-click a Student row | Opens the "Student Dossier / Admission Record" modal (read-only). Only works for rows with role Student. | none (uses data already loaded) |
| Student rows: "Transport" and "Chat" toggle buttons | Toggle the feature flag locally (initial values come from a random filter in the code). Local state only. | none |
| Student rows: "Assign Bus" / "Route: <bus>" button (shown only when Transport is on) | Opens the "Assign Transport" modal. Choosing a bus sets `busAssigned` locally and closes the modal. "Remove" clears it. Local state only. | none |
| Non-student rows: role group dropdown | Sets the row's role group locally from the list loaded from `/role-groups`. Local state only (not saved to the backend on this page). | none |
| Status badge (Active rows only; hover shows "Click to Inactivate") | Opens the "Inactivate User" modal. | none until confirmed |
| Inactivate modal → "Inactivate" | Sets the user's status to inactive, marks the row Inactive and switches the filter to "Alumni". | `PATCH /users/:id/status` body `{status: "inactive"}` |
| Pencil (edit) button | Opens the "Manage Access" modal. | none |
| Manage Access modal: "Assign Role Group" dropdown (non-students only) | Sets role group locally and closes the modal. | none |
| Manage Access modal: "Display Name" input | Pressing Enter or leaving the field (blur) with a non-empty value renames the row locally and closes the modal. | none (local only) |
| Manage Access modal: "Done" | Closes the modal. | none |
| Trash (delete) button | Opens the "Confirm Deletion" modal. | none until confirmed |
| Delete modal → "Delete User" | Deletes the user and removes the row. | `DELETE /users/:id` |
| Modal backdrop click / X icon in dossier / "Cancel" | Closes the modal. | none |

### Text on screen
**Header (PageSection):** eyebrow `Identity Management`; title `User Directory & Access`; description `Manage student and staff accounts, edit profiles, and toggle feature permissions for individual users.`

**Filter tabs:** `All`, `Students`, `Teachers`, `Alumni`

**Search placeholder:** `Search by name or ID...`

**Buttons:** `Enroll Student`, `Add Staff` (download button has an icon only).

**Table columns:** `User Info`, `Role`, `Access & Permissions`, `Status`, `Actions`

**Loading:** `Loading directory...` (no empty-state message exists when the filtered list is empty).

**Row content:** `No Contact` (phone fallback); `••••••••`; feature buttons `Transport`, `Chat`; `Assign Bus`; `Route: <bus>`; dropdown placeholder `-- Assign Role Group --`; status `Active` / `Inactive`; tooltip `Click to Inactivate`.

**Student Dossier modal:** badge `Student Dossier`; heading `Admission Record`; sidebar fallback `No ID`; `Class & Section`; `Date of Birth` (fallback `Not Provided`); section `Previous Education` with `Present School`, `Previous Grade`, `Board of Education` (fallback `N/A`); section `Parents / Guardians` with `Father's Details` and `Mother's Details`, each with `Name`, `Contact` (fallbacks `No Phone`, `No Email`), `Occupation`; section `Additional Info` with `Nationality`, `Religion`, `Community`, `Mother Tongue`.

**Delete modal:** `Confirm Deletion`; `Are you sure you want to delete <name>? This will permanently remove all their associated records.`; buttons `Cancel`, `Delete User` / `Deleting...`

**Inactivate modal:** `Inactivate User`; `Are you sure you want to inactivate <name>? They will be moved to the Alumni list.`; buttons `Cancel`, `Inactivate` / `Processing...`

**Manage Access modal:** `Manage Access`; label `Assign Role Group`; option `-- Select Group --`; label `Display Name`; note `* Changes will update the local directory view.`; button `Done`

**Assign Transport modal:** `Assign Transport`; buses `Bus 1` – `Downtown Express (Route A)`, `Bus 2` – `Northern Suburbs (Route B)`, `Bus 3` – `Eastern Campus Link (Route C)`, `Bus 4` – `West End Local (Route D)`; buttons `Cancel`, `Remove`.

**Alerts:** `Server failed to delete user.`; `Error deleting user.`; on inactivate failure the error message or `Failed to inactivate user`.

---

## 2. Staff

**Route:** `/dashboard/staff` (`staff-page.tsx`)

**Who can access:** Sidebar link "Staff" is shown to `admin` and `leader`. The create call `POST /users/teacher` is `@Roles('admin')` on the backend.

**Purpose:** Three-step wizard to onboard a new faculty member: employee details, role and access selection, then a confirmation screen.

### Functions
| Control | What it does | API |
|---|---|---|
| Progress bar (3 segments) | Shows the current step. | none |
| Step 1 fields | Full Name, Professional Email, Employee ID, Account Password, Phone Number, Date of Birth (date), Wedding Date (Anniversary) (date), Department (select). | none |
| Wand icon next to Employee ID (title "Auto-generate ID") | Fills `TCH-<current year>-<random 4-digit number>`. | none |
| Wand icon next to Account Password (title "Generate Secure Password") | Fills a random 10-character password from letters, digits and `!@#$%`. | none |
| "Set Permissions" button | Goes to step 2. Disabled until Full Name, Email, Employee ID and Password are all filled. | none |
| Role Group Template select | Replaces the selected permissions with a preset: Senior Faculty = `view_attendance, view_reports, timetable_edit`; Office Administration = `manage_students, admission_access, finance_access, staff_management`; Department Head = `view_attendance, view_reports, staff_management, exam_control, broadcast_access`; Junior Teacher = `view_attendance, view_reports`. Choosing the "custom" option does nothing. | none |
| Primary Identity Role buttons (Teacher / Department Head / Office Admin) | Sets `role` in the form state (default `teacher`). | none |
| "Select All" / "Clear All" | Selects all 10 listed permission IDs (`view_attendance, view_reports, manage_students, admission_access, staff_management, timetable_edit, finance_access, broadcast_access, exam_control, transport_view`) / clears them. | none |
| Permission tiles (10) | Toggle each permission in form state. | none |
| "Back" | Returns to step 1. | none |
| "Finalize Staff Record" | Creates the teacher account, then moves to step 3. Sends `name`, `email`, `department`, `employeeId` (or `STAFF-<random>` if empty), `designation: "Faculty"`, `specialization` (= department), `password`, `dateOfBirth`, `weddingDate`. Phone, role and permissions are held in form state but are **not** sent. | `POST /users/teacher` |
| "Add Another Member" (step 3) | Resets the form and returns to step 1. | none |
| "View Staff Directory" (step 3) | Has no click handler. | none |

### Text on screen
**Header:** eyebrow `Faculty & Admin`; title `Staff Management`; description `Onboard new faculty members and configure their system access levels and responsibilities.`

**Card header:** `Faculty Registration` / `Configure roles and permissions`

**Step 1** – heading `Employee Details`. Labels and placeholders:
- `Full Name` – `e.g. Dr. Sarah Connor`
- `Professional Email` – `sarah.c@sns-academy.edu`
- `Employee ID` – `e.g. SNS-T-2024`
- `Account Password` – `••••••••`
- `Phone Number` – `+91 XXXXX XXXXX`
- `Date of Birth` – `YYYY-MM-DD`
- `Wedding Date (Anniversary)` – `YYYY-MM-DD`
- `Department` – options `Select Department`, `Mathematics`, `Science`, `Humanities`, `Administration`

Button: `Set Permissions`

**Step 2** – heading `Role & Access Control`; `Role Group Template` with options `-- Select Assignment Group --`, `Senior Faculty Template`, `Office Administration Group`, `Department Head Group`, `Junior Teacher Template`; `Primary Identity Role` with `Teacher` (`Access to classes & grading`), `Department Head` (`Approve leaves & syllabus`), `Office Admin` (`Manage fees & admissions`); `Advanced Feature Access` with note `Assign module-level permissions for this faculty member.`; links `Select All`, `Clear All`; tiles (label – sub-label): `Attendance` – `Track Presence`, `Reports` – `Generate Data`, `Students` – `Class Directory`, `Timetable` – `Set Schedules`, `Calendar` – `School Events`, `Notifications` – `Broadcast Hub`, `Results` – `Publish Marks`, `Transport` – `Track Routes`, `Chat` – `Communication`, `Settings` – `User Preferences`; buttons `Back`, `Finalize Staff Record` / `Creating Account...`

**Step 3** – `Onboarding Complete`; `Account for <name> has been created. Credentials have been sent to their email.`; buttons `Add Another Member`, `View Staff Directory`

**Error alert:** the error message, or `Failed to create staff member`.

---

## 3. Roles (Role Management)

**Route:** `/dashboard/roles` (`role-management-page.tsx`)

**Who can access:** Sidebar label is "Role Assignment", shown to `admin` and `leader`. All endpoints used (`GET /users`, `PATCH /users/:id/role`, and every `/role-groups` endpoint) are `@Roles('admin')` on the backend.

**Purpose:** Change a user's base role and manage "role groups" (named sets of page permissions), including assigning users to groups.

### Functions
| Control | What it does | API |
|---|---|---|
| On load (needs a session token) | Loads users and role groups. Failures show a toast. | `GET /users`; `GET /role-groups` (Bearer token) |
| Tabs: `Users` / `Role Groups` | Switch between the two views. | none |
| **Users tab** – role summary cards (Parent, Teacher, Leader, Admin) | Each shows the count of users with that role. Clicking toggles a filter on that role; clicking again clears it. | none |
| Search box | Client-side filter on name or email. | none |
| Role Group dropdown per user | Assigns the user to the group (or clears it with the blank option). A spinner shows while saving. Updates the row, toast `Group assigned.` | `PATCH /role-groups/:userId/assign` body `{roleGroupId}` |
| Role buttons per user (every role except the current one) | Changes the user's role. Toast `Role updated successfully.` | `PATCH /users/:id/role` body `{role}` |
| **Role Groups tab** – "Create Group" | Opens the form (hidden while the form is open). | none |
| Group form: Group Name | Text input; required (Save is disabled when blank). | none |
| Group form: Page Access tiles | 8 tiles that toggle On/Off: Users, Staff, Admission, Finance, Timetable, Broadcast, Reports, Exams. | none |
| "Save Group" / "Update Group" | Creates a new group, or updates the one being edited, with `{name, permissions}`. | `POST /role-groups`; `PATCH /role-groups/:id` |
| Form "Cancel" | Closes and resets the form. | none |
| Group card "Edit" | Loads the group into the form. | none |
| Group card "Delete" | Deletes the group immediately (no confirmation). Users in the group get `roleGroupId` cleared in local state. | `DELETE /role-groups/:id` |
| Group card chips | Read-only display of the 8 permissions on/off for the group. | none |

### Text on screen
**Header:** eyebrow `System Security`; title `Role Management`; description `Assign roles and manage permission groups. Changes take effect on next login.`

**Tabs:** `Users`, `Role Groups`

**Role cards:** `Parent`, `Teacher`, `Leader`, `Admin`

**Search placeholder:** `Search by name or email...`

**Table columns:** `User`, `Department`, `Current Role`, `Role Group`, `Change Role`. Group dropdown default option: `-- Assign Role Group --`.

**Empty state (users):** `No users found.`

**Groups tab:** `Permission Groups`; `Create groups and control which pages each group can access.`; button `Create Group`

**Form:** `New Role Group` / `Edit Group`; label `Group Name`, placeholder `e.g. Senior Faculty`; label `Page Access`; tiles (label – sub): `Users` – `Directory Search`, `Staff` – `Colleague Info`, `Admission` – `Process Logs`, `Finance` – `Fee Status`, `Timetable` – `Master Schedules`, `Broadcast` – `Push Alerts`, `Reports` – `Academic Data`, `Exams` – `Marks & Control`; tile state `On` / `Off`; buttons `Save Group` / `Update Group`, `Cancel`

**Group card:** `<n> member` / `<n> members`; buttons `Edit`, `Delete`

**Empty state (groups):** `No groups yet. Create one above.`

**Toasts:**
- `Failed to load users.`
- `Failed to load groups.`
- `Role updated successfully.`
- `Failed to update role.`
- `Group assigned.`
- `Failed to assign group.`
- `Group updated.`
- `Group created.`
- `Failed to save group.`
- `Group deleted.`
- `Failed to delete group.`

---

## 4. Teachers

**Route:** `/dashboard/teachers` (`teachers-page.tsx`)

**Who can access:** No sidebar link points to this route (not found in `sidebar-nav.tsx`), so it is reachable only by typing the URL. Any role allowed into the dashboard can open it. The backend `GET /teachers` has no `@Roles` decorator, so it needs only a valid login (global `AuthGuard`).

**Purpose:** Read-only mock overview of teachers: summary counts, department distribution and a teacher table. The description on screen says it is a mock until full CRUD exists.

### Functions
| Control | What it does | API |
|---|---|---|
| On load | Fetches teacher data using the session access token (`useAuthResource`). Shows loading and error states. | `GET /teachers` (via `getTeachers` in `mock-data-service.ts`) |
| Metric cards | Display `data.summary.total`, `data.summary.active`, `data.summary.overloaded`. | none |
| Department distribution list | Lists each department with its teacher count. | none |
| Teachers table | Displays ID, Name, Department, Subjects (joined with ", "), Workload, Status. | none |

There are no buttons, filters or forms.

### Text on screen
**Header:** eyebrow `Teachers`; title `Teacher management`; description `This mock view gives your team a working teacher list, department distribution, and workload picture until full CRUD and Prisma models land.`

**Loading:** `Loading teachers...`
**Error:** `Unable to load teachers: <message>`

**Metric cards:** `Total teachers`, `Active today`, `Workload alerts`

**Section title:** `Department distribution`

**Table columns:** `ID`, `Name`, `Department`, `Subjects`, `Workload`, `Status`

(No custom empty-state text on this page.)

---

## 5. Admission

**Route:** `/dashboard/admission` (`admission-page.tsx`)

**Who can access:** Sidebar link "Admission" (with a pending-count badge) is shown to `admin` and `leader`. The create call `POST /users/student` is `@Roles('admin')`.

**Purpose:** Four-step form to enrol a new student using the application form data, creating a student account.

### Functions
| Control | What it does | API |
|---|---|---|
| Header | Shows `Step <n> of 4` and a 4-segment progress bar. | none |
| Auto-fill from phone | When Father's or Mother's Contact No is entered and Admission No is empty or starts with `ADM-`, Admission No is set to that phone number (father's takes priority). | none |
| Wand icon on Admission No ("Auto-generate ID") | Fills `ADM-<year>-<random 4-digit>`. | none |
| Wand icon on Application No ("Auto-generate ID") | Fills `APP-<random 6-digit>`. | none |
| Wand icon on Login Password ("Generate Password") | Fills a random 8-character password. | none |
| "Next: Education Details" | Goes to step 2. Disabled until First Name is filled. | none |
| "Next: Parent Details" | Goes to step 3. | none |
| "Back" | Returns to the previous step. | none |
| "Submit Application" | Creates the student, then shows step 4. Sends name (first + last), email (father's email, else mother's, else generated `<firstname><random>@sns.edu`), `department: "Academic"`, `studentId` (admission no, else `STU-<random>`), `class` (the "Class for Admission" value), `section` (default `"A"`, no input on screen), and all other form fields including password. Also logs the payload to the console. | `POST /users/student` |
| "New Application" (step 4) | Resets the form and returns to step 1. | none |
| "Print Form" (step 4) | Has no click handler. | none |

### Text on screen
**Header:** eyebrow `Enrollment Management`; title `Admission Flow`; description `Register new students into the SNS Academy database using the official application form data.`

**Card header:** `Student Enrollment`, `Step <n> of 4`

**Step 1 – `Student Data`.** Labels and placeholders:
- `Admission No` – `e.g. ADM-2026-001`
- `Application No` – `e.g. APP-89234`
- `First Name` – `e.g. Arjun`
- `Last Name` – `e.g. Sharma`
- `Gender` – options `Select`, `Male`, `Female`, `Others`
- `Class for Admission` – `e.g. Grade 8`
- `Date of Birth` – `DD/MM/YY` (date input)
- `Birth Certificate No` – `e.g. BC-123456`
- `Nationality` – `e.g. Indian`
- `Religion` – `e.g. Hindu`
- `Community` – options `Select`, `BC`, `MBC`, `SC`, `ST`, `Others`
- `Blood Group` – `e.g. O+`
- `Mother Tongue` – `e.g. Tamil`
- `Login Password` – `••••••••`

Button: `Next: Education Details`

**Step 2 – `Previous Education Details`.**
- `Name of Present School` – `e.g. ABC Public School`
- `Currently Studying in Grade` – `e.g. Grade 7`
- `Board of Education` – `e.g. CBSE`

Buttons: `Back`, `Next: Parent Details`

**Step 3 – `Parent's Details`.** Column titles `Father/Guardian` and `Mother/Guardian`. Fields (father placeholder / mother placeholder):
- `Name` – `Name` / `Name`
- `Contact No` – `+91 XXXXX` / `+91 XXXXX`
- `Email` – `email@example.com` / `email@example.com`
- `Educational Qualification` – `e.g. M.Sc` / `e.g. B.Tech`
- `Occupation` – `e.g. Engineer` / `e.g. Doctor`
- `Organization` – `Company Name` / `Hospital Name`
- `Designation` – `Job Title` / `Job Title`
- `Office Address` – `Address` / `Address`

Buttons: `Back`, `Submit Application` / `Saving...`

**Step 4:** `Application Submitted`; `<first> <last> has been officially enrolled in <grade>.`; buttons `New Application`, `Print Form`

**Error alert:** the error message, or `Failed to enroll student`.

---

## 6. Academics (Academic Structure)

**Route:** `/dashboard/academics` (`academics-page.tsx`)

**Who can access:** Sidebar link "Academic Structure" is shown to `admin` and `leader`. Backend: `GET /academics/overview` has no `@Roles` in the controller. All create, update and delete endpoints are `@Roles('admin', 'leader')` (`principal` and `coordinator` also pass via inheritance).

**Purpose:** Manage the school's academic setup: wings, classes and sections, subjects and their assignment to classes, the grading scale, exam types and medium of instruction.

### Functions
General: on load the page fetches everything with `GET /academics/overview`. Every change goes through a helper that runs the call, then refetches the overview. On failure it shows `alert("<failure text>: <error message or Unknown error>")`. Six tabs: Wings, Classes, Subjects, Grading, Exams, Medium (default Wings).

**Wings tab**
| Control | Action | API |
|---|---|---|
| "Add Wing" / "Cancel" | Shows or hides the add form. | none |
| Form: Wing name, Grade range, Coordinator | Text inputs. | none |
| "Save Wing" | Requires a wing name (else alert `Wing name is required.`). Creates the wing, clears and closes the form. | `POST /academics/wings` |
| Trash icon on a wing card | After `window.confirm`, deletes the wing (classes are kept but unassigned). | `DELETE /academics/wings/:id` |

**Classes tab**
| Control | Action | API |
|---|---|---|
| "Add Class" / "Cancel" | Shows or hides the form. | none |
| Form: Class name, Short code, Wing (select, default Unassigned), Sections (comma separated, default `A`) | Inputs. | none |
| "Save Class" | Requires name and code (else alert `Class name and code are required.`). Sends `{name, code, wingId or null, sections}`; empty sections become `["A"]`. | `POST /academics/classes` |
| Trash icon on a class card | After `window.confirm`, deletes the class and its sections. | `DELETE /academics/classes/:id` |
| Section chips (click) | After `window.confirm`, removes that section. | `DELETE /academics/classes/:id/sections/:sectionId` |
| "Add section" input + `+` button (Enter also works) | Adds a section (name upper-cased, max 4 characters). | `POST /academics/classes/:id/sections` |

**Subjects tab**
| Control | Action | API |
|---|---|---|
| "New subject" input, "Type" select (`scholastic`, `co-scholastic`, `assessment`), "Add" button (Enter also works) | Requires a name (else alert `Subject name is required.`). Creates the subject. | `POST /academics/subjects` |
| "Select a class..." dropdown | Chooses a class. | none |
| Subject toggle chips (after a class is selected) | Adds or removes the subject for that class by sending the full list of subject IDs. | `POST /academics/classes/:id/subjects` body `{subjectIds}` |
| Catalogue cards grouped by type; trash icon (visible on hover) | After `window.confirm`, deletes the subject from every class. | `DELETE /academics/subjects/:id` |

**Grading tab** (uses the first grading scale)
| Control | Action | API |
|---|---|---|
| "Check a percentage" input + "Grade it" (Enter also works) | Validates 0–100 (else alert `Enter a percentage between 0 and 100.`), finds the matching band and shows grade and PASS/FAIL against the pass mark. | none |
| "Pass mark" input | On blur, if changed, validates 0–100 (else alert `Pass mark must be 0-100.`) and saves. | `PATCH /academics/grading/:id` body `{passMark}` |
| Bands table | Read-only, sorted by minimum mark descending. Pass/Fail per band is `minMark >= passMark`. | none |
| If no scale exists | Shows an error box. | none |

**Exams tab**
| Control | Action | API |
|---|---|---|
| "Add Exam Type" / "Cancel" | Shows or hides the form. | none |
| Form: Exam name, Applies to (default `All grades (I - XII)`), "Counts as a term" checkbox | Inputs. | none |
| "Save Exam Type" | Requires a name (else alert `Exam name is required.`). | `POST /academics/exam-types` |
| Trash icon per row | After `window.confirm`, deletes the exam type. | `DELETE /academics/exam-types/:id` |

**Medium tab**
| Control | Action | API |
|---|---|---|
| Primary medium, Second language (from Grade 1), Board & curriculum inputs; "Save" | Saves the school-wide medium settings. | `PATCH /academics/medium` |

### Text on screen
**Header:** eyebrow `Academics`; title `Academic Structure`; description `Wings, classes, subjects, grading scale and exam types.`

**Summary card:** `Academic Structure`; `<n> wings · <n> classes · <n> subjects` or `Loading structure`

**Tabs:** `Wings`, `Classes`, `Subjects`, `Grading`, `Exams`, `Medium`

**Loading:** `Loading academic structure...`; **Error:** `Unable to load academic structure: <message>` (default message `Failed to load academic structure.`)

**Wings:** buttons `Add Wing` / `Cancel`, `Save Wing` / `Saving...`; labels `Wing name` (`e.g. Middle School`), `Grade range` (`e.g. Grade 6 - 8`), `Coordinator` (`e.g. Mrs. Gangadevi`); card badge `Wing <sortOrder>`; fallbacks `No grade range set`, `No coordinator`; `<n> classes`. Confirm: `Delete wing "<name>"? Its classes will be kept but unassigned.` Failure text: `Failed to create wing`, `Failed to delete wing`.

**Classes:** buttons `Add Class` / `Cancel`, `Save Class` / `Saving...`; labels `Class name` (`e.g. Grade VI`), `Short code` (`e.g. 6`), `Wing` (option `Unassigned`), `Sections (comma separated)` (`A, B, C`); section chip tooltip `Remove section <name>`; input placeholder `Add section`; `<n> subjects`. Confirms: `Delete <class> and its <n> section(s)?`, `Remove section <name> from <class>?`. Failure text: `Failed to create class`, `Failed to delete class`, `Failed to add section`, `Failed to remove section`.

**Subjects:** label `New subject` (`e.g. French`); label `Type`; button `Add`; section `Subjects per class` with `Pick a class, then toggle which subjects it offers.`; option `Select a class...`; empty prompt `Select a class to edit its subjects.`; catalogue badges show the type name and count. Confirm: `Delete subject "<name>"? It will be removed from every class.` Failure text: `Failed to create subject`, `Failed to delete subject`, `Failed to update class subjects`.

**Grading:** label `Check a percentage` (placeholder `e.g. 85`); button `Grade it`; result labels `Grade`, `PASS` / `FAIL`, `Pass <passMark>`; scale name as heading and `<n> bands`; label `Pass mark`; table columns `Marks`, `Grade`, `Status`; row status `Pass` / `Fail`; note `To edit the bands themselves, change them in the database — the API replaces bands only when the whole set is sent, which protects this scale from partial writes.`; no scale: `Unable to load grading scale: No scale configured.` Failure text: `Failed to update pass mark`.

**Exams:** buttons `Add Exam Type` / `Cancel`, `Save Exam Type` / `Saving...`; labels `Exam name` (`e.g. Periodic Test 4`), `Applies to`, checkbox `Counts as a term`; table columns `#`, `Exam`, `Applies to`, `Term`, `Action`; badge `Term` or `—`; empty state `No exam types defined yet.` Confirm: `Delete exam type "<name>"?` Failure text: `Failed to create exam type`, `Failed to delete exam type`.

**Medium:** heading `Medium of instruction`; `Applies school-wide and appears on report cards and schedules.`; labels `Primary medium` (`English`), `Second language (from Grade 1)` (`Tamil / Hindi / French`), `Board & curriculum` (`CBSE`); button `Save` / `Saving...`. Failure text: `Failed to update medium of instruction`.


---

# Part 3: Operations Pages (Frontend `frontend/src`)

Notes common to all pages:

- Every `/dashboard/*` route is wrapped by `DashboardLayoutShell` (`components/dashboard/dashboard-layout-shell.tsx`). It redirects to `/` when there is no session, and logs out and redirects when `canAccessWebDashboard(role)` is false (allowed roles: `admin`, `leader`, `teacher`, `parent`).
- The layout does not restrict individual routes by role. The access notes below come from the sidebar (`sidebar-nav.tsx`), from checks inside the page, and from `@Roles` decorators on the backend.
- The sidebar shows the "MANAGEMENT" section (Users, Academic Structure, Staff, Role Assignment, Admission, Profile Requests, Leave Applications, Birthdays, Substitutions) only when role is `admin` or `leader`. Attendance, Timetable, Homework and Calendar are in the "WORKSPACE" section for every dashboard user. "My Profile" and "Substitution" are in the "TOOLS" section only for role `teacher`.
- API calls go through `apiRequest` (`services/api-client.ts`). Base URL is `NEXT_PUBLIC_API_BASE_URL`, default `http://localhost:5000`.
- Shared state components (`resource-states.tsx`): `ResourceLoading` shows `Loading {label}...`. `ResourceError` shows `Unable to load {label}: {message}`.
- Each `page.tsx` only renders the matching component.

---

## 1. Attendance

- **Route:** `/dashboard/attendance` (component `AttendancePage`, `attendance-page.tsx`)
- **Who can access:** Any logged-in dashboard user can open the page (sidebar "Attendance" is shown to all). Backend: `GET /attendance` has no role restriction, `POST /attendance/mark` allows `admin`, `teacher`, and `POST /attendance/mark-teacher` allows `admin` only. The page itself does not check the role.
- **Purpose:** Mark and review daily attendance for teachers and students, with a class-wise summary. Changes are edited locally, then saved with a button.

### Functions

- **On load:** `GET /attendance` (via `getAttendance`) returns teachers, summary, class-wise data and students per class. Shows the loading or error state while fetching.
- **View buttons (top):**
  - "Teacher Attendance": sets view to teacher, clears selected class.
  - "Class-wise Summary": sets view to class summary, clears selected class.
  - "Student Attendance": sets view to student, clears selected class.
- **Teacher view:**
  - Four metric cards: Total Faculty, Present, Absent, Not Marked (Present/Absent/Not Marked computed from local edits plus loaded status).
  - Live counters `{n}P`, `{n}A`, `{n} unmarked` (the unmarked badge shows only when more than 0).
  - "All Present" and "All Absent": set every teacher's local status.
  - "Save Attendance": `POST /attendance/mark-teacher` with `{date: today, records: [{teacherId (empId), status, department}]}`. Status defaults to the local value, then the loaded status, then "Present". On success shows the saved message. Button is disabled and shows "Saving..." while saving. The message clears after 4 seconds.
  - Table with per-row button "Mark Absent" (when Present) or "Mark Present" that toggles the local status.
  - Photo is a dicebear avatar generated from the teacher name.
- **Class-wise Summary view:**
  - Metric cards: Total Present, On Leave/Absent, Late arrivals (from `data.summary`).
  - Table of classes. Clicking a class name switches to the student view for that class.
- **Student view (no class selected):** same three metric cards, plus a grid of class cards (class name and `{n} students`). Clicking a card selects the class. The class list comes from the keys of `studentsAttendance`, excluding `Unassigned`.
- **Student view (class selected):**
  - "Back to Classes" clears the selection.
  - Live counters, "All Present", "All Absent", "Save Attendance".
  - "Save Attendance": `POST /attendance/mark` with `{date: today, class, section, records: [{studentId (rollNo), status}]}`. Class and section come from splitting the selected key on `-`.
  - Table with per-row toggle button "Mark Absent" / "Mark Present". Status badge shows "Leave" when status is `L`.

### Text on screen

- Eyebrow: `Attendance`
- Title: `Attendance: Class {selectedClass}` / `Teacher Attendance` / `Attendance Management` (the last for the class and student views with no class selected)
- Description: `Manage presence for both faculty and students. Admins can mark and update records in real-time.`
- View buttons: `Teacher Attendance`, `Class-wise Summary`, `Student Attendance`
- Loading/error: `Loading attendance...`, `Unable to load attendance: {message}`
- Teacher view: `Total Faculty`, `Present`, `Absent`, `Not Marked`; heading `Faculty Attendance`; subtext `Mark attendance for all teachers · {today's date, en-IN long format}`; buttons `All Present`, `All Absent`, `Save Attendance`, `Saving...`; table columns `Photo`, `Emp ID`, `Teacher Name`, `Department`, `Status`, `Action`; department fallback `N/A`; row buttons `Mark Absent` / `Mark Present`; empty state `No teachers found in the database.` and `Add teacher accounts to see them here.`
- Toast/message: `✓ Saved {n} teacher records`, `✓ Saved {n} student records`, `Failed to save. Try again.`
- Class summary: `Total Present`, `On Leave/Absent`, `Late arrivals`; heading `Class-wise Report`; columns `Class`, `Total Students`, `Present`, `Absent`, `Percentage`
- Student view: class card text `{n} students`; `Back to Classes`; heading `Student Attendance`; subtext `Currently viewing records for Class {selectedClass}`; columns `Photo`, `Roll No`, `Student Name`, `Status`, `Action`; buttons as above.

---

## 2. Timetable

- **Route:** `/dashboard/timetable` (`TimetablePage`, `timetable-page.tsx`)
- **Who can access:** Any logged-in dashboard user (sidebar "Timetable" for all). Backend `GET /timetable` has no auth guard. Create/update/delete timetable endpoints (`POST/PATCH/DELETE /timetable`) allow `admin`, `leader`, `teacher`, but this page does not call them.
- **Purpose:** Show the master timetable. Pick a class to see its weekly grid of seven periods and a lunch column. Edits made on the page stay in local state only.

### Functions

- **On load:** `GET /timetable`. Reads `schedule` (day and periods) and `metadata.classes`. Sets the class list from `metadata.classes` when present.
- **Class selection grid:** each class card sets `selectedClass`. Card shows the class name and `Grade {first part before "-"}`.
- **"Add Class" (header button and dashed card):** opens "Add New Class" modal. Input is upper-cased and trimmed; Enter key also submits. "Add Class" button adds the class to the local list. If it already exists, `alert('Class "{name}" already exists.')`. Empty input does nothing. No API call.
- **Back button (caret) when a class is selected:** clears the selection.
- **"Edit Timetable" / "Save Schedule":** toggles `isEditing`. No API call; "Save Schedule" only leaves edit mode.
- **Plus icon button (class selected):** opens "Add Time Slot" modal.
- **"Add Slot Override" (shown only while editing):** opens the same modal.
- **Add Time Slot modal:** fields Day (select Monday to Friday), Time, Subject, Grade (prefilled with and locked to the selected class), Room. "Add to Schedule" validates that time, subject, grade, room are non-empty, else `alert("Please fill in all fields")`. It appends the slot to local state for that day. No API call. Slots fill period columns in order.
- **Grid:** rows Monday to Friday; columns I, II, III, LUNCH, IV, V, VI, VII. Cells show the subject of the nth slot of the day or `-`. The data is shown for the day regardless of the selected class (the grid does not filter by class). `handleRemoveEntry` exists but no UI calls it.

### Text on screen

- Eyebrow: `Academic Schedule`
- Title: `Master Timetable` or `Timetable: {selectedClass}`
- Description: `Select a class to view its specific weekly schedule and coordinate with departments.` or `Viewing detailed 8-period schedule for Class {selectedClass}.`
- Header card: `Weekly View` or `Class {selectedClass}`; subtext `{data.weekLabel}` or fallback `May 2024 • Term 1 Schedule`
- Buttons: `Add Class`, `Edit Timetable`, `Save Schedule`, `Add Slot Override`
- Loading/error: `Loading timetable...`, `Unable to load timetable: {message}`
- Table headers: `DAY / PERIOD`, `I`, `II`, `III`, `LUNCH`, `IV`, `V`, `VI`, `VII`; row label `LUNCH`; empty cell `-`
- Add Time Slot modal: title `Add Time Slot`; labels `Day`, `Time`, `Subject`, `Grade`, `Room`; placeholders `09:00 AM`, `Mathematics`, `10-A`, `Room 101`; button `Add to Schedule`
- Add New Class modal: title `Add New Class`; text `Enter the class name (e.g. 1-C, 11-B)`; placeholder `e.g. 1-C`; button `Add Class`
- Alerts: `Please fill in all fields`; `Class "{name}" already exists.`

---

## 3. Homework

- **Route:** `/dashboard/homework` (`HomeworkPage`, `homework-page.tsx`)
- **Who can access:** Any logged-in dashboard user can open it (sidebar for all). Backend: `GET /homework` allows any authenticated user per the controller; `POST /homework` and `DELETE /homework/:id` allow `admin`, `teacher`.
- **Purpose:** List homework assignments and let staff create or delete them.

### Functions

- **On load:** `GET /homework` and renders cards. Error message from the API or `Failed to load homework.`
- **"Create Homework" button:** opens the modal.
- **Create modal:** fields Title, Description, Class, Section, Subject, Due Date. "Post Homework" validates that title, subject, due date, class and section are filled, else `alert("Please fill in all required fields.")`. Then `POST /homework` with `{title, description, subject, dueDate, class, section}`. On success closes the modal, resets the form and reloads the list. On failure `alert("Failed to create homework: {message}")`. Button shows `Creating...` and is disabled while submitting.
- **Trash icon on each card:** after `confirm`, calls `DELETE /homework/{id}` and reloads. On failure `alert("Failed to delete homework: {message}")`.
- **Card contents:** subject badge, title, description (2 lines), `Class {class}-{section}`, `Due: {date}`.

### Text on screen

- Eyebrow: `Academics`; Title: `Homework Management`; Description: `Create, view, and manage homework assignments across all classes.`
- Header card: `Active Assignments`, `Manage student workload`; button `Create Homework`
- Loading/error: `Loading homework...`, `Unable to load homework: {message}`
- Empty state: `No homework assignments found.` and `Click "Create Homework" to add one.`
- Modal: title `Create Homework`; labels `Title`, `Description`, `Class`, `Section`, `Subject`, `Due Date`; placeholders `e.g. Algebra Exercise 5`, `Provide details about the assignment...`, `e.g. 10`, `e.g. A`, `e.g. Mathematics`; button `Post Homework` / `Creating...`
- Dialogs: `Are you sure you want to delete this homework?`; `Please fill in all required fields.`; `Failed to create homework: {message}`; `Failed to delete homework: {message}`

---

## 4. Calendar

- **Route:** `/dashboard/calendar` (`CalendarPage`, `calendar-page.tsx`)
- **Who can access:** Any logged-in dashboard user can view. The "ADD EVENT" button and event editing is meaningful for `admin` (`isAdmin = role === "admin"`). Note: clicking an existing event opens the edit modal for any role, since only the "ADD EVENT" button is hidden for non-admins.
- **Purpose:** Monthly school calendar showing academic events, exams, holidays and events. Data is hard-coded sample events held in local state (no API call).

### Functions

- **Month navigation:** left and right caret buttons move to the previous or next month. The initial month is May 2026.
- **Grid:** 7-column month grid (Sunday to Saturday); today's date is highlighted; events appear as colored chips by type.
- **Click an event chip:** opens the modal in edit mode.
- **"ADD EVENT" (admin only, hidden on small screens):** opens the modal in create mode.
- **Modal form:** Event Title, Date (date input), Time (text), Event Category (buttons `academic`, `holiday`, `exam`, `event`), Location.
- **Create Event / Update Event:** saves to local state only (no validation, no API).
- **Delete (edit mode only):** `confirm("Delete this event?")` then removes it locally.
- **"Next Events" panel:** the first four events on or after 1 May 2026 sorted by date, with month, day, title, time.
- **Legend:** Academic, Holiday, Exam, Event.
- Initial sample events: Mid-Term Examination (2026-05-15), Annual Sports Meet (2026-05-22), Labor Day Holiday (2026-05-01), Parent Teacher Meeting (2026-05-28).

### Text on screen

- Eyebrow: `Schedule & Events`; Title: `School Calendar`; Description: `Manage the official school timeline, schedule events, and broadcast academic dates to the community.`
- Card header: `School Schedule` (displayed upper-case), `Academic events, exams and holidays for the current year.`; `{Month} {Year}`; button `ADD EVENT`
- Weekday headers: `Sunday` to `Saturday` (first 3 letters on mobile)
- Next Events panel: `Next Events`, `Academic Focus`
- Legend: `Academic`, `Holiday`, `Exam`, `Event`, `SNS ACADEMY`
- Modal: titles `Edit Event` / `Create New Event`; labels `Event Title`, `Date`, `Time`, `Event Category`, `Location`; placeholders `E.g. Sports Day`, `10:00 AM`, `E.g. Auditorium`; buttons `Delete`, `Update Event`, `Create Event`
- Confirm: `Delete this event?`

---

## 5. Birthdays

- **Route:** `/dashboard/birthdays` (`BirthdaysPage`, `birthdays-page.tsx`)
- **Who can access:** Sidebar link is shown to `admin` and `leader`. The page itself has no role check. It calls `GET /users`, which the backend restricts to `admin`, so other roles would get no data (the error is only logged to the console).
- **Purpose:** Show birthdays of students and teachers and wedding anniversaries of teachers, filtered by today, next 30 days or whole year.

### Functions

- **On load:** `GET /users` (via `getAllUsers`, with no-cache headers). Failure is logged with `console.error("Failed to fetch users", err)`.
- **Category toggle:** `Students` (users with role `parent`, DOB from `studentProfile.dob`) or `Teachers` (role `teacher`, DOB from `teacherProfile.dateOfBirth`; plus an anniversary card from `teacherProfile.weddingDate`).
- **Tab toggle:** `Today`, `Next 30 Days` (1 to 30 days ahead, wrapping the year), `All Year`.
- **Search box:** filters by name (case-insensitive).
- Results are sorted by days until the next occurrence.
- **Celebration card:** icon, name, `Student`/`Staff Member`, `Wedding Anniversary`/`Birthday Celebration`, Month and Date. A "Happening Today" badge for today's items. A gift icon button on non-today cards and a "Send Wishes" button plus a star button on today's cards. These buttons have no handlers (no action).

### Text on screen

- Eyebrow: `School Celebrations`; Title: `Birthdays & Anniversaries`; Description: `Celebrate our community members. Track upcoming birthdays for students and staff, and wedding anniversaries for faculty.`
- Filters: `Students`, `Teachers`; `Today`, `Next 30 Days`, `All Year`; placeholder `Search by name...`
- Loading: `Loading celebrations...`
- Empty state: `No celebrations found` and `Try adjusting your filters or search query.`
- Card: `Happening Today`, `Student`, `Staff Member`, `Wedding Anniversary`, `Birthday Celebration`, `Month`, `Date`, `Send Wishes`

---

## 6. Substitution (teacher request view)

- **Route:** `/dashboard/substitution` (`SubstitutionPage`, `substitution-page.tsx`)
- **Who can access:** Sidebar link "Substitution" is shown only to role `teacher`. No role check inside the page.
- **Purpose:** Lets a teacher pick one of their periods and request a colleague to cover. It is a static mockup: periods, staff and history are hard-coded and no API is called.

### Functions

- **Step 1, Select Your Period:** three hard-coded period cards (09:00 AM - 09:45 AM Mathematics 10-A; 10:30 AM - 11:15 AM Mathematics 9-B; 01:30 PM - 02:15 PM Free Period N/A). Clicking selects one.
- **Step 2, Assign Available Staff:** dimmed and disabled until a period is selected. Lists three hard-coded staff (Mr. Vikram Rao, Physics, Light; Ms. Anjali M., Mathematics, Medium; Dr. Karan S., Computer Science, Free). Each has a "Request" button. Every button runs the same handler, which after 1.5 seconds sets the sent state. While requesting, every button reads "Sending...". No API call.
- **Sent state:** confirmation screen with "Create Another Request" that resets the form.
- **Right column:** "Recent History" with two hard-coded entries; "Urgent Need?" card with a "Contact Admin" button that has no handler.

### Text on screen

- Eyebrow: `Schedule Coordination`; Title: `Substitution Management`; Description: `Request staff coverage for your periods or view pending substitution requests from your colleagues.`
- `New Substitution Request`; `1. Select Your Period`; `2. Assign Available Staff`; `{dept} • Workload: {load}`; buttons `Request`, `Sending...`
- Success: `Request Sent`; `Your substitution request for {subject} ({grade}) has been sent to the staff members.`; button `Create Another Request`
- Sidebar cards: `Recent History`; entries `Mr. Somnath P.` / `Covered your class` / `Completed` / `Yesterday` and `Ms. Anjali M.` / `Requested you` / `Declined` / `2 days ago`
- `Urgent Need?`; `If you have an emergency and need immediate coverage, please contact the Office Admin directly via the Chat system.`; button `Contact Admin`

---

## 7. Substitutions (admin assignment wizard)

- **Route:** `/dashboard/substitutions` (`SubstitutionsPage`, `substitutions-page.tsx`)
- **Who can access:** Sidebar link shown to `admin` and `leader` (with a pending count badge). The page has no role check. `GET /users` is admin-only on the backend. The substitutions endpoints have no role decorators.
- **Purpose:** Admin assigns substitute teachers for an absent teacher through a three-step wizard, and sees recent assignments and summary counts.

### Functions

- **On load:** `GET /users` (teachers only are kept) and `GET /substitutions` (history from `requests`, counters from `summary`). Errors are logged to the console.
- **Stat cards:** Pending Requests (`pendingApproval`), Emergency Replacements (`emergencyReplacements`), Auto Assignments (`autoAssigned`).
- **Step 1:** Assignment Date (date input, defaults to today) and Search Teacher (filters by name or department). Clicking a teacher selects them and moves to step 2.
- **Step 2:** shows the absent teacher, with a filter icon button that returns to step 1. Period toggle buttons Period 1 to 8. "Select All" / "Deselect All" toggles all eight. "Find Available Substitutes" (disabled with no periods or while loading): calls `GET /substitutions/available?date=&period=&absentTeacherId=` for each selected period and keeps only teachers free in all periods, then goes to step 3.
- **Step 3:** list of available substitutes (name, dept, specialization, "Best Match" badge when `score > 0`). "Back to Periods" returns to step 2. "Assign" calls `POST /substitutions` once per selected period with `{date, period, absentTeacherId, substituteTeacherId, notes: "Manual Assignment (Bulk)"}`. On success shows the completion screen and refreshes `GET /substitutions`. Errors are logged only. Button shows `Assigning...` while submitting.
- **Footer:** chips for the selected teacher and `Periods: ...`; "Cancel Wizard" (shown when step > 1) goes back one step (it does not reset the wizard).
- **Completion screen:** "Start New Assignment" resets the wizard.
- **Recent Assignments panel:** date, status (`completed` styled green, otherwise orange), absent teacher to suggested teacher, `Period {n} • {mode}`.

### Text on screen

- Eyebrow: `Admin Operations`; Title: `Substitution Management`; Description: `Manage staff absences by intelligently assigning available substitutes based on timetable and specialization.`
- Stat labels: `Pending Requests`, `Emergency Replacements`, `Auto Assignments`
- Wizard: `New Assignment Wizard`; `Assignment Date`; `Search Teacher`; placeholder `Search by name or dept...`; teacher subtext `{department} • {specialization or "General"}`
- Step 2: `Absent Teacher`; `Select Absent Periods`; `Select All` / `Deselect All`; `Period {1-8}`; button `Find Available Substitutes`
- Step 3: `Available Substitutes`; `Back to Periods`; `Best Match`; `Assign` / `Assigning...`; empty state `No free teachers found for this period.`
- Footer: `Periods: {list}`; `Cancel Wizard`
- Success: `Assignment Complete!`; `The substitution for {teacher name} has been successfully recorded and the substitute has been notified.`; button `Start New Assignment`
- History: `Recent Assignments`; empty state `No recent history`

---

## 8. Leave Applications

- **Route:** `/dashboard/leaves` (`LeaveApplicationsPage`, `leave-applications-page.tsx`)
- **Who can access:** Sidebar link shown to `admin` and `leader` (with a pending count badge). Backend: `GET /leaves` allows `admin`, `leader`, `teacher`; `PATCH /leaves/:id` allows `admin`, `leader`.
- **Purpose:** Review student leave requests submitted by parents and approve or reject them with an optional note.

### Functions

- **On load (when a session token exists):** `GET /leaves` with the bearer token. On failure the toast reads `Failed to load applications.`
- **Filter tabs:** `all`, `pending`, `approved`, `rejected`, each with a count `(n)`. Filters the list locally.
- **Card:** student initial avatar, student name, `Class {class}-{section} · {email}`, `Submitted {date}`, status pill, From, To, optional "View Document" link (opens `documentUrl` in a new tab), Reason, and `Admin note: {note}` when present.
- **Pending cards only:** text input for an optional note, plus two buttons:
  - "Approve": `PATCH /leaves/{id}` with `{status: "approved", adminNote}`.
  - "Reject": `PATCH /leaves/{id}` with `{status: "rejected", adminNote}`.
  - Both are disabled with a spinner while the action runs. On success the toast reads `Leave {status}.` and the list reloads. On failure `Action failed.`
- Toast disappears after 3.5 seconds.

### Text on screen

- Eyebrow: `Student Management`; Title: `Leave Applications`; Description: `Review and approve or reject student leave requests submitted by parents.`
- Tabs: `all (n)`, `pending (n)`, `approved (n)`, `rejected (n)` (displayed upper-case)
- Empty state: `No {filter} applications.` (the filter word is omitted for "all")
- Card labels: `Submitted {date}`, `From`, `To`, `View Document`, `Reason`, `Admin note: {note}`
- Placeholder: `Add an optional note for the parent...`
- Buttons: `Approve`, `Reject`
- Toasts: `Failed to load applications.`, `Leave approved.`, `Leave rejected.`, `Action failed.`

---

## 9. Profile Requests

- **Route:** `/dashboard/profile-requests` (`ProfileRequestsPage`, `profile-requests-page.tsx`)
- **Who can access:** Sidebar link shown to `admin` and `leader` (with a count badge). Backend `GET /auth/profile-requests` and `PATCH /auth/profile-requests/:id` allow `admin` only.
- **Purpose:** Review parent profile change requests and approve or reject them with an optional note.

### Functions

- **On load (when a session token exists):** `GET /auth/profile-requests` with the bearer token. On failure the toast reads `Failed to load profile requests.`
- **Pending section:** per request shows name, `{email} · {role}`, date and time, status pill, and each changed field (field name and new value). Includes an "Admin Note (optional)" input and two buttons:
  - "Approve": `PATCH /auth/profile-requests/{id}` with `{action: "approved", adminNote}`.
  - "Reject": same endpoint with `{action: "rejected", adminNote}`.
  - Disabled with spinner while running. Success toast `Request {action} successfully.` then reload. Failure toast `Action failed. Please try again.`
- **Resolved section:** read-only rows with name, date, optional `Note: {adminNote}`, and status pill.
- Toast disappears after 4 seconds.

### Text on screen

- Eyebrow: `User Management`; Title: `Profile Update Requests`; Description: `Review and approve or reject parent profile change requests.`
- Section headings: `Pending ({n})`, `Resolved ({n})`
- Empty state: `No profile update requests yet.`
- Labels: `Admin Note (optional)`; placeholder `Add a note for the parent...`; buttons `Approve`, `Reject`; `Note: {adminNote}`
- Toasts: `Failed to load profile requests.`, `Request approved successfully.`, `Request rejected successfully.`, `Action failed. Please try again.`

---

## 10. Profile

- **Route:** `/dashboard/profile` (`ProfilePage`, `profile-page.tsx`)
- **Who can access:** Sidebar link "My Profile" is shown only to role `teacher`. The page has no role check and reads the current session user.
- **Purpose:** Shows the logged-in user's profile and allows changing the profile photo. Text edits are only local and are not saved to the backend.

### Functions

- **Initial data:** name, email, phone, role, department and employee/student ID from the session user. Bio starts empty.
- **Photo:** loads a saved photo from local storage (`getProfilePhotoLocally`). The pencil button on the avatar opens a file picker (images only). The chosen file is uploaded with `uploadAvatar` (Supabase storage), the URL is saved locally with `saveProfilePhotoLocally`, and the photo updates. The button shows a spinner while uploading. On failure `alert("Photo upload failed: {message}")`.
- **"Edit Profile" / "Save Changes":** toggles edit mode. In edit mode Full Name, Phone Number and Professional Bio can be changed. The Email field is enabled but has no change handler, so it cannot be edited. "Save Changes" only leaves edit mode. There is no API call.
- "Security Status" shows a fixed `Two-Factor Enabled` badge.

### Text on screen

- Eyebrow: `Account Settings`; Title: `My Profile`; Description: `Manage your professional profile, contact information, and system preferences.`
- Left card: user name, role (upper-case), `Employee ID`, `Department`
- Form heading: `Personal Information`; button `Edit Profile` / `Save Changes`
- Labels: `Full Name`, `Email Address`, `Phone Number`, `Security Status`, `Professional Bio`
- Badge: `Two-Factor Enabled`
- Alert: `Photo upload failed: {message}`


---

# Part 4: Content, Results, Settings and Records Pages

Source: `frontend/src/components/dashboard/*.tsx`, wrapped by `frontend/src/app/dashboard/<route>/page.tsx`. Quoted text is copied from the code.

## Common access notes

- All routes sit under `app/dashboard/layout.tsx`, which renders `DashboardLayoutShell`. The shell redirects to `/` if there is no session or the role is not in `webAllowedRoles` (`admin`, `leader`, `teacher`, `parent`) (`lib/role-access.ts`).
- None of the eight page components checks the user role before rendering, apart from the specific checks noted per page. Effective access therefore comes from the sidebar (`sidebar-nav.tsx`) and the backend role guards.
- Sidebar: "New Post" and "Event Gallery" are in the WORKSPACE section, shown to every role. "Alumni", "Results", "Transport", "Reports", "Chat" and "Settings" are in the TOOLS section, also shown to every role. The MANAGEMENT section is shown only to `admin` and `leader`.
- Most pages load students with `GET /users`, which the backend restricts to `admin` (`@Roles('admin')`). For other roles that call returns an error.
- `PageSection` renders only its children. The `eyebrow`, `title` and `description` props are passed in but are NOT displayed on screen. They are listed below as "props (not rendered)".

---

## 1. Notice Post

- **Route:** `/dashboard/notice-post` (`notice-post-page.tsx`). Sidebar label: "New Post" (highlighted). The top bar in the layout shell also routes here (`dashboard-layout-shell.tsx`).
- **Who can access:** The page has no frontend role check, so any signed-in web user who reaches the URL sees the form. The backend `POST /announcements` is limited to `admin` and `leader`. Other roles get an error toast on publish.
- **Purpose:** Admins compose and publish a school announcement with a headline, body, optional image and a target audience.

### Functions

| Control | Behaviour | API |
|---|---|---|
| Announcement Headline (text input) | Sets the title. | none |
| Content Detail (textarea) | Sets the body. | none |
| "Add Image" button | Opens a hidden file picker (`accept="image/*"`). Rejects non-images and files over 10 MB with a toast. Shows a preview on success. | none (validation only) |
| Remove (X) button on preview | Clears the selected image. Disabled while busy. | none |
| Target Audience buttons: Global (Everyone), Parents (Parent Portal), Faculty (Staff Only) | Sets `target` to `all`, `parents` or `staff`. Default is `all`. | none |
| "Publish Post" button | Requires non-empty title and content. If an image is selected, uploads it to Supabase storage folder `announcements` (`uploadFile`). Then calls `createAnnouncement`. On success it toasts and navigates to `/dashboard/events-gallery`. Disabled while uploading or publishing. | `POST /announcements` body `{title, content, target, imageUrl?}` |

### Text on screen

- props (not rendered): eyebrow "School Bulletin", title "Create New Post", description "Publish official announcements, event updates, and news stories with rich media to the school community."
- Labels: "Announcement Headline", "Content Detail", "Media Attachments"
- Placeholders: "e.g. Annual Cultural Festival 2026", "Write your announcement details here..."
- Image button: "Add Image"; overlay while uploading: "Uploading…"; preview alt "Preview"
- Right panel heading: "Publish Settings"; sub-label "Target Audience"
- Audience options: "Global" / "Everyone"; "Parents" / "Parent Portal"; "Faculty" / "Staff Only"
- Publish button: "Publish Post"; while busy: "Uploading…" or "Publishing…"
- Card "Post Guidelines":
  - "Postings are immediate and cannot be undone once published."
  - "Images are uploaded to secure cloud storage (max 10 MB)."
- Toasts (sonner):
  - error "Only image files are allowed"
  - error "Image must be smaller than 10 MB"
  - error "Please provide both title and content"
  - error "Image upload failed. Please try again."
  - success "Notice posted successfully!"
  - error: the server error message, or "Failed to post announcement"

---

## 2. Events Gallery (Event Gallery)

- **Route:** `/dashboard/events-gallery` (`events-gallery.tsx`). Sidebar label: "Event Gallery".
- **Who can access:** Any signed-in web user. `GET /announcements` has no role guard. The "New Post" button and the "Create the first post →" link are shown only when the role is `admin` or `leader`.
- **Purpose:** A feed of the latest announcements (up to 50) shown as cards with author, audience badge, time, image and text.

### Functions

| Control | Behaviour | API |
|---|---|---|
| Page load / Refresh icon button (title "Refresh") | Fetches announcements (skip 0, take 50). | `GET /announcements?skip=0&take=50` |
| "New Post" button (admin and leader only) | Goes to `/dashboard/notice-post`. | none |
| Filter pills "All" / "Parents" | Client-side filter. "All" shows everything. "Parents" shows only posts whose audience label is "Parents". | none |
| "Retry" (error state) | Refetches. | `GET /announcements` |
| "Create the first post →" (empty state, admin and leader only) | Goes to `/dashboard/notice-post`. | none |
| Share icon on each card | Has no click handler. | none |

### Text on screen

- Heading "Event Gallery"; subtitle `{n} announcements`
- Filters: "All", "Parents"
- Audience badges: "Everyone", "Parents", "Staff Only"
- Relative time: "Just now", "{m}m ago", "{h}h ago", "{d}d ago", else a date in `en-IN` format
- Card footer: author role (capitalised) and the full date/time
- Error: "Failed to load announcements." with button "Retry"
- Empty: "No announcements yet" and (admin and leader) "Create the first post →"
- Button "New Post"

---

## 3. Chat

- **Route:** `/dashboard/chat` (`chat-page.tsx`). The layout shell removes padding on this route. The shell header also links here.
- **Who can access:** Any signed-in web user. The `/messaging/*` endpoints use `AuthGuard` only, with no role restriction. When the role is `parent`, the page is read-only: the message composer is replaced by a notice, and the create, edit and add-member controls are hidden.
- **Purpose:** Group chat. A list of groups on the left and the selected group's messages on the right, with message sending, file/image attachments and group management.

### Functions

| Control | Behaviour | API |
|---|---|---|
| Page load | Loads groups, de-duplicated by id. Each is shown with the placeholder last message "Select to view messages" and time "Now". | `GET /messaging/groups` |
| "Messages" tab | Active-looking tab with an empty click handler. | none |
| "Announcements" tab (hidden for parents) | Empty click handler, so it does nothing. | none |
| Search box | Filters the group list by name, client-side. | none |
| Group list item | Selects the group and loads its messages. | `GET /messaging/messages/:groupId` |
| Chat header (icon and name) | Opens the "Group info" slide-over. | none |
| Three-dots button in the header | No handler. | none |
| Paperclip (non-parents) | Picks a file. Shows a local "📎 Uploading {name}…" message, uploads to Supabase folder `chat`, then sends a message `📷 [Image] {url}` for images or `📎 [File] {name} — {url}` for other files. On failure it removes the local message and shows `alert("Upload failed: …")`. | Supabase upload, then `POST /messaging/send` |
| Message input and Enter key / send button (non-parents) | Sends text to the selected group and refreshes messages. The send button is disabled when the input is empty. Failures are only logged. | `POST /messaging/send` body `{groupId, text}` |
| Image / file messages | Images render as a clickable thumbnail. Files render as a link. | none |
| Group info panel: pencil icon (non-parents) | Opens the "Create Group" dialog pre-filled with the group's name and description. See note below. | none until confirmed |
| Group info: "Add" and "Add members" (non-parents) | Opens the "Add Members" dialog and loads all users. | `GET /users` (admin only on the backend) |
| Group info: "Search" | Empty handler. | none |
| Add Members: a user row | Adds that user to the selected group. It shows `alert("Member added successfully")` or `alert("Failed to add member")`, then refreshes groups. | `POST /messaging/groups/:groupId/members` body `{userId}` |
| Add Members: "Done" / X | Closes the dialog. | none |
| Create Group: "Create Group" (disabled when name is empty) | Creates a group, then refreshes the list. On failure it sets an error state. | `POST /messaging/groups` body `{name, description}` |
| Create Group: "Cancel" / X | Closes the dialog. | none |

Notes from the code:
- `handleNewGroup` exists but no visible control calls it, so the only route to the "Create Group" dialog is the pencil edit button.
- The pencil "edit" path does not call an update endpoint. Confirming it creates a new group.
- Reply (`handleReply`) is defined but not wired to any control.

### Text on screen

- Tabs: "Messages", "Announcements"
- Search placeholder: "Search..."
- Empty list: "No conversations found"
- Placeholder pane: "Your Messages" / "Select a conversation from the sidebar to start messaging"
- Header status text: "Online"
- Date separators use the short month and day.
- Empty thread: "No messages yet. Start the conversation!"
- Composer placeholder: "Type a message..."
- Parent notice: "Messaging is restricted to read-only for students/parents."
- Group info panel: "Group info"; "Group · {n} members"; buttons "Add", "Search"; "Description" (fallback "Welcome to the group."); "{n} members"; "Add members"; member badge "YOU"; member role in uppercase
- Create Group dialog: "Create Group", "Setup a new communication channel", "Group Name" (placeholder "Enter group name..."), "Description (Optional)" (placeholder "What's this group about?"), buttons "Cancel", "Create Group"
- Add Members dialog: "Add Members", "To {group name}", button "Done"
- Alerts: "Member added successfully", "Failed to add member", "Upload failed: {message}"

---

## 4. Results

- **Route:** `/dashboard/results` (`results-page.tsx`). Sidebar label: "Results".
- **Who can access:** Reachable by any role through the sidebar. The class list is built from `GET /users`, which is admin-only, so non-admins get no class list. The save endpoint `POST /exams/results/bulk` allows `admin` and `teacher`.
- **Purpose:** A three-step flow to pick a class, type marks for Mathematics, Science and English, and publish them.

### Functions

| Control | Behaviour | API |
|---|---|---|
| Page load | Fetches all users and keeps role `parent` users that have `studentProfile.class`. Groups them by class and section, labelled `Class {class}{section}`. Errors are only logged. | `GET /users` |
| Step 1: class cards | Selects the class, builds blank mark rows for its students and moves to step 2. | none |
| Step 2: term `<select>` | Options "Periodic I", "Cycle II", "Term Exam" (default), "Annual". | none |
| Step 2: Mathematics, Science and English inputs | Free-text marks per student. The Total column is the sum of the parsed ints, or "—" when the sum is 0. | none |
| "Back" | Returns to step 1. | none |
| "Save Draft" | No handler, so it does nothing. | none |
| "Publish Results" | Only students with at least one mark are sent. Each mark becomes `{subject, internal: 0, exam, total}`. `academicYear` is `{currentYear}-{currentYear+1}`. On success it moves to step 3. On error it shows the message in red. | `POST /exams/results/bulk` body `{class, section, term, academicYear, students[]}` |
| "Process Another Class" (step 3) | Resets to step 1. | none |
| "Generate Report Cards" (step 3) | No handler. | none |

### Text on screen

- props (not rendered): "Academic Performance", "Results Flow", "Record, validate, and publish academic results following the official grading workflow."
- Card header: "Result Management" / "Session 2024-25 • Term 1" (hard-coded)
- Step 1: "Select Class"; "Choose the class to begin mark entry for the current term."; counts "{n} Student" or "{n} Students"; empty "No classes found. Add students via Admission first."
- Step 2: "Entering Marks for {class label}"; column headers "Student Name", "Mathematics", "Science", "English", "Total"; buttons "Back", "Save Draft", "Publish Results" / "Publishing..."
- Error fallback: "Failed to publish results."
- Warning panel (step 2): "Attention: Publishing results is an irreversible action. Ensure all marks have been cross-verified against the physical answer scripts before final submission."
- Step 3: "Results Published"; "Term 1 results for {class} have been sent to all students and parents." (always says "Term 1", whatever term was chosen); buttons "Process Another Class", "Generate Report Cards"

---

## 5. Reports

- **Route:** `/dashboard/reports` (`reports-page.tsx`). Sidebar label: "Reports".
- **Who can access:** Any role through the sidebar. The page makes no API calls and has no role check.
- **Purpose:** A "Reporting Center" with report-type cards and a "Recent Exports" list. It is a static mock-up: nothing is generated or downloaded.

### Functions

| Control | Behaviour | API |
|---|---|---|
| "Generate PDF" on each of the 4 cards | Shows "Processing..." for 2 seconds (timer only), then reverts. No file is produced. | none |
| Excel icon button on each card | No handler. | none |
| Download icon on each recent export | No handler. | none |
| "Verify Data Consistency" | No handler. | none |

### Text on screen

- props (not rendered): "Data & Insights", "Reporting Center", "Generate comprehensive academic and administrative reports. Export data in professional PDF or Excel formats."
- Cards (title and description):
  - "Monthly Attendance": "Summary of student/staff presence by grade."
  - "Term Result Analysis": "Performance breakdown by subject and class."
  - "Fee Collection Status": "Tracking paid, pending, and overdue fees."
  - "Student Demographics": "Distribution of students by gender and area."
- Buttons: "Generate PDF" / "Processing..."
- "Recent Exports" (hard-coded sample files):
  - "May_Attendance_Final.pdf", "2.4 MB", "Today, 10:15 AM"
  - "Term1_Subject_Stats.xlsx", "1.1 MB", "Yesterday"
  - "New_Admissions_Q2.pdf", "4.8 MB", "May 28"
- "System Status": "All data nodes are synchronized. Academic reports reflect the latest marks published as of 12:00 PM today."
- Button: "Verify Data Consistency"

---

## 6. Settings (with Year-End Promotion)

- **Route:** `/dashboard/settings` (`settings-page.tsx`). Sidebar label: "Settings".
- **Who can access:** Reachable by any role through the sidebar. The page has no frontend role check. Backend: `GET /settings` is open to any authenticated user. `PATCH /settings` and all promotion endpoints require `admin`.
- **Purpose:** Tabbed system settings. Only the General tab (institution profile) and the Academic Session tab (promotion) talk to the backend. The Appearance tab stores the theme in the browser. The other tabs are local state only.

### Layout and shared behaviour

- Left tab list (label / description):
  - "General" / "Institution & academic info"
  - "Security" / "Authentication & access"
  - "Faculty Access" / "Teacher portal permissions"
  - "Notifications" / "Alerts & messaging"
  - "Appearance" / "Theme & branding"
  - "Data Management" / "Backups & exports"
  - "Academic Session" / "Promotion & year-end"
- On load: `GET /settings` fills the General form. On failure the error "Could not load settings from server." is shown.
- Footer "Save Settings" button (disabled while saving or just saved):
  - On the General tab it calls `PATCH /settings` with `{name, academicYear, timezone, contactEmail, contactPhone, address}`. On failure it shows "Failed to save settings.".
  - On every other tab it only runs an 800 ms fake spinner and shows the success message. Nothing is sent or stored.
- Footer messages: success "Settings saved successfully!" (hidden after 3 s), otherwise "Unsaved changes will be lost.". Button text "Save Settings" / "Saving...".
- props (not rendered): "System Administration", "Global Settings", "Manage institution configurations, security protocols, and system-wide preferences."

### Tab: General (API-backed)

- Heading "Institution Profile": "Update the core details of your educational institution."
- Fields: "Institution Name" (default "SNS Academy"); "Academic Year" (select: 2024-2025, 2025-2026, 2026-2027); "Timezone" (default "Asia/Kolkata"); "Contact Email"; "Contact Phone"; "Address"

### Tab: Security (local only)

- Heading "Security & Access": "Configure multi-factor authentication and password policies."
- Toggles: "Multi-Factor Authentication (MFA)" ("Require MFA for all administrative staff accounts."); "Enforce Strong Passwords" ("Require 12+ chars, numbers, and special symbols.")
- Number fields: "Password Expiry (Days)" (default 90), "Session Timeout (Mins)" (default 30)

### Tab: Faculty Access (local only)

- Heading "Faculty Access Control": "Define which modules are accessible globally to the Teacher role."
- Toggle tiles (title / sub-text):
  - "Users" / "Directory Search"
  - "Staff" / "Colleague Info"
  - "Admission" / "Process Logs"
  - "Finance" / "Fee Status"
  - "Timetable" / "Master Schedules"
  - "Broadcast" / "Push Alerts"
  - "Reports" / "Academic Data"
  - "Exams" / "Marks & Control"
- Note: "Note: These are global overrides. Individual teacher permissions set in the Staff module will still apply."
- The state also holds `canViewTransport`, but no tile is shown for it.

### Tab: Notifications (local only)

- Heading "Communication Preferences": "Control automated messaging and notification channels."
- Toggles (title: description):
  - "Global Email Alerts": "Allow system to send automated emails."
  - "Global SMS Alerts": "Enable SMS gateways for critical updates."
  - "Automated Attendance Alerts": "Notify parents immediately if a student is marked absent."
  - "Automated Fee Reminders": "Send invoice reminders 7 days before due dates."
  - "Publish Exam Results": "Automatically notify students when grades are posted."

### Tab: Appearance (browser storage)

- Heading "Interface Customization": "Choose between our signature dashboard layouts."
- Theme cards: "Classic ERP" ("The balanced, card-based interface with orange accents."), "Modern Control" ("Minimalist, high-contrast layout with advanced analytics.").
- Clicking a card writes `localStorage["sns_theme"]` (`classic` or `modern`) and reloads the page. Badge on the active one: "Active Theme". "classic" is the default.

### Tab: Data Management (placeholder)

- "Database Management": "This module is currently being provisioned for your tenant. Advanced data settings will be available shortly."

### Tab: Academic Session: Year-End Promotion (API-backed)

The tab loads data each time it is opened.

**Flow**
1. Opening the tab calls `GET /settings/promotion-preview` and `GET /settings/promotion-history`. Every student defaults to "promoted". "New Academic Year" is auto-filled as `{start+1}-{start+2}` from the current year, for example 2026-2027 becomes 2027-2028. A failed load is silent.
2. The admin can edit the new year text, change each student's action, or click "Select All Promote".
3. "Execute Promotion" shows an inline confirmation. "Yes, Promote" sends the request. The result banner is shown, and the preview and history are reloaded.
4. A batch in the history can be reversed with "Rollback".

| Control | Behaviour | API |
|---|---|---|
| "New Academic Year" input | Free text. Placeholder "2027-2028". | none |
| "Select All Promote" | Sets every student's status to `promoted`. | none |
| Per-student Action `<select>` | "✅ Promote" (`promoted`), "🔁 Retain (Failed)" (`failed`), "↗️ Transferred" (`transferred`), "⛔ Discontinued" (`discontinued`) | none |
| "Execute Promotion" | Shows the confirmation. | none |
| "Yes, Promote" (disabled while loading) | Sends all students with `{profileId, studentId, studentName, fromClass, fromSection, toClass, toSection, status}`, plus `fromAcademicYear` and `toAcademicYear`. The from/to class values come from the preview's class groups. | `POST /settings/promote` |
| Confirmation "Cancel" | Hides the confirmation. | none |
| Result banner "✕" | Dismisses the banner. | none |
| History "Rollback" (only for batches not rolled back) | Reverses the batch, then reloads. A failure is silent. | `POST /settings/promote-rollback` body `{batchId}` |

**Text on screen**
- Heading "Academic Session & Promotion": "Promote students to the next class at the end of the academic year. Student IDs remain permanent."
- Year cards: "Current Academic Year" with "{n} active students"; "New Academic Year"
- Loading: "Loading student data..."
- "Promotion Preview"; button "Select All Promote"
- Table columns: "Student ID", "Name", "From", "To", "Action". The ID is shown as `#` plus the first 8 characters. "From" is `{class}-{section}`. "To" is "Graduated" when `toClass` is `graduated`, otherwise `{toClass}-{toSection}`.
- "Execute Promotion"; confirmation "Confirm promotion for {n} students?" / "This can be reversed using the rollback feature below."; buttons "Yes, Promote", "Cancel"
- Empty: "No active students found to promote."
- Result banner: the server `message`. On success it adds "Promoted: {n} · Failed: {n} · Transferred: {n} · Graduated: {n}". On request failure the message is "Promotion failed. Please try again."
- "Promotion History": each entry shows "{fromYear} → {toYear}", a "Rolled Back" badge, the date, "{n} students", "{n} promoted", "{n} retained", "{n} graduated", and the button "Rollback"

---

## 7. Alumni

- **Route:** `/dashboard/alumni` (`alumni-page.tsx`). Sidebar label: "Alumni".
- **Who can access:** Any role through the sidebar. Data comes from `GET /users`, which is admin-only on the backend.
- **Purpose:** Lists student records whose status is `inactive`, with search and email/phone shortcuts.

### Functions

| Control | Behaviour | API |
|---|---|---|
| Page load | Fetches all users, keeps `role === "parent"` with a `studentProfile`, then shows those with `status === "inactive"`. | `GET /users` |
| "Passed Out Students" / "Inactivated Students" toggle | Changes the label and the count card. It clears the search. Both views show the same inactive-student list. | none |
| Search box (X clears it) | Client-side match on name, student ID, admission no., class, section, email, contact, father name or mother name. | none |
| "Email" link | `mailto:` the student's email. | none |
| Phone icon link | `tel:` the contact number. It is disabled when there is no contact. | none |

### Text on screen

- props (not rendered): "Student Records", "Alumni & Inactive Students", "Track graduated students and those who have left the institution."
- Toggle buttons: "Passed Out Students", "Inactivated Students"
- Search placeholder: "Search by name, ID, class, contact..."
- Count card label: "Total Alumni" or "Inactive Records"; sub-text `Showing results for "{search}"` or "Student records marked inactive in the system"
- Loading: "Loading student records..."
- Error: the server message, or "Failed to load student records."
- Card: name; badge `Class {class}-{section}` or "No class"; status text; admission no. or student ID; contact or "No contact added"; link "Email"
- Empty: "No alumni records found" (Passed Out view) or "No inactive students found" (Inactivated view), followed by ` matching "{search}"` when searching

---

## 8. Transport

- **Route:** `/dashboard/transport` (`transport-page.tsx`). Sidebar label: "Transport".
- **Who can access:** Any role through the sidebar. The "Assign Students" modal loads `GET /users`, which is admin-only on the backend.
- **Purpose:** A mock transport console showing four hard-coded bus routes, a simulated map and a manifest modal for assigning students to routes. Nothing is saved.

### Functions

| Control | Behaviour | API |
|---|---|---|
| Route list (R-101 to R-104) | Selects a route, which updates the bus label and the "Students On Board" figure on the map. | none |
| "+ Add Route" | No handler. | none |
| "Broadcast to Route" | No handler. | none |
| Map icons (search, navigation) | Decorative. The bus marker is an animation. Speed (42 km/h) and ETA (4 mins) are fixed text. | none |
| "Assign Students" card | Opens the "Route Manifest" modal and loads users. It keeps `role === "parent"` with `status === "active"`. | `GET /users` |
| Manifest: per-student dropdown | Choose "Unassigned" or a route (`{id} - {name}`). Kept in local state only. | none |
| Manifest: "Save & Close" / X / backdrop click | Closes the modal. The assignments are discarded because nothing is sent to the server. | none |
| "Update Stops" card, "Daily Log" card | No handlers. | none |

Hard-coded routes: R-101 "North Zone Circuit" (driver Somnath P., On Route, 42 students); R-102 "South City Express" (Karan S., On Route, 38); R-103 "East Metro Link" (Vikram R., Delayed, 45); R-104 "West Hills Path" (Deepak M., Idle, 32).

### Text on screen

- props (not rendered): "Logistics & Safety", "Transport Management", "Monitor school bus fleet, manage student assignments, and track routes in real-time."
- Left: "Active Routes"; "+ Add Route"; route statuses "On Route", "Delayed", "Idle"
- "Safety Alert": "Route R-103 is currently 15 minutes behind schedule due to traffic congestion on MG Road. Auto-notifications sent to parents."; button "Broadcast to Route"
- Map: "Live Tracking Active"; "{route id} • {driver}"; "Current Speed" "42 km/h"; "Students On Board"; "ETA Next Stop" "4 mins"
- Action cards: "Assign Students" / "Manage route manifest"; "Update Stops" / "Edit pick-up points"; "Daily Log" / "View trip compliance"
- Modal: "Route Manifest" / "Assign transport-enrolled students to buses"; loading "Syncing Database..."; option "Unassigned"; empty "No Students Found" / "No active students found in the database."; button "Save & Close"


---

# Part 5 – Teacher Portal

Source: `frontend/src/app/teacher-dashboard/page.tsx` and `frontend/src/components/teacher/*`, plus the shared `components/dashboard/*` pages that the teacher shell renders.

API base URL: `NEXT_PUBLIC_API_BASE_URL` (default `http://localhost:5000`). Every call goes through `services/api-client.ts` `apiRequest` and sends `Authorization: Bearer <accessToken>`.

---

## 0. Portal shell (`app/teacher-dashboard/page.tsx`)

**Route/section:** `/teacher-dashboard`. A single page. The "pages" below are tabs held in the `activeTab` React state (initial value `"overview"`), not separate URLs.

**Who can access:**
- Client-side check: `useAuth()`. If bootstrapping is finished and there is no session, it runs `router.replace("/")`. While bootstrapping, or with no session, it renders `null`.
- The page itself does not check the role. `lib/role-access.ts` `getDashboardRoute` sends role `teacher` to `/teacher-dashboard`. Roles `admin` and `leader` go to `/dashboard`, and `parent` goes to `/parent-dashboard`.
- `webAllowedRoles` is `admin`, `leader`, `teacher`, `parent`.

**Purpose:** Layout and tab switcher for the teacher portal. It combines a desktop sidebar, a header, a mobile bottom nav and the active tab's content.

**Functions:**
- `renderContent()` switch on `activeTab`:

| activeTab | Component rendered |
|---|---|
| `overview` (and default) | `DashboardOverview` (receives `onNavigate={setActiveTab}`) |
| `notifications` | `NotificationsPage` (shared) |
| `attendance` | `AttendancePage` (shared) |
| `schedule` | `ScheduleManager` |
| `calendar` | `CalendarPage` (shared) |
| `classes` | `ClassesSubjects` |
| `results` | `ResultsPage` (shared) |
| `transport` | `TransportPage` (shared) |
| `tasks` | `ReportsPage` (shared) |
| `communication` | `ChatPage` (shared), wrapped in `<div className="flex-1 -mx-6 lg:-mx-10 -mt-8 overflow-hidden">` |
| `settings` | `SettingsPage` (shared) |
| `profile` | `ProfilePage` (shared) |

- Theme: local state `theme` (`'light'` or `'dark'`, initial `'light'`). An effect sets `document.documentElement` attribute `data-theme`. `toggleTheme` is passed to the header.
- Content transition: `AnimatePresence`/`motion.div` keyed by `activeTab` (fade/slide).
- Layout: `TeacherSidebar` (desktop only), `TeacherHeader`, `TeacherBottomNav` (mobile only). Main area has `lg:ml-72`.
- Imported but never rendered in the switch: `AssignmentsExams`, `LearningResources`. `CommunicationHub` is not imported here either. Unused icons `Settings`, `BarChart3`, `HelpCircle` are also imported.
- No API call is made by the shell itself.

**Text on screen:**
- Page heading: `{activeTab} <span>Dashboard</span>`. The raw tab id is printed, for example `overview Dashboard`, `tasks Dashboard`, `communication Dashboard`. CSS class `uppercase` makes it display in capitals.
- Sub-heading: `Academic Year 2026-27`

---

## 1. TeacherSidebar (`components/teacher/TeacherSidebar.tsx`)

**Route/section:** Left navigation panel inside `/teacher-dashboard`. Hidden below the `lg` breakpoint (`hidden lg:flex`), fixed, width `w-72`.

**Who can access:** Anyone who sees the teacher dashboard (session required).

**Purpose:** Desktop navigation between tabs, a link to the profile tab, and logout.

**Functions:**
- Brand block: image `/images/logo.png` (alt `SNS Logo`) and the title `SNS ERP`. Not clickable.
- Staff profile button (top): `setActiveTab("profile")`. It shows `Active {role}` and the user name, both from `useAuth().session.user`. Fallbacks are `"Teacher"` for the name and `"Faculty"` for the role. `teacherInitial` is computed but not displayed.
- Menu buttons: each calls `setActiveTab(id)`. The active item is highlighted with a dot.
  - Group `MENU`: `overview` → Dashboard, `notifications` → Notifications, `attendance` → Attendance, `schedule` → Timetable, `calendar` → Calendar.
  - Group `TOOLS`: `classes` → Students, `results` → Results, `transport` → Transport, `tasks` → Reports, `communication` → Chat, `settings` → Settings.
- Logout button: calls `logout()` from `useAuth`. This clears the session in storage and state. The shell effect then redirects to `/`. No API call.
- No API calls.

**Text on screen:**
- `SNS ERP`
- `Active {teacherRole}` (for example `Active teacher`)
- Group titles: `MENU`, `TOOLS`
- Labels: `Dashboard`, `Notifications`, `Attendance`, `Timetable`, `Calendar`, `Students`, `Results`, `Transport`, `Reports`, `Chat`, `Settings`
- Button: `Logout Account`
- Logo alt text: `SNS Logo`

---

## 2. TeacherHeader (`components/teacher/TeacherHeader.tsx`)

**Route/section:** Sticky top bar inside `/teacher-dashboard`.

**Who can access:** Same as the shell.

**Purpose:** Search box (non-functional), theme toggle, notification shortcut.

**Functions:**
- Mobile menu button (`Menu` icon, shown below `lg`): no `onClick`, so it does nothing.
- Search input (visible from `md` up): uncontrolled, no handler and no API call. It is decorative.
- Theme toggle button: calls `toggleTheme`. It shows a Sun icon when the theme is dark and a Moon icon when light.
- Notification bell button: `setActiveTab("notifications")`. It has a permanent accent dot, which is not tied to any data.
- Props `Settings`, `User` and `ChevronDown` icons are imported but unused.

**Text on screen:**
- Search placeholder: `Search students, classes, or files...`
- No other text (icon-only buttons).

---

## 3. TeacherBottomNav (`components/teacher/TeacherBottomNav.tsx`)

**Route/section:** Fixed bottom bar inside `/teacher-dashboard`, mobile only (`lg:hidden`).

**Who can access:** Same as the shell.

**Purpose:** Mobile shortcut to five tabs.

**Functions:**
- Five icon-only buttons; each calls `setActiveTab(id)`:
  - `overview` (LayoutDashboard)
  - `classes` (Users)
  - `schedule` (Calendar)
  - `tasks` (FileText)
  - `communication` (MessageCircle)
- The active button gets an animated highlight and a dot.
- Other tabs (notifications, attendance, calendar, results, transport, settings, profile) are not reachable from the bottom bar. The header bell does reach notifications.
- No API calls.

**Text on screen:** None (icons only).

---

## 4. Dashboard (tab `overview`) – `DashboardOverview.tsx`

**Route/section:** `/teacher-dashboard`, tab `overview` (default).

**Who can access:** Teacher portal users. The backend endpoint `GET /dashboard/teacher` is restricted with `@Roles('teacher', 'admin', 'leader')`.

**Purpose:** Home screen with quick links, school-wide presence, birthdays, the next class, class attendance and the latest admin announcement.

**Functions:**
- On mount, calls `getTeacherDashboardOverview()` → **`GET /dashboard/teacher`** (sends no-cache headers). It shows a spinner until `data` is set.
- Error handling: on failure it runs `console.error` only. `loading` becomes false but `data` stays null, so the spinner shows forever.
- Four quick-action cards. Each calls `onNavigate(tab)`:
  - Mark Attendance → `attendance`
  - Exam Reports → `results`
  - Send Homework → `communication`
  - Notifications → `notifications`
- School Presence card (from `data.schoolPresence`): Total Present, Total Absent.
- Celebrations card: student birthdays (`data.celebrations.studentBirthdays`: name, grade, date; a `Today` badge is highlighted) and staff birthdays (`staffBirthdays`: name, role, date).
- Upcoming Class card (`data.upcomingClass`): subject, grade, time, number of students. If it is null, an empty-state message is shown.
- Class Attendance card (`data.classAttendance`): grade, percentage, progress bar, Present, Absent.
- Important Note from Admin card (`data.announcement`): title, message, author initial, `author · localeDateString(date)`. If it is null, an empty-state message is shown. The `Urgent` badge is always shown.
- All data is live from the API. Nothing is mocked.

**Text on screen:**
- Quick actions: `Mark Attendance` / `Record student daily presence`; `Exam Reports` / `Update and view student marks`; `Send Homework` / `Share assignments with students`; `Notifications` / `View administrative updates`
- `School Presence`, `Daily Overview (All Grades)`, `Total Present`, `Total Absent`
- `Celebrations`, `Birthdays this week`, `Student Birthdays`, `Staff Birthdays`
- Empty states: `No student birthdays this week`, `No staff birthdays this week`
- `Upcoming Class`, `{subject} — {grade}`, `{students} Students`
- Empty state: `No more classes scheduled for today`
- `Class Attendance`, `Weekly Performance Overview`, `Present`, `Absent`
- `Important Note from Admin`, `Urgent`
- Empty state: `No urgent announcements at this time.`

---

## 5. Notifications (tab `notifications`) – shared `NotificationsPage`

**Route/section:** `/teacher-dashboard`, tab `notifications`. It reads the query param `action`; the value `new` jumps to step 2 with audience `notice`.

**Who can access:** Any portal user can view. Sending is limited by the backend: `POST /notifications/broadcast` has `@Roles('admin', 'leader')`, so a teacher's send attempt is expected to fail with the error toast below. This is inferred from the backend decorator.

**Purpose:** Compose and broadcast a notification in a 4-step wizard, and show recent broadcast history.

**Functions:**
- On mount, loads history: **`GET /notifications`** (errors are logged and history becomes `[]`). Loads classes: **`GET /users/classes`** (backend roles `admin`, `leader`, `teacher`).
- Header tool panel: green pulse `System Online` and `{history.length} Broadcasts`. These are display only.
- Step indicator 1–4.
- Step 1, choose a type:
  - `General Alert` sets audience `both` and moves to step 2.
  - `Class-wise` sets audience `parents` and moves to step 2.
- Step 2, compose:
  - Text input `Message Headline`.
  - Textarea `Content`.
  - If the audience is `parents`: class chips (from `/users/classes`), `Select All`, `Clear`.
  - If the audience is `notice` (only via `?action=new`): a media upload box. It is a placeholder with no input and no handler.
- Step 3, review: a preview of the title, the `To:` audience plus the classes, and the message.
- Footer buttons: `Back` (disabled and invisible on step 1) and `Continue`. On step 3 the button becomes `Deliver Now` (`Launching...` while sending). `Continue` is disabled when:
  - on step 2 the title or message is empty, or the audience is `parents` with no class selected;
  - sending is in progress.
- `Deliver Now` calls **`POST /notifications/broadcast`** with body `{audience (default "both"), title, message, targetClasses (only if audience is "parents")}`. On success it moves to step 4, clears the form, shows a toast and reloads history.
- Step 4: `New Broadcast` button resets the wizard to step 1.
- Recent History panel: each item shows `TO: {audience}`, the date (short month and day), the title and the message. The `See Full Archive` button has no handler.
- `handleDelete` (**`POST /notifications/delete`** with `{id}`) is defined but no UI element calls it.

**Text on screen:**
- (Eyebrow and description props are not rendered; `PageSection` only renders its children.)
- `System Online`, `{n} Broadcasts`
- `Step 1: Select Notification Type`; `General Alert` / `Broadcast to everyone.`; `Class-wise` / `Target specific grades.`
- `Step 2: Compose Message`; labels `Message Headline`, `Content`, `Select Target Class`, `Attach Media (Images/Videos)`
- Placeholders: `e.g. Annual Sports Meet 2026`, `What would you like to say to the community?`
- Buttons: `Select All`, `Clear`
- Upload box text: `Click to upload or drag & drop`
- Empty state: `No classes found in database`
- `Step 3: Review & Schedule`; `Broadcast Preview`; `Untitled Message` (fallback); `To: {audience} (...)`; `All Classes` (fallback); `No content provided...` (fallback)
- `Ready for immediate delivery via Push Notification & Web Hub.`
- Step 4: `Broadcast Launched!`; `Your message has been delivered to all registered devices in the {audience} ... group.`; button `New Broadcast`
- Footer buttons: `Back`, `Continue`, `Deliver Now`, `Launching...`
- Right panel: `Recent History`, `TO: {audience}`, empty state `No Recent History`, button `See Full Archive`
- Toasts (sonner):
  - `Please fill in both title and message` (error)
  - `Broadcast delivered successfully!` (success)
  - `Delivery failed. Please try again.` (error)
  - `Notification removed from archive` (success; only reachable from the unused delete handler)
  - `Failed to delete notification` (error; same)

---

## 6. Attendance (tab `attendance`) – shared `AttendancePage`

**Route/section:** `/teacher-dashboard`, tab `attendance`.

**Who can access:** The backend `GET /attendance` has no role restriction beyond the auth guard. `POST /attendance/mark` is `@Roles('admin', 'teacher')`. `POST /attendance/mark-teacher` is `@Roles('admin')`, so a teacher's save of faculty attendance is expected to fail. This is inferred from the backend decorator.

**Purpose:** View and mark attendance for faculty and for students by class.

**Functions:**
- On load, `useAuthResource(getAttendance)` → **`GET /attendance`**. It shows `ResourceLoading` and `ResourceError` states.
- Three view buttons: `Teacher Attendance` (default view), `Class-wise Summary`, `Student Attendance`. Each resets the selected class.
- **Teacher Attendance view:**
  - Metric cards: Total Faculty, Present, Absent, Not Marked.
  - Live counters: `{n}P`, `{n}A`, `{n} unmarked`.
  - `All Present` / `All Absent` set every row locally.
  - `Save Attendance` calls **`POST /attendance/mark-teacher`** with `{date: today (ISO yyyy-mm-dd), records: [{teacherId: empId, status, department}]}`. The default status is `Present`.
  - Table columns: Photo (dicebear avatar), Emp ID, Teacher Name (with designation), Department (`N/A` fallback), Status badge, Action. The per-row button toggles `Mark Absent` / `Mark Present`.
  - A save message appears for 4 seconds.
- **Class-wise Summary view:**
  - Metric cards: Total Present, On Leave/Absent, Late arrivals.
  - `Class-wise Report` table with columns Class, Total Students, Present, Absent, Percentage.
  - Clicking a class name opens the Student Attendance view for that class.
- **Student Attendance view:**
  - Without a class: the same three metric cards and a grid of class tiles (`{cls}` and `{n} students`). The `Unassigned` group is excluded.
  - With a class: `Back to Classes`, counters, `All Present`, `All Absent` and `Save Attendance`.
  - `Save Attendance` calls **`POST /attendance/mark`** with `{date: today, class, section (from splitting "class-section" on "-"), records: [{studentId: rollNo, status}]}`.
  - Table columns: Photo, Roll No, Student Name, Status, Action (toggle).
  - Status badge colours handle `Present`/`P`, `Absent`/`A`, `L`/`Leave`.

**Text on screen:**
- Tab buttons: `Teacher Attendance`, `Class-wise Summary`, `Student Attendance`
- Loading and error: `Loading attendance...`, `Unable to load attendance: {message}`
- Teacher view: `Total Faculty`, `Present`, `Absent`, `Not Marked`, `Faculty Attendance`, `Mark attendance for all teachers · {long date en-IN}`, `All Present`, `All Absent`, `Save Attendance`, `Saving...`
- Table headers: `Photo`, `Emp ID`, `Teacher Name`, `Department`, `Status`, `Action`
- Row buttons: `Mark Absent`, `Mark Present`
- Empty state: `No teachers found in the database.` / `Add teacher accounts to see them here.`
- Class summary: `Total Present`, `On Leave/Absent`, `Late arrivals`, `Class-wise Report`, headers `Class`, `Total Students`, `Present`, `Absent`, `Percentage`
- Student view: `{n} students`, `Back to Classes`, `Student Attendance`, `Currently viewing records for Class {selectedClass}`, headers `Photo`, `Roll No`, `Student Name`, `Status`, `Action`
- Save messages: `✓ Saved {n} student records`, `✓ Saved {n} teacher records`, `Failed to save. Try again.`

---

## 7. Timetable (tab `schedule`) – `ScheduleManager.tsx`

**Route/section:** `/teacher-dashboard`, tab `schedule`.

**Who can access:** Teacher portal users.

**Purpose:** Show a weekly timetable grid.

**Functions:**
- **Static/mock data.** No API call. Hardcoded `timetable` entries:

| Day | Slot | Subject | Class |
|---|---|---|---|
| Mon | 09–10 AM | Mathematics | 10-A |
| Tue | 10–11 AM | Physics | 11-C |
| Wed | 08–09 AM | Science | 9-B |
| Thu | 11 AM–12 PM | Calculus | 12-B |
| Fri | 09–10 AM | Math Lab | 10-A |

- Days: Mon–Sat. Hours: 08 AM to 02 PM, one row per hour.
- Previous-week and next-week arrow buttons: no handlers.
- `PDF` button: no handler.
- Empty slots show a dashed cell. Filled slots show subject and class, with a hover scale effect.

**Text on screen:**
- `Weekly Timetable`, `Academic Session 2026-27`, `This Week`, `PDF`
- Column headers: `Time`, `Mon`, `Tue`, `Wed`, `Thu`, `Fri`, `Sat`
- Row labels: `08 AM`, `09 AM`, `10 AM`, `11 AM`, `12 PM`, `01 PM`, `02 PM`
- Cell text: the subject and class values from the table above

---

## 8. Calendar (tab `calendar`) – shared `CalendarPage`

**Route/section:** `/teacher-dashboard`, tab `calendar`.

**Who can access:** Everyone sees the calendar. Adding events is limited by `isAdmin = session.user.role === "admin"`, so teachers see no add button. A teacher can still click an event, which opens the modal with edit and delete controls (see below).

**Purpose:** Month view of school events.

**Functions:**
- **Static/local data.** No API call. Events are held in local state from `INITIAL_EVENTS`:
  - `Mid-Term Examination` (2026-05-15, 09:00 AM, exam, Block A & B)
  - `Annual Sports Meet` (2026-05-22, 08:30 AM, event, School Ground)
  - `Labor Day Holiday` (2026-05-01, Full Day, holiday)
  - `Parent Teacher Meeting` (2026-05-28, 10:00 AM, academic, Auditorium)
- The initial month is May 2026. The previous and next month arrow buttons change the month.
- `ADD EVENT` (admin only, hidden below `md`) opens the create modal.
- Clicking an event chip opens the modal for editing, for any role. In the modal, `Update Event` / `Create Event` saves to local state only. `Delete` asks `confirm("Delete this event?")` and then removes the event from local state. Nothing is persisted.
- Modal fields: Event Title (text), Date (date), Time (text), Event Category (buttons `academic`, `holiday`, `exam`, `event`), Location. The `description` field exists in state but has no input.
- The `Next Events` panel lists up to 4 events on or after 2026-05-01, sorted by date.
- The legend and today highlight are display only.

**Text on screen:**
- `School Schedule`, `Academic events, exams and holidays for the current year.`
- `{Month} {Year}`, `ADD EVENT`
- Weekday headers: `Sunday` to `Saturday` (3-letter on mobile)
- `Next Events`, `Academic Focus`
- Legend: `Academic`, `Holiday`, `Exam`, `Event`; `SNS ACADEMY`
- Modal: `Edit Event` / `Create New Event`; labels `Event Title`, `Date`, `Time`, `Event Category`, `Location`
- Placeholders: `E.g. Sports Day`, `10:00 AM`, `E.g. Auditorium`
- Category buttons: `academic`, `holiday`, `exam`, `event` (shown in capitals via CSS)
- Buttons: `Delete`, `Update Event`, `Create Event`
- Confirm dialog: `Delete this event?`

---

## 9. Students (tab `classes`) – `ClassesSubjects.tsx`

**Route/section:** `/teacher-dashboard`, tab `classes` (sidebar label `Students`, bottom-nav icon Users).

**Who can access:** Teacher portal users.

**Purpose:** List the classes the teacher handles, with an expandable action panel per class.

**Functions:**
- **Static/mock data.** No API call. Hardcoded classes:
  - `Grade 10-A` / `Mathematics & Science` / 42 students / `Class Teacher`
  - `Grade 11-C` / `Physics` / 38 / `Subject Teacher`
  - `Grade 12-B` / `Advanced Calculus` / 35 / `Subject Teacher`
- Clicking a class card toggles it open or closed (accordion; only one open at a time; the first is open initially).
- Expanded panel: four buttons (`Attendance`, `Marks Entry`, `Insights`, `Contact`). None has a handler.
- The `MoreVertical` button next to the heading has no handler.

**Text on screen:**
- `Classes & Subjects`
- Card: title, subtitle, badge (`Class Teacher` or `Subject Teacher`), `{n} Students`
- Action buttons: `Attendance`, `Marks Entry`, `Insights`, `Contact`

---

## 10. Results (tab `results`) – shared `ResultsPage`

**Route/section:** `/teacher-dashboard`, tab `results`.

**Who can access:** `POST /exams/results/bulk` is `@Roles('admin', 'teacher')`. The class list comes from `GET /users`, which is `@Roles('admin')` in the backend, so for a teacher this call is expected to fail. The page would then show no classes (error is only logged). This is inferred from the backend decorator.

**Purpose:** A 3-step flow to select a class, enter marks and publish results.

**Functions:**
- On mount, **`GET /users`** (`getAllUsers`). It keeps users with `role === 'parent'` that have `studentProfile.class`. It groups them into `Class {class}{section}` entries with a student count.
- Header shows a three-segment progress bar.
- Step 1: pick a class tile. This sets up the marks rows and goes to step 2. A spinner shows while loading.
- Step 2:
  - Term dropdown with options `Periodic I`, `Cycle II`, `Term Exam` (default), `Annual`.
  - Table of text inputs for Mathematics, Science and English. `Total` is the sum, or `—` if it is zero.
  - `Back` returns to step 1.
  - `Save Draft` has no handler.
  - `Publish Results` calls **`POST /exams/results/bulk`** with `{class, section, term, academicYear (currentYear-nextYear), students: [{studentId (profile id), name, subjects: [{subject, internal: 0, exam, total}]}]}`. Only students with at least one mark are sent, and only filled subjects are sent. On success it goes to step 3. On failure it shows `publishError`.
  - Warning panel at the bottom (step 2 only).
- Step 3: `Process Another Class` resets to step 1. `Generate Report Cards` has no handler.

**Text on screen:**
- `Result Management`, `Session 2024-25 • Term 1`
- Step 1: `Select Class`, `Choose the class to begin mark entry for the current term.`, tile text `Class {n}{section}` and `{n} Student(s)`
- Empty state: `No classes found. Add students via Admission first.`
- Step 2: `Entering Marks for {selectedClass}`, headers `Student Name`, `Mathematics`, `Science`, `English`, `Total`
- Buttons: `Back`, `Save Draft`, `Publish Results`, `Publishing...`
- Error fallback: `Failed to publish results.`
- Warning: `Attention: Publishing results is an irreversible action. Ensure all marks have been cross-verified against the physical answer scripts before final submission.`
- Step 3: `Results Published`, `Term 1 results for {selectedClass} have been sent to all students and parents.`, buttons `Process Another Class`, `Generate Report Cards`

---

## 11. Transport (tab `transport`) – shared `TransportPage`

**Route/section:** `/teacher-dashboard`, tab `transport`.

**Who can access:** Teacher portal users. The manifest modal calls `GET /users`, which the backend restricts to `admin`, so for a teacher it is expected to fail (the error is only logged).

**Purpose:** View school bus routes with a mock live-tracking map, and open a student-to-bus assignment list.

**Functions:**
- **Mostly static/mock.** Routes are hardcoded:
  - `R-101` North Zone Circuit (Somnath P., On Route, 42)
  - `R-102` South City Express (Karan S., On Route, 38)
  - `R-103` East Metro Link (Vikram R., Delayed, 45)
  - `R-104` West Hills Path (Deepak M., Idle, 32)
- Route buttons select a route. The bus marker label shows `{id} • {driver}`, and `Students On Board` shows the route's student count.
- `+ Add Route`, `Broadcast to Route`, `Update Stops`, `Daily Log`: no handlers.
- The map, speed `42 km/h`, ETA `4 mins` and the `Live Tracking Active` badge are fixed placeholders.
- `Assign Students` opens the manifest modal. It calls **`GET /users`** and keeps users with role `parent` and status `active`. Each row has a select to pick a bus (the options are `Unassigned` and `{id} - {name}`). The choice is kept in local state only.
- `Save & Close` and the X button only close the modal. There is no save call.

**Text on screen:**
- `Active Routes`, `+ Add Route`, route names, ids and statuses (`On Route`, `Delayed`, `Idle`)
- `Safety Alert`, `Route R-103 is currently 15 minutes behind schedule due to traffic congestion on MG Road. Auto-notifications sent to parents.`, `Broadcast to Route`
- `Live Tracking Active`, `Current Speed` `42 km/h`, `Students On Board`, `ETA Next Stop` `4 mins`
- Action cards: `Assign Students` / `Manage route manifest`; `Update Stops` / `Edit pick-up points`; `Daily Log` / `View trip compliance`
- Modal: `Route Manifest`, `Assign transport-enrolled students to buses`, `Syncing Database...`, `Unassigned`, empty state `No Students Found` / `No active students found in the database.`, button `Save & Close`

---

## 12. Reports (tab `tasks`) – shared `ReportsPage`

**Route/section:** `/teacher-dashboard`, tab `tasks` (sidebar label `Reports`).

**Who can access:** Teacher portal users.

**Purpose:** A report centre UI.

**Functions:**
- **Static/mock.** No API call.
- Four report cards, each with `Generate PDF`: `Monthly Attendance`, `Term Result Analysis`, `Fee Collection Status`, `Student Demographics`. The button sets a processing label for 2 seconds (`setTimeout`) and does nothing else. The Excel icon button beside it has no handler.
- Recent Exports list is hardcoded: `May_Attendance_Final.pdf` (2.4 MB, Today, 10:15 AM), `Term1_Subject_Stats.xlsx` (1.1 MB, Yesterday), `New_Admissions_Q2.pdf` (4.8 MB, May 28). Download buttons have no handler.
- `Verify Data Consistency` has no handler.

**Text on screen:**
- Card descriptions: `Summary of student/staff presence by grade.`, `Performance breakdown by subject and class.`, `Tracking paid, pending, and overdue fees.`, `Distribution of students by gender and area.`
- Buttons: `Generate PDF`, `Processing...`
- `Recent Exports`
- `System Status`, `All data nodes are synchronized. Academic reports reflect the latest marks published as of 12:00 PM today.`, `Verify Data Consistency`

---

## 13. Chat (tab `communication`) – shared `ChatPage`

**Route/section:** `/teacher-dashboard`, tab `communication`. The bottom nav also lists it.

**Who can access:** Teacher portal users. Role `parent` sees a read-only version.

**Purpose:** Group messaging: list groups, read and send messages, create groups, add members.

**Functions:**
- On mount: **`GET /messaging/groups`**. On selecting a group: **`GET /messaging/messages/{groupId}`**.
- Top tab buttons: `Messages` (active look, no-op) and `Announcements` (shown for non-parents; no-op).
- Search box filters the group list by name on the client.
- Group header click opens the Group info slide-over. The `DotsThreeVertical` button has no handler.
- Send: the Enter key or the send button calls **`POST /messaging/send`** with `{groupId, text}` (via `apiSendMessage`). Then it clears the input and reloads messages. The send button is disabled when the input is empty. Send failures are logged only.
- Paperclip file upload: shows a local `📎 Uploading {name}…` message, calls `uploadChatFile` (Supabase storage), then sends `📷 [Image] {url}` or `📎 [File] {name} — {url}` through `/messaging/send`. On failure it shows `alert("Upload failed: {msg}")`.
- Group info slide-over:
  - Edit (pencil, non-parents): opens the Create Group modal pre-filled. Note that confirming it calls `createGroup`, so it creates a new group instead of editing.
  - `Add` / `Add members` (non-parents): load `GET /users` and open the Add Members modal. This endpoint is admin-only in the backend, so for a teacher it is expected to fail and `fetchError` is set. That error is not displayed in the modal.
  - Choosing a user calls **`POST /messaging/groups/{groupId}/members`** (body `{userId}`) and shows `alert("Member added successfully")` or `alert("Failed to add member")`.
  - Member list with a `YOU` tag and the role.
  - The `Search` button has no handler.
- Create Group modal: **`POST /messaging/groups`** with `{name, description}`. The button is disabled when the name is empty.
- Parents (`role === "parent"`): input is replaced by a read-only note, and group creation, editing and member adding are hidden.

**Text on screen:**
- Tabs: `Messages`, `Announcements`
- Search placeholder: `Search...`
- Empty list: `No conversations found`
- Row default last message: `Select to view messages` and time `Now`
- Empty chat panel: `Your Messages`, `Select a conversation from the sidebar to start messaging`
- Conversation header: group name and `Online`
- Empty messages: `No messages yet. Start the conversation!`
- Input placeholder: `Type a message...`
- Parent read-only note: `Messaging is restricted to read-only for students/parents.`
- Group info: `Group info`, `Group · {n} members`, `Add`, `Search`, `Description`, default description `Welcome to the group.`, `{n} members`, `Add members`, `YOU`
- Create modal: `Create Group`, `Setup a new communication channel`, labels `Group Name`, `Description (Optional)`, placeholders `Enter group name...`, `What's this group about?`, buttons `Cancel`, `Create Group`
- Add Members modal: `Add Members`, `To {groupName}`, `Done`
- Alerts: `Member added successfully`, `Failed to add member`, `Upload failed: {msg}`
- Error strings kept in state: `Failed to load directory`, `Failed to create group`

---

## 14. Settings (tab `settings`) – shared `SettingsPage`

**Route/section:** `/teacher-dashboard`, tab `settings`.

**Who can access:** `GET /settings` has no role restriction in the backend. `PATCH /settings` and the promotion endpoints are `@Roles('admin')`. A teacher can open the page and view data, but saves and promotion calls are expected to fail. This is inferred from the backend decorators.

**Purpose:** A global-settings screen written for administrators, with seven sub-tabs.

**Functions:**
- On mount: **`GET /settings`**. It fills the General tab from `institution`: name, academicYear, timezone, contactEmail, contactPhone, address. On failure it shows `Could not load settings from server.`
- Sub-tab buttons on the left: General, Security, Faculty Access, Notifications, Appearance, Data Management, Academic Session.
- **General:** text inputs and an academic-year select (`2024-2025`, `2025-2026`, `2026-2027`).
- **Security:** two toggles (MFA, strong passwords) and two number inputs (password expiry, session timeout). Local state only.
- **Faculty Access:** eight toggle tiles (Users, Staff, Admission, Finance, Timetable, Broadcast, Reports, Exams). Local state only.
- **Notifications:** five toggles. Local state only.
- **Appearance:** two theme buttons (`Classic ERP`, `Modern Control`). Clicking one writes `localStorage["sns_theme"]` and reloads the page.
- **Data Management:** a placeholder panel.
- **Academic Session:**
  - It loads **`GET /settings/promotion-preview`** and **`GET /settings/promotion-history`** when the tab opens.
  - A New Academic Year input, a per-student status select, `Select All Promote`, `Execute Promotion` and a two-step confirm.
  - `Yes, Promote` calls **`POST /settings/promote`**.
  - `Rollback` per batch calls **`POST /settings/promote-rollback`** with `{batchId}`.
- Footer `Save Settings`:
  - On the General tab it calls **`PATCH /settings`** with `{name, academicYear, timezone, contactEmail, contactPhone, address}`.
  - On every other tab it only fakes a save with an 800 ms timer and shows the success message.
  - On failure it sets `Failed to save settings.`

**Text on screen:**
- Sub-tabs (label / description):
  - `General` / `Institution & academic info`
  - `Security` / `Authentication & access`
  - `Faculty Access` / `Teacher portal permissions`
  - `Notifications` / `Alerts & messaging`
  - `Appearance` / `Theme & branding`
  - `Data Management` / `Backups & exports`
  - `Academic Session` / `Promotion & year-end`
- General: `Institution Profile`, `Update the core details of your educational institution.`, labels `Institution Name`, `Academic Year`, `Timezone`, `Contact Email`, `Contact Phone`, `Address`
- Security: `Security & Access`, `Configure multi-factor authentication and password policies.`, `Multi-Factor Authentication (MFA)` / `Require MFA for all administrative staff accounts.`, `Enforce Strong Passwords` / `Require 12+ chars, numbers, and special symbols.`, labels `Password Expiry (Days)`, `Session Timeout (Mins)`
- Faculty: `Faculty Access Control`, `Define which modules are accessible globally to the Teacher role.`, tiles `Users`/`Directory Search`, `Staff`/`Colleague Info`, `Admission`/`Process Logs`, `Finance`/`Fee Status`, `Timetable`/`Master Schedules`, `Broadcast`/`Push Alerts`, `Reports`/`Academic Data`, `Exams`/`Marks & Control`, note `Note: These are global overrides. Individual teacher permissions set in the Staff module will still apply.`
- Notifications: `Communication Preferences`, `Control automated messaging and notification channels.`, `Global Email Alerts`, `Global SMS Alerts`, `Automated Attendance Alerts`, `Automated Fee Reminders`, `Publish Exam Results` (each with its own description)
- Appearance: `Interface Customization`, `Choose between our signature dashboard layouts.`, `Classic ERP` / `The balanced, card-based interface with orange accents.`, `Modern Control` / `Minimalist, high-contrast layout with advanced analytics.`, badge `Active Theme`
- Data: `Database Management`, `This module is currently being provisioned for your tenant. Advanced data settings will be available shortly.`
- Academic: `Academic Session & Promotion`, `Promote students to the next class at the end of the academic year. Student IDs remain permanent.`, `Current Academic Year`, `{n} active students`, `New Academic Year` (placeholder `2027-2028`), `Loading student data...`, `Promotion Preview`, `Select All Promote`, headers `Student ID`, `Name`, `From`, `To`, `Action`, options `✅ Promote`, `🔁 Retain (Failed)`, `↗️ Transferred`, `⛔ Discontinued`, `Graduated`, `Execute Promotion`, `Confirm promotion for {n} students?`, `This can be reversed using the rollback feature below.`, `Yes, Promote`, `Cancel`, `No active students found to promote.`, `Promotion History`, `Rolled Back`, `Rollback`, `Promotion failed. Please try again.`
- Footer: `Settings saved successfully!`, `Unsaved changes will be lost.`, `Save Settings`, `Saving...`

---

## 15. Profile (tab `profile`) – shared `ProfilePage`

**Route/section:** `/teacher-dashboard`, tab `profile`. It opens from the top button in the sidebar.

**Who can access:** Any logged-in portal user.

**Purpose:** Show the user's profile data.

**Functions:**
- Initial values come from `useAuth().session.user` (name, email, phone, role, department, and `teacherProfile.employeeId` or `studentProfile.studentId`). No profile fetch is made.
- The photo is stored locally. On load it reads `getProfilePhotoLocally(userId)`. The pencil button opens a file picker. `uploadAvatar(file, userId)` (Supabase) uploads the image, `saveProfilePhotoLocally` stores the URL, and failures show `alert("Photo upload failed: {msg}")`.
- `Edit Profile` / `Save Changes` toggles the edit state. `Save Changes` only turns edit mode off. It does not call any API, so edits are lost on reload.
- Name, Phone and Bio are editable while editing. The email input has no `onChange`, so it cannot actually be changed.
- The `Two-Factor Enabled` badge is static text.

**Text on screen:**
- `My Profile` sections: `Employee ID`, `Department`
- Right card: `Personal Information`, buttons `Edit Profile` / `Save Changes`
- Labels: `Full Name`, `Email Address`, `Phone Number`, `Security Status`, `Professional Bio`
- Badge: `Two-Factor Enabled`
- Alert: `Photo upload failed: {msg}`
- Profile image alt text: `Profile`

---

## 16. Components in `components/teacher/` that are not mounted in the portal

These three components exist but no tab renders them. `AssignmentsExams` and `LearningResources` are imported in `page.tsx` but not used in `renderContent`. `CommunicationHub` is not imported anywhere in the teacher page.

### 16.1 AssignmentsExams (`AssignmentsExams.tsx`)

**Route/section:** None (unreachable).

**Who can access:** No one through the UI.

**Purpose:** Card list of assignments and exams.

**Functions:**
- **Static/mock data**, no API. Items:
  - `Algebra Worksheet` (Assignment, 10-A, Today, 32/42, Active)
  - `Mid-term Physics Paper` (Exam, 11-C, May 05, 0/38, Upcoming)
  - `Biology Lab Report` (Assignment, 9-B, Yesterday, 42/42, Completed)
- Filter buttons `All`, `Assignments`, `Exams` set `filter`. The filter drops the trailing "s" to match the item type.
- `Create New`, the more-options button, `View` and `Upload` have no handlers.

**Text on screen:**
- `Assignments & Exams`, `Create New`, `All`, `Assignments`, `Exams`
- Card: title, `{class} • {type}`, `Date`, `Submissions`, buttons `View`, `Upload`

### 16.2 LearningResources (`LearningResources.tsx`)

**Route/section:** None (unreachable).

**Who can access:** No one through the UI.

**Purpose:** Grid of course files.

**Functions:**
- **Static/mock data**, no API. Files: `Algebra Basics.pdf` (2.4 MB, 2h ago), `Force & Motion.mp4` (45 MB, Yesterday), `Chemistry Lab.jpg` (1.2 MB, Apr 25), `Midterm Syllabus.docx` (850 KB, Apr 20).
- The folder button, `Upload`, the per-file more-options button and the `Add Resource` tile have no handlers.

**Text on screen:**
- `Learning Resources`, `Manage your course materials and gallery`, `Upload`, `Add Resource`

### 16.3 CommunicationHub (`CommunicationHub.tsx`)

**Route/section:** None (unreachable). The `communication` tab uses the shared `ChatPage` instead.

**Who can access:** No one through the UI.

**Purpose:** Static messaging and announcements mock-up.

**Functions:**
- **Static/mock data**, no API. Tab buttons `Messages` and `Announcements` switch the right panel.
- Chats are hardcoded: `Rahul S. (Parent)`, `Grade 10-A Group`, `Principal`. The right panel always shows `Rahul S. (Parent)` with `Online`.
- The search input, send button, more button and `New Post` have no handlers.
- Announcement posts are hardcoded: `Sports Day Rescheduled` (Apr 28, 2026, Urgent) and `Summer Vacation Dates` (Apr 25, 2026, Regular). Both use the same body text.

**Text on screen:**
- `Messages`, `Announcements`, `Search...`
- Chats: `Rahul S. (Parent)` / `When is the next math test?` / `2m ago`; `Grade 10-A Group` / `Assignment uploaded` / `1h ago`; `Principal` / `Please check the circular` / `3h ago`
- `Online`, `Select a conversation to start chatting`, `Type a message...`
- `Announcements`, `New Post`, `Urgent`, `Regular`
- Post body: `Please note that the upcoming sports day has been rescheduled to next week due to weather forecasts.`


---

# Part 6 – Parent (Student) Portal

Source: `frontend/src/app/parent-dashboard/page.tsx`, `components/parent/ParentSidebar.tsx`, `components/parent/MobileBottomNav.tsx`, `components/parent/sections/*`.

All sections live on one Next.js route, **`/parent-dashboard`**. There is no URL change between sections. The `activeMenu` state (`MenuKey`: `dashboard | events | profile | diary | notifications | academic | transport | settings | communication`) picks the section. Inside Academic, `academicTab` picks the sub-tab (`calendar | attendance | timetable | exam | schedule | leave`).

**Who can access (all pages):** users with the `parent` role. `lib/role-access.ts` maps `parent` to `/parent-dashboard`, and `app/dashboard/page.tsx` redirects there. The login page's role card for this portal is labelled "Parent", and a parent signs in with a student ID and password. `page.tsx` itself does not check the role. It reads `useAuth()` and shows a spinner while `isBootstrapping`. Any 401 from the API client (outside credential-check endpoints) sends the browser to `/login`.

---

## 0. Shell (page.tsx, ParentSidebar, MobileBottomNav)

### 0.1 Page shell – `app/parent-dashboard/page.tsx`

**Route/section:** `/parent-dashboard` (wrapper for every section).

**Purpose:** Builds the active-student object, the theme, the top bar, the contextual page header and the content area. It switches between sections.

**Functions**
- **Primary student**: built from `session.user` and `session.user.studentProfile`. Fallbacks are listed under "Text on screen".
- **Linked students**: read from `localStorage["sns-linked-students"]`. The list refreshes on the window `storage` event and on window `focus`. The students list is the primary student followed by linked students whose id differs.
- **Active student**: defaults to the primary student. It is switched from the sidebar dropdown. It is re-set to the primary student once the session loads, if the id is still "N/A".
- **Dark mode**: state is stored in `localStorage["sns-dark-mode"]`. It toggles `dark` class and `data-theme` on `<html>`.
- **Bell badge count**: `GET /notifications` (via `notificationService.getNotifications`, bearer token). The badge shows the number of unread items, or `99+` above 99. The badge is hidden at 0.
- **Hamburger button** (below `lg` only): opens the sidebar drawer. A dark overlay click closes it.
- **Dark/light toggle button** in the top bar.
- **Bell button**: opens Announcements (`notifications`) section.
- **Avatar button**: opens Profile section.
- **Contextual header** (icon tile, title, student name, class chip): shown for academic tabs, diary, profile, transport, settings and notifications. Not shown for dashboard, events and communication.
- **Messages** (`communication`): renders the shared `ChatPage` component from `components/dashboard/chat-page`. It is outside the scope of this document.
- The `DashboardHome` quick-action cards call `onNavigate(tab)`, which sets the academic tab and opens Academic. `onNavigateMenu` opens another section.
- Default (unknown menu) renders `EventsGallery`.

**Text on screen**
- Top bar: date in `en-IN` format (weekday short, day, month short, year) on desktop; `{activeStudent.name}`; `Class {class}-{section}`.
- Button titles / aria-labels: `Open menu`, `Switch to Light Mode`, `Switch to Dark Mode`, `Notifications`, `Open profile` (title `Profile`).
- Avatar: initials of the active student.
- Page header titles: `Academic Calendar`, `Attendance`, `Time Table`, `Exam Report Card`, `Exam Schedule`, `Leave Application` (academic tabs); `Diary & Homework`, `Student Profile`, `Transport Tracking`, `Settings`, `Announcements`. Under the title: student name. On the right (≥ sm): `Class {class}-{section}`.
- Fallback values for the primary student: name `Student Name`; id/studentId/class/section `N/A`; school `SNS Academy, Coimbatore`; `Not Provided` (father, mother, guardian names); `N/A` (contacts, emails, address); relation `Contact`; class teacher `Assigning...`; teacher email `contact@school.com`.
- Linked students are given `classTeacher: "Assigning..."`, `teacherEmail: "contact@school.com"`, school `SNS Academy, Coimbatore`; class and section default to `N/A`.

### 0.2 Sidebar – `components/parent/ParentSidebar.tsx`

**Route/section:** Left navigation (fixed on desktop `lg+`, slide-in drawer on smaller screens).

**Purpose:** Navigation between sections, switching between students, and signing out.

**Functions**
- **Student card (left part)**: opens Profile.
- **Caret button**: opens or closes a dropdown that lists all students (`name`, `Class {class}-{section}`). Choosing one sets the active student (and closes the drawer on mobile).
- **Menu buttons**: each calls `setActiveMenu(key)` (and closes the drawer on mobile).
- **Badge**: the "Diary & Homework" item shows a hard-coded badge `3` when it is not active. It is static, not from the API.
- **Sign Out**: `clearSession()` then `router.push("/login")`. No API call.

**Text on screen**
- Logo alt `Logo`; `SNS Academy`; `Parent Portal`.
- Group `MENU`: `Events Gallery`, `Dashboard`, `Diary & Homework`, `Announcements`, `Messages`.
- Group `TOOLS`: `Academic Reports`, `Transport Tracking`, `Settings`.
- `Sign Out`.

### 0.3 Mobile bottom navigation – `components/parent/MobileBottomNav.tsx`

**Route/section:** Fixed bottom bar, visible below `lg` only (`aria-label="Primary"`).

**Purpose:** Quick access on phones to four common places.

**Functions** (all static navigation, no API)
- `Home` → Dashboard.
- `Time Table` → Academic, tab `timetable`. Highlighted for any Academic tab except `exam`.
- `Homework` → Diary & Homework.
- `Performance` → Academic, tab `exam`.

**Text on screen:** `Home`, `Time Table`, `Homework`, `Performance`.

---

## 1. Dashboard (`activeMenu = "dashboard"`) – `sections/DashboardHome.tsx`

**Route/section:** `/parent-dashboard` → Dashboard (default section).

**Who can access:** Parent role.

**Purpose:** Home page with four quick-action cards, today's class schedule and the latest announcement/holiday.

**Functions**
- **Card-layout switcher** (buttons `1`, `2`, `3`, `Auto`): sets the number of columns of the quick cards. Saved in `localStorage["sns_dashboard_cols"]`. Default is Auto. On phones it is limited to 2 columns.
- **Attendance card** → opens Academic > Attendance. Value and sub-text come from `GET /dashboard/parent/{studentProfile.id}` (`getParentDashboardOverview`).
- **Exam Reports card** → opens Academic > Exam Report Card. Value and sub-text come from the same call.
- **Leave Application card** → opens Academic > Leave Application. Static text.
- **Notifications card** → opens Announcements section. Value is the unread count from `GET /notifications`.
- **Today's Schedule**: `GET /timetable/student?class={class}&section={section}`. It filters rows for the current weekday and sorts by period. The first row is labelled "Current" and the others "Upcoming" (by position, not by time).
- **Important Note**: `GET /announcements`; shows the content of the first (latest) one. "Read More" is a text element with an arrow. It has no click handler.
- **Upcoming Holiday**: first announcement whose title contains "holiday" (case-insensitive). It shows its title and its created date (`en-IN`, day + short month).
- The date badge in the schedule card is the hard-coded string `April 20, 2026`.

**Text on screen**
- `Quick Actions`; layout buttons `1` `2` `3` `Auto`.
- Cards:
  - `Attendance`: value `…` until loaded, sub `Calculating…`.
  - `Exam Reports`: value `…`, sub `No results yet`.
  - `Leave Application`: value `Apply Now`, sub `Quick Request`.
  - `Notifications`: value `…` or the count; sub `1 unread message` or `{n} unread`.
- `Today's Schedule`; `April 20, 2026`; per-row `{subject}`, `{startTime} - {endTime}`, tag `Current` / `Upcoming`; empty state `No classes scheduled for today.`
- `Important Note`; fallback `No new announcements at this time. Stay tuned for school updates.`; link `Read More`.
- `Upcoming Holiday`; fallback `No upcoming holidays`; date fallback `-`.

---

## 2. Events Gallery (`activeMenu = "events"`) – `sections/EventsGallery.tsx`

**Route/section:** `/parent-dashboard` → Events Gallery (also the fallback section).

**Who can access:** Parent role.

**Purpose:** An Instagram-style feed of school announcements, with an author "stories" bar.

**Functions**
- **Load**: `GET /announcements?skip=0&take=50` (`getAnnouncements`). Only posts with target `all` or `parents` are kept.
- **Stories bar** (shown when posts exist): the `All` circle (★) plus one circle per unique author (first name). Clicking an author filters the feed to that author. Clicking the active author again returns to `All`.
- **View switcher** (buttons `1`, `2`, `3`): feed columns. Saved in `localStorage["sns_gallery_cols"]`. Default 1.
- **Like**: heart button, or double-click on the image/text tile. It toggles a like and plays a heart animation. Likes are local state only and are not saved to the server.
- **Three-dot button** on each post: no handler.
- **Retry** button after an error: reloads the posts.
- Posts with `imageUrl` show a square image. Others show the title as a large text tile.
- Time since posting: `Just now`, `{n}m`, `{n}h`, `{n}d`, or a date (`en-IN`, day + short month) after 7 days.

**Text on screen**
- Story labels: `All`, `★`, author first names.
- `View`.
- Post header: author handle (name lower-cased, no spaces), tag `Everyone` (target `all`) or `Parents`, line `SNS Academy · {time}`.
- Caption: handle + title (+ content if different), then the date (`en-IN`, day, long month, year).
- Error: `Failed to load. Tap retry.` with button `Retry`.
- Empty: `No posts here yet`.
- Loading: two skeleton cards.

---

## 3. Diary & Homework (`activeMenu = "diary"`) – `sections/DiarySection.tsx`

**Route/section:** `/parent-dashboard` → Diary & Homework.

**Who can access:** Parent role.

**Purpose:** Shows homework for the active student's class and a list of school events/announcements.

**Functions**
- **Load** (on class/section change, in parallel):
  - `GET /homework?class={class}&section={section}` (`getHomework`)
  - `GET /announcements`
  - `GET /timetable/student?class=…&section=…` (converted into a Mon–Fri grid and stored in state, but not displayed)
  - `GET /exams/schedule?class=…&section=…` (stored in state, not displayed)
  - Each call ignores errors. `isLoading` is set but not used for display.
- **Tabs**: `Homework` and `Upcoming Events`.
- **Subject filter pills** (Homework tab): `All` plus each distinct subject. They filter the list on the client.
- **View Details** button on each homework card: no handler.
- Events tab lists every announcement (title, created date). The tag shows `Announcement` if the target is `all`, otherwise the target in upper case.

**Text on screen**
- Tabs: `Homework`, `Upcoming Events`.
- `Filter:`; pills `All` + subjects.
- Homework card: subject tag, `{title}`, `{description}`, `Due: {date}`, button `View Details`.
- Events: `{title}`, `{date}`, tag `Announcement` or the upper-case target.
- Empty (events): `No upcoming events or announcements.` The Homework tab has no empty-state message.

---

## 4. Announcements / Notifications (`activeMenu = "notifications"`) – `sections/NotificationsSection.tsx`

**Route/section:** `/parent-dashboard` → Announcements (sidebar label), reached by the bell button and the dashboard card.

**Who can access:** Parent role (needs `session.accessToken`).

**Purpose:** Shows the parent's personal alerts and school announcements.

**Functions**
- **Load**: `GET /notifications` and `GET /announcements?skip=0&take=50` in parallel. Announcements are limited to targets `all` and `parents`.
- **Auto mark-as-read**: if any notification is unread, it calls `markAllAsRead` (`/notifications/read-all`) and marks them read locally.
- **Tabs**: `My Alerts` (with an unread count pill) and `Announcements`.
- **Delete** (trash icon per alert): `deleteNotification` (`/notifications/{id}`). It removes the alert from the list. Errors are ignored silently. A spinner shows while deleting.
- Alert colour by type: `message` indigo, `alert` red, `info` orange.
- Time format: `Just now`, `{n} min ago`, `{n} hr ago`, `Yesterday`, else a date.

**Text on screen**
- Heading `Notifications`; sub-heading `Your alerts and school announcements.`
- Tabs `My Alerts`, `Announcements`.
- Alert cards: `{title}`, `{message}`, time.
- Empty alerts: `All caught up!` / `No notifications yet.`
- Announcement cards: `{title}`, `Posted by {author name or "Admin"}`, time, `{content}`, target tag (raw value, e.g. `all`).
- Empty announcements: `No Announcements Yet` / `Admin posts will appear here.`

Note: the page header above the section says `Announcements`, while the heading inside the section says `Notifications`.

---

## 5. Academic Reports (`activeMenu = "academic"`) – `sections/AcademicSection.tsx`

**Route/section:** `/parent-dashboard` → Academic Reports (sidebar label). Six tabs make up the sub-pages. The tab rail is sticky and scrolls horizontally. The active tab is kept in sync with the dashboard cards and the bottom nav.

**Who can access:** Parent role.

**Purpose:** Calendar, attendance, timetable, report card, exam schedule and leave application for the active student.

**Common data load** (when `student.id` is not "N/A"):
- `GET /timetable/student?class&section` (`getStudentTimetable`)
- `GET /exams/results/{student.id}` (`getStudentExamResults`)
- `GET /dashboard/parent/{studentId or id}` for the report attendance value
- `GET /announcements?skip=0&take=100` (calendar events)
- `GET /exams/schedule?class&section` (`getExamSchedule`)
- `GET /attendance/student/{studentId}?month=YYYY-MM`: reloaded whenever the displayed month changes
- `GET /leaves/mine`: only when the Leave tab is open (and again after a submit)

**Tab labels:** `Academic Calendar`, `Attendance`, `Time Table`, `Exam Report Card`, `Exam Schedule`, `Leave Application`.

### 5.1 Academic Calendar (tab `calendar`)

**Functions**
- Monthly grid. It starts at April 2026. Previous and next month buttons (aria-labels `Previous month`, `Next month`) change the month.
- Announcements created in the displayed month appear on their day as coloured labels (upper-case title). Target `all` counts as an event (green) and anything else as academic (blue). On phones, one label per day is shown with `+{n} more`.
- The `Next Events` card is **static, hard-coded** data.

**Text on screen**
- `SCHOOL SCHEDULE`; `Academic events, exams and holidays for the current year.`; month name and year.
- Weekday headers: `SUNDAY` … `SATURDAY` (`SUN` … `SAT` on phones).
- Legend under the calendar: `Present`, `Absent`, `Leave`, `Holiday`.
- Card `Next Events` with tag `Academic Focus`, and the hard-coded rows: `MAY 1` `Labor Day Holiday` `Full Day`; `MAY 15` `Mid-Term Exami...` `09:00 AM`; `MAY 22` `Annual Sports M...` `08:30 AM`; `MAY 28` `Parent Teacher...` `10:00 AM`.
- Second legend: `ACADEMIC`, `HOLIDAY`, `EXAM`, `EVENT`; footer logo text `SNS ACADEMY`.

### 5.2 Attendance (tab `attendance`)

**Functions**
- Same calendar grid as 5.1, with month navigation. Each day shows a chip from the attendance register for that month. Accepted statuses are `P`/`Present`, `A`/`Absent`, `L`/`Leave`, `H`/`Holiday`. The chip hover text includes the reason when there is one.
- Summary boxes count Present, Absent and Leave days in the displayed month.

**Text on screen**
- Summary: `Present` `{n} Days`; `Absent` `{n} Day(s)`; `Leave` `{n} Day(s)`.
- Chips: `PRESENT`, `ABSENT`, `LEAVE`, `HOLIDAY`.
- The calendar header, legends and Next Events card from 5.1 also show here.

### 5.3 Time Table (tab `timetable`)

**Functions**
- Builds a grid of Monday–Saturday × 8 columns from `/timetable/student`. Column 4 is always `LUNCH`. Period 1–3 fill columns 1–3, and periods 4–7 fill columns index 4–7.
- If the API returns no rows, a **hard-coded sample timetable** is shown instead (Math, Physics, English, L A B, and so on).
- Below the desktop breakpoint, each day becomes a card with a period grid. On desktop it is a table.

**Text on screen**
- Table header `DAY/PERIOD`; columns `I`, `II`, `III`, `LUNCH`, `IV`, `V`, `VI`, `VII`.
- Day names; `{n} Periods` (card view); `LUNCH BREAK`; empty cells `—`; the cell `SPORTS` has a pill style.

### 5.4 Exam Report Card (tab `exam`)

**Functions**
- **Exam type buttons**: `Periodic Exam`, `Cycle Exam`, `Term Exam` (default Term). They filter results by term text: `Periodic I`, `Cycle II`, `Annual`.
- Results from `/exams/results/{student.id}` are shown in a marks table. The percentage is the average of the totals. Attendance comes from `/dashboard/parent/...`.
- **Download PDF** button: has an animation only, no handler.
- If there are no results, the term shows `No Data`.

**Text on screen**
- `SNS ACADEMY`; term name; button `Download PDF`; logo alt `SNS Logo`.
- Fields: `Student Name`, `Student ID` (value `Not Assigned` if "N/A"), `Grade & Section`.
- Table columns: `Subject`, `Internal (20)` (`Int (20)` on phones), `Exam (80)`, `Total (100)` (`Total` on phones), `Grade`.
- Empty: `No subjects recorded for this exam term.`
- Summary: `Percentage`, `Attendance`, `Teacher's Remarks`. Remarks fall back to `Good performance in {term}.` or, with no data, `No examination records found for this term.` Percentage with no data is `0%`.

### 5.5 Exam Schedule (tab `schedule`)

**Functions**
- Shows the same three exam type buttons as 5.4, but they do not filter this list. The schedule is loaded once and all entries show.
- Each entry is a card: term, date (`en-IN`), subject, start time with duration, and hall when present.

**Text on screen**
- Buttons `Periodic Exam`, `Cycle Exam`, `Term Exam`.
- Card: `{term}`, `{date}`, `{subject}`, `⏰ {startTime} ({duration})`, `📍 {hall}`.
- Empty: `No exam schedule published yet.` / `The school admin will publish the exam timetable soon.`

### 5.6 Leave Application (tab `leave`)

**Functions**
- **Form** (all required except the document): start date, end date, reason, optional file. The file is uploaded with `uploadDocument` from `lib/supabase`. If the upload fails, the form is still submitted without it.
- **Submit**: `POST /leaves` with `studentName`, `class`, `section`, `startDate`, `endDate`, `reason`, `documentUrl`. Uses the bearer token. Shows the submitted view on success and an error banner on failure. The button is disabled while submitting.
- **Apply for Another Date** resets the form view.
- **My Applications**: `GET /leaves/mine`. Each entry shows the date range, the applied date, class and section, a status pill (`Pending`, `Approved`, `Rejected`), the reason, and an admin note when present.

**Text on screen**
- `Apply for Leave`; `Student: {name} ({class}-{section})`.
- Labels: `Start Date`, `End Date`, `Reason for Leave`, `Supporting Documents (Optional)`.
- Placeholder `Please provide a valid reason...`; upload text `Click to upload attachment` (or the file name and size in MB).
- Buttons: `Submit Leave Application`, `Submitting…`, `Apply for Another Date`.
- Success: `✓`, `Application Submitted!`, `The leave request for {name} of class {class}-{section} has been sent to the administrator.`
- Error fallback: `Failed to submit. Please try again.`
- `My Applications`; sub-text `{n} application(s) on file — updates appear here once the office decides.` or `Approval status for every leave you have requested.`
- Empty: `No leave applications yet.` (or `Sign in to view your leave applications.` when logged out).
- Entry: `Applied {date} · Class {class}-{section}`; `Admin note: {note}`; for approved: `These days are recorded as Leave in the attendance register.`

---

## 6. Student Profile (`activeMenu = "profile"`) – `sections/ProfileSection.tsx`

**Route/section:** `/parent-dashboard` → Profile (from the sidebar student card, the top-bar avatar, or the dropdown).

**Who can access:** Parent role.

**Purpose:** Read-only profile of the active student, parents, guardian and class teacher.

**Functions:** Display only. There are no buttons, forms or API calls. All values come from the `Student` object built in `page.tsx` (session data or linked students). Guardian details and class teacher are placeholder defaults (`Not Provided`, `Assigning...`) for the primary student.

**Text on screen**
- Avatar card: initials, `{name}`, `Class {class}-{section}`, `Permanent Address` with `{address}`.
- `Student Information`: `Full Name`, `Class` (value `Class {class} – Section {section}`), `School` (fallback `SNS Academy, Coimbatore`), `Student ID`.
- `Parent Information`: `Father: {name}` and `Mother: {name}` with phone and email (fallbacks `Not Provided`, `N/A`).
- Guardian box: `Guardian / Emergency Contact`, `{name} ({relation})` (relation fallback `Emergency Contact`), `Contact Number`.
- `Academic Contact`: `Class Teacher`, `Teacher Email`.

---

## 7. Transport Tracking (`activeMenu = "transport"`) – `sections/TransportSection.tsx`

**Route/section:** `/parent-dashboard` → Transport Tracking.

**Who can access:** Parent role.

**Purpose:** Shows bus route, timings and driver details.

**Functions:** **Static mock data only.** There are no API calls and no interactive controls. The data is a hard-coded `busInfo` object. The map area is a placeholder.

**Text on screen**
- `Route 7B`; `Bus No: TN 33 Z 9901`.
- Time tiles: `Pick-up` `7:45 AM`; `Drop-off` `4:30 PM`.
- `Route Stops`: `SNS Academy (Start)`, `Saibaba Colony`, `Gandhipuram`, `RS Puram`, `Peelamedu (School)`.
- `Driver Information`: avatar `R`, `Ramesh Kumar`, `Licensed Driver`, `Phone` `+91 94440 12345`, `License` `TN 33 AB 5678`.
- Map placeholder: `Live Tracking`, `Coming Soon`.

---

## 8. Settings (`activeMenu = "settings"`) – `sections/SettingsSection.tsx`

**Route/section:** `/parent-dashboard` → Settings.

**Who can access:** Parent role (actions need `session.accessToken`).

**Purpose:** Requests profile changes (admin approval), sets preferences, changes the password and links other students.

**Functions**
- **Prefill**: the profile form is filled from the session (name, email, father/mother contact, address from father's office address).
- **Send Approval to Admin**: builds a changes object from the filled fields (name and email only if changed). It sends `POST /auth/profile-request`, then reloads `GET /auth/profile-requests/mine`. With no changes it shows an error toast. Note: `guardianMobile` is editable but never included in the request.
- **Approval Request History**: loaded from `GET /auth/profile-requests/mine`. The card is shown only when there are requests or while loading.
- **Dark Mode toggle**: calls `setIsDarkMode` (same state as the top-bar toggle).
- **Language select**: `English`, `Tamil`, `Hindi`. Local state only. Nothing is saved or translated.
- **Change Password** button: validates, then `POST /auth/change-password` with `currentPassword` and `newPassword`. It is disabled until current and new password are filled. It clears the fields on success.
- **Add Another Student**: `Link Student` calls `POST /auth/verify-student` (`studentId`, `password`). On success the student is added to `localStorage["sns-linked-students"]` and a `storage` event is dispatched so the sidebar list refreshes. Pressing Enter in the password field also submits. A duplicate student ID is rejected.
- **Remove** on a linked student: removes it from state and `localStorage` (no API call).
- **Toast**: top-right, disappears after 4 seconds.

**Text on screen**
- `Settings`; `Manage your account preferences`.
- `Edit Profile`; `Changes will be submitted to admin for approval before taking effect.`
- Labels: `Full Name`, `Email`, `Mobile`, `City`, `Father's Mobile`, `Mother's Mobile`, `Guardian Mobile (Optional)`, `Current Address` (placeholder `Enter your full address...`).
- Buttons: `Send Approval to Admin`, `Sending...`.
- `Approval Request History`; `Loading...`; status (raw value in upper case), date, `{key}: {value}` pairs, `Admin note: {note}`.
- `Preferences`; `Dark Mode` / `Switch between light and dark theme`; `Language` / `Choose your preferred language`.
- `Change Password`; labels `Current Password`, `New Password`, `Confirm New Password`; placeholder `••••••••`; button `Change Password` / `Changing...`.
- `Add Another Student`; `Link another student profile to switch between them easily.`; linked row `{name}`, `{studentId} · Class {class}-{section}`, button `Remove`; labels `Student ID` (placeholder `SNS-2026-XXXX`), `Password` (placeholder `••••••••`); button `Link Student` / `Verifying...`.
- Toasts:
  - `You are not logged in.`
  - `No changes detected.`
  - `Approval request sent to admin!`
  - `Failed to send request.`
  - `Please enter your current password.`
  - `Please enter a new password.`
  - `New password must be at least 6 characters.`
  - `New passwords do not match!`
  - `Password changed successfully!`
  - `Failed to change password.`
  - `Please enter the Student ID.`
  - `Please enter the student password.`
  - `This student is already linked.`
  - `{name} linked successfully!`
  - `Invalid credentials. Please try again.`
  - Server error messages are shown when the API returns one.


---

