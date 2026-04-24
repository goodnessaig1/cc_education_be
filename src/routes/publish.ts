import { Router } from 'express';
import prisma from '../db';

const router = Router();

router.post('/', async (req, res) => {
  try {
    // Collect all data
    const config = await prisma.siteConfig.findUnique({ where: { id: 'default-config' } });
    const pages = await prisma.page.findMany({
      include: {
        sections: {
          orderBy: { order: 'asc' }
        }
      }
    });

    const deploymentData = {
      config: config || {
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
      },
      pages
    };

    const deployment = await prisma.publishedDeployment.upsert({
      where: { id: 'live' },
      update: {
        data: deploymentData,
        publishedAt: new Date()
      },
      create: {
        id: 'live',
        data: deploymentData
      }
    });

    res.json({ success: true, publishedAt: deployment.publishedAt });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to publish site' });
  }
});

export default router;
