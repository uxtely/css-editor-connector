/**
 * Copyright (c) Uxtely LLC. All rights reserved.
 * Licensed under the ISC license found in the LICENSE
 * file in the root directory of this source tree.
 */

const {
	run, onWebSocketMessage, write,
	remove, printOK, strictEqual
} = require('./utils.js');


const SHEET_IMPORT = '__Uxtely_Import_Test__.less';
const SHEET = '__Uxtely_Test__.less';

write(SHEET_IMPORT, `
@color: red;
`);

write(SHEET, `
@import "${SHEET_IMPORT}";
.Red { color: @color }
`);

const EXPECTED = `.Red {
  color: red;
}
`;

const connector = run(SHEET, () => {
	const ws = onWebSocketMessage(css => {
		strictEqual(css, EXPECTED);
		printOK('Compiles Less');

		ws.close();
		connector.kill();
		remove(SHEET, SHEET_IMPORT);
	})
})

