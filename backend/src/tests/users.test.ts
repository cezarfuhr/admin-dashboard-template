import request from 'supertest';
import app from '../index';

describe('Users API', () => {
  let adminToken: string;
  let userToken: string;

  beforeAll(async () => {
    // Login as admin
    const adminResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@example.com',
        password: 'admin123',
      });
    adminToken = adminResponse.body.data.token;

    // Login as regular user
    const userResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'john@example.com',
        password: 'user123',
      });
    userToken = userResponse.body.data.token;
  });

  describe('GET /api/users', () => {
    it('should get all users with valid token', async () => {
      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    it('should reject request without token', async () => {
      const response = await request(app).get('/api/users');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/users', () => {
    it('should allow admin to create user', async () => {
      const response = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'New User',
          email: `newuser${Date.now()}@example.com`,
          password: 'password123',
          role: 'user',
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe('New User');
    });

    it('should reject non-admin user creation', async () => {
      const response = await request(app)
        .post('/api/users')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          name: 'Unauthorized User',
          email: `unauth${Date.now()}@example.com`,
          password: 'password123',
        });

      expect(response.status).toBe(403);
      expect(response.body.error).toBe('Admin access required');
    });
  });
});
