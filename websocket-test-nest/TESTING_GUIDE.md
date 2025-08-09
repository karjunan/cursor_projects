# WebSocket Testing Guide - NestJS

This guide demonstrates how to test the NestJS WebSocket application with various scenarios including single connection with multiple sending patterns.

## 🚀 Quick Start

1. **Start the server**:
   ```bash
   npm run start:dev
   ```

2. **Access the web interface**:
   - Open `http://localhost:3000/test-client` in your browser

3. **Run test scripts**:
   ```bash
   # Single connection with multiple sending
   node simple-test.js
   
   # REST API testing
   node rest-api-test.js
   
   # Comprehensive testing
   node test-single-connection.js
   ```

## 📋 Test Scenarios

### 1. Single Connection with Multiple Sending

The `simple-test.js` script demonstrates a single WebSocket connection performing multiple sending operations:

#### Scenario 1: Rapid Message Sending
- **Description**: Sends 10 messages every 100ms
- **Purpose**: Tests message throughput and server handling
- **Expected**: Server should handle rapid message sending without issues

#### Scenario 2: Ping Testing
- **Description**: Sends 5 pings every 500ms
- **Purpose**: Tests latency and connection health
- **Expected**: Server should respond with pong messages

#### Scenario 3: Broadcast Testing
- **Description**: Sends 3 broadcasts every 1 second
- **Purpose**: Tests broadcast functionality
- **Expected**: All connected clients should receive broadcasts

#### Scenario 4: Mixed Sending
- **Description**: Combines messages, pings, and broadcasts
- **Purpose**: Tests concurrent different types of events
- **Expected**: Server should handle mixed event types efficiently

#### Scenario 5: Stress Testing
- **Description**: Sends 20 messages in 1 second (20 msg/sec)
- **Purpose**: Tests server performance under load
- **Expected**: Server should maintain stability under high message rate

### 2. REST API Testing

The `rest-api-test.js` script tests the REST API endpoints:

#### Available Endpoints:
- `GET /websocket` - Get server status
- `GET /websocket/connections` - Get active connections
- `GET /websocket/messages` - Get message history
- `POST /websocket/broadcast` - Broadcast message
- `POST /websocket/connections/:id/send` - Send to specific connection
- `POST /websocket/disconnect-all` - Disconnect all connections
- `GET /health` - Health check

### 3. Web Interface Testing

Access `http://localhost:3000/test-client` for interactive testing:

#### Features:
- **Main Connection**: Single WebSocket connection with real-time status
- **Multiple Connections**: Create 1-20 parallel connections
- **Auto Testing**: Automated ping and broadcast testing
- **Message Logging**: Real-time message history
- **REST API Testing**: Built-in API testing buttons
- **Connection Monitoring**: Live connection status and statistics

## 🧪 Test Results Example

### Single Connection Test Output:
```
🎯 Single Connection Multiple Sending Test
==========================================
✅ Connected! ID: mgIbBYa5UrOX4MnbAAAB
🚀 Starting multiple sending scenarios...

📤 Scenario 1: Rapid Message Sending (10 messages every 100ms)
   Sent: Rapid message #1
   Sent: Rapid message #2
   ...
   ✅ Rapid message sending completed

🏓 Scenario 2: Ping Testing (5 pings every 500ms)
   Ping #1 sent
🏓 Pong received at 11:27:48 PM
   ...
   ✅ Ping testing completed

📢 Scenario 3: Broadcast Testing (3 broadcasts every 1s)
   Broadcast: Broadcast #1 from single connection
   ...
   ✅ Broadcast testing completed

🔄 Scenario 4: Mixed Sending (messages + pings + broadcasts)
   Mixed iteration #1
   ...
   ✅ Mixed sending completed

💪 Scenario 5: Stress Testing (20 messages in 1 second)
   ✅ Stress testing completed

📊 Final Statistics:
   - Total messages sent: 45
   - Total pings sent: 14
   - Total broadcasts sent: 9
   - Connection ID: mgIbBYa5UrOX4MnbAAAB
```

### REST API Test Output:
```
🔧 REST API WebSocket Control Test
==================================

📊 Test 1: Get Server Status
   Active connections: 0
   Message history: 0 messages

📋 Test 2: Get Active Connections
   Total connections: 0

📢 Test 3: Broadcast Message via REST API
   Result: Message broadcasted to all connections

📝 Test 5: Get Recent Messages
   Recent messages: 0
   No recent messages

❤️ Test 6: Health Check
   Status: ok
   Uptime: 36.15 seconds

✅ All REST API tests completed successfully!
```

## 📊 Performance Metrics

### Message Throughput:
- **Rapid Messages**: 10 messages per second
- **Stress Test**: 20 messages per second
- **Mixed Events**: 5 events per second (messages + pings + broadcasts)

### Connection Management:
- **Single Connection**: Stable with multiple event types
- **Multiple Connections**: Up to 20 parallel connections
- **Connection Cleanup**: Automatic cleanup on disconnect

### Server Performance:
- **Message History**: Limited to last 100 messages
- **Connection Tracking**: Real-time connection monitoring
- **Event Handling**: Concurrent event processing

## 🔧 Custom Testing

### Creating Custom Test Scripts:

```javascript
const io = require('socket.io-client');

const socket = io('http://localhost:3000');

socket.on('connect', () => {
  console.log('Connected:', socket.id);
  
  // Custom test scenario
  setInterval(() => {
    socket.emit('message', { message: 'Custom test message' });
  }, 1000);
});

socket.on('welcome', (data) => {
  console.log('Welcome:', data.message);
});
```

### REST API Integration:

```javascript
// Send broadcast via REST API
const response = await fetch('http://localhost:3000/websocket/broadcast', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    event: 'message',
    data: { message: 'Hello from API!' }
  })
});

const result = await response.json();
console.log(result.message);
```

## 🎯 Testing Best Practices

1. **Start Simple**: Begin with single connection tests
2. **Gradual Scaling**: Increase load gradually
3. **Monitor Resources**: Watch server logs and performance
4. **Test Edge Cases**: Test disconnections, reconnections
5. **Validate Responses**: Verify server responses match expectations
6. **Clean Up**: Always disconnect connections after tests

## 🐛 Troubleshooting

### Common Issues:

1. **Connection Failed**:
   - Ensure server is running (`npm run start:dev`)
   - Check port 3000 is available
   - Verify CORS settings

2. **High Memory Usage**:
   - Limit number of test connections
   - Reduce message frequency
   - Restart server periodically

3. **Test Script Errors**:
   - Install dependencies: `npm install socket.io-client node-fetch`
   - Check Node.js version compatibility
   - Verify server is accessible

### Debug Mode:

Enable debug logging in the WebSocket gateway:
```typescript
// In websocket.gateway.ts
private readonly logger = new Logger(WebsocketGateway.name);

// Add debug logs
this.logger.debug(`Message received: ${JSON.stringify(data)}`);
```

## 📈 Monitoring and Metrics

### Server Logs:
- Connection events (connect/disconnect)
- Message processing
- Error handling
- Performance metrics

### Client Metrics:
- Connection status
- Message count
- Response times
- Error rates

### REST API Metrics:
- Endpoint response times
- Success/failure rates
- Data throughput

## 🎉 Success Criteria

A successful test should demonstrate:

1. **Connection Stability**: No unexpected disconnections
2. **Message Delivery**: All messages received correctly
3. **Performance**: Acceptable response times
4. **Scalability**: Handles multiple connections
5. **Reliability**: Consistent behavior under load
6. **API Integration**: REST endpoints work correctly

This testing framework provides comprehensive coverage for WebSocket functionality and helps ensure the application performs reliably in production environments. 