const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { PrismaClient } = require('@prisma/client');
const { isAuthenticated } = require('../middlewares/auth');

const router = express.Router();
const prisma = new PrismaClient();

const upload = multer({ dest: 'uploads/' });

router.post('/upload', isAuthenticated, upload.single('file'), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'personal_storage_service',
    });

    const file = await prisma.file.create({
      data: {
        name: req.file.originalname,
        path: result.secure_url,
        size: req.file.size,
        cloudinaryPublicId: result.public_id,
        userId: req.user.id,
        folderId: parseInt(req.body.folderId),
      },
    });

    res.json({ message: 'File uploaded successfully', file });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading file', error });
  }
});

router.get('/:id', isAuthenticated, async (req, res) => {
  try {
    const file = await prisma.file.findUnique({
      where: { id: parseInt(req.params.id) },
    });
    if (!file || file.userId !== req.user.id) {
      return res.status(404).json({ message: 'File not found' });
    }
    res.json(file);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching file', error });
  }
});

router.delete('/:id', isAuthenticated, async (req, res) => {
  try {
    const file = await prisma.file.findUnique({
      where: { id: parseInt(req.params.id) },
    });
    if (!file || file.userId !== req.user.id) {
      return res.status(404).json({ message: 'File not found' });
    }
    await cloudinary.uploader.destroy(file.cloudinaryPublicId);
    await prisma.file.delete({
      where: { id: parseInt(req.params.id) },
    });
    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting file', error });
  }
});

module.exports = router;