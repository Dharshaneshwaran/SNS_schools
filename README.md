# SNS Academy ERP

Modern administration portal supporting smart management features for parents and educators.

---

## 🚀 Execution Instructions

Launch individual architecture segments independently.

### Prerequisites
- Node.js 24.14.1+ 
- npm 10.8.0+
- PostgreSQL or compatible database
- Firebase project credentials

### Web Server (Client)
```bash
cd frontend
npm install
npm run dev

# Access at http://localhost:3001
```

### API Endpoints (Server)
```bash
cd backend
npm install
npm run build          # Build for production
npm run start:prod     # Run production build
# OR for development:
npm run start:dev      # Runs with hot-reload
```

## 🌐 Deployment to Render

### Prerequisites
1. Push code to GitHub
2. Create Render account
3. Prepare environment variables

### Environment Variables
Add these in Render Dashboard → Environment:
```
NODE_ENV=production
NODE_OPTIONS=--max-old-space-size=2048
DATABASE_URL=postgresql://user:password@host/dbname
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY=your_private_key (use literal \n for newlines)
FIREBASE_CLIENT_EMAIL=your_email@project.iam.gserviceaccount.com
JWT_SECRET=your_jwt_secret_here
```

### Deploy
```bash
# Option 1: Use render.yaml
git push origin main
# Render will auto-deploy using render.yaml configuration

# Option 2: Manual via Dashboard
# Select GitHub repo → render.yaml will be detected automatically
```

### Troubleshooting Deployment

If you get "JavaScript heap out of memory" error:
1. Check environment variables include `NODE_OPTIONS=--max-old-space-size=2048`
2. Ensure `npm ci` is used (not `npm install`) in build command
3. For large instances, increase to `--max-old-space-size=4096`

See [DEPLOYMENT_FIXES.md](./DEPLOYMENT_FIXES.md) for detailed error solutions.

---

## 👥 Demo Credentials

All test configurations leverage the shared core password: `ChangeMe123!`

| Role Scope | Targeted Email Account |
|---|---|
| **Superadmin** | `superadmin@sns-erp.local` |
| **Admin** | `admin@sns-erp.local` |
| **Leader** | `leader@sns-erp.local` |
| **Teacher** | `teacher@sns-erp.local` |
| **Parent** | `1234567890` |

---

## 📋 Local Testing

Before deploying to production, test locally:

```bash
# Test build script exactly as Render will run it
bash deploy.sh

# This will:
# - Clean install dependencies
# - Generate Prisma client
# - Build TypeScript
# - Verify artifacts
```

---

## 🔧 Development

### Backend Scripts
- `npm run build` - Build for production
- `npm run start:dev` - Development mode with hot-reload
- `npm run start:debug` - Debug mode
- `npm run test` - Run tests
- `npm run lint` - Run ESLint
- `npm run format` - Format code

### Frontend Scripts
- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

---

## 📝 Architecture

- **Backend**: NestJS + Prisma + PostgreSQL
- **Frontend**: Next.js + React + Tailwind CSS
- **Mobile**: Flutter (native iOS/Android)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Firebase Admin SDK + JWT
- **Notifications**: Firebase Cloud Messaging

