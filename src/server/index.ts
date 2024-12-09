import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

// Get all journal entries
app.get('/api/journal-entries', async (req, res) => {
  try {
    const entries = await prisma.journalEntry.findMany({
      orderBy: { timestamp: 'desc' },
    });
    res.json(entries);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch journal entries' });
  }
});

// Create a journal entry
app.post('/api/journal-entries', async (req, res) => {
  try {
    const { content, emotionLevel } = req.body;
    const entry = await prisma.journalEntry.create({
      data: { content, emotionLevel },
    });
    res.json(entry);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create journal entry' });
  }
});

// Update a journal entry
app.put('/api/journal-entries/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const entry = await prisma.journalEntry.update({
      where: { id },
      data: { content },
    });
    res.json(entry);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update journal entry' });
  }
});

// Delete a journal entry
app.delete('/api/journal-entries/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.journalEntry.delete({
      where: { id },
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete journal entry' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});