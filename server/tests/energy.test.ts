import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { createServer } from '../index';

describe('Energy API', () => {
  const app = createServer();

  it('GET /api/energy should return an array of energy records', async () => {
    const res = await request(app).get('/api/energy');
    
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('GET /api/energy/summary should return energy summary totals', async () => {
    const res = await request(app).get('/api/energy/summary');
    
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('total_electricity');
    expect(res.body).toHaveProperty('total_solar');
    expect(res.body).toHaveProperty('efficiency_score');
  });

  it('POST /api/energy should fail without authentication', async () => {
    const res = await request(app)
      .post('/api/energy')
      .send({
        building_name: "Test Building",
        electricity_kwh: 100,
        solar_kwh: 20,
        month: "March",
        year: 2026
      });
    
    expect(res.status).toBe(401); 
  });
});
