# Deployment Issues & Solutions

## JavaScript Heap Out of Memory Error

### Problem
```
FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory
```

### Root Causes
1. Default Node.js heap size is too small (~1.4GB)
2. Build process (TypeScript compilation + Prisma) is memory-intensive
3. Render.com has limited memory per container

### Solutions Applied

#### 1. Increased Heap Memory for Build
- Build script now uses `--max-old-space-size=2048` (2GB)
- Start scripts use `--max-old-space-size=1024` (1GB)
- Global npm configuration in `.npmrc`

#### 2. Added Missing Webpack Dependency
- `ts-loader` requires `webpack` as peer dependency
- Added `webpack@^5.92.0` and `webpack-cli@^6.0.0` to devDependencies

#### 3. Package Manager Consistency
- Using npm exclusively (removed Yarn, npm handles package-lock.json)
- Use `npm ci` in production (clean install)
- Added `.npmrc` with legacy peer deps flag for compatibility

#### 4. Render Configuration
- Created `render.yaml` for proper deployment settings
- Set `NODE_OPTIONS` environment variable for memory allocation
- Reduced max instances to 1 for memory efficiency

## Deprecation Warnings

### UUID Packages
The `uuid` warnings won't cause build failures but should be addressed in future updates:
- firebase-admin transitively includes old uuid versions
- These will be fixed when firebase-admin releases new versions
- Currently using `legacy-peer-deps=true` to suppress warnings

### Jest & Glob
- Jest v30 handles glob vulnerabilities better
- Already on recent versions, no action needed

## Environment Variables
Set these in Render dashboard under "Environment":
```
NODE_ENV=production
NODE_OPTIONS=--max-old-space-size=2048
DATABASE_URL=<your_database>
FIREBASE_PROJECT_ID=<your_project>
FIREBASE_PRIVATE_KEY=<your_key>
FIREBASE_CLIENT_EMAIL=<your_email>
```

## Testing Locally Before Deploy
```bash
# Install with clean state
rm -rf node_modules package-lock.json
npm ci

# Build with memory optimization
npm run build

# Test production build
npm run start:prod
```

## Monitoring Memory Usage
After deployment, monitor:
```bash
# In Render logs
NODE_OPTIONS="--max-old-space-size=2048" node dist/main
```

If still running out of memory:
1. Increase heap size to 4096 (requires larger Render plan)
2. Implement lazy loading for modules
3. Split monolith into microservices
