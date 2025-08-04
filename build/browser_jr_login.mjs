// public/browser_jr_login.mjs
import { Noir } from "https://esm.sh/@noir-lang/noir_js";
import { Barretenberg } from "https://esm.sh/@aztec/bb.js";
console.log("hello");
console.log("loaded script");
var form = document.getElementById("login-form");
var CIRCUIT_URL = (username) => `/circuits/${username}_login_check/target/${username}_login_check.json`;
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  console.log("submitted");
  try {
    const data = new FormData(form);
    const username = data.get("username");
    const password = data.get("password");
    const enc = new TextEncoder();
    const digest = new Uint8Array(await crypto.subtle.digest("SHA-256", enc.encode(password)));
    const attemptDec2 = Array.from(digest);
    const attemptHex = attemptDec2.map((b) => b.toString(16).padStart(2, "0")).join("");
    await fetch(`/api/login-attempt/${username}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ attemptHashHex: attemptHex })
    });
    const { expectedDec: expectedDec2 } = await fetch(`/api/expected-dec?u=${encodeURIComponent(username)}`).then((r) => r.json());
    if (!Array.isArray(expectedDec2) || expectedDec2.length !== 32) {
      throw new Error("Invalid expectedDec from server");
    }
    const circuit = await fetch(CIRCUIT_URL(username)).then((r) => r.json());
    const noir = new Noir(circuit);
    const api = await Barretenberg.new({ threads: 1 });
    const witness2 = await noir.execute({
      attemptHash: attemptDec2,
      expectedHash: expectedDec2
    });
    const input = new TextEncoder().encode(witness2);
    const result = await api.blake2s(input);
    await api.destroy();
    const t0 = performance.now();
    const { proof, publicInputs } = await api.generateProof(witness2);
    const ok = await api.verifyProof(proof, publicInputs);
    const duration = Math.round(performance.now() - t0);
    console.log("proveryverify(ms)", duration, "ok=", ok);
    alert(ok ? "\u2705 Proof verified (hashes match)" : "\u274C Verification failed");
  } catch (err) {
    console.error(err);
    alert("Error during prove/verify. See console.");
  } finally {
    form.reset();
  }
  console.log("attemptDec:", attemptDec);
  console.log("expectedDec:", expectedDec);
  console.log("witness:", witness);
});
//# sourceMappingURL=browser_jr_login.mjs.map
