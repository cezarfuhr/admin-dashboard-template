import request from 'supertest';
import app from '../index';

describe('Dashboard API', () => {
  let token: string;

  beforeAll(async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@example.com',
        password: 'admin123',
      });
    token = response.body.data.token;
  });

  describe('GET /api/dashboard/stats', () => {
    it('should get dashboard stats', async () => {
      const response = await request(app)
        .get('/api/dashboard/stats')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('totalUsers');
      expect(response.body.data).toHaveProperty('activeUsers');
      expect(response.body.data).toHaveProperty('revenue');
      expect(response.body.data).toHaveProperty('growth');
    });
  });

  describe('GET /api/dashboard/charts/:type', () => {
    it('should get revenue chart data', async () => {
      const response = await request(app)
        .get('/api/dashboard/charts/revenue')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data[0]).toHaveProperty('name');
      expect(response.body.data[0]).toHaveProperty('value');
    });

    it('should reject invalid chart type', async () => {
      const response = await request(app)
        .get('/api/dashboard/charts/invalid')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });
});
