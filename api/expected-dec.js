// api/expected-dec.js
import fs from 'fs/promises';
import path from 'path';
import express from 'express';

const router = express.Router();

router.get('/api/expected-dec', async (req, res) => {
  const username = req.query.u;
  if (!username) return res.status(400).json({ error: 'Missing username' });

  const filePath = path.join('./input', `${username}.json`);
  try {
    const json = JSON.parse(await fs.readFile(filePath, 'utf8'));
    const passwordHash = json.password_hash;
    const expectedDec = passwordHash
      .replace(/^sha256:/, '')
      .match(/../g)
      .map(b => parseInt(b, 16));

    res.json({ expectedDec });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to read user data' });
  }
});

export default router;
