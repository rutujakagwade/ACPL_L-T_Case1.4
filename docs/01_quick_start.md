# Quick Start Guide

This guide will help you get the L&T Sales Tracker application up and running in your development environment within 15-20 minutes.

## Prerequisites

Before you begin, ensure you have the following tools installed on your system:

### Required Software
- [ ] **Node.js** (v18.x or higher)
- [ ] **MongoDB** (v8.x or higher)
- [ ] **Git** (v2.x or higher)
- [ ] **Android Studio** (for Android development)
- [ ] **Expo CLI** (`npm install -g expo-cli`)
- [ ] **Android SDK** (API Level 33 or higher)

### Optional Tools
- [ ] **MongoDB Compass** (for database management)
- [ ] **VS Code** (recommended IDE)
- [ ] **Postman** (for API testing)

## Quick Setup Steps

1. **Clone the Repository**
   ```powershell
   git clone https://github.com/Divyagarse/mapworkin-backend.git
   cd mapworkin-backend
   ```

2. **Set Up Backend**
   ```powershell
   cd backend/backend
   npm install
   # Copy example env file and edit with your values
   copy .env.example .env
   ```

3. **Set Up Frontend**
   ```powershell
   cd ../../client
   npm install
   copy .env.example .env
   ```

4. **Configure Environment Variables**

   Backend (.env):
   ```plaintext
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/lt-sales-tracker
   JWT_SECRET=your-secret-key
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```

   Frontend (.env):
   ```plaintext
   EXPO_PUBLIC_API_URL=http://localhost:5000
   ```

5. **Start Development Servers**

   Terminal 1 (Backend):
   ```powershell
   cd backend/backend
   npm run dev
   # Expected output: Server running on port 5000
   ```

   Terminal 2 (Frontend):
   ```powershell
   cd client
   npm start
   # Press 'a' to run on Android emulator
   ```

## Verification Steps

1. **Backend Health Check**
   ```powershell
   curl http://localhost:5000/api/health
   # Expected: {"status":"ok"}
   ```

2. **Database Connection**
   - Open MongoDB Compass
   - Connect to: mongodb://localhost:27017
   - Verify lt-sales-tracker database is created

3. **Mobile App**
   - Open Android emulator
   - Verify app loads to login screen
   - Test login with default credentials:
     - Email: admin@example.com
     - Password: admin123

## Common Setup Issues

> **⚠️ Issue**: MONGODB_URI connection failed
- **Solution**: Ensure MongoDB service is running:
  ```powershell
  net start MongoDB
  ```

> **⚠️ Issue**: Metro bundler fails to start
- **Solution**: Clear Metro cache:
  ```powershell
  cd client
  npm start -- --reset-cache
  ```

> **⚠️ Issue**: Android build fails
- **Solution**: Check Android SDK installation:
  ```powershell
  cd client/android
  ./gradlew --version
  ```

## Next Steps

After successful setup, explore these resources:
1. [System Architecture Overview](02_architecture.md)
2. [API Documentation](04_api_reference.md)
3. [Development Workflow](10_maintenance_and_contrib.md)

For detailed setup instructions and troubleshooting, see:
- [Build & Release Guide](06_build_release.md)
- [Troubleshooting Guide](09_troubleshooting.md)