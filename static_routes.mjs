import express from 'express';
import path from 'path';
import { fileURLTOPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function mountStatic(app) {
    app.use(express.static(path.join(__dirname, 'public')));
    app.use('/circuits', express.static(path.join(__dirname, 'noirCircuits')));
}