import { test } from 'node:test';
import { strictEqual, deepStrictEqual } from 'node:assert';
import verifyToken from '../middleware/verifyToken.js';
import isAdmin from '../middleware/isAdmin.js';
import { cancelReservation } from '../controllers/reservationController.js';
import User from '../models/User.js';
import Reservation from '../models/Reservation.js';

process.env.JWT_SECRET = 'testsecret';

const createRes = () => {
  const res = {};
  res.statusCode = 200;
  res.status = (code) => {
    res.statusCode = code;
    return res;
  };
  res.json = (data) => {
    res.data = data;
    return res;
  };
  return res;
};

test('verifyToken rejects missing token', async () => {
  const req = { cookies: {}, headers: {} };
  const res = createRes();
  let nextCalled = false;
  await verifyToken(req, res, () => { nextCalled = true; });
  strictEqual(nextCalled, false);
  strictEqual(res.statusCode, 401);
});

test('isAdmin rejects non-admin user', async () => {
  User.findByPk = async () => ({ id: 1, role: 'User' });
  const req = { userId: 1 };
  const res = createRes();
  let nextCalled = false;
  await isAdmin(req, res, () => { nextCalled = true; });
  strictEqual(nextCalled, false);
  strictEqual(res.statusCode, 403);
});

test('guest can cancel own reservation with matching contact', async () => {
  Reservation.findByPk = async () => ({
    id: 1,
    userId: null,
    guestEmail: null,
    guestPhone: '123',
    reservationTime: new Date().toISOString(),
    status: 'Pending',
    save: async function () { this.saved = true; },
  });

  const req = { params: { id: 1 }, body: { phone: '123' } };
  const res = createRes();

  await cancelReservation(req, res);

  strictEqual(res.statusCode, 200);
  deepStrictEqual(res.data?.message, 'Reservation cancelled successfully');
});
