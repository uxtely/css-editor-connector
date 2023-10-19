const fs = require('fs')
const { run, write, strictEqual } = require('./utils.js')

const EXISTING_FILE = '__Uxtely_TestFileCreation__'
write(EXISTING_FILE, '')

const connector = run(EXISTING_FILE + '/foo.css', () => {})

connector.stderr.on('data', stream => {
	strictEqual(stream.toString(), 'ERROR: Your desired directory name is not available\n')
})

connector.on('exit', exitCode => {
	strictEqual(exitCode, 1)
	fs.rmSync(EXISTING_FILE)
})


