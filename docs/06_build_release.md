# Build & Release Guide

This guide covers the complete process of building, deploying, and releasing the L&T Sales Tracker application, from local development to production deployment.

## Local Development Setup

### Frontend Development Server

1. **Install Dependencies**
   ```powershell
   cd client
   npm install
   ```

2. **Start Metro Bundler**
   ```powershell
   npm start
   ```
   Options:
   - Press `a` - Open Android
   - Press `w` - Open Web
   - Press `r` - Reload
   - Press `m` - Toggle menu

3. **Hot Reload Configuration**
   - Enable Fast Refresh in Dev Menu (shake device or press `m`)
   - Edit files to see immediate updates

### Backend Development Server

1. **Install Dependencies**
   ```powershell
   cd backend/backend
   npm install
   ```

2. **Start Server with Nodemon**
   ```powershell
   npm run dev
   ```

   Server features:
   - Auto-reload on file changes
   - Error stack traces
   - Environment variables from `.env`

### Database Setup

1. **Local MongoDB**
   ```powershell
   # Start MongoDB service
   net start MongoDB
   
   # Verify connection
   mongosh "mongodb://localhost:27017/lt-sales-tracker"
   ```

2. **Docker MongoDB** (alternative)
   ```powershell
   docker-compose up -d mongodb
   ```

## Android Build Process

### Debug Build

1. **Prepare Environment**
   ```powershell
   cd client
   
   # Clean Android build
   cd android
   ./gradlew clean
   ```

2. **Configure Debug Settings**
   - Edit `android/app/build.gradle`:
   ```gradle
   buildTypes {
       debug {
           signingConfig signingConfigs.debug
           debuggable true
       }
   }
   ```

3. **Build Debug APK**
   ```powershell
   ./gradlew assembleDebug
   ```
   
   Output location: 
   ```
   client/android/app/build/outputs/apk/debug/app-debug.apk
   ```

### Release Build

1. **Generate Keystore** (if not exists)
   ```powershell
   cd android
   keytool -genkey -v -keystore lt-sales-tracker.keystore -alias lt-sales-tracker -keyalg RSA -keysize 2048 -validity 10000
   ```

2. **Configure Signing**
   
   Edit `android/gradle.properties`:
   ```properties
   MYAPP_UPLOAD_STORE_FILE=lt-sales-tracker.keystore
   MYAPP_UPLOAD_KEY_ALIAS=lt-sales-tracker
   MYAPP_UPLOAD_STORE_PASSWORD=*****
   MYAPP_UPLOAD_KEY_PASSWORD=*****
   ```

3. **Build Release APK**
   ```powershell
   ./gradlew assembleRelease
   ```

   Output location:
   ```
   client/android/app/build/outputs/apk/release/app-release.apk
   ```

### Build Troubleshooting

> **⚠️ Issue**: Gradle sync failed
```powershell
cd android
./gradlew clean
rm -rf ~/.gradle/caches/
./gradlew build
```

> **⚠️ Issue**: Missing Android SDK
```powershell
# Set ANDROID_HOME
$env:ANDROID_HOME="C:\Users\username\AppData\Local\Android\Sdk"
```

## Backend Deployment

### Docker Deployment

1. **Build Container**
   ```powershell
   cd backend/backend
   docker build -t lt-sales-tracker-api .
   ```

2. **Run Container**
   ```powershell
   docker run -d \
     -p 5000:5000 \
     --name lt-sales-api \
     --env-file .env \
     lt-sales-tracker-api
   ```

3. **Multi-Container Setup**
   ```powershell
   docker-compose up -d
   ```

### PM2 Deployment

1. **Install PM2**
   ```powershell
   npm install -g pm2
   ```

2. **Configuration**
   
   Create `ecosystem.config.js`:
   ```javascript
   module.exports = {
     apps: [{
       name: 'lt-sales-api',
       script: 'server.js',
       instances: 'max',
       autorestart: true,
       watch: false,
       max_memory_restart: '1G',
       env: {
         NODE_ENV: 'production'
       }
     }]
   }
   ```

3. **Start Application**
   ```powershell
   pm2 start ecosystem.config.js
   ```

### Health Check Endpoints

```javascript
GET /api/health
Response: { "status": "ok", "timestamp": "ISO-8601" }
```

## Database Deployment

### MongoDB Atlas Setup

1. **Create Cluster**
   - Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create M0 (free) or larger cluster
   - Configure IP whitelist
   - Create database user

2. **Connection String**
   ```
   mongodb+srv://<username>:<password>@<cluster>.mongodb.net/lt-sales-tracker?retryWrites=true&w=majority
   ```

3. **Security Settings**
   - Enable IP whitelist
   - Set strong password
   - Enable SSL/TLS
   - Configure backup schedule

### Production Hardening

1. **Enable Authentication**
   ```javascript
   security:
     authorization: enabled
   ```

2. **Configure Backup**
   - Enable continuous backup
   - Set retention policy
   - Test restore procedure

## Release Process

### Pre-release Checklist

1. **Version Update**
   - [ ] Update `client/app.json` version
   - [ ] Update `backend/package.json` version
   - [ ] Update CHANGELOG.md

2. **Testing**
   - [ ] Run automated tests
   - [ ] Perform manual testing
   - [ ] Test all API endpoints
   - [ ] Verify database migrations

3. **Documentation**
   - [ ] Update API documentation
   - [ ] Update release notes
   - [ ] Update deployment guide

### Deployment Steps

1. **Backend Deployment**
   ```powershell
   # Pull latest changes
   git pull origin main
   
   # Install dependencies
   npm ci --production
   
   # Run migrations
   node migrate.js up
   
   # Restart PM2
   pm2 reload lt-sales-api
   ```

2. **Frontend Release**
   - Build signed APK
   - Test on test devices
   - Upload to Play Store
   - Submit for review

3. **Post-deployment**
   - Monitor error rates
   - Check API response times
   - Verify database performance
   - Test critical user flows

### Rollback Procedures

1. **Backend Rollback**
   ```powershell
   # Revert to previous version
   git checkout v1.2.3
   
   # Rollback database
   node migrate.js down
   
   # Restart service
   pm2 reload lt-sales-api
   ```

2. **Frontend Rollback**
   - Halt staged rollout in Play Store
   - Revert to previous version
   - Monitor crash reports

## Monitoring & Logs

### Log Management

1. **Application Logs**
   ```powershell
   # PM2 logs
   pm2 logs lt-sales-api
   
   # Docker logs
   docker logs lt-sales-api
   ```

2. **Log Rotation**
   ```javascript
   // winston configuration
   {
     maxsize: '10m',
     maxFiles: '7d'
   }
   ```

### Performance Monitoring

1. **Backend Metrics**
   - Request rate
   - Response time
   - Error rate
   - Memory usage

2. **Frontend Metrics**
   - App load time
   - API call latency
   - Error tracking
   - User engagement

## Continuous Integration

### GitHub Actions Workflow

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Test
        run: |
          npm ci
          npm test

  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Build
        run: |
          npm ci
          npm run build
```

## Emergency Procedures

### System Outage

1. **Immediate Actions**
   - Check server status
   - Review error logs
   - Notify team
   - Start incident response

2. **Recovery Steps**
   - Identify root cause
   - Apply fixes
   - Verify system status
   - Update status page

### Data Recovery

1. **Backup Restoration**
   ```powershell
   # Restore from backup
   mongorestore --uri "$MONGODB_URI" --gzip --archive=backup.gz
   ```

2. **Verification**
   - Check data integrity
   - Verify application functionality
   - Test critical features