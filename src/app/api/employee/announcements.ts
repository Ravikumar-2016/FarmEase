import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const client = await clientPromise;
    const db = client.db('FarmEase');

    if (req.method === 'GET') {
      const announcements = await db
        .collection('announcements')
        .find({ isActive: true })
        .sort({ createdAt: -1 })
        .toArray();
      res.status(200).json(announcements);
    } else if (req.method === 'POST') {
      const { title, message, type } = req.body;

      if (!title || !message || !type) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const newAnnouncement = {
        title,
        message,
        type,
        isActive: true,
        createdAt: new Date().toISOString()
      };

      const result = await db.collection('announcements').insertOne(newAnnouncement);
      res.status(201).json({ ...newAnnouncement, _id: result.insertedId });
    } else {
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}