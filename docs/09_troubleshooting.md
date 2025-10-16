# Troubleshooting Guide

This guide provides solutions for common issues you might encounter while developing, deploying, or running the L&T Sales Tracker application.

## Diagnostic Commands

### Frontend Diagnostics

1. **Check Expo Status**
   ```powershell
   cd client
   expo doctor
   ```

2. **Clear Metro Bundler Cache**
   ```powershell
   cd client
   npm start -- --clear
   ```

3. **Check Android Build Configuration**
   ```powershell
   cd client/android
   ./gradlew app:dependencies
   ```

4. **View React Native Logs**
   ```powershell
   # Android logcat filtering for React Native logs
   adb logcat *:S ReactNative:V ReactNativeJS:V
   ```

### Backend Diagnostics

1. **Check Node.js Server**
   ```powershell
   cd backend/backend
   npm run dev
   ```

2. **Test MongoDB Connection**
   ```powershell
   mongosh $MONGO_URI --eval "db.runCommand({ ping: 1 })"
   ```

3. **Check API Health**
   ```powershell
   curl http://localhost:5000/api/health
   ```

4. **View Server Logs**
   ```powershell
   cd backend/backend
   Get-Content ./logs/app.log -Tail 100
   ```

## Common Issues and Solutions

### 1. Metro Bundler Errors

> **⚠️ Issue**: Metro bundler fails to start
```
Error: Unable to resolve module ...
```

**Cause**: 
- Corrupted Metro cache
- Missing dependencies
- Incorrect import paths

**Solution**:
1. Clear Metro cache:
   ```powershell
   cd client
   npm start -- --reset-cache
   ```

2. Reinstall node_modules:
   ```powershell
   cd client
   Remove-Item -Recurse -Force node_modules
   Remove-Item package-lock.json
   npm install
   ```

3. Check import paths case-sensitivity

### 2. Expo Go Connection Issues

> **⚠️ Issue**: Can't connect to development server
```
Network response timed out
```

**Cause**:
- Wrong IP address in EXPO_PUBLIC_API_URL
- Firewall blocking connection
- Device not on same network

**Solution**:
1. Check network connectivity:
   ```powershell
   # Test connection to dev server
   Test-NetConnection -ComputerName localhost -Port 19000
   ```

2. Verify API URL:
   ```javascript
   // client/lib/api.js
   console.log('API_BASE:', API_BASE);
   ```

3. Try tunnel connection:
   ```powershell
   npm start --tunnel
   ```

### 3. Android Build Failures

> **⚠️ Issue**: Gradle build fails
```
Execution failed for task ':app:processDebugResources'
```

**Cause**:
- Missing Android SDK components
- Incorrect Gradle configuration
- Memory issues

**Solution**:
1. Check Android SDK:
   ```powershell
   cd client/android
   ./gradlew --version
   ```

2. Update Gradle configuration:
   ```groovy
   // android/gradle.properties
   org.gradle.jvmargs=-Xmx2048m -XX:MaxPermSize=512m
   ```

3. Clean build:
   ```powershell
   cd client/android
   ./gradlew clean
   ./gradlew assembleDebug
   ```

### 4. Backend Won't Start

> **⚠️ Issue**: Node.js server fails to start
```
Error: EADDRINUSE: address already in use :::5000
```

**Cause**:
- Port already in use
- Environment variables missing
- Database connection issues

**Solution**:
1. Check port usage:
   ```powershell
   # Find process using port 5000
   netstat -ano | findstr :5000
   ```

2. Verify environment variables:
   ```powershell
   cd backend/backend
   Get-Content .env
   ```

3. Test database connection:
   ```javascript
   // backend/config/db.js
   mongoose.connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 });
   ```

### 5. Database Connection Refused

> **⚠️ Issue**: MongoDB connection fails
```
MongoServerSelectionError: connection timed out
```

**Cause**:
- MongoDB not running
- Wrong connection string
- Network/firewall issues

**Solution**:
1. Check MongoDB service:
   ```powershell
   Get-Service MongoDB
   ```

2. Verify connection string:
   ```javascript
   // Test connection string format
   if (!process.env.MONGO_URI.startsWith('mongodb')) {
     throw new Error('Invalid MongoDB URI');
   }
   ```

3. Try connecting locally:
   ```powershell
   mongosh "mongodb://localhost:27017/lt-sales-tracker"
   ```

### 6. Authentication Failures

> **⚠️ Issue**: JWT verification fails
```
JsonWebTokenError: invalid signature
```

**Cause**:
- Mismatched JWT secret
- Expired token
- Invalid token format

**Solution**:
1. Check JWT configuration:
   ```javascript
   // backend/middleware/auth.js
   console.log('Token received:', token.substring(0, 20) + '...');
   ```

2. Clear stored tokens:
   ```javascript
   await AsyncStorage.removeItem('userToken');
   ```

3. Verify token generation:
   ```javascript
   // backend/utils/generateToken.js
   const token = jwt.sign(payload, process.env.JWT_SECRET, { 
     expiresIn: '7d'
   });
   ```

### 7. File Upload Issues

> **⚠️ Issue**: Cloudinary upload fails
```
Error: Upload preset not found
```

**Cause**:
- Invalid Cloudinary credentials
- Network issues
- File size limits

**Solution**:
1. Verify Cloudinary config:
   ```javascript
   // backend/config/cloudinary.js
   console.log('Cloudinary Config:', {
     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
     api_key: '***' + process.env.CLOUDINARY_API_KEY.slice(-4)
   });
   ```

2. Check file size:
   ```javascript
   if (file.size > 5 * 1024 * 1024) {
     throw new Error('File too large');
   }
   ```

3. Test upload preset:
   ```powershell
   curl -X POST https://api.cloudinary.com/v1_1/$CLOUD_NAME/image/upload -F "file=@test.jpg" -F "upload_preset=$PRESET"
   ```

## Debugging Tools

### React Native Debugger

1. **Installation**
   ```powershell
   winget install React-Native-Community.ReactNativeDebugger
   ```

2. **Usage**
   - Launch React Native Debugger
   - Enable Debug mode in app
   - Connect to localhost:8081

### Chrome DevTools

1. **Backend API Debugging**
   - Open Chrome DevTools
   - Network tab for API calls
   - Console for server logs

2. **Frontend Debugging**
   - Enable remote debugging
   - Use Network tab for API calls
   - Use Sources for breakpoints

### Android Studio Logcat

1. **View Android Logs**
   ```powershell
   adb logcat | Select-String -Pattern "ReactNative|your-app-tag"
   ```

2. **Filter by Priority**
   ```powershell
   adb logcat *:E  # Show only errors
   ```

## When to Escalate

### Critical Issues

1. **Data Loss or Corruption**
   - Unexpected database changes
   - Failed migrations
   - Inconsistent state

2. **Security Incidents**
   - Unauthorized access
   - Token compromise
   - Data breaches

3. **Production Outages**
   - API unavailable
   - Database down
   - Authentication system failure

### Escalation Process

1. **Initial Assessment**
   - Document the issue
   - Gather error logs
   - Note reproduction steps

2. **Contact Points**
   - Backend team lead
   - DevOps engineer
   - Database administrator

3. **Required Information**
   - Error logs
   - Environment details
   - Recent changes
   - Impact assessment

## Prevention Tips

### Frontend

1. **Regular Maintenance**
   - Update Expo SDK
   - Clear Metro cache
   - Update dependencies

2. **Error Boundaries**
   ```javascript
   class ErrorBoundary extends React.Component {
     componentDidCatch(error, info) {
       console.error('Error:', error);
       // Log to monitoring service
     }
   }
   ```

### Backend

1. **Health Checks**
   ```javascript
   app.get('/health', (req, res) => {
     const dbHealth = mongoose.connection.readyState === 1;
     res.json({ 
       status: dbHealth ? 'ok' : 'error',
       timestamp: new Date()
     });
   });
   ```

2. **Graceful Shutdown**
   ```javascript
   process.on('SIGTERM', async () => {
     console.log('Shutting down gracefully...');
     await mongoose.connection.close();
     process.exit(0);
   });
   ```

### Database

1. **Regular Backups**
   ```powershell
   # Automated backup script
   mongodump --uri $MONGO_URI --out /backup/$(Get-Date -Format "yyyy-MM-dd")
   ```

2. **Index Maintenance**
   ```javascript
   // Create indexes for frequent queries
   db.members.createIndex({ email: 1 }, { unique: true });
   db.journeys.createIndex({ user: 1, createdAt: -1 });
   ```

## Monitoring Tools

1. **Server Monitoring**
   - PM2 monitoring
   - Docker stats
   - Custom health endpoints

2. **Error Tracking**
   - Console logs
   - Error boundaries
   - API error responses

3. **Performance Monitoring**
   - Response times
   - Database queries
   - Memory usage

## Additional Resources

1. [Expo Debugging Guide](https://docs.expo.dev/debugging/tools/)
2. [React Native Troubleshooting](https://reactnative.dev/docs/troubleshooting)
3. [MongoDB Diagnostics](https://www.mongodb.com/docs/manual/administration/monitoring/)