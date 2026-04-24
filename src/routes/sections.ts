import { Router } from 'express';
import prisma from '../db';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const pageId = req.query.pageId as string;
    
    const sections = await prisma.section.findMany({
      where: pageId ? { pageId } : undefined,
      orderBy: { order: 'asc' }
    });
    res.json(sections);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch sections' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { type, pageId, order, variation, content } = req.body;
    const section = await prisma.section.create({
      data: {
        type,
        pageId,
        order: order || 10,
        variation: variation || 'style1',
        content: content || {},
        isVisible: true
      }
    });
    res.json(section);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create section' });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const section = await prisma.section.update({
      where: { id },
      data: req.body
    });
    res.json(section);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update section' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.section.delete({
      where: { id }
    });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete section' });
  }
});

export default router;
