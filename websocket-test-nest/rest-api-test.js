const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// REST API test for WebSocket control
async function testRESTAPI() {
  console.log('🔧 REST API WebSocket Control Test');
  console.log('==================================');

  const BASE_URL = 'http://localhost:3000';

  try {
    // Test 1: Get server status
    console.log('\n📊 Test 1: Get Server Status');
    const statusResponse = await fetch(`${BASE_URL}/websocket`);
    const statusData = await statusResponse.json();
    console.log(`   Active connections: ${statusData.data.connectionCount}`);
    console.log(`   Message history: ${statusData.data.messageHistory.length} messages`);

    // Test 2: Get connections
    console.log('\n📋 Test 2: Get Active Connections');
    const connectionsResponse = await fetch(`${BASE_URL}/websocket/connections`);
    const connectionsData = await connectionsResponse.json();
    console.log(`   Total connections: ${connectionsData.data.count}`);
    
    if (connectionsData.data.connections.length > 0) {
      console.log(`   First connection ID: ${connectionsData.data.connections[0].id}`);
    }

    // Test 3: Broadcast message via REST API
    console.log('\n📢 Test 3: Broadcast Message via REST API');
    const broadcastResponse = await fetch(`${BASE_URL}/websocket/broadcast`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event: 'message',
        data: { message: 'Hello from REST API broadcast!' }
      })
    });
    const broadcastData = await broadcastResponse.json();
    console.log(`   Result: ${broadcastData.message}`);

    // Test 4: Send message to specific connection (if any exists)
    if (connectionsData.data.connections.length > 0) {
      const connectionId = connectionsData.data.connections[0].id;
      console.log(`\n📤 Test 4: Send Message to Connection ${connectionId}`);
      
      const sendResponse = await fetch(`${BASE_URL}/websocket/connections/${connectionId}/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'message',
          data: { message: 'Hello specific connection from REST API!' }
        })
      });
      const sendData = await sendResponse.json();
      console.log(`   Result: ${sendData.message}`);
    }

    // Test 5: Get recent messages
    console.log('\n📝 Test 5: Get Recent Messages');
    const messagesResponse = await fetch(`${BASE_URL}/websocket/messages`);
    const messagesData = await messagesResponse.json();
    console.log(`   Recent messages: ${messagesData.data?.count || 0}`);
    
    if (messagesData.data?.messages?.length > 0) {
      const lastMessage = messagesData.data.messages[messagesData.data.messages.length - 1];
      console.log(`   Last message: ${lastMessage.event} - ${JSON.stringify(lastMessage.data)}`);
    } else {
      console.log('   No recent messages');
    }

    // Test 6: Health check
    console.log('\n❤️ Test 6: Health Check');
    const healthResponse = await fetch(`${BASE_URL}/health`);
    const healthData = await healthResponse.json();
    console.log(`   Status: ${healthData.status}`);
    console.log(`   Uptime: ${healthData.uptime.toFixed(2)} seconds`);

    console.log('\n✅ All REST API tests completed successfully!');

  } catch (error) {
    console.error('❌ REST API test failed:', error.message);
  }
}

// Run the test
testRESTAPI().catch(console.error); 