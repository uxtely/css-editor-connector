/**
 * Copyright (c) Uxtely LLC. All rights reserved.
 * Licensed under the ISC license found in the LICENSE
 * file in the root directory of this source tree.
 */

const fs = require('fs')
const { spawn } = require('child_process')
const { strictEqual } = require('assert')
const WebSocketClient = require('ws')


const CONNECTOR_ADDR = 'ws://localhost:29924'

module.exports = {
	run(stylesheet, onReady) {
		const connector = spawn('node', ['connect.js', stylesheet])

		connector.stdout.on('data', stream => {
			if (stream.toString().startsWith('Ready'))
				onReady()
		})

		return connector
	},

	onWebSocketMessage(onMessage) {
		const ws = new WebSocketClient(CONNECTOR_ADDR)
		ws.on('message', onMessage)
		return ws
	},

	read: file => fs.readFileSync(file, 'utf8'),
	write(file, data) { fs.writeFileSync(file, data, 'utf8') },
	append(file, data) { fs.appendFileSync(file, data, 'utf8') },
	remove(...files) { files.forEach(f => fs.unlinkSync(f)) },
	removeDir(...dirs) { dirs.forEach(d => fs.rmSync(d, { recursive: true })) },

	strictEqual,
	printOK(msg) { console.log('✓', msg) }
}
