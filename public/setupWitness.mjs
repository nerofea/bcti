// setupWitness.mjs
import { exec as _exec } from 'child_process';
import path from 'path';
import fs from 'fs/promises';

// Helper: Run a shell command
const runCommand = (cmd, cwd = '.') =>
  new Promise((resolve, reject) => {
    _exec(cmd, { cwd, maxBuffer: 10 * 1024 * 1024 }, (error, stdout, stderr) =>
      error ? reject(stderr || error.message) : resolve(stdout || stderr)
    );
  });

// Helper: Convert hex to decimal array
export function hexToDecimals(hex) {
  hex = String(hex).toLowerCase().replace(/^0x|^sha256:/, '');
  if (!/^[0-9a-f]{64}$/.test(hex)) throw new Error('Hash must be 32-byte hex (64 chars).');
  return hex.match(/../g).map(b => parseInt(b, 16));
}

// 🔧 Load expectedHash from JSON file and convert to decimal
export async function getExpectedHashFromFile(username) {
  const filePath = path.join('input', `${username}.json`);
  const json = JSON.parse(await fs.readFile(filePath, 'utf8'));
  return json.password_hash;
}

// Main: Write Prover.toml and run nargo
export async function createWitness({ username, attemptHex }) {
  const expectedHex = await getExpectedHashFromFile(username);
  const attemptDec = hexToDecimals(attemptHex);
  const expectedDec = hexToDecimals(expectedHex);

  const proverToml = `attemptHash = [${attemptDec.join(',')}]
expectedHash = [${expectedDec.join(',')}]
`;

  const circuitDir = path.join('./noirCircuits', 'alice_login_check');
  await fs.writeFile(path.join(circuitDir, 'Prover.toml'), proverToml, 'utf8');
  console.log('📝 Prover.toml written at', circuitDir);

  await runCommand('nargo execute', circuitDir);
  const targetDir = path.join(circuitDir, 'target');
  console.log('✅ Witness created in', targetDir);

  return targetDir;
}
