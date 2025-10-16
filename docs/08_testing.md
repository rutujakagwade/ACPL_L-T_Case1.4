# Testing Guide

This guide provides a comprehensive testing strategy for the L&T Sales Tracker application. While the current codebase doesn't include tests, this document outlines the recommended testing approach and provides examples for implementation.

## Testing Philosophy

Our testing strategy follows the Testing Pyramid principle:
1. Unit Tests (70%): Testing individual components and functions
2. Integration Tests (20%): Testing interaction between components
3. End-to-End Tests (10%): Testing complete user flows

## Test Setup Instructions

### Backend Testing Setup

1. **Install Dependencies**
   ```powershell
   cd backend/backend
   npm install --save-dev jest supertest @babel/preset-env
   ```

2. **Jest Configuration**
   
   Create `jest.config.js`:
   ```javascript
   module.exports = {
     testEnvironment: 'node',
     testMatch: ['**/*.test.js'],
     collectCoverage: true,
     coverageDirectory: 'coverage',
     coverageThreshold: {
       global: {
         branches: 80,
         functions: 80,
         lines: 80,
         statements: 80
       }
     }
   };
   ```

3. **Update package.json**
   ```json
   {
     "scripts": {
       "test": "jest",
       "test:watch": "jest --watch",
       "test:coverage": "jest --coverage"
     }
   }
   ```

### Frontend Testing Setup

1. **Install Dependencies**
   ```powershell
   cd client
   npm install --save-dev @testing-library/react-native @testing-library/jest-native jest
   ```

2. **Jest Configuration**
   
   Create `jest.config.js`:
   ```javascript
   module.exports = {
     preset: 'jest-expo',
     setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
     transformIgnorePatterns: [
       'node_modules/(?!(jest-)?react-native|@react-native|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)'
     ]
   };
   ```

## Unit Testing

### Backend Unit Tests

1. **Controller Tests**

   ```javascript
   // controllers/__tests__/memberController.test.js
   import { loginMember } from '../memberController';
   import Member from '../../models/Member';
   import { generateToken } from '../../utils/generateToken';
   
   jest.mock('../../models/Member');
   jest.mock('../../utils/generateToken');
   
   describe('loginMember', () => {
     it('should return token and user data for valid credentials', async () => {
       const req = {
         body: {
           email: 'test@example.com',
           password: 'password123'
         }
       };
       const res = {
         json: jest.fn()
       };
   
       const mockUser = {
         _id: '123',
         email: 'test@example.com',
         role: 'user'
       };
   
       Member.findOne.mockResolvedValue(mockUser);
       generateToken.mockReturnValue('mock-token');
   
       await loginMember(req, res);
   
       expect(res.json).toHaveBeenCalledWith({
         token: 'mock-token',
         user: mockUser
       });
     });
   });
   ```

2. **Model Tests**

   ```javascript
   // models/__tests__/Journey.test.js
   import mongoose from 'mongoose';
   import Journey from '../Journey';
   
   describe('Journey Model', () => {
     beforeAll(async () => {
       await mongoose.connect(globalThis.__MONGO_URI__);
     });
   
     afterAll(async () => {
       await mongoose.connection.close();
     });
   
     it('should create journey with valid data', async () => {
       const validJourney = {
         user: new mongoose.Types.ObjectId(),
         title: 'Test Journey',
         startLocation: {
           latitude: 19.0760,
           longitude: 72.8777
         },
         endLocation: {
           latitude: 18.5204,
           longitude: 73.8567
         }
       };
   
       const journey = await Journey.create(validJourney);
       expect(journey.title).toBe(validJourney.title);
     });
   });
   ```

### Frontend Unit Tests

1. **Component Tests**

   ```javascript
   // app/User/__tests__/ExpenseForm.test.js
   import React from 'react';
   import { render, fireEvent } from '@testing-library/react-native';
   import ExpenseForm from '../ExpenseForm';
   
   describe('ExpenseForm', () => {
     it('should submit form with valid data', () => {
       const mockSubmit = jest.fn();
       const { getByPlaceholderText, getByText } = render(
         <ExpenseForm onSubmit={mockSubmit} />
       );
   
       fireEvent.changeText(
         getByPlaceholderText('Amount'),
         '100'
       );
       fireEvent.changeText(
         getByPlaceholderText('Description'),
         'Test expense'
       );
       fireEvent.press(getByText('Submit'));
   
       expect(mockSubmit).toHaveBeenCalledWith({
         amount: 100,
         description: 'Test expense'
       });
     });
   });
   ```

2. **Hook Tests**

   ```javascript
   // hooks/__tests__/useAuth.test.js
   import { renderHook, act } from '@testing-library/react-hooks';
   import useAuth from '../useAuth';
   import AsyncStorage from '@react-native-async-storage/async-storage';
   
   jest.mock('@react-native-async-storage/async-storage');
   
   describe('useAuth', () => {
     it('should load auth state from storage', async () => {
       AsyncStorage.getItem.mockResolvedValue(JSON.stringify({
         token: 'test-token',
         user: { id: '123' }
       }));
   
       const { result, waitForNextUpdate } = renderHook(() => useAuth());
       await waitForNextUpdate();
   
       expect(result.current.isAuthenticated).toBe(true);
       expect(result.current.user).toEqual({ id: '123' });
     });
   });
   ```

## Integration Testing

### Backend Integration Tests

```javascript
// tests/integration/auth.test.js
import request from 'supertest';
import app from '../../app';
import Member from '../../models/Member';

describe('Auth API', () => {
  beforeEach(async () => {
    await Member.deleteMany({});
  });

  describe('POST /api/auth/login', () => {
    it('should authenticate user and return token', async () => {
      // Create test user
      await Member.create({
        email: 'test@example.com',
        password: 'password123',
        role: 'user'
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
    });
  });
});
```

### Frontend Integration Tests

```javascript
// tests/integration/JourneyFlow.test.js
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import JourneyTracking from '../../app/User/JourneyTracking';

describe('Journey Tracking Flow', () => {
  it('should create and start journey', async () => {
    const { getByText, getByPlaceholderText } = render(
      <NavigationContainer>
        <JourneyTracking />
      </NavigationContainer>
    );

    // Fill journey details
    fireEvent.changeText(
      getByPlaceholderText('Start Location'),
      'Mumbai'
    );
    fireEvent.changeText(
      getByPlaceholderText('End Location'),
      'Pune'
    );

    // Start journey
    fireEvent.press(getByText('Start Journey'));

    await waitFor(() => {
      expect(getByText('Journey Started')).toBeTruthy();
    });
  });
});
```

## E2E Testing

### Setup with Detox

1. **Install Detox**
   ```powershell
   cd client
   npm install --save-dev detox
   ```

2. **Configure Detox**
   
   Update `.detoxrc.js`:
   ```javascript
   module.exports = {
     testRunner: 'jest',
     runnerConfig: 'e2e/config.json',
     configurations: {
       'android.emu.debug': {
         type: 'android.emulator',
         binaryPath: 'android/app/build/outputs/apk/debug/app-debug.apk',
         build: 'cd android && ./gradlew assembleDebug',
         device: {
           avdName: 'Pixel_3a_API_30_x86'
         }
       }
     }
   };
   ```

3. **Example E2E Test**

   ```javascript
   // e2e/login.test.js
   describe('Login Flow', () => {
     beforeAll(async () => {
       await device.launchApp();
     });
   
     it('should login successfully', async () => {
       await element(by.id('email')).typeText('user@example.com');
       await element(by.id('password')).typeText('password123');
       await element(by.text('Login')).tap();
   
       await expect(element(by.text('Dashboard'))).toBeVisible();
     });
   });
   ```

## Manual Testing

### Critical User Flows

1. **Authentication Flow**
   - [ ] User registration
   - [ ] User login
   - [ ] Password reset
   - [ ] Token refresh

2. **Journey Management**
   - [ ] Create journey
   - [ ] Start tracking
   - [ ] End journey
   - [ ] View journey history

3. **Expense Management**
   - [ ] Submit expense
   - [ ] Upload receipt
   - [ ] View expense status
   - [ ] Expense approval (admin)

### Test Case Template

```markdown
### Test Case: [ID] - [Title]

**Preconditions:**
- List required setup
- Required user role
- Required data state

**Steps:**
1. Step one
2. Step two
3. Step three

**Expected Result:**
- What should happen
- What user should see
- What data should change

**Actual Result:**
- Document what actually happened

**Pass/Fail:**
- Mark as PASS or FAIL
- Note any defects

**Screenshots:**
- Attach relevant screenshots
```

## API Testing

### Postman Collection

1. **Export collection from Postman**
<!-- 2. **Save to `docs/postman/lt-sales-tracker.postman_collection.json`** -->
3. **Include environment variables file**

### Example API Test Script

```javascript
// tests/api/journey.test.js
const axios = require('axios');

describe('Journey API', () => {
  let token;

  beforeAll(async () => {
    const response = await axios.post('/api/auth/login', {
      email: 'test@example.com',
      password: 'password123'
    });
    token = response.data.token;
  });

  it('should create new journey', async () => {
    const response = await axios.post('/api/journeys', {
      startLocation: 'Mumbai',
      endLocation: 'Pune',
      purpose: 'Meeting'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    expect(response.status).toBe(201);
    expect(response.data).toHaveProperty('id');
  });
});
```

## Performance Testing

### Load Testing with Artillery

1. **Install Artillery**
   ```powershell
   npm install -g artillery
   ```

2. **Create Test Script**
   ```yaml
   # tests/performance/load-test.yml
   config:
     target: "http://localhost:5000"
     phases:
       - duration: 60
         arrivalRate: 20
   scenarios:
     - name: "API endpoints"
       flow:
         - post:
             url: "/api/auth/login"
             json:
               email: "test@example.com"
               password: "password123"
   ```

3. **Run Test**
   ```powershell
   artillery run tests/performance/load-test.yml
   ```

### Performance Benchmarks

| Endpoint | Expected Response Time | Max Load |
|----------|----------------------|-----------|
| Login | < 200ms | 100 req/s |
| Create Journey | < 300ms | 50 req/s |
| Upload Expense | < 500ms | 20 req/s |

## Recommended Tests to Add

### Backend Tests

1. **Authentication**
   - Token validation
   - Role-based access
   - Password hashing

2. **Data Validation**
   - Input sanitization
   - Schema validation
   - Error handling

3. **Business Logic**
   - Journey calculations
   - Expense approvals
   - Balance updates

### Frontend Tests

1. **UI Components**
   - Form validation
   - Error states
   - Loading states

2. **Navigation**
   - Route protection
   - Deep linking
   - Back navigation

3. **State Management**
   - Data persistence
   - Cache handling
   - Offline mode

## Test Scaffolding

### Backend Test Structure

```
backend/
├── __tests__/
│   ├── unit/
│   │   ├── controllers/
│   │   ├── models/
│   │   └── utils/
│   ├── integration/
│   │   ├── auth/
│   │   ├── journey/
│   │   └── expense/
│   └── e2e/
└── jest.config.js
```

### Frontend Test Structure

```
client/
├── __tests__/
│   ├── components/
│   ├── screens/
│   ├── hooks/
│   └── utils/
├── e2e/
│   ├── flows/
│   └── config.json
└── jest.config.js
```