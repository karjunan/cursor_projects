const io = require('socket.io-client');

// Configuration
const SERVER_URL = 'http://localhost:3000';
const TEST_DURATION = 30000; // 30 seconds
const MESSAGE_INTERVAL = 100; // 100ms between messages
const PING_INTERVAL = 1000; // 1 second between pings

class SingleConnectionTester {
  constructor() {
    this.socket = null;
    this.messageCount = 0;
    this.pingCount = 0;
    this.broadcastCount = 0;
    this.startTime = null;
    this.messageInterval = null;
    this.pingInterval = null;
    this.broadcastInterval = null;
  }

  async connect() {
    console.log('🔌 Connecting to WebSocket server...');
    
    this.socket = io(SERVER_URL, {
      transports: ['websocket', 'polling'],
      timeout: 5000
    });

    return new Promise((resolve, reject) => {
      this.socket.on('connect', () => {
        console.log(`✅ Connected! Connection ID: ${this.socket.id}`);
        this.startTime = Date.now();
        resolve();
      });

      this.socket.on('connect_error', (error) => {
        console.error('❌ Connection failed:', error.message);
        reject(error);
      });

      this.socket.on('disconnect', (reason) => {
        console.log(`🔌 Disconnected: ${reason}`);
      });

      this.socket.on('welcome', (data) => {
        console.log(`👋 Welcome message: ${data.message}`);
      });

      this.socket.on('pong', (data) => {
        console.log(`🏓 Pong received at ${new Date(data.timestamp).toLocaleTimeString()}`);
      });

      this.socket.on('broadcast', (data) => {
        console.log(`📢 Broadcast received from ${data.from}: ${data.message}`);
      });

      this.socket.on('userJoined', (data) => {
        console.log(`👤 User joined: ${data.connectionId} (Total: ${data.totalConnections})`);
      });

      this.socket.on('userLeft', (data) => {
        console.log(`👤 User left: ${data.connectionId} (Total: ${data.totalConnections})`);
      });
    });
  }

  startRapidMessageSending() {
    console.log(`📤 Starting rapid message sending (every ${MESSAGE_INTERVAL}ms)...`);
    
    this.messageInterval = setInterval(() => {
      const message = `Message #${++this.messageCount} at ${new Date().toLocaleTimeString()}`;
      this.socket.emit('message', { message });
      
      if (this.messageCount % 10 === 0) {
        console.log(`📤 Sent ${this.messageCount} messages`);
      }
    }, MESSAGE_INTERVAL);
  }

  startPingTesting() {
    console.log(`🏓 Starting ping testing (every ${PING_INTERVAL}ms)...`);
    
    this.pingInterval = setInterval(() => {
      this.socket.emit('ping', { timestamp: Date.now() });
      this.pingCount++;
      
      if (this.pingCount % 5 === 0) {
        console.log(`🏓 Sent ${this.pingCount} pings`);
      }
    }, PING_INTERVAL);
  }

  startBroadcastTesting() {
    console.log('📢 Starting broadcast testing (every 2 seconds)...');
    
    this.broadcastInterval = setInterval(() => {
      const message = `Broadcast #${++this.broadcastCount} at ${new Date().toLocaleTimeString()}`;
      this.socket.emit('broadcast', { message });
      console.log(`📢 Sent broadcast: ${message}`);
    }, 2000);
  }

  startMixedTesting() {
    console.log('🔄 Starting mixed testing (messages + pings + broadcasts)...');
    
    // Rapid messages
    this.messageInterval = setInterval(() => {
      const message = `Mixed message #${++this.messageCount}`;
      this.socket.emit('message', { message });
    }, 200);

    // Pings
    this.pingInterval = setInterval(() => {
      this.socket.emit('ping', { timestamp: Date.now() });
      this.pingCount++;
    }, 1500);

    // Broadcasts
    this.broadcastInterval = setInterval(() => {
      const message = `Mixed broadcast #${++this.broadcastCount}`;
      this.socket.emit('broadcast', { message });
    }, 3000);
  }

  startStressTesting() {
    console.log('💪 Starting stress testing (very rapid messages)...');
    
    this.messageInterval = setInterval(() => {
      const message = `Stress message #${++this.messageCount}`;
      this.socket.emit('message', { message });
    }, 50); // 20 messages per second

    this.pingInterval = setInterval(() => {
      this.socket.emit('ping', { timestamp: Date.now() });
      this.pingCount++;
    }, 500); // 2 pings per second
  }

  async testServerStatus() {
    try {
      console.log('📊 Checking server status...');
      const response = await fetch(`${SERVER_URL}/websocket`);
      const data = await response.json();
      
      console.log(`📊 Server Status:`);
      console.log(`   - Active connections: ${data.data.connectionCount}`);
      console.log(`   - Message history: ${data.data.messageHistory.length} messages`);
      
      return data;
    } catch (error) {
      console.error('❌ Failed to get server status:', error.message);
    }
  }

  async testRESTAPI() {
    console.log('🔧 Testing REST API endpoints...');
    
    try {
      // Test broadcast via REST API
      const broadcastResponse = await fetch(`${SERVER_URL}/websocket/broadcast`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'message',
          data: { message: 'Hello from REST API!' }
        })
      });
      
      const broadcastData = await broadcastResponse.json();
      console.log(`📢 REST API Broadcast: ${broadcastData.message}`);
      
      // Test getting connections
      const connectionsResponse = await fetch(`${SERVER_URL}/websocket/connections`);
      const connectionsData = await connectionsResponse.json();
      console.log(`📊 REST API Connections: ${connectionsData.data.count} active`);
      
    } catch (error) {
      console.error('❌ REST API test failed:', error.message);
    }
  }

  stopAllIntervals() {
    if (this.messageInterval) {
      clearInterval(this.messageInterval);
      this.messageInterval = null;
    }
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
    if (this.broadcastInterval) {
      clearInterval(this.broadcastInterval);
      this.broadcastInterval = null;
    }
  }

  async disconnect() {
    console.log('🔌 Disconnecting...');
    this.stopAllIntervals();
    
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  printStats() {
    const duration = Date.now() - this.startTime;
    console.log('\n📈 Test Statistics:');
    console.log(`   - Duration: ${duration}ms`);
    console.log(`   - Messages sent: ${this.messageCount}`);
    console.log(`   - Pings sent: ${this.pingCount}`);
    console.log(`   - Broadcasts sent: ${this.broadcastCount}`);
    console.log(`   - Total events: ${this.messageCount + this.pingCount + this.broadcastCount}`);
    console.log(`   - Events per second: ${((this.messageCount + this.pingCount + this.broadcastCount) / (duration / 1000)).toFixed(2)}`);
  }
}

// Test scenarios
async function runTest(testName, testFunction) {
  console.log(`\n🚀 Starting test: ${testName}`);
  console.log('='.repeat(50));
  
  const tester = new SingleConnectionTester();
  
  try {
    await tester.connect();
    await tester.testServerStatus();
    
    // Run the specific test
    await testFunction(tester);
    
    // Wait for test duration
    await new Promise(resolve => setTimeout(resolve, TEST_DURATION));
    
    // Test REST API
    await tester.testRESTAPI();
    
    // Print statistics
    tester.printStats();
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await tester.disconnect();
  }
}

// Main test runner
async function main() {
  console.log('🎯 Single Connection Multiple Sending Tests');
  console.log('==========================================');
  
  // Test 1: Rapid Message Sending
  await runTest('Rapid Message Sending', async (tester) => {
    tester.startRapidMessageSending();
  });
  
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Test 2: Ping Testing
  await runTest('Ping Testing', async (tester) => {
    tester.startPingTesting();
  });
  
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Test 3: Broadcast Testing
  await runTest('Broadcast Testing', async (tester) => {
    tester.startBroadcastTesting();
  });
  
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Test 4: Mixed Testing
  await runTest('Mixed Testing', async (tester) => {
    tester.startMixedTesting();
  });
  
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Test 5: Stress Testing
  await runTest('Stress Testing', async (tester) => {
    tester.startStressTesting();
  });
  
  console.log('\n✅ All tests completed!');
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Tests interrupted by user');
  process.exit(0);
});

// Run tests
main().catch(console.error); 