# Environment Variables & Secrets Management

This guide details all environment variables used in the L&T Sales Tracker application, their purposes, and best practices for managing them securely.

## Environment Variable Registry

### Backend Environment Variables

| Variable | Purpose | Required | Default | Example | Environment |
|----------|---------|----------|---------|---------|-------------|
| `PORT` | Server port number | No | 5000 | `5000` | All |
| `MONGO_URI` | MongoDB connection string | Yes | - | `mongodb://localhost:27017/lt-sales-tracker` | All |
| `JWT_SECRET` | Secret for JWT tokens | Yes | - | `your-256-bit-secret` | All |
| `NODE_ENV` | Environment name | No | development | `production` | All |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | Yes | - | `your-cloud-name` | All |
| `CLOUDINARY_API_KEY` | Cloudinary API key | Yes | - | `123456789012345` | All |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | Yes | - | `your-api-secret` | All |
| `SMTP_HOST` | Email server hostname | No | smtp.gmail.com | `smtp.gmail.com` | All |
| `SMTP_PORT` | Email server port | No | 587 | `587` | All |
| `SMTP_USER` | Email server username | Yes | - | `your-email@gmail.com` | All |
| `SMTP_PASS` | Email server password | Yes | - | `your-app-specific-password` | All |
| `CLIENT_NAME` | From name for emails | No | CASE | `L&T Sales` | All |

### Frontend Environment Variables

| Variable | Purpose | Required | Default | Example | Environment |
|----------|---------|----------|---------|---------|-------------|
| `EXPO_PUBLIC_API_URL` | Backend API URL | Yes | - | `http://localhost:5000/api` | All |

## Environment-Specific Configurations

### Development

```plaintext
# backend/.env.development
PORT=5000
MONGO_URI=mongodb://localhost:27017/lt-sales-tracker
JWT_SECRET=dev-secret-key-change-in-production
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
CLIENT_NAME=L&T Sales

# client/.env.development
EXPO_PUBLIC_API_URL=http://localhost:5000/api
```

### Staging

```plaintext
# backend/.env.staging
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/lt-sales-staging
JWT_SECRET=staging-secret-key-different-from-prod
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=staging-email@company.com
SMTP_PASS=your-app-password
CLIENT_NAME=L&T Sales (Staging)

# client/.env.staging
EXPO_PUBLIC_API_URL=https://api-staging.lt-sales-tracker.com/api
```

### Production

```plaintext
# backend/.env.production
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/lt-sales-prod
JWT_SECRET=long-random-production-secret
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=no-reply@company.com
SMTP_PASS=your-app-password
CLIENT_NAME=L&T Sales

# client/.env.production
EXPO_PUBLIC_API_URL=https://api.lt-sales-tracker.com/api
```

## Secret Management Best Practices

### 1. Local Development
- Never commit `.env` files
- Use `.env.example` as a template
- Keep different `.env` files for different environments

```plaintext
# .env.example
PORT=5000
MONGO_URI=mongodb://localhost:27017/lt-sales-tracker
JWT_SECRET=your-secret-key
# ... other variables
```

### 2. Version Control
- Include `.env` in `.gitignore`
- Commit `.env.example` with dummy values
- Document all required variables

```plaintext
# .gitignore
.env
.env.local
.env.*.local
```

### 3. Production Deployment

#### Docker Secrets
```yaml
# docker-compose.yml
services:
  api:
    environment:
      - JWT_SECRET=/run/secrets/jwt_secret
    secrets:
      - jwt_secret

secrets:
  jwt_secret:
    file: ./secrets/jwt_secret.txt
```

#### Kubernetes Secrets
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: lt-sales-secrets
type: Opaque
data:
  jwt-secret: <base64-encoded-secret>
  mongodb-uri: <base64-encoded-uri>
```

### 4. CI/CD Secret Injection

#### GitHub Actions
```yaml
name: Deploy
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Set up environment
        env:
          JWT_SECRET: ${{ secrets.JWT_SECRET }}
          MONGO_URI: ${{ secrets.MONGO_URI }}
```

## Secret Rotation Procedures

### JWT Secret
1. Generate new secret
2. Deploy new secret to environment
3. Update application configuration
4. Force re-authentication (optional)

### Database Credentials
1. Create new database user
2. Update connection strings
3. Deploy changes
4. Remove old user

### API Keys
1. Generate new keys in service dashboard
2. Update environment variables
3. Deploy changes
4. Revoke old keys

## Security Checklist

### Environment Setup
- [ ] All secrets stored in environment variables
- [ ] No hardcoded credentials in code
- [ ] Different secrets for each environment
- [ ] Secure secret storage solution in place

### Access Control
- [ ] Limited access to production secrets
- [ ] Audit trail for secret access
- [ ] Regular secret rotation
- [ ] Emergency revocation procedure

### Monitoring
- [ ] Secret usage monitoring
- [ ] Failed authentication alerts
- [ ] Regular secret audit
- [ ] Automatic leak detection

## Encryption Keys and Certificates

### SSL/TLS Certificates
- Location: `/etc/ssl/certs/`
- Rotation: Every 90 days
- Monitoring: Certificate expiry alerts

### JWT Keys
- Algorithm: HS256
- Key Length: 256 bits
- Rotation: Every 180 days

## Development Guidelines

### Loading Environment Variables
```javascript
// backend/config/validateEnv.js
import { cleanEnv, str, port } from 'envalid';

export default function validateEnv() {
  return cleanEnv(process.env, {
    PORT: port(),
    MONGO_URI: str(),
    JWT_SECRET: str(),
    // ... other validations
  });
}
```

### Using Environment Variables
```javascript
// Good
const { JWT_SECRET } = process.env;

// Bad
const JWT_SECRET = "hardcoded-secret";
```

## Troubleshooting

### Common Issues

> **⚠️ Issue**: Environment variables not loading
```powershell
# Check if .env file exists
Test-Path .env

# Verify file permissions
Get-Acl .env
```

> **⚠️ Issue**: Wrong environment loaded
```javascript
console.log('Current ENV:', process.env.NODE_ENV);
console.log('API URL:', process.env.EXPO_PUBLIC_API_URL);
```

## Additional Resources

1. [Twelve-Factor App - Config](https://12factor.net/config)
2. [Node.js Security Best Practices](https://nodejs.org/en/security)
3. [Docker Secrets Documentation](https://docs.docker.com/engine/swarm/secrets/)
4. [GitHub Environment Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)