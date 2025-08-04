import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function mountStatic(app) {
    const buildPath = path.join(__dirname, '..', 'build');
    console.log('[STATIC] Serving /build from:', buildPath);

    app.use(express.static(path.join(__dirname, 'public')));
    app.use('/circuits', express.static(path.join(__dirname, 'noirCircuits')));
    app.use('/build', express.static(buildPath));
}
