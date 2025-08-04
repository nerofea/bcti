// backend/jr_login.mjs
import { mountZKLogin } from './zk_mount.mjs';
import path from 'path';

export function mountJRLogin(app) {
  mountZKLogin(app, {
    profilesDir: path.join('input'), // where .json.gz profiles are stored
  });
}
