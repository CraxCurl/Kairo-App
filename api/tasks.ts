import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDatabase } from './db';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const db = await getDatabase();
  if (!db) {
    return res.status(200).json({
      connected: false,
      message: 'MongoDB URI not configured. Using client state.',
      data: []
    });
  }

  const tasksCollection = db.collection('tasks');

  try {
    if (req.method === 'GET') {
      const tasks = await tasksCollection.find({}).sort({ position: 1, createdAt: -1 }).toArray();
      return res.status(200).json({ connected: true, data: tasks });
    }

    if (req.method === 'POST') {
      const newTask = req.body;
      if (!newTask || !newTask.name) {
        return res.status(400).json({ error: 'Task name is required' });
      }
      await tasksCollection.insertOne({
        ...newTask,
        createdAt: newTask.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      return res.status(201).json({ success: true, task: newTask });
    }

    if (req.method === 'PUT') {
      const { id, updates, reorderedTasks } = req.body;

      if (reorderedTasks && Array.isArray(reorderedTasks)) {
        // Bulk update positions
        const operations = reorderedTasks.map((t: any, idx: number) => ({
          updateOne: {
            filter: { id: t.id },
            update: { $set: { position: idx, updatedAt: new Date().toISOString() } }
          }
        }));
        if (operations.length > 0) {
          await tasksCollection.bulkWrite(operations);
        }
        return res.status(200).json({ success: true });
      }

      if (id && updates) {
        await tasksCollection.updateOne(
          { id },
          { $set: { ...updates, updatedAt: new Date().toISOString() } }
        );
        return res.status(200).json({ success: true });
      }

      return res.status(400).json({ error: 'Invalid update payload' });
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({ error: 'Task ID is required' });
      }
      await tasksCollection.deleteOne({ id: String(id) });
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.error('API tasks error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
