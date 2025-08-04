import { exec } from 'child_process'
import path from 'path'
import { promises as fs } from 'fs'

const CIRCUIT_NAME = 'alice_login_check'
const CIRCUIT_DIR = path.join('./noirCircuits', CIRCUIT_NAME)
const TEMPLATE_PATH = path.join('./templates', 'registration_login_check.nr')


const runCommand = (cmd, cwd = '.') =>
new Promise((resolve, reject) => {
    exec(cmd, { cwd }, (error, stdout, stderr) => {
    if (error) reject(stderr || error.message)
    else resolve(stdout)
    })
})

// ZK'ing the jr password so that password match check can happen browser side without leakges 
async function setupCircuit() {
try {
    console.log('🔧 Creating circuit...')
    await runCommand(`nargo new ${CIRCUIT_NAME}`, './noirCircuits')

    console.log('📄 Copying main.nr...')
    await runCommand(`cp ${TEMPLATE_PATH} ${CIRCUIT_DIR}/src/main.nr`)

    console.log('🧠 Compiling...')
    await runCommand('nargo compile', CIRCUIT_DIR)

    console.log('✅ Circuit setup complete!')
} catch (err) {
    console.error('❌ Error:', err)
}
}

setupCircuit()
