const io = require('socket.io-client');

// Simple single connection test with multiple sending scenarios
async function testSingleConnectionMultipleSending() {
  console.log('🎯 Single Connection Multiple Sending Test');
  console.log('==========================================');

  const socket = io('http://localhost:3000', {
    transports: ['websocket', 'polling']
  });

  let messageCount = 0;
  let pingCount = 0;
  let broadcastCount = 0;

  // Set up event listeners
  socket.on('connect', () => {
    console.log(`✅ Connected! ID: ${socket.id}`);
    console.log('🚀 Starting multiple sending scenarios...\n');
    
    // Scenario 1: Rapid message sending
    console.log('📤 Scenario 1: Rapid Message Sending (10 messages every 100ms)');
    const messageInterval = setInterval(() => {
      const message = `Rapid message #${++messageCount}`;
      socket.emit('message', { message });
      console.log(`   Sent: ${message}`);
      
      if (messageCount >= 10) {
        clearInterval(messageInterval);
        console.log('   ✅ Rapid message sending completed\n');
        
        // Scenario 2: Ping testing
        console.log('🏓 Scenario 2: Ping Testing (5 pings every 500ms)');
        let pingSent = 0;
        const pingInterval = setInterval(() => {
          socket.emit('ping', { timestamp: Date.now() });
          console.log(`   Ping #${++pingSent} sent`);
          
          if (pingSent >= 5) {
            clearInterval(pingInterval);
            console.log('   ✅ Ping testing completed\n');
            
            // Scenario 3: Broadcast testing
            console.log('📢 Scenario 3: Broadcast Testing (3 broadcasts every 1s)');
            let broadcastSent = 0;
            const broadcastInterval = setInterval(() => {
              const broadcast = `Broadcast #${++broadcastSent} from single connection`;
              socket.emit('broadcast', { message: broadcast });
              console.log(`   Broadcast: ${broadcast}`);
              
              if (broadcastSent >= 3) {
                clearInterval(broadcastInterval);
                console.log('   ✅ Broadcast testing completed\n');
                
                // Scenario 4: Mixed sending
                console.log('🔄 Scenario 4: Mixed Sending (messages + pings + broadcasts)');
                let mixedCount = 0;
                const mixedInterval = setInterval(() => {
                  mixedCount++;
                  
                  // Send message
                  socket.emit('message', { message: `Mixed message #${mixedCount}` });
                  
                  // Send ping every 3rd iteration
                  if (mixedCount % 3 === 0) {
                    socket.emit('ping', { timestamp: Date.now() });
                  }
                  
                  // Send broadcast every 5th iteration
                  if (mixedCount % 5 === 0) {
                    socket.emit('broadcast', { message: `Mixed broadcast #${mixedCount}` });
                  }
                  
                  console.log(`   Mixed iteration #${mixedCount}`);
                  
                  if (mixedCount >= 15) {
                    clearInterval(mixedInterval);
                    console.log('   ✅ Mixed sending completed\n');
                    
                    // Scenario 5: Stress testing
                    console.log('💪 Scenario 5: Stress Testing (20 messages in 1 second)');
                    let stressCount = 0;
                    const stressInterval = setInterval(() => {
                      const stressMessage = `Stress message #${++stressCount}`;
                      socket.emit('message', { message: stressMessage });
                      
                      if (stressCount >= 20) {
                        clearInterval(stressInterval);
                        console.log('   ✅ Stress testing completed\n');
                        
                        // Final statistics
                        console.log('📊 Final Statistics:');
                        console.log(`   - Total messages sent: ${messageCount + 15 + 20}`);
                        console.log(`   - Total pings sent: ${pingSent + 5 + 4}`);
                        console.log(`   - Total broadcasts sent: ${broadcastSent + 3 + 3}`);
                        console.log(`   - Connection ID: ${socket.id}`);
                        
                        // Disconnect after 2 seconds
                        setTimeout(() => {
                          console.log('\n🔌 Disconnecting...');
                          socket.disconnect();
                          process.exit(0);
                        }, 2000);
                      }
                    }, 50); // 20 messages per second
                  }
                }, 200); // Every 200ms
              }
            }, 1000);
          }
        }, 500);
      }
    }, 100);
  });

  socket.on('disconnect', () => {
    console.log('🔌 Disconnected from server');
  });

  socket.on('welcome', (data) => {
    console.log(`👋 Welcome: ${data.message}`);
  });

  socket.on('pong', (data) => {
    console.log(`🏓 Pong received at ${new Date(data.timestamp).toLocaleTimeString()}`);
  });

  socket.on('broadcast', (data) => {
    console.log(`📢 Broadcast received from ${data.from}: ${data.message}`);
  });

  socket.on('connect_error', (error) => {
    console.error('❌ Connection failed:', error.message);
    process.exit(1);
  });
}

// Run the test
testSingleConnectionMultipleSending().catch(console.error); 