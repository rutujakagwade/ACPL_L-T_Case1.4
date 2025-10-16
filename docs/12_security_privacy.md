# Security & Privacy Guide

This document outlines the security measures, privacy considerations, and compliance guidelines for the L&T Sales Tracker application.

## Security Analysis

### Authentication Mechanism

#### JWT-Based Authentication
The application uses JSON Web Tokens (JWT) for stateless authentication.

1. **Token Generation**
   ```javascript
   // utils/generateToken.js
   const token = jwt.sign(
     { id: user._id, type: 'member' },
     process.env.JWT_SECRET,
     { expiresIn: '7d' }
   );
   ```

2. **Token Verification**
   ```javascript
   // middleware/auth.js
   const decoded = jwt.verify(token, process.env.JWT_SECRET);
   ```

3. **Security Features**
   - Token expiration (7 days)
   - Signature verification
   - Role-based access control
   - Token type verification

#### Role-Based Authorization

1. **Role Types**
   ```javascript
   const roles = {
     user: "Regular sales team member",
     admin: "Administrative user",
     superadmin: "Super administrative user"
   };
   ```

2. **Permission Matrix**

   | Endpoint | User | Admin | SuperAdmin |
   |----------|------|-------|------------|
   | /api/auth/me | ✓ | ✓ | ✓ |
   | /api/journeys | ✓ | ✓ | ✓ |
   | /api/admin/* | ✗ | ✓ | ✓ |
   | /api/superadmin/* | ✗ | ✗ | ✓ |

3. **Authorization Middleware**
   ```javascript
   protect(['admin'], 'member')  // Requires admin role
   protect([], 'member')         // Any authenticated member
   protect([], 'superadmin')     // Requires superadmin
   ```

### Data Security

#### Password Protection

1. **Password Hashing**
   ```javascript
   // Using bcryptjs for password hashing
   const salt = await bcrypt.genSalt(10);
   const hashedPassword = await bcrypt.hash(password, salt);
   ```

2. **Password Requirements**
   - Minimum 8 characters
   - At least one uppercase letter
   - At least one number
   - At least one special character

3. **Password Storage**
   - Passwords are never stored in plain text
   - Password reset tokens are time-limited
   - Failed login attempts are monitored

#### Data Encryption

1. **Data in Transit**
   - HTTPS/TLS for all API communication
   - Secure WebSocket connections
   - Certificate pinning in mobile app

2. **Data at Rest**
   - MongoDB encryption at rest
   - Encrypted file storage in Cloudinary
   - Encrypted local storage in mobile app

3. **Sensitive Data Handling**
   ```javascript
   // Exclude password from queries
   const user = await Member.findById(id).select('-password');
   ```

### API Security Measures

#### Request Validation

1. **Input Sanitization**
   ```javascript
   // Example middleware
   const sanitizeInput = (req, res, next) => {
     req.body = sanitize(req.body);
     next();
   };
   ```

2. **Request Rate Limiting**
   ```javascript
   // Recommended implementation
   const rateLimit = require('express-rate-limit');
   
   app.use('/api/', rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 100 // limit each IP to 100 requests per windowMs
   }));
   ```

3. **CORS Configuration**
   ```javascript
   // Strict CORS policy
   const corsOptions = {
     origin: process.env.ALLOWED_ORIGINS.split(','),
     methods: ['GET', 'POST', 'PUT', 'DELETE'],
     allowedHeaders: ['Content-Type', 'Authorization'],
     maxAge: 86400 // 24 hours
   };
   ```

#### File Upload Security

1. **File Validation**
   - File type verification
   - File size limits
   - Virus/malware scanning

2. **Storage Security**
   ```javascript
   // Cloudinary configuration
   cloudinary.config({
     secure: true,
     private_cdn: true
   });
   ```

### Infrastructure Security

#### Server Hardening

1. **Node.js Security**
   ```javascript
   // Security headers
   app.use(helmet());
   app.use(helmet.noSniff());
   app.use(helmet.xssFilter());
   app.use(helmet.frameguard({ action: 'deny' }));
   ```

2. **MongoDB Security**
   - Authentication required
   - Network isolation
   - Regular security patches

3. **Docker Security**
   ```dockerfile
   # Non-root user
   USER node
   
   # Read-only filesystem
   VOLUME ["/data"]
   ```

## Privacy Assessment

### User Data Collection

#### Personal Information
1. **Required Data**
   - Email address
   - Name
   - Role information
   - Location data (during journeys)

2. **Optional Data**
   - Profile picture
   - Contact information
   - Device information

3. **Derived Data**
   - Usage patterns
   - Performance metrics
   - Location history

#### Data Storage Locations

1. **Primary Database (MongoDB)**
   - User profiles
   - Authentication data
   - Journey records
   - Expense data

2. **Cloud Storage (Cloudinary)**
   - Profile pictures
   - Expense receipts
   - Document uploads

3. **Local Storage (Mobile App)**
   - Authentication tokens
   - User preferences
   - Cached data

### Data Retention Policies

1. **Active Data**
   - User accounts: Until deletion request
   - Journey data: 3 years
   - Expense records: 7 years (legal requirement)

2. **Archived Data**
   - Inactive accounts: 1 year
   - Completed journeys: 3 years
   - Approved expenses: 7 years

3. **Deleted Data**
   ```javascript
   // Soft delete implementation
   const softDelete = async (model, id) => {
     await model.updateOne(
       { _id: id },
       { 
         $set: { 
           deleted: true,
           deletedAt: new Date()
         }
       }
     );
   };
   ```

### Privacy Controls

1. **User Controls**
   - Profile visibility settings
   - Location tracking toggles
   - Data export functionality
   - Account deletion option

2. **Administrative Controls**
   - Data access logs
   - User activity monitoring
   - Privacy policy enforcement
   - Data breach notification system

## Security Hardening Recommendations

### 1. Authentication Enhancements

```javascript
// Implement refresh tokens
const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
  
  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.REFRESH_SECRET,
    { expiresIn: '7d' }
  );
  
  return { accessToken, refreshToken };
};
```

### 2. API Security

```javascript
// Add request validation middleware
const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: error.details[0].message
      });
    }
    next();
  };
};
```

### 3. Data Protection

```javascript
// Implement field-level encryption
const encryptField = (value) => {
  const cipher = crypto.createCipher('aes-256-cbc', process.env.ENCRYPTION_KEY);
  return cipher.update(value, 'utf8', 'hex') + cipher.final('hex');
};
```

## Compliance Checklist

### GDPR Compliance

1. **Data Processing**
   - [ ] Lawful basis for processing
   - [ ] Purpose limitation
   - [ ] Data minimization
   - [ ] Accuracy maintenance

2. **User Rights**
   - [ ] Right to access
   - [ ] Right to rectification
   - [ ] Right to erasure
   - [ ] Right to data portability

3. **Technical Measures**
   - [ ] Data protection by design
   - [ ] Security measures implementation
   - [ ] Breach notification procedures
   - [ ] Data processing records

### Data Protection

1. **Access Controls**
   - [ ] Role-based access
   - [ ] Multi-factor authentication
   - [ ] Session management
   - [ ] Access logging

2. **Data Security**
   - [ ] Encryption in transit
   - [ ] Encryption at rest
   - [ ] Secure backup procedures
   - [ ] Data disposal protocols

3. **Monitoring**
   - [ ] Security event logging
   - [ ] Access attempt monitoring
   - [ ] Data access auditing
   - [ ] Anomaly detection

## Security Response Plan

### Incident Response

1. **Detection**
   - System monitoring
   - Alert mechanisms
   - User reports
   - Automated scanning

2. **Response**
   - Incident classification
   - Team notification
   - Containment measures
   - Investigation procedures

3. **Recovery**
   - Service restoration
   - Data recovery
   - Security patch deployment
   - Post-incident analysis

### Breach Notification

1. **Internal Process**
   ```plaintext
   1. Incident detection
   2. Security team notification
   3. Impact assessment
   4. Management briefing
   5. Response coordination
   ```

2. **External Process**
   ```plaintext
   1. User notification
   2. Authority reporting
   3. Public disclosure
   4. Legal compliance
   ```

## Security Tools & Resources

### Recommended Tools

1. **Security Testing**
   - OWASP ZAP
   - Burp Suite
   - npm audit
   - Docker security scanning

2. **Monitoring**
   - ELK Stack
   - Prometheus
   - Grafana
   - AWS CloudWatch

3. **Compliance**
   - GDPR compliance tools
   - PCI DSS scanners
   - SOC 2 frameworks
   - ISO 27001 toolkits