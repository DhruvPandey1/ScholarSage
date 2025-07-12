const request = require('supertest');
const app = require('../server'); // Adjust the path to your Express app

describe('Rate Limiting - test environment (2s window, 3 max requests)', () => {
  it('should allow 3 requests and block the 4th within the window', async () => {
    const agent = request.agent(app);

    // Send 3 successful requests
    for (let i = 1; i <= 3; i++) {
      const res = await agent.get('/test');
      expect(res.statusCode).toBe(200);
      expect(res.text).toBe('OK');
    }

    // 4th request should be rate limited
    const resLimited = await agent.get('/test');
    expect(resLimited.statusCode).toBe(429); // Too Many Requests
    expect(resLimited.text.toLowerCase()).toMatch(/too many requests/);
  });

  it('should reset rate limit after windowMs', async () => {
    const agent = request.agent(app);

    // Hit the rate limit
    for (let i = 1; i <= 3; i++) {
      await agent.get('/test');
    }
    await agent.get('/test'); // Blocked

    // Wait for the window to reset (2 seconds + small buffer)
    await new Promise(resolve => setTimeout(resolve, 2100));

    // Should be allowed again
    const res = await agent.get('/test');
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe('OK');
  });
});