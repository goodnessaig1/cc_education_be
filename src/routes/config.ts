import { Router } from 'express';
import prisma from '../db';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const config = await prisma.siteConfig.findUnique({
      where: { id: 'default-config' }
    });
    // If no config exists, return default object instead of completely failing
    if (!config) {
      return res.json({
         id: 'default-config',
         layoutType: 'home1',
         siteTitle: 'Edulearn',
         logoUrl: null,
         faviconUrl: null,
         colors: {
           primary: "#ff3115",
           secondary: "#212121",
           bg: "#ffffff",
           text: "#000000"
         }
      });
    }
    res.json(config);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch config' });
  }
});

router.patch('/', async (req, res) => {
  try {
    const config = await prisma.siteConfig.upsert({
      where: { id: 'default-config' },
      update: req.body,
      create: {
        id: 'default-config',
        ...req.body
      }
    });
    res.json(config);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update config' });
  }
});

export default router;
