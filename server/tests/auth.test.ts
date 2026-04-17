import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { createServer } from '../index';

describe('Auth API', () => {
  const app = createServer();

  it('POST /api/login with invalid credentials should return 401', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({
        username: 'nonexistentuser',
        password: 'wrongpassword'
      });
    
    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Invalid username or password');
  });

  it('POST /api/register with missing fields should return 400', async () => {
    const res = await request(app)
      .post('/api/register')
      .send({
        username: 'newuser'
        // Missing name, email, password
      });
    
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('All fields are required');
  });
});
