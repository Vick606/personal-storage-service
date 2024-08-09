const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { isAuthenticated } = require('../middlewares/auth');

const router = express.Router();
const prisma = new PrismaClient();

router.post('/', isAuthenticated, async (req, res) => {
  try {
    const folder = await prisma.folder.create({
      data: {
        name: req.body.name,
        userId: req.user.id,
      },
    });
    res.status(201).json(folder);
  } catch (error) {
    res.status(500).json({ message: 'Error creating folder', error });
  }
});

router.get('/', isAuthenticated, async (req, res) => {
  try {
    const folders = await prisma.folder.findMany({
      where: { userId: req.user.id },
      include: { files: true },
    });
    res.json(folders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching folders', error });
  }
});

router.get('/:id', isAuthenticated, async (req, res) => {
  try {
    const folder = await prisma.folder.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { files: true },
    });
    if (!folder || folder.userId !== req.user.id) {
      return res.status(404).json({ message: 'Folder not found' });
    }
    res.json(folder);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching folder', error });
  }
});

router.put('/:id', isAuthenticated, async (req, res) => {
  try {
    const folder = await prisma.folder.findUnique({
      where: { id: parseInt(req.params.id) },
    });
    if (!folder || folder.userId !== req.user.id) {
      return res.status(404).json({ message: 'Folder not found' });
    }
    const updatedFolder = await prisma.folder.update({
      where: { id: parseInt(req.params.id) },
      data: { name: req.body.name },
    });
    res.json(updatedFolder);
  } catch (error) {
    res.status(500).json({ message: 'Error updating folder', error });
  }
});

router.delete('/:id', isAuthenticated, async (req, res) => {
  try {
    const folder = await prisma.folder.findUnique({
      where: { id: parseInt(req.params.id) },
    });
    if (!folder || folder.userId !== req.user.id) {
      return res.status(404).json({ message: 'Folder not found' });
    }
    await prisma.folder.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.json({ message: 'Folder deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting folder', error });
  }
});

module.exports = router;