import fs from 'fs'
import zlib from 'zlib'
import crypto from 'crypto'
import { generateZKProof, verifyZKProof } from './zkUtils.js' // should use dynamic import or fix path

export async function verifyPassword(profile, circuitPath, vkeyPath) {
  const attemptHash = Array.isArray(profile.attempt_hash)
    ? profile.attempt_hash
    : Array.from(Buffer.from(profile.attempt_hash, 'hex'))

  const expectedHash = Array.isArray(profile.password_hash)
    ? profile.password_hash
    : Array.from(Buffer.from(profile.password_hash, 'hex'))

  const proof = await generateZKProof(circuitPath, {
    attemptHash,
    expectedHash
  })

  const isValid = await verifyZKProof(proof, vkeyPath)
  console.log(`✅ ZK Password Proof Verified:`, isValid)
  return isValid
}
