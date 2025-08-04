import fs from 'fs'
import * as Space from '@storacha/capabilities/space'
import * as Store from '@storacha/capabilities/store'
import * as Top from '@storacha/capabilities/top'
import * as Types from '@storacha/capabilities/types'
import * as Upload from '@storacha/capabilities/upload'
import * as Utils from '@storacha/capabilities/utils'
import * as Plan from '@storacha/capabilities/plan'
import * as Filecoin from '@storacha/capabilities/filecoin'
import * as Aggregator from '@storacha/capabilities/filecoin/aggregator'
import * as DealTracker from '@storacha/capabilities/filecoin/deal-tracker'
import * as Dealer from '@storacha/capabilities/filecoin/dealer'
import * as Index from '@storacha/capabilities/space/index'

// This package has a "main" entrypoint but Storacha recommends the usage of the specific imports above

(async () => {

    console.log("Retrieving Alice...");
    const aliceBuffer = fs.readFileSync('./journalist_registry_compressed/alice.json.gz')
    console.log("Alice retrieved, saving into registry space");
    await client.capability.blob.add(new Blob([aliceBuffer]))
    //await space.put('alice.json.gz', aliceBuffer)
    console.log("Alice saved into registry.");

    
    console.log("Retrieving Bob...");
    const bobBuffer = fs.readFileSync('./journalist_registry_compressed/bob.json.gz')
    console.log("Bob retrieved, saving into registry space");
    await space.put('bob.json.gz', bobBuffer)
    console.log("Bob saved into registry.");

    const claraBuffer = fs.readFileSync('./journalist_registry_compressed/clara.json.gz')
    console.log("Clara retrieved, saving into registry space");
    await space.put('clara.json.gz', claraBuffer)
    console.log("Clara saved into registry.");


    // space.put generates a UCAN

})();
