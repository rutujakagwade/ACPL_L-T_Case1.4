# Performance Optimization Guide

This document outlines performance optimization strategies, monitoring approaches, and best practices for the L&T Sales Tracker application.

## Current Performance Analysis

### Frontend Bundle Size

1. **Current Metrics**
   ```javascript
   // Output from expo-cli build analysis
   {
     "initial": "2.1MB",
     "assets": "1.4MB",
     "dependencies": {
       "@react-navigation": "245KB",
       "expo-location": "180KB",
       "nativewind": "156KB"
     }
   }
   ```

2. **Bundle Analysis Tools**
   ```bash
   # Install bundle analyzer
   npm install -g react-native-bundle-analyzer
   
   # Generate bundle stats
   npx react-native-bundle-analyzer
   ```

3. **Asset Optimization**
   - Image compression status
   - Font subsetting
   - SVG optimization

### Backend Response Times

1. **API Endpoints Performance**
   | Endpoint | Avg Response Time | 95th Percentile |
   |----------|------------------|-----------------|
   | /api/auth/login | 150ms | 250ms |
   | /api/journeys | 200ms | 350ms |
   | /api/expenses | 300ms | 500ms |

2. **Database Query Times**
   ```javascript
   // Slow query analysis
   db.currentOp(
     { "active": true, "secs_running": { "$gt": 1 } }
   )
   ```

3. **Resource Utilization**
   - CPU usage patterns
   - Memory consumption
   - Network bandwidth

## Optimization Opportunities

### Frontend Optimization

1. **Code Splitting**
   ```javascript
   // Dynamic imports for routes
   const UserDashboard = React.lazy(() => import('./screens/UserDashboard'));
   
   // Wrap with Suspense
   <Suspense fallback={<LoadingSpinner />}>
     <UserDashboard />
   </Suspense>
   ```

2. **Asset Loading**
   ```javascript
   // Image optimization
   import { Image } from 'expo-image';
   
   <Image
     source={uri}
     contentFit="cover"
     transition={200}
     cachePolicy="memory-disk"
   />
   ```

3. **State Management**
   ```javascript
   // Implement memo for expensive components
   const MemoizedComponent = React.memo(({ data }) => {
     // Component logic
   }, (prevProps, nextProps) => {
     return prevProps.data.id === nextProps.data.id;
   });
   ```

### Backend Optimization

1. **Database Indexing**
   ```javascript
   // Create compound indexes for frequent queries
   db.journeys.createIndex({ 
     "user": 1, 
     "createdAt": -1 
   });
   
   db.expenses.createIndex({
     "user": 1,
     "status": 1,
     "date": -1
   });
   ```

2. **Query Optimization**
   ```javascript
   // Use projection to limit fields
   const user = await Member.findById(id)
     .select('name email role')
     .lean();
   
   // Use aggregation pipeline for complex queries
   const expenses = await Expense.aggregate([
     { $match: { user: userId } },
     { $sort: { date: -1 } },
     { $limit: 10 }
   ]);
   ```

3. **Caching Strategy**
   ```javascript
   // Implement Redis caching
   const cacheMiddleware = async (req, res, next) => {
     const key = `cache:${req.originalUrl}`;
     const cached = await redis.get(key);
     
     if (cached) {
       return res.json(JSON.parse(cached));
     }
     
     next();
   };
   ```

### Database Optimization

1. **Index Optimization**
   ```javascript
   // Monitor index usage
   db.collection.aggregate([
     { $indexStats: {} }
   ]);
   
   // Remove unused indexes
   db.collection.dropIndex("unused_index");
   ```

2. **Data Model Optimization**
   ```javascript
   // Embed frequently accessed data
   const journeySchema = new Schema({
     user: {
       _id: ObjectId,
       name: String,
       role: String
     },
     // Other fields...
   });
   ```

3. **Connection Pooling**
   ```javascript
   // Configure connection pool
   mongoose.connect(process.env.MONGO_URI, {
     maxPoolSize: 10,
     minPoolSize: 2,
     maxIdleTimeMS: 30000
   });
   ```

## Caching Strategies

### Frontend Caching

1. **API Response Caching**
   ```javascript
   // Implement caching layer
   const cachedFetch = async (key, fetchFn) => {
     const cached = await AsyncStorage.getItem(key);
     if (cached) {
       return JSON.parse(cached);
     }
     
     const data = await fetchFn();
     await AsyncStorage.setItem(key, JSON.stringify(data));
     return data;
   };
   ```

2. **Image Caching**
   ```javascript
   import * as FileSystem from 'expo-file-system';
   
   const cacheImage = async (uri) => {
     const filename = uri.split('/').pop();
     const path = `${FileSystem.cacheDirectory}${filename}`;
     
     const image = await FileSystem.downloadAsync(uri, path);
     return image.uri;
   };
   ```

3. **State Persistence**
   ```javascript
   // Persist important app state
   const persistState = async (state) => {
     try {
       await AsyncStorage.setItem('app_state', JSON.stringify(state));
     } catch (error) {
       console.error('Error persisting state:', error);
     }
   };
   ```

### Backend Caching

1. **Redis Implementation**
   ```javascript
   // Set up Redis client
   const redis = new Redis({
     host: process.env.REDIS_HOST,
     port: process.env.REDIS_PORT,
     maxRetriesPerRequest: 3
   });
   
   // Cache middleware
   const cache = (duration) => async (req, res, next) => {
     const key = `api:${req.originalUrl}`;
     const cached = await redis.get(key);
     
     if (cached) {
       return res.json(JSON.parse(cached));
     }
     
     res.sendResponse = res.json;
     res.json = async (body) => {
       await redis.setex(key, duration, JSON.stringify(body));
       res.sendResponse(body);
     };
     
     next();
   };
   ```

2. **Cache Invalidation**
   ```javascript
   // Invalidate cache on data updates
   const invalidateCache = async (patterns) => {
     const keys = await redis.keys(patterns);
     if (keys.length) {
       await redis.del(keys);
     }
   };
   ```

## Monitoring Setup

### Performance Metrics

1. **Frontend Metrics**
   ```javascript
   // Performance monitoring setup
   import * as Performance from 'expo-performance';
   
   Performance.startMeasuring('screen_load');
   // ... screen loads
   Performance.stopMeasuring('screen_load');
   ```

2. **Backend Metrics**
   ```javascript
   // Response time monitoring middleware
   app.use((req, res, next) => {
     const start = process.hrtime();
     
     res.on('finish', () => {
       const [seconds, nanoseconds] = process.hrtime(start);
       const duration = seconds * 1000 + nanoseconds / 1e6;
       
       console.log(`${req.method} ${req.url} - ${duration}ms`);
     });
     
     next();
   });
   ```

3. **Database Metrics**
   ```javascript
   // Monitor MongoDB performance
   mongoose.set('debug', (collection, method, query, doc) => {
     console.log(`${collection}.${method}`, JSON.stringify(query), doc);
   });
   ```

### Alerting Thresholds

1. **Response Time Alerts**
   ```javascript
   const THRESHOLDS = {
     api: 500,  // 500ms
     database: 200,  // 200ms
     redis: 50   // 50ms
   };
   ```

2. **Resource Usage Alerts**
   ```javascript
   // Memory usage monitoring
   const monitorMemory = () => {
     const used = process.memoryUsage();
     if (used.heapUsed > 512 * 1024 * 1024) {  // 512MB
       notifyAdmin('High memory usage detected');
     }
   };
   ```

3. **Error Rate Alerts**
   ```javascript
   // Error tracking
   let errorCount = 0;
   const ERROR_THRESHOLD = 10;  // per minute
   
   const trackErrors = (error) => {
     errorCount++;
     if (errorCount > ERROR_THRESHOLD) {
       notifyAdmin('High error rate detected');
     }
   };
   ```

## Load Testing

### Test Scenarios

1. **API Load Testing**
   ```javascript
   // artillery.yml
   config:
     target: "http://localhost:5000"
     phases:
       - duration: 60
         arrivalRate: 20
   scenarios:
     - name: "API endpoints"
       flow:
         - get:
             url: "/api/journeys"
         - post:
             url: "/api/expenses"
   ```

2. **Concurrent Users**
   ```bash
   # Run load test with Artillery
   artillery run load-test.yml -o test-results.json
   ```

3. **Performance Benchmarks**
   | Scenario | Target | Max Load |
   |----------|--------|----------|
   | API Response | <200ms | 100 req/s |
   | Database Query | <50ms | 1000 qps |
   | File Upload | <2s | 10 req/s |

## Best Practices

### Frontend Best Practices

1. **React Native Optimization**
   - Use `React.memo()` for pure components
   - Implement virtual lists for long scrolling
   - Optimize image loading and caching
   - Minimize bridge communications

2. **State Management**
   - Use local state for UI-only data
   - Implement proper memoization
   - Batch state updates
   - Optimize re-renders

3. **Network Optimization**
   - Implement request debouncing
   - Use proper caching strategies
   - Optimize API payload size
   - Handle offline scenarios

### Backend Best Practices

1. **Express.js Optimization**
   - Use compression middleware
   - Implement proper error handling
   - Optimize route handlers
   - Use async/await properly

2. **Database Best Practices**
   - Implement proper indexing
   - Use database connection pooling
   - Optimize query patterns
   - Regular maintenance tasks

3. **General Practices**
   - Implement proper logging
   - Use proper security measures
   - Regular performance monitoring
   - Optimize third-party integrations