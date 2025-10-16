# Maintenance & Contributing Guide

This document outlines the procedures for maintaining the L&T Sales Tracker application and guidelines for contributing to its development.

## Maintenance Checklist

### Daily Tasks

1. **System Health Monitoring**
   ```powershell
   # Check backend service status
   curl http://localhost:5000/api/health
   
   # Check MongoDB connection
   mongosh --eval "db.adminCommand('ping')"
   
   # Check server logs
   Get-Content ./backend/logs/app.log -Tail 100
   ```

2. **Error Monitoring**
   - Review error logs
   - Check failed API requests
   - Monitor authentication failures
   - Review client-side crash reports

3. **Performance Checks**
   - API response times
   - Database query performance
   - Mobile app startup time
   - Memory usage trends

### Weekly Tasks

1. **Dependency Updates**
   ```powershell
   # Check for outdated packages
   cd client
   npm outdated
   
   cd ../backend/backend
   npm outdated
   ```

2. **Database Maintenance**
   ```javascript
   // Check database stats
   db.stats()
   
   // Review and optimize indexes
   db.getCollectionNames().forEach(function(collection) {
     db[collection].getIndexes()
   })
   ```

3. **Backup Verification**
   ```powershell
   # Verify backup integrity
   mongorestore --dry-run --archive=backup.gz
   
   # Test restore in staging environment
   mongorestore --uri $STAGING_MONGO_URI --archive=backup.gz
   ```

### Monthly Tasks

1. **Security Updates**
   - Update system packages
   - Review security advisories
   - Update SSL certificates if needed
   - Rotate access tokens/keys

2. **Performance Optimization**
   - Analyze slow queries
   - Review API usage patterns
   - Optimize database indexes
   - Clear unnecessary logs

3. **Documentation Review**
   - Update API documentation
   - Review troubleshooting guides
   - Update deployment procedures
   - Maintain changelog

## Handoff Guide

### Key System Knowledge

1. **Architecture Overview**
   - Expo React Native frontend
   - Node.js/Express backend
   - MongoDB database
   - Cloudinary file storage

2. **Critical Components**
   ```plaintext
   backend/
   ├── config/          # Configuration files
   ├── controllers/     # Business logic
   ├── middleware/      # Request processing
   ├── models/         # Database schemas
   └── routes/         # API endpoints

   client/
   ├── app/           # Screen components
   ├── components/    # Reusable UI
   ├── lib/          # Utilities
   └── assets/       # Static files
   ```

3. **Integration Points**
   - Authentication service
   - File upload service
   - Email notifications
   - Location tracking

### Access Management

1. **Required Accounts**
   - GitHub repository access
   - MongoDB Atlas account
   - Cloudinary dashboard
   - Play Store console

2. **Environment Variables**
   ```plaintext
   backend/.env
   ├── MONGO_URI
   ├── JWT_SECRET
   ├── CLOUDINARY_*
   └── SMTP_*

   client/.env
   └── EXPO_PUBLIC_API_URL
   ```

3. **Access Rotation**
   - Quarterly password changes
   - API key rotation
   - SSH key updates
   - Token refreshes

### Emergency Contacts

| Role | Contact | Availability |
|------|---------|-------------|
| Backend Lead | backend-lead@company.com | 24/7 |
| Frontend Lead | frontend-lead@company.com | Business hours |
| DevOps Engineer | devops@company.com | On-call rotation |
| Database Admin | dba@company.com | Business hours |

## Incident Response

### Severity Levels

1. **Critical (P0)**
   - Service unavailable
   - Data loss/corruption
   - Security breach

2. **High (P1)**
   - Major feature unavailable
   - Significant performance degradation
   - Authentication issues

3. **Medium (P2)**
   - Minor feature issues
   - UI/UX problems
   - Non-critical bugs

4. **Low (P3)**
   - Cosmetic issues
   - Feature requests
   - Documentation updates

### Response Procedures

1. **Initial Assessment**
   ```plaintext
   - Impact evaluation
   - User communication
   - Team notification
   - Resource allocation
   ```

2. **Resolution Steps**
   ```plaintext
   - Problem investigation
   - Solution implementation
   - Testing and validation
   - Deployment and verification
   ```

3. **Post-Incident**
   ```plaintext
   - Root cause analysis
   - Prevention measures
   - Documentation updates
   - Team debriefing
   ```

## Contributing Guidelines

### Development Workflow

1. **Branch Strategy**
   ```plaintext
   main           # Production code
   ├── develop    # Development branch
   ├── feature/*  # New features
   ├── bugfix/*   # Bug fixes
   └── release/*  # Release preparation
   ```

2. **Branch Naming**
   ```plaintext
   feature/user-profile
   bugfix/login-error
   release/v1.2.0
   ```

3. **Commit Messages**
   ```plaintext
   feat: add user profile page
   fix: resolve login token expiration
   docs: update API documentation
   chore: update dependencies
   ```

### Code Style Guide

1. **JavaScript/TypeScript**
   ```javascript
   // Use consistent naming
   const UserProfile = ({ userId }) => { ... }  // Components: PascalCase
   const fetchUserData = async () => { ... }   // Functions: camelCase
   const MAX_RETRY_COUNT = 3                   // Constants: UPPER_SNAKE_CASE
   ```

2. **React Native Components**
   ```javascript
   // Organize imports
   import React from 'react';
   import { View, Text } from 'react-native';
   import { styles } from './styles';
   
   // Use functional components
   export const MyComponent = ({ prop1, prop2 }) => {
     return (
       <View style={styles.container}>
         <Text>{prop1}</Text>
       </View>
     );
   };
   ```

3. **Backend Code**
   ```javascript
   // Use async/await
   const getUser = async (req, res) => {
     try {
       const user = await User.findById(req.params.id);
       res.json(user);
     } catch (error) {
       res.status(500).json({ message: error.message });
     }
   };
   ```

### Pull Request Process

1. **PR Template**
   ```markdown
   ## Description
   Brief description of changes
   
   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Breaking change
   
   ## Testing
   - Steps to test changes
   - Test coverage
   
   ## Screenshots
   If applicable
   ```

2. **Review Checklist**
   - Code style compliance
   - Test coverage
   - Documentation updates
   - Performance impact
   - Security considerations

3. **Merge Requirements**
   - Passing CI/CD pipeline
   - Code review approval
   - No merge conflicts
   - Updated documentation

## Version Control

### Semantic Versioning

1. **Version Format**
   ```plaintext
   MAJOR.MINOR.PATCH
   1.2.3
   ```

2. **Version Rules**
   - MAJOR: Breaking changes
   - MINOR: New features
   - PATCH: Bug fixes

3. **Version Tags**
   ```powershell
   git tag -a v1.2.3 -m "Release version 1.2.3"
   git push origin v1.2.3
   ```

### Release Process

1. **Version Bump**
   ```powershell
   # Update version in package.json
   npm version patch # or minor/major
   
   # Update version in app.json
   # Update CHANGELOG.md
   ```

2. **Release Branch**
   ```powershell
   git checkout -b release/v1.2.3
   # Make release preparations
   git merge --no-ff release/v1.2.3
   ```

3. **Release Deployment**
   ```powershell
   # Tag release
   git tag v1.2.3
   
   # Deploy to production
   npm run deploy:prod
   ```

### Migration Guide

1. **Database Migrations**
   ```javascript
   // migrations/20251007_add_user_profile.js
   export const up = async (db) => {
     await db.collection('users').updateMany({}, {
       $set: { profile: { created: new Date() } }
     });
   };
   
   export const down = async (db) => {
     await db.collection('users').updateMany({}, {
       $unset: { profile: "" }
     });
   };
   ```

2. **API Versioning**
   ```plaintext
   /api/v1/users
   /api/v2/users
   ```

3. **Client Updates**
   - Version check on startup
   - Force update mechanism
   - Migration notifications