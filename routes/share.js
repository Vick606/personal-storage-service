const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { isAuthenticated } = require('../middlewares/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Generate share link
router.post('/:folderId', isAuthenticated, async (req, res) => {
  const { folderId } = req.params;
  const { duration } = req.body;

  try {
    const folder = await prisma.folder.findFirst({
      where: { id: parseInt(folderId), userId: req.user.id },
    });

    if (!folder) {
      return res.status(404).json({ message: 'Folder not found' });
    }

    const durationInDays = parseInt(duration);
    if (isNaN(durationInDays) || durationInDays <= 0) {
      return res.status(400).json({ message: 'Invalid duration' });
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + durationInDays);

    const sharedFolder = await prisma.sharedFolder.create({
      data: {
        folderId: folder.id,
        expiresAt,
      },
    });

    const shareLink = `${req.protocol}://${req.get('host')}/share/${sharedFolder.id}`;
    res.json({ shareLink });
  } catch (error) {
    res.status(500).json({ message: 'Error creating share link', error });
  }
});

// Access shared folder
router.get('/:shareId', async (req, res) => {
  const { shareId } = req.params;

  try {
    const sharedFolder = await prisma.sharedFolder.findUnique({
      where: { id: shareId },
      include: { folder: { include: { files: true } } },
    });

    if (!sharedFolder || sharedFolder.expiresAt < new Date()) {
      return res.status(404).render('error', { message: 'Shared folder not found or link expired' });
    }

    res.render('sharedFolder', { sharedFolder });
  } catch (error) {
    res.status(500).render('error', { message: 'Error accessing shared folder', error });
  }
});

module.exports = router;