console.log('hello');
//import { Noir } from "@noir-lang/noir_js";
//import { BarretenbergBackend } from '@noir-lang/backend_barretenberg'; 
//"@aztec/bb.js": "https://esm.sh/@aztec/bb.js@1.2.1?bundle&target=es2020&browser"
//import { Barretenberg} from '@aztec/bb.js'; 
import { Noir } from "https://esm.sh/@noir-lang/noir_js";
import { Barretenberg } from "https://esm.sh/@aztec/bb.js";


console.log('loaded script')
const form = document.getElementById('login-form');
const CIRCUIT_URL = (username) => `/circuits/${username}_login_check/target/${username}_login_check.json`;


form.addEventListener('submit', async (e) => {
  e.preventDefault();
  console.log('submitted');
  try {
    // 1) Read form values
    const data = new FormData(form);
    const username = data.get('username');
    const password = data.get('password');

    // 2) Compute attempt hash -> [u8;32]
    const enc = new TextEncoder();
    const digest = new Uint8Array(await crypto.subtle.digest('SHA-256', enc.encode(password)));
    const attemptDec = Array.from(digest);

    const attemptHex = attemptDec.map(b => b.toString(16).padStart(2, '0')).join('');
    await fetch(`/api/login-attempt/${username}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ attemptHashHex: attemptHex })
    });


    // 3) Fetch expectedDec (server must return { expectedDec: number[32] })
    const { expectedDec } =
      await fetch(`/api/expected-dec?u=${encodeURIComponent(username)}`).then(r => r.json());

    if (!Array.isArray(expectedDec) || expectedDec.length !== 32) {
      throw new Error('Invalid expectedDec from server');
    }

    // 4) Load circuit JSON
    const circuit = await fetch(CIRCUIT_URL(username)).then(r => r.json());

    // 5) Execute -> witness
    const noir = new Noir(circuit);
    //const backend = new BarretenbergBackend(circuit);
    const api = await Barretenberg.new({threads: 1});
    const witness = await noir.execute({
      attemptHash: attemptDec,   
      expectedHash: expectedDec
    });

    const input = new TextEncoder().encode(witness);
    const result = await api.blake2s(input);
    await api.destroy();

    // 6) Prove + verify in-browser
    const t0 = performance.now();
    const { proof, publicInputs } = await api.generateProof(witness);
    const ok = await api.verifyProof(proof, publicInputs);
    const duration = Math.round(performance.now() - t0);
    console.log('proveryverify(ms)', duration, 'ok=', ok);

    alert(ok ? '✅ Proof verified (hashes match)' : '❌ Verification failed');
  } catch (err) {
    console.error(err);
    alert('Error during prove/verify. See console.');
  } finally {
    form.reset();
  }


  console.log('attemptDec:', attemptDec);
  console.log('expectedDec:', expectedDec);
  console.log('witness:', witness);
});