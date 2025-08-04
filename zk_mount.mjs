// backend/zk_mount.mjs
import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

export function mountZKLogin(app, { profilesDir }) {
  // GET expected password hash
  app.get('/api/expected-dec', (req, res) => {
    try {
      const { u: username } = req.query;
      const file = path.join(profilesDir, `${username.toLowerCase()}.json.gz`);
      if (!fs.existsSync(file)) return res.status(404).json({});

      const profile = JSON.parse(zlib.gunzipSync(fs.readFileSync(file)).toString());
      const expectedHex = String(profile.password_hash || '').toLowerCase().replace(/^sha256:/, '');
      const expectedDec = expectedHex.match(/../g).map(b => parseInt(b, 16));

      res.json({ expectedDec });
    } catch (e) {
      console.error(e);
      res.status(500).json({});
    }
  });

  // POST login attempt (optional)
  app.post('/api/login-attempt/:username', (req, res) => {
    const { username } = req.params;
    const { attemptHashHex } = req.body || {};
    if (!username || !attemptHashHex) return res.status(400).json({ ok: false });

    console.log(`[zk login] User=${username} Attempt=${attemptHashHex}`);
    res.json({ ok: true }); // Here you'd verify proof later
  });
}
