import fs from 'fs'
import * as Client from '@storacha/client'
//import { ShardedDAGIndex } from '@storacha/blob-index'
//import { base58btc } from 'multiformats/bases/base58'
//import { CID } from 'multiformats/cid'

;(async () => {
  const { File } = await import('fetch-blob')

  console.log("Creating client...");
  const client = await Client.create()

  console.log("Logging in...");
  await client.login('nerofea.official@gmail.com')
  console.log("Logged in!");

  // the registry of compressed jr profle info
  const spaceDid = 'did:key:z6Mkuye9aTK2CbNiAxSwXfbChhW64cVyz3MegGbtG7zv3nzo'
  await client.setCurrentSpace(spaceDid)
  const space = client.currentSpace()
  console.log("Space set and active to work with!");

  // Create user Alice with password hashed in SHA-256
  // Create user Bob with password hashed in SHA-256 and salted
  // Create user Clara with password hashed in SHA-256 
  await import('./generateJnrProfile.js')

  console.log("Retrieving Alice...");
  const aliceBuffer = fs.readFileSync('./journalist_registry_compressed/alice.json.gz')
  console.log("Alice retrieved, saving into registry space");

  const blob = new Blob([aliceBuffer], { type: 'application/gzip' })

  const aliceCID = await client.uploadFile(blob)
  console.log("✅ Alice blob added with CID:", aliceCID.toString())

  if (!aliceCID) throw new Error("❌ digestAlice.link is undefined")


    // To DO not working and we need it for the recording of a closed session
  result = await client.capability.blob.list()

  // List all blobs
  for (const entry of result.results) {
    const { digest, size } = entry.blob
    const base64Digest = Buffer.from(digest).toString('base64') // or hex/base58 if needed

    console.log("🧩 Digest (base64):", base64Digest)
    console.log("📄 Size:", size)
  }

  // TO DO NOT YET CONNECTED HERE 
   // the decompress jr profile cylo
  const spaceDid = 'did:key:z6Mki3eLdFDNcpso1hy7vZfRLsyKc5ZcSiTRvFfqeqAohBLm'
  await client.setCurrentSpace(spaceDid)
  const space = client.currentSpace()
  console.log("Space set and active to work with!");

  // Initialize the Noir ZK'd jr user 
  await import('./setupCircuit.mjs');
  // Overwrite the ZK noir circuit function with the ZK password hash logic (hashed password)
  await import('./overwriteCircuit.mjs')

  // Request for password 
 
  // Check hash of password matches with the zk circuit.  
  const { verifyPassword } = await import('./passwordMatchCheck.mjs')
  
  // Alice (unsalted)
  await verifyPassword('./input/alice.json', 'alice_login_check.nr', 'alice_login_check.vkey')

  // Bob (salted)
  await verifyPassword('./input/bob.json', 'bob_login_check.nr', 'bob_login_check.vkey', true)

  // Clara (unsalted)
  await verifyPassword('./input/clara.json', 'clara_login_check.nr', 'clara_login_check.vkey')


  // the multi-sig contract registry
  //const spaceDid = 'did:key:z6MkoCbvC14Xb4hhUhWP9Bh8w5oYLPsx21HxtnowujnX4fcj'
  //await client.setCurrentSpace(spaceDid)
  //const space = client.currentSpace()
  //console.log("Space set and active to work with!");


  // Upload Bob
  //const bobBuffer = fs.readFileSync('./journalist_registry_compressed/bob.json.gz')
  //const bobDigest = await client.capability.blob.add(new Blob([bobBuffer]))
  //const bobCID = bobDigest.link
  //if (!bobCID) throw new Error("❌ bobCID is undefined")
  //await client.capability.upload.add(bobCID, [bobCID])
  //console.log("✅ Bob uploaded with CID:", bobCID.toString())

  // Upload Clara
  //const claraBuffer = fs.readFileSync('./journalist_registry_compressed/clara.json.gz')
  //const claraDigest = await client.capability.blob.add(new Blob([claraBuffer]))
  //const claraCID = claraDigest.link
  //if (!claraCID) throw new Error("❌ claraCID is undefined")
  //await client.capability.upload.add(claraCID, [claraCID])
  //console.log("✅ Clara uploaded with CID:", claraCID.toString())





  // the draft articles registry
  //const spaceDid = 'did:key:z6MkoHD4XS9Eti6uAV2DyeXQpvtummWwECpxCmPUycCbnLRu'
  //await client.setCurrentSpace(spaceDid)
  //const space = client.currentSpace()
  //console.log("Space set and active to work with!");


  // the finalized articles registry
  //const spaceDid = 'did:key:z6Mkjy2ChY7hoZe8UdZSnNHFU2VfycupW7iiA3qFXLBwRSqD'
  //await client.setCurrentSpace(spaceDid)
  //const space = client.currentSpace()
  //console.log("Space set and active to work with!");


  // the published articles registry
  //const spaceDid = 'did:key:z6MkjDLtwJerfByhAbhpNHq1trAmjaCsgJNE1gDBCVGGDCwF'
  //await client.setCurrentSpace(spaceDid)
  //const space = client.currentSpace()
  //console.log("Space set and active to work with!");



  

})()
