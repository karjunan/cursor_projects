# WebSocket Client API - NestJS

A NestJS REST API application that acts as a client to the WebSocket server. This application receives REST requests and forwards them to the WebSocket server, then returns the responses back to the REST clients.

## 🏗️ Architecture

```
┌─────────────────┐    REST API    ┌──────────────────┐    WebSocket    ┌─────────────────┐
│   REST Client   │ ──────────────► │  Client API      │ ──────────────► │  WebSocket      │
│   (External)    │                 │  (Port 3001)     │                 │  Server         │
│                 │ ◄────────────── │                  │ ◄────────────── │  (Port 3000)    │
└─────────────────┘    Response    └──────────────────┘    Response     └─────────────────┘
```

## 🚀 Features

- **REST API Gateway**: Receives HTTP requests and forwards them to WebSocket server
- **WebSocket Client**: Maintains persistent connection to WebSocket server
- **Request/Response Handling**: Manages request timeouts and response mapping
- **Bulk Operations**: Support for sending multiple messages/pings
- **Health Monitoring**: Connection status and health checks
- **Error Handling**: Comprehensive error handling and logging

## 📋 Prerequisites

- Node.js 18+
- WebSocket server running on `http://localhost:3000`
- npm or yarn

## 🛠️ Installation

1. **Clone or navigate to the project**:
   ```bash
   cd websocket-client-api
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the WebSocket server** (in another terminal):
   ```bash
   cd ../websocket-test-nest
   npm run start:dev
   ```

4. **Start the client API**:
   ```bash
   npm run start:dev
   ```

## 🌐 API Endpoints

### Base URL: `http://localhost:3001`

### Information
- **GET `/`** - Get API information and available endpoints

### Core Operations
- **POST `/api/message`** - Send a message via WebSocket
- **POST `/api/broadcast`** - Send a broadcast via WebSocket
- **POST `/api/ping`** - Send a ping via WebSocket

### Status & Monitoring
- **GET `/api/status`** - Get connection status and server info
- **GET `/api/connections`** - Get active WebSocket connections
- **GET `/api/health`** - Health check

### Bulk Operations
- **POST `/api/bulk/messages`** - Send multiple messages
- **POST `/api/bulk/pings`** - Send multiple pings

## 📝 Usage Examples

### Send a Message
```bash
curl -X POST http://localhost:3001/api/message \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello from REST API!"}'
```

**Response:**
```json
{
  "success": true,
  "message": "Message sent successfully via WebSocket",
  "data": {
    "originalMessage": "Hello from REST API!",
    "websocketResponse": {
      "success": true,
      "data": { "message": "Message sent successfully" },
      "timestamp": "2025-08-08T23:30:00.000Z"
    },
    "timestamp": "2025-08-08T23:30:00.000Z"
  }
}
```

### Send a Broadcast
```bash
curl -X POST http://localhost:3001/api/broadcast \
  -H "Content-Type: application/json" \
  -d '{"message": "Broadcast to all clients!"}'
```

### Send a Ping
```bash
curl -X POST http://localhost:3001/api/ping \
  -H "Content-Type: application/json" \
  -d '{}'
```

### Get Status
```bash
curl http://localhost:3001/api/status
```

**Response:**
```json
{
  "success": true,
  "data": {
    "client": {
      "connected": true,
      "connectionId": "abc123"
    },
    "server": {
      "connectionCount": 1,
      "connections": [...],
      "messageHistory": [...]
    },
    "timestamp": "2025-08-08T23:30:00.000Z"
  }
}
```

### Send Bulk Messages
```bash
curl -X POST http://localhost:3001/api/bulk/messages \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      "Message 1",
      "Message 2",
      "Message 3"
    ]
  }'
```

### Send Bulk Pings
```bash
curl -X POST http://localhost:3001/api/bulk/pings \
  -H "Content-Type: application/json" \
  -d '{"count": 5}'
```

## 🧪 Testing

### Run the Test Script
```bash
node test-client-api.js
```

This will test all the API endpoints and show the results.

### Manual Testing with curl

1. **Check API info**:
   ```bash
   curl http://localhost:3001/
   ```

2. **Check health**:
   ```bash
   curl http://localhost:3001/api/health
   ```

3. **Send a message**:
   ```bash
   curl -X POST http://localhost:3001/api/message \
     -H "Content-Type: application/json" \
     -d '{"message": "Test message"}'
   ```

## 🔧 Configuration

### Environment Variables
- `PORT` - Port for the client API (default: 3001)
- `WEBSOCKET_SERVER_URL` - WebSocket server URL (default: http://localhost:3000)

### WebSocket Connection Settings
- **Reconnection**: Enabled with 5 attempts
- **Reconnection Delay**: 1 second
- **Request Timeout**: 10 seconds
- **Transport**: WebSocket with polling fallback

## 📊 Monitoring

### Health Check
The health endpoint provides:
- Overall API status
- WebSocket connection status
- Connection ID
- Uptime information

### Status Monitoring
The status endpoint provides:
- Client connection details
- Server connection count
- Server message history
- Real-time connection information

## 🏗️ Project Structure

```
websocket-client-api/
├── src/
│   ├── websocket-client/
│   │   ├── websocket-client.service.ts    # WebSocket client service
│   │   ├── websocket-client.controller.ts # REST API controller
│   │   └── websocket-client.module.ts     # Module configuration
│   ├── app.controller.ts                  # Main app controller
│   ├── app.service.ts                     # Main app service
│   ├── app.module.ts                      # Main app module
│   └── main.ts                            # Application entry point
├── test-client-api.js                     # Test script
└── package.json
```

## 🔄 Request Flow

1. **REST Request**: Client sends HTTP request to `/api/message`
2. **Request Processing**: Controller receives and validates request
3. **WebSocket Forwarding**: Service forwards request to WebSocket server
4. **Response Handling**: Service waits for response or timeout
5. **REST Response**: Controller returns formatted response to client

## ⚡ Performance

### Request Timeouts
- **Default Timeout**: 10 seconds
- **Ping Timeout**: 100ms (immediate response)
- **Message Timeout**: 500ms (standard response)

### Connection Management
- **Persistent Connection**: Maintains WebSocket connection
- **Auto Reconnection**: Handles disconnections automatically
- **Connection Pooling**: Single connection for all requests

## 🐛 Troubleshooting

### Common Issues

1. **WebSocket Server Not Running**:
   - Ensure WebSocket server is running on port 3000
   - Check server logs for connection errors

2. **Connection Timeout**:
   - Verify network connectivity
   - Check firewall settings
   - Ensure CORS is properly configured

3. **Request Timeout**:
   - Increase timeout settings if needed
   - Check WebSocket server performance
   - Monitor server logs

### Debug Mode

Enable debug logging by setting the log level:
```typescript
// In websocket-client.service.ts
private readonly logger = new Logger(WebsocketClientService.name);
this.logger.setLogLevels(['debug', 'log', 'warn', 'error']);
```

## 🔒 Security Considerations

- **CORS**: Configured for development (allow all origins)
- **Input Validation**: Validate all incoming requests
- **Error Handling**: Don't expose sensitive information in errors
- **Rate Limiting**: Consider implementing rate limiting for production

## 🚀 Production Deployment

1. **Environment Configuration**:
   ```bash
   export PORT=3001
   export WEBSOCKET_SERVER_URL=https://your-websocket-server.com
   ```

2. **Build the Application**:
   ```bash
   npm run build
   npm run start:prod
   ```

3. **Health Monitoring**:
   - Monitor `/api/health` endpoint
   - Set up alerts for connection failures
   - Monitor request/response times

## 📈 Metrics

### Key Metrics to Monitor
- **Connection Status**: WebSocket connection health
- **Request Success Rate**: Percentage of successful requests
- **Response Time**: Average response time
- **Error Rate**: Number of failed requests
- **Throughput**: Requests per second

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.
