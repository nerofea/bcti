import { UltraHonkBackend } from "@aztec/bb.js";
import { Noir } from "@noir-lang/noir_js";
import initNoirC from "@noir-lang/noirc_abi";
import initACVM from "@noir-lang/acvm_js";
import acvm from "@noir-lang/acvm_js/web/acvm_js_bg.wasm?url";
import noirc from "@noir-lang/noirc_abi/web/noirc_abi_wasm_bg.wasm?url";

// Initialize WASM modules
await Promise.all([initACVM(fetch(acvm)), initNoirC(fetch(noirc))]);

console.log('ZK Login System Loaded');

const form = document.getElementById('login-form');

// Helper function to convert hex string to byte array
function hexToBytes(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return Array.from(bytes);
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  console.log('Login attempt submitted');

  try {
    // 1) Read form values
    const data = new FormData(form);
    const username = data.get('username');
    const password = data.get('password');

    if (!username || !password) {
      throw new Error('Username and password are required');
    }

    // 2) Load user data directly from static file (no server needed!)
    const userResponse = await fetch(`/input/${username.toLowerCase()}.json`);
    if (!userResponse.ok) {
      throw new Error('User not found');
    }
    const userData = await userResponse.json();

    // 3) Load the pre-compiled circuit
    const circuitResponse = await fetch(`/noirCircuits/${username}_login_check/target/${username}_login_check.json`);
    if (!circuitResponse.ok) {
      throw new Error('ZK circuit not found for user');
    }
    const circuit = await circuitResponse.json();

    // 4) Compute password hash client-side
    const enc = new TextEncoder();
    const digest = new Uint8Array(await crypto.subtle.digest('SHA-256', enc.encode(password)));
    const attemptDec = Array.from(digest);

    // 5) Convert stored password hash to expected format
    const storedHash = userData.password_hash.replace('sha256:', '');
    const expectedDec = hexToBytes(storedHash);

    console.log('🔐 Generating ZK proof client-side...');

    // 6) Initialize Noir and Barretenberg
    const noir = new Noir(circuit);
    const backend = new UltraHonkBackend(circuit.bytecode);

    // 7) Execute circuit to get witness
    console.log('⏳ Generating witness...');
    const { witness } = await noir.execute({
      attemptHash: attemptDec,
      expectedHash: expectedDec
    });
    console.log('✅ Witness generated');

    // 8) Generate ZK proof
    console.log('⏳ Generating proof...');
    const proofStart = Date.now();
    const proof = await backend.generateProof(witness);
    const proofTime = Date.now() - proofStart;
    console.log(`✅ Proof generated in ${proofTime}ms`);
    // 9) Verify the proof
    console.log('⏳ Verifying proof...');
    const verifyStart = Date.now();
    const isValid = await backend.verifyProof(proof);
    const verifyTime = Date.now() - verifyStart;
    console.log(`✅ Proof verified in ${verifyTime}ms: ${isValid ? 'Valid' : 'Invalid'}`);

    if (isValid) {
      // 10) Success! No server authentication needed - ZK proof is the authentication
      alert(`✅ ZK Login Successful!\n\n🔐 Zero-Knowledge Proof Verified\n📋 Circuit: ${username}_login_check\n⏱️ Proof Generation: ${proofTime}ms\n🔍 Verification: ${verifyTime}ms\n\n💡 Your password was verified using ZK proofs!\n\n👤 Welcome, ${userData.journalist_name}!`);
      console.log('Login successful with ZK proof!');
    } else {
      throw new Error('ZK proof verification failed');
    }

  } catch (err) {
    console.error('Login error:', err);
    alert(`Error: ${err.message}`);
  } finally {
    form.reset();
  }
});