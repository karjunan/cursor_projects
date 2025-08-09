<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).

# WebSocket Testing Application - NestJS

A comprehensive NestJS application for testing WebSocket connections with multiple parallel clients, REST API endpoints, and real-time monitoring capabilities.

## Features

- **WebSocket Gateway**: Built with Socket.IO for reliable real-time communication
- **Multiple Connection Testing**: Create and manage multiple parallel WebSocket connections
- **REST API Integration**: HTTP endpoints for WebSocket management and testing
- **Real-time Monitoring**: Live connection status, message history, and server statistics
- **Auto Ping Testing**: Automated ping/pong testing with configurable intervals
- **Broadcast Messaging**: Send messages to all connected clients
- **Connection Management**: Individual connection control and bulk operations
- **Modern UI**: Clean, responsive interface built with vanilla JavaScript and CSS
- **Health Checks**: Built-in health monitoring endpoints

## Prerequisites

- Node.js 18+ 
- npm or yarn

## Installation

1. Clone the repository or navigate to the project directory:
```bash
cd websocket-test-nest
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run start:dev
```

4. Open your browser and navigate to:
   - Main application: `http://localhost:3000`
   - Test client: `http://localhost:3000/test-client`
   - Health check: `http://localhost:3000/health`

## Usage

### Web Interface

1. **Access Test Client**:
   - Navigate to `http://localhost:3000/test-client`
   - This provides a comprehensive web interface for testing

2. **Main Connection**:
   - Click "Connect" to establish a WebSocket connection
   - Monitor connection status and view your connection ID
   - Send individual messages or broadcasts

3. **Multiple Connections**:
   - Create 1-20 parallel connections for load testing
   - Monitor all connections in real-time
   - Send ping messages to all connections simultaneously

4. **Auto Testing**:
   - Enable auto ping with configurable intervals
   - Set up automatic broadcast messages
   - Monitor performance and connection stability

### REST API Endpoints

The application provides comprehensive REST API endpoints for programmatic WebSocket management:

#### Health & Status

**GET `/health`** - Health check
```bash
curl http://localhost:3000/health
```

**GET `/websocket`** - Get WebSocket server status
```bash
curl http://localhost:3000/websocket
```

**GET `/websocket/connections`** - Get all active connections
```bash
curl http://localhost:3000/websocket/connections
```

**GET `/websocket/connections/:connectionId`** - Get specific connection
```bash
curl http://localhost:3000/websocket/connections/connection-id-here
```

**GET `/websocket/messages`** - Get message history
```bash
curl http://localhost:3000/websocket/messages
```

#### WebSocket Management

**POST `/websocket`** - Send commands to WebSocket server
```bash
# Broadcast message
curl -X POST http://localhost:3000/websocket \
  -H "Content-Type: application/json" \
  -d '{
    "action": "broadcast",
    "event": "message",
    "data": {"message": "Hello from API!"}
  }'

# Send to specific connection
curl -X POST http://localhost:3000/websocket \
  -H "Content-Type: application/json" \
  -d '{
    "action": "sendToConnection",
    "connectionId": "connection-id-here",
    "event": "message",
    "data": {"message": "Hello specific client!"}
  }'

# Disconnect specific connection
curl -X POST http://localhost:3000/websocket \
  -H "Content-Type: application/json" \
  -d '{
    "action": "disconnectConnection",
    "connectionId": "connection-id-here"
  }'

# Disconnect all connections
curl -X POST http://localhost:3000/websocket \
  -H "Content-Type: application/json" \
  -d '{
    "action": "disconnectAll"
  }'
```

**POST `/websocket/broadcast`** - Broadcast message
```bash
curl -X POST http://localhost:3000/websocket/broadcast \
  -H "Content-Type: application/json" \
  -d '{
    "event": "message",
    "data": {"message": "Hello from API!"}
  }'
```

**POST `/websocket/connections/:connectionId/send`** - Send to specific connection
```bash
curl -X POST http://localhost:3000/websocket/connections/connection-id-here/send \
  -H "Content-Type: application/json" \
  -d '{
    "event": "message",
    "data": {"message": "Hello specific client!"}
  }'
```

**POST `/websocket/connections/:connectionId/disconnect`** - Disconnect specific connection
```bash
curl -X POST http://localhost:3000/websocket/connections/connection-id-here/disconnect
```

**POST `/websocket/disconnect-all`** - Disconnect all connections
```bash
curl -X POST http://localhost:3000/websocket/disconnect-all
```

## WebSocket Events

The server handles the following events:

- **`connect`**: Client connects to server
- **`disconnect`**: Client disconnects from server
- **`welcome`**: Server sends welcome message to new client
- **`userJoined`**: Broadcast when new client joins
- **`userLeft`**: Broadcast when client leaves
- **`message`**: Custom message from client
- **`ping`**: Ping request from client
- **`pong`**: Ping response from server
- **`broadcast`**: Broadcast message from client

## Architecture

```
websocket-test-nest/
├── src/
│   ├── websocket/
│   │   ├── websocket.gateway.ts    # WebSocket gateway
│   │   ├── websocket.service.ts    # Business logic service
│   │   ├── websocket.controller.ts # REST API controller
│   │   └── websocket.module.ts     # Module configuration
│   ├── app.controller.ts           # Main app controller
│   ├── app.service.ts              # Main app service
│   ├── app.module.ts               # Main app module
│   └── main.ts                     # Application entry point
├── public/
│   └── index.html                  # Test client interface
└── package.json
```

## Development

### Running in Development Mode
```bash
npm run start:dev
```

### Building for Production
```bash
npm run build
npm run start:prod
```

### Testing
```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

### Linting
```bash
npm run lint
```

## Testing Scenarios

1. **Single Connection Testing**:
   - Connect one client and send messages
   - Test ping/pong functionality
   - Verify message history

2. **Multiple Connection Testing**:
   - Create 5-10 parallel connections
   - Test broadcast messaging
   - Monitor connection stability

3. **Load Testing**:
   - Create 20+ connections
   - Enable auto ping with 1-second intervals
   - Monitor server performance

4. **API Integration Testing**:
   - Use REST API to send messages
   - Test connection management via API
   - Verify real-time updates

5. **Disconnection Testing**:
   - Test graceful disconnections
   - Verify cleanup of disconnected clients
   - Test reconnection scenarios

## API Response Format

All API responses follow a consistent format:

```json
{
  "status": "success|error",
  "message": "Optional message",
  "data": {
    // Response data
  }
}
```

## Error Handling

The application includes comprehensive error handling:

- **400 Bad Request**: Invalid parameters or missing required fields
- **404 Not Found**: Connection or resource not found
- **500 Internal Server Error**: Server-side errors

## Performance Considerations

- WebSocket connections are managed efficiently with automatic cleanup
- Message history is limited to prevent memory leaks
- Connection monitoring includes activity tracking
- CORS is configured for cross-origin requests

## Troubleshooting

### Common Issues

1. **Port Already in Use**:
   - Change the port in `main.ts` or kill existing processes
   - Default port is 3000

2. **WebSocket Connection Failed**:
   - Ensure the server is running (`npm run start:dev`)
   - Check browser console for errors
   - Verify CORS settings if testing from different domains

3. **High Memory Usage**:
   - Limit the number of test connections
   - Disable auto ping for extended testing
   - Restart the server periodically

### Performance Tips

- Use WebSocket transport instead of polling for better performance
- Limit message history to prevent memory leaks
- Monitor connection count to avoid server overload
- Use appropriate ping intervals for your testing needs

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is open source and available under the MIT License.
