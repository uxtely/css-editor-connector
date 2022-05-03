const fs = require('fs')
const { run, strictEqual } = require('./utils.js')

const EXISTING_DIR = '__Uxtely_TestDirCreation__.css'
fs.mkdirSync(EXISTING_DIR)

const connector = run(EXISTING_DIR, () => {})

connector.stderr.on('data', stream => {
	strictEqual(stream.toString(), 'ERROR: Your desired stylesheet name is not available\n')
})

connector.on('exit', exitCode => {
	strictEqual(exitCode, 1)
	fs.rmdirSync(EXISTING_DIR)
})


