import { Router } from 'express';
import prisma from '../db';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const deployment = await prisma.publishedDeployment.findUnique({
      where: { id: 'live' }
    });
    
    if (!deployment) {
      return res.status(404).json({ error: 'No published site found' });
    }

    res.json(deployment.data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch live site' });
  }
});

export default router;
