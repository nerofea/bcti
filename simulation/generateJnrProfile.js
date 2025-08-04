import fs from 'fs'
import crypto from 'crypto'
import path from 'path'
import zlib from 'zlib'

const OUTPUT_DIR = './input'

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true })

// Utility: SHA-256 hash + hex prefix
const hashPassword = (password) =>
  'sha256:' + crypto.createHash('sha256').update(password).digest('hex')

// Utility: Salted SHA-256
const hashPasswordWithSalt = (password, salt) => {
  const saltedInput = Buffer.concat([salt, Buffer.from(password)])
  return {
    salt: salt.toString('hex'),
    hash: 'sha256:' + crypto.createHash('sha256').update(saltedInput).digest('hex')
  }
}

// Utility: Write and compress JSON
function writeCompressedJson(name, data) {
  const json = JSON.stringify(data, null, 2)
  const gzipped = zlib.gzipSync(json)
  fs.writeFileSync(`${OUTPUT_DIR}/${name}.json.gz`, gzipped)
}

// ✅ Alice
const alice = {
  did: 'did:key:z6Mkf...abc123',
  ucan_permissions: ['upload', 'edit', 'publish'],
  journalist_name: 'Alice Example',
  auth_expiry: '2025-12-31T23:59:59Z',
  password_hash: hashPassword('alicepassword')
}
fs.writeFileSync(`${OUTPUT_DIR}/alice.json`, JSON.stringify(alice, null, 2))
writeCompressedJson('alice', alice)
console.log('✅ Alice profile written and compressed.')

// ✅ Bob
const bobSalt = crypto.randomBytes(16)
const bobHashed = hashPasswordWithSalt('bobpassword', bobSalt)
const bob = {
  did: 'did:key:z6Mkf...abc123',
  ucan_permissions: ['upload', 'edit', 'publish'],
  journalist_name: 'Bob Example',
  auth_expiry: '2025-12-31T23:59:59Z',
  password_hash: bobHashed.hash,
  salt: bobHashed.salt
}
fs.writeFileSync(`${OUTPUT_DIR}/bob.json`, JSON.stringify(bob, null, 2))
writeCompressedJson('bob', bob)
console.log('✅ Bob profile written and compressed.')

// ✅ Clara
const clara = {
  did: 'did:key:z6Mkf...abc123',
  wallet_address: '0x1234abcd5678efgh...',
  journalist_name: 'Clara Example',
  email: 'clara@example.com',
  password_hash: hashPassword('clarapassword'),
  auth_expiry: '2025-08-31T23:59:59Z',
  ucan_permissions: ['upload', 'edit', 'publish'],
  bio: 'Investigative journalist focused on transparency and blockchain.',
  credentials: ['member:IFJ', 'verified:PressPass', 'award:Pulitzer2022'],
  portfolio_links: [
    'https://clarareports.com/article1',
    'https://clarareports.com/article2'
  ],
  areas_of_expertise: ['blockchain', 'cybersecurity', 'elections'],
  website: 'https://clarareports.com',
  social_handles: {
    twitter: '@clara_journalist',
    mastodon: '@clara@journo.network',
    bluesky: '@clarareports.bsky.social'
  },
  referrals: [
    'did:key:z6Mkf...def456',
    'did:key:z6Mkf...xyz789'
  ],
  pgp_public_key: '-----BEGIN PGP PUBLIC KEY BLOCK-----\n...\n-----END PGP PUBLIC KEY BLOCK-----',
  region: 'Balkans',
  languages_spoken: ['English', 'Bulgarian', 'German'],
  preferred_topics: ['privacy', 'digital rights', 'open governance'],
  is_freelancer: true,
  company_affiliation: [
    { employer: 'Global Journalism Group' },
    { publisher: 'OpenNews Media' }
  ]
}
fs.writeFileSync(`${OUTPUT_DIR}/clara.json`, JSON.stringify(clara, null, 2))
writeCompressedJson('clara', clara)
console.log('✅ Clara profile written and compressed.')
