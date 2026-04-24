import { Router } from 'express';
import prisma from '../db';

const router = Router();

// Get all pages
router.get('/', async (req, res) => {
  try {
    const pages = await prisma.page.findMany({
      orderBy: { createdAt: 'asc' },
      include: {
        sections: {
          orderBy: { order: 'asc' }
        }
      }
    });
    res.json(pages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch pages' });
  }
});

// Create a new page and auto-seed default sections
router.post('/', async (req, res) => {
  try {
    const { name, slug } = req.body;
    
    // Create the page
    const page = await prisma.page.create({
      data: {
        name,
        slug
      }
    });

    // Auto-seed default sections: Infobar, Navbar, Footer
    await prisma.section.createMany({
      data: [
        {
          type: 'Infobar',
          pageId: page.id,
          order: 0,
          variation: 'style1',
          content: { text: "Contact Info Here", phone: "123-456-7890", email: "info@example.com" }
        },
        {
          type: 'Navbar',
          pageId: page.id,
          order: 1,
          variation: 'style1',
          content: { }
        },
        // We leave space for dynamic content to be appended with order > 1 but < 999
        {
          type: 'Footer',
          pageId: page.id,
          order: 999, // push to bottom
          variation: 'style1',
          content: { copyrightText: "© 2026 Edulearn. All rights reserved." }
        }
      ]
    });

    const populatedPage = await prisma.page.findUnique({
      where: { id: page.id },
      include: { sections: true }
    });

    res.json(populatedPage);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create page' });
  }
});

// Delete a page
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.page.delete({
      where: { id }
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete page' });
  }
});

export default router;
