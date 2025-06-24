import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const client = await clientPromise;
    const db = client.db('FarmEase');

    if (req.method === 'GET') {
      const tasks = await db
        .collection('farmWorks')
        .find({ status: 'active' })
        .toArray();
      res.status(200).json(tasks);
    } else if (req.method === 'PATCH') {
      const { taskId } = req.query;
      const { action } = req.body;

      if (!['complete', 'cancel'].includes(action)) {
        return res.status(400).json({ message: 'Invalid action' });
      }

      const result = await db
        .collection('farmWorks')
        .updateOne(
          { _id: taskId },
          { $set: { status: action === 'complete' ? 'completed' : 'cancelled' } }
        );

      if (result.modifiedCount === 0) {
        return res.status(404).json({ message: 'Task not found' });
      }

      res.status(200).json({ message: 'Task updated successfully' });
    } else {
      res.setHeader('Allow', ['GET', 'PATCH']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}