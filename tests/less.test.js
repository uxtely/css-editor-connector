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
const SHEET_IMPORT = DIR + '__Uxtely_Import_Test__.less'
const SHEET = DIR + '__Uxtely_Test__.less'

write(SHEET_IMPORT, `
@color: red;
`)

write(SHEET, `
@import "${SHEET_IMPORT}";
.Red { color: @color }
`)

const EXPECTED = `.Red {
  color: red;
}
`

const connector = run(SHEET, () => {
	const ws = onWebSocketMessage(css => {
		strictEqual(css, EXPECTED)
		printOK('Compiles Less')
		ws.close()
		connector.kill()
	})
})

