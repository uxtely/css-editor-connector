/**
 * Copyright (c) Uxtely LLC. All rights reserved.
 * Licensed under the ISC license found in the LICENSE
 * file in the root directory of this source tree.
 */

const {
	run,
	write,
	printOK,
	strictEqual,
	makeTempDir,
	onWebSocketMessage
} = require('./utils.js')


const DIR = makeTempDir() + '/'
const SHEET = DIR + '__Uxtely_Test__.less'
write(SHEET, '.Red { color red }')

const EXPECTED_ERROR_CODE = '0'

const connector = run(SHEET, () => {
	const ws = onWebSocketMessage(css => {
		strictEqual(css, EXPECTED_ERROR_CODE)
		printOK('Notifies syntax errors')
		ws.close()
		connector.kill()
	})
})

