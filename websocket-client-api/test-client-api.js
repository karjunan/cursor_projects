const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const BASE_URL = 'http://localhost:3001';

async function testClientAPI() {
  console.log('🧪 Testing WebSocket Client API');
  console.log('================================');

  try {
    // Test 1: Get API info
    console.log('\n📋 Test 1: Get API Information');
    const infoResponse = await fetch(`${BASE_URL}/`);
    const info = await infoResponse.json();
    console.log('API Info:', info.message);
    console.log('Description:', info.description);

    // Test 2: Check health
    console.log('\n❤️ Test 2: Health Check');
    const healthResponse = await fetch(`${BASE_URL}/api/health`);
    const health = await healthResponse.json();
    console.log('Health Status:', health.status);
    console.log('WebSocket Connected:', health.websocket.connected);
    console.log('Connection ID:', health.websocket.connectionId);

    // Test 3: Send a message
    console.log('\n📤 Test 3: Send Message');
    const messageResponse = await fetch(`${BASE_URL}/api/message`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Hello from REST API client!' })
    });
    const messageResult = await messageResponse.json();
    console.log('Message Result:', messageResult.success ? '✅ Success' : '❌ Failed');
    console.log('Response:', messageResult.message);

    // Test 4: Send a ping
    console.log('\n🏓 Test 4: Send Ping');
    const pingResponse = await fetch(`${BASE_URL}/api/ping`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({})
    });
    const pingResult = await pingResponse.json();
    console.log('Ping Result:', pingResult.success ? '✅ Success' : '❌ Failed');
    console.log('Response:', pingResult.message);

    // Test 5: Send a broadcast
    console.log('\n📢 Test 5: Send Broadcast');
    const broadcastResponse = await fetch(`${BASE_URL}/api/broadcast`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'Broadcast from REST API client!' })
    });
    const broadcastResult = await broadcastResponse.json();
    console.log('Broadcast Result:', broadcastResult.success ? '✅ Success' : '❌ Failed');
    console.log('Response:', broadcastResult.message);

    // Test 6: Get status
    console.log('\n📊 Test 6: Get Status');
    const statusResponse = await fetch(`${BASE_URL}/api/status`);
    const status = await statusResponse.json();
    console.log('Status Result:', status.success ? '✅ Success' : '❌ Failed');
    console.log('Client Connected:', status.data.client.connected);
    console.log('Server Connections:', status.data.server.connectionCount);

    // Test 7: Send bulk messages
    console.log('\n📦 Test 7: Send Bulk Messages');
    const bulkMessagesResponse = await fetch(`${BASE_URL}/api/bulk/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: [
          'Bulk message 1',
          'Bulk message 2',
          'Bulk message 3'
        ]
      })
    });
    const bulkMessagesResult = await bulkMessagesResponse.json();
    console.log('Bulk Messages Result:', bulkMessagesResult.success ? '✅ Success' : '❌ Failed');
    console.log('Total:', bulkMessagesResult.data.total);
    console.log('Successful:', bulkMessagesResult.data.successful);
    console.log('Failed:', bulkMessagesResult.data.failed);

    // Test 8: Send bulk pings
    console.log('\n🏓 Test 8: Send Bulk Pings');
    const bulkPingsResponse = await fetch(`${BASE_URL}/api/bulk/pings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ count: 3 })
    });
    const bulkPingsResult = await bulkPingsResponse.json();
    console.log('Bulk Pings Result:', bulkPingsResult.success ? '✅ Success' : '❌ Failed');
    console.log('Total:', bulkPingsResult.data.total);
    console.log('Successful:', bulkPingsResult.data.successful);
    console.log('Failed:', bulkPingsResult.data.failed);

    console.log('\n✅ All tests completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testClientAPI().catch(console.error); 