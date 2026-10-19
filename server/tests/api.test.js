import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../src/app.js';
import User from '../src/models/User.js';
import Vaccine from '../src/models/Vaccine.js';
import Record from '../src/models/Record.js';

let mongoServer;

describe('Vaxio Complete API & Business Logic Test Suite', () => {
  before(async () => {
    process.env.JWT_SECRET = 'test_secret_for_vaxio_testing_only';
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  });

  after(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
  });

  let user1Token;
  let user1Id;
  let user2Token;
  let user2Id;
  let createdVaccineId;

  // 1. User Registration & Validation
  test('POST /api/auth/register - Register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Alex Rivera',
        email: 'alex.rivera@example.com',
        password: 'securePassword123',
        phone: '+1-555-0199',
        bloodGroup: 'O+',
      });

    assert.equal(res.status, 201);
    assert.equal(res.body.success, true);
    assert.ok(res.body.token);
    assert.equal(res.body.user.email, 'alex.rivera@example.com');
    assert.equal(res.body.user.name, 'Alex Rivera');

    user1Token = res.body.token;
    user1Id = res.body.user._id;
  });

  test('POST /api/auth/register - Rejects duplicate email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Alex Duplicate',
        email: 'alex.rivera@example.com',
        password: 'anotherPassword123',
      });

    assert.equal(res.status, 400);
    assert.equal(res.body.success, false);
    assert.match(res.body.message, /already exists/i);
  });

  test('POST /api/auth/register - Rejects invalid email and short password', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Invalid Test',
        email: 'not-an-email',
        password: '123',
      });

    assert.equal(res.status, 400);
    assert.equal(res.body.success, false);
  });

  // 2. User Login & Credentials
  test('POST /api/auth/login - Log in with valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'alex.rivera@example.com',
        password: 'securePassword123',
      });

    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(res.body.token);
  });

  test('POST /api/auth/login - Rejects invalid password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'alex.rivera@example.com',
        password: 'wrongPassword999',
      });

    assert.equal(res.status, 401);
    assert.equal(res.body.success, false);
    assert.match(res.body.message, /invalid email or password/i);
  });

  // 3. Register second user for cross-user isolation testing
  test('Setup second user for isolation test', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Jordan Smith',
        email: 'jordan.smith@example.com',
        password: 'jordanPassword456',
      });

    assert.equal(res.status, 201);
    user2Token = res.body.token;
    user2Id = res.body.user._id;
  });

  // 4. Protected Routes
  test('GET /api/vaccines - Protected route rejects request without token', async () => {
    const res = await request(app).get('/api/vaccines');
    assert.equal(res.status, 401);
    assert.equal(res.body.success, false);
  });

  // 5. Vaccine Management
  test('POST /api/vaccines - Add an upcoming vaccination', async () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 14);

    const res = await request(app)
      .post('/api/vaccines')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        vaccineName: 'Tetanus Booster',
        targetDisease: 'Tetanus',
        doseNumber: 1,
        totalDoses: 1,
        scheduledDate: futureDate.toISOString(),
        notes: 'Routine 10-year booster',
      });

    assert.equal(res.status, 201);
    assert.equal(res.body.success, true);
    assert.equal(res.body.vaccine.vaccineName, 'Tetanus Booster');
    assert.equal(res.body.vaccine.status, 'upcoming');
    assert.equal(res.body.vaccine.isCompleted, false);

    createdVaccineId = res.body.vaccine._id;
  });

  test('POST /api/vaccines - Add an overdue vaccination', async () => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 10);

    const res = await request(app)
      .post('/api/vaccines')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        vaccineName: 'Hepatitis B',
        targetDisease: 'Hepatitis B',
        doseNumber: 2,
        totalDoses: 3,
        scheduledDate: pastDate.toISOString(),
        notes: 'Dose 2 overdue',
      });

    assert.equal(res.status, 201);
    assert.equal(res.body.vaccine.status, 'overdue');
  });

  test('GET /api/vaccines - View all user vaccinations', async () => {
    const res = await request(app)
      .get('/api/vaccines')
      .set('Authorization', `Bearer ${user1Token}`);

    assert.equal(res.status, 200);
    assert.equal(res.body.count, 2);
  });

  test('GET /api/vaccines/:id - View single vaccination', async () => {
    const res = await request(app)
      .get(`/api/vaccines/${createdVaccineId}`)
      .set('Authorization', `Bearer ${user1Token}`);

    assert.equal(res.status, 200);
    assert.equal(res.body.vaccine.vaccineName, 'Tetanus Booster');
  });

  test('PUT /api/vaccines/:id - Edit a vaccination', async () => {
    const res = await request(app)
      .put(`/api/vaccines/${createdVaccineId}`)
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        vaccineName: 'Tdap (Tetanus, Diphtheria, Pertussis)',
        notes: 'Updated to full Tdap formulation',
      });

    assert.equal(res.status, 200);
    assert.equal(res.body.vaccine.vaccineName, 'Tdap (Tetanus, Diphtheria, Pertussis)');
  });

  // 6. Cross-User Data Isolation
  test('Cross-user isolation: User 2 cannot view or edit User 1 vaccination', async () => {
    const viewRes = await request(app)
      .get(`/api/vaccines/${createdVaccineId}`)
      .set('Authorization', `Bearer ${user2Token}`);

    assert.equal(viewRes.status, 403);

    const editRes = await request(app)
      .put(`/api/vaccines/${createdVaccineId}`)
      .set('Authorization', `Bearer ${user2Token}`)
      .send({ vaccineName: 'Hacked Name' });

    assert.equal(editRes.status, 403);
  });

  // 7. Complete Vaccination & Synchronize Record
  test('PATCH /api/vaccines/:id/complete - Mark vaccination as completed', async () => {
    const administeredDate = new Date();

    const res = await request(app)
      .patch(`/api/vaccines/${createdVaccineId}/complete`)
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        administeredDate: administeredDate.toISOString(),
        administeredBy: 'Dr. Sarah Connor, Central Health Clinic',
        batchNumber: 'LOT-TX-9921',
        clinicLocation: 'Room 302, St. Jude Medical',
        notes: 'Administered without adverse reaction',
      });

    assert.equal(res.status, 200);
    assert.equal(res.body.vaccine.isCompleted, true);
    assert.equal(res.body.vaccine.status, 'completed');
    assert.ok(res.body.record);
    assert.equal(res.body.record.batchNumber, 'LOT-TX-9921');
  });

  test('GET /api/records - View vaccination records', async () => {
    const res = await request(app)
      .get('/api/records')
      .set('Authorization', `Bearer ${user1Token}`);

    assert.equal(res.status, 200);
    assert.equal(res.body.count, 1);
    assert.equal(res.body.records[0].batchNumber, 'LOT-TX-9921');
  });

  // 8. Prevent duplicate records on repeated completion
  test('PATCH /api/vaccines/:id/complete - Prevents duplicate completion records', async () => {
    await request(app)
      .patch(`/api/vaccines/${createdVaccineId}/complete`)
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        administeredDate: new Date().toISOString(),
        administeredBy: 'Dr. Sarah Connor',
      });

    const recordsRes = await request(app)
      .get('/api/records')
      .set('Authorization', `Bearer ${user1Token}`);

    assert.equal(recordsRes.body.count, 1); // Remains exactly 1 record!
  });

  // 9. Dashboard Statistics Calculation
  test('GET /api/vaccines/dashboard/stats - Real database-backed statistics', async () => {
    const res = await request(app)
      .get('/api/vaccines/dashboard/stats')
      .set('Authorization', `Bearer ${user1Token}`);

    assert.equal(res.status, 200);
    assert.equal(res.body.stats.totalVaccines, 2);
    assert.equal(res.body.stats.completedVaccinations, 1);
    assert.equal(res.body.stats.overdueVaccinations, 1);
    assert.equal(res.body.stats.upcomingVaccinations, 0);
    assert.equal(res.body.stats.completionRate, 50);
  });

  // 10. User Profile & Password
  test('GET /api/user/profile - Get user profile', async () => {
    const res = await request(app)
      .get('/api/user/profile')
      .set('Authorization', `Bearer ${user1Token}`);

    assert.equal(res.status, 200);
    assert.equal(res.body.user.email, 'alex.rivera@example.com');
  });

  test('PUT /api/user/profile - Update user profile', async () => {
    const res = await request(app)
      .put('/api/user/profile')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        name: 'Alex M. Rivera',
        phone: '+1-555-9988',
        bloodGroup: 'AB+',
      });

    assert.equal(res.status, 200);
    assert.equal(res.body.user.name, 'Alex M. Rivera');
    assert.equal(res.body.user.bloodGroup, 'AB+');
  });

  test('PUT /api/user/password - Change user password & login with new password', async () => {
    const changeRes = await request(app)
      .put('/api/user/password')
      .set('Authorization', `Bearer ${user1Token}`)
      .send({
        currentPassword: 'securePassword123',
        newPassword: 'brandNewPassword2026',
      });

    assert.equal(changeRes.status, 200);

    // Verify login with new password
    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'alex.rivera@example.com',
        password: 'brandNewPassword2026',
      });

    assert.equal(loginRes.status, 200);
    assert.ok(loginRes.body.token);
  });

  // 11. Delete Vaccination
  test('DELETE /api/vaccines/:id - Delete vaccination and clean records', async () => {
    const deleteRes = await request(app)
      .delete(`/api/vaccines/${createdVaccineId}`)
      .set('Authorization', `Bearer ${user1Token}`);

    assert.equal(deleteRes.status, 200);

    const getRes = await request(app)
      .get(`/api/vaccines/${createdVaccineId}`)
      .set('Authorization', `Bearer ${user1Token}`);

    assert.equal(getRes.status, 404);

    // Records should also be cleaned up
    const recordsRes = await request(app)
      .get('/api/records')
      .set('Authorization', `Bearer ${user1Token}`);

    assert.equal(recordsRes.body.count, 0);
  });
});
