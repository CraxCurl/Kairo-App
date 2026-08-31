import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDatabase } from './db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const db = await getDatabase();
  if (!db) {
    return res.status(200).json({ connected: false });
  }

  const laptopCollection = db.collection('laptop_state');

  try {
    if (req.method === 'GET') {
      const state = await laptopCollection.findOne({ type: 'current' });
      return res.status(200).json({ connected: true, data: state });
    }

    if (req.method === 'POST' || req.method === 'PUT') {
      const updates = req.body;
      await laptopCollection.updateOne(
        { type: 'current' },
        { $set: { ...updates, type: 'current', updatedAt: new Date().toISOString() } },
        { upsert: true }
      );
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}
