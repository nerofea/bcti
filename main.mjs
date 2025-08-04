import fs from 'fs';
import * as Client from '@storacha/client';
import path from 'path';
import { fileURLToPath } from 'url';

import { createApp, start } from './server/server.mjs';        // uses express inside
import { mountStatic } from './server/static-routes.mjs';
import { mountZKLogin } from './jr_login.mjs';
import expectedDecRouter from './api/expected-dec.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ✅ use your modular server correctly
const app = createApp();

// ✅ mount middleware and routes
app.use(expectedDecRouter);
mountStatic(app);
mountZKLogin(app, {
  profilesDir: path.join(__dirname, 'input'),
  circuitDir: path.join(__dirname, 'noirCircuits', `${username}_login_check`)
});

// ✅ start server
start(app, 3000);

// ✅ run supporting async modules
;(async () => {
  await import('./agent_login.mjs');
  await import('./generateJnrProfile.js');
  await import('./jr_login.mjs');
  await import('./ripple_journalist_dashboard.mjs');
})();
