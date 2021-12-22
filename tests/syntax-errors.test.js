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
} = require('./utils.js');


const SHEET = '__Uxtely_Test__.less';
write(SHEET, '.Red { color red }');

const EXPECTED_ERROR_CODE = '0';

const connector = run(SHEET, () => {
	const ws = onWebSocketMessage(css => {
		strictEqual(css, EXPECTED_ERROR_CODE);
		printOK('Notifies syntax errors');

		ws.close();
		connector.kill();
		remove(SHEET);
	});
});

