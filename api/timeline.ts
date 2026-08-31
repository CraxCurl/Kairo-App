import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDatabase } from './db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const db = await getDatabase();
  if (!db) {
    return res.status(200).json({ connected: false, data: [] });
  }

  const timelineCollection = db.collection('timeline');

  try {
    if (req.method === 'GET') {
      const events = await timelineCollection.find({}).sort({ timestamp: -1 }).limit(50).toArray();
      return res.status(200).json({ connected: true, data: events });
    }

    if (req.method === 'POST') {
      const newEvent = req.body;
      await timelineCollection.insertOne({
        ...newEvent,
        createdAt: new Date().toISOString()
      });
      return res.status(201).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}
