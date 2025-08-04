// main.mjs
import express from 'express';

export function createApp() {
  const app = express();
  app.use(express.json());
  return app;
}

export function start(app, port = 3000) {
  app.listen(port, () => console.log(`http://localhost:${port}`));
}

// enable multi-threaded wasm build
//app.use((red, red, next) => {
//  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
//  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
//  next();
//});