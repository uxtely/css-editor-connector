/**
 * Copyright (c) Uxtely LLC. All rights reserved.
 * Licensed under the ISC license found in the LICENSE
 * file in the root directory of this source tree.
 */

const {
	run,
	write,
	remove,
	printOK,
	strictEqual,
	onWebSocketMessage
} = require('./utils.js')


const SHEET_IMPORT = '__Uxtely_Import_Test__.scss'
const SHEET = '__Uxtely_Test__.scss'

write(SHEET_IMPORT, `
$color: red;
`)

write(SHEET, `
@import "${SHEET_IMPORT}";
.Red { color: $color }
`)

const EXPECTED = `.Red {
  color: red;
}`

const connector = run(SHEET, () => {
	const ws = onWebSocketMessage(css => {
		strictEqual(css, EXPECTED)
		printOK('Compiles SCSS')

		ws.close()
		connector.kill()
		remove(SHEET, SHEET_IMPORT)
	})
})

