const { createClient } = require('redis');

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://127.0.0.1:6379',
  socket: {
    reconnectStrategy: (retries) => {
      // Cap reconnect spam while Redis is down; keep trying every 5s
      if (retries > 20) {
        return 5000;
      }
      return Math.min(retries * 200, 3000);
    },
  },
});

let lastRedisErrorLog = 0;
redisClient.on('error', (error) => {
  const now = Date.now();
  // Throttle noisy ECONNREFUSED logs so startup stays readable
  if (now - lastRedisErrorLog < 10000) {
    return;
  }
  lastRedisErrorLog = now;
  console.error('Redis Client Error:', error.message || error);
});

redisClient.on('connect', () => {
  console.log('✅ Redis connected');
});

(async () => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }
  } catch (error) {
    console.warn(
      '⚠️  Redis is unavailable at startup. OTP/session features need Redis running.'
    );
    console.warn(`   ${error.message}`);
  }
})();

module.exports = redisClient;
