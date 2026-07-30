import { POST } from './route';
import { NextRequest } from 'next/server';
import { describe, it, expect, vi } from 'vitest';

vi.mock('firebase/firestore', () => ({
  doc: vi.fn(),
  updateDoc: vi.fn(),
  increment: vi.fn(),
  getDoc: vi.fn(),
}));

vi.mock('@/lib/firebase', () => ({
  db: {},
}));

describe('POST /api/user/[uid]/coins', () => {
  it('should return 400 if amount or reason is missing', async () => {
    // Missing reason
    const req = new NextRequest('http://localhost/api/user/test-user/coins', {
      method: 'POST',
      body: JSON.stringify({ amount: 10 }),
    });
    let response = await POST(req, { params: Promise.resolve({ uid: 'test-user' }) } as any);
    expect(response.status).toBe(400);
    let data = await response.json();
    expect(data.error).toBe('Amount and reason required');

    // Missing amount
    const req2 = new NextRequest('http://localhost/api/user/test-user/coins', {
      method: 'POST',
      body: JSON.stringify({ reason: 'test' }),
    });
    response = await POST(req2, { params: Promise.resolve({ uid: 'test-user' }) } as any);
    expect(response.status).toBe(400);
    data = await response.json();
    expect(data.error).toBe('Amount and reason required');

    // Both missing
    const req3 = new NextRequest('http://localhost/api/user/test-user/coins', {
      method: 'POST',
      body: JSON.stringify({}),
    });
    response = await POST(req3, { params: Promise.resolve({ uid: 'test-user' }) } as any);
    expect(response.status).toBe(400);
    data = await response.json();
    expect(data.error).toBe('Amount and reason required');
  });
});
