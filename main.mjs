import { createApp, start } from './server/server.mjs';

// Create and start the server
const app = createApp();
start(app, 3000);
