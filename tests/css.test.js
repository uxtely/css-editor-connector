/**
 * Copyright (c) Uxtely LLC. All rights reserved.
 * Licensed under the ISC license found in the LICENSE
 * file in the root directory of this source tree.
 */

const {
	run,
	read,
	append,
	remove,
	printOK,
	removeDir,
	strictEqual,
	onWebSocketMessage
} = require('./utils.js');


const DIR = '__Uxtely_Test_Dir__';
const SUBDIR = DIR + '/a';
const SHEET = SUBDIR + '/Test.css';
const INITIAL = read('default-template.css');
const APPENDED = '.Red { color: red }';

let testCount = 0;
const connector = run(SHEET, test);

const tests = [
	css => {
		strictEqual(css, INITIAL);
		printOK('Creates "dir/subdir/stylesheet.css" from the template');
		printOK('Sends CSS on connection');
		append(SHEET, APPENDED);
	},
	css => {
		strictEqual(css, INITIAL + APPENDED);
		printOK('Sends CSS on change');
	}
];

function test() {
	const ws = onWebSocketMessage(css => {
		tests[testCount++](css);

		if (testCount === tests.length) {
			ws.close();
			connector.kill();
			remove(SHEET);
			removeDir(SUBDIR, DIR);
		}
	})
}

