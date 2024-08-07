#!/usr/bin/env node

/**
 * Copyright (c) Uxtely LLC. All rights reserved.
 * Licensed under the ISC license found in the LICENSE
 * file in the root directory of this source tree.
 */

/**
 * This program:
 * - On init, watches the directory of the passed-in stylesheet.
 * - On sheet edit, compiles and pushes the CSS to the connected Uxtly app(s).
 */
const usage = `
Usage Example:
  ./connect.js my-styles.less
Supported Extensions: css, less, scss`

process.on('unhandledRejection', error => { throw error })

const fs = require('node:fs')
const path = require('node:path')
const server = require('node:http').createServer()
const watch = require('node-watch')
const WebSocketServer = require('ws').Server
const sass = require('util').promisify(require('sass').render)
const less = require('less').render

const PORT = 29924 // Allowed in CSP
const DEFAULT_TEMPLATE = 'default-template.css'
const COMPILATION_FAILURE_CODE = '0'
const ALLOWED_ORIGIN = process.env.UXTELY_SKIP_ORIGIN_CHECK === 'yes'
	? '' // Only for running tests
	: 'https://my.uxtly.com'


const compilers = new Map([
	['.css', file => fs.promises.readFile(file, 'utf8')],

	['.less', file => fs.promises.readFile(file, 'utf8')
		.then(styles => less(styles, { filename: file }))
		.then(res => res.css)],

	['.scss', file => sass({ file })
		.then(res => res.css.toString())]
])

const sheetPath = path.resolve(process.argv[2] || '')
const sheetDir = path.dirname(sheetPath)
const compiler = compilers.get(path.extname(sheetPath))

if (!compiler) {
	console.error(usage)
	process.exitCode = 1
}

let error = ensureSheetExists()
if (error) {
	console.error('ERROR:', error)
	process.exitCode = 1
}
else
	init()


function ensureSheetExists() {
	if (!fs.existsSync(sheetDir))
		fs.mkdirSync(sheetDir, { recursive: true })

	if (!fs.lstatSync(sheetDir).isDirectory())
		return 'Your desired directory name is not available'

	if (!fs.existsSync(sheetPath))
		fs.copyFileSync(DEFAULT_TEMPLATE, sheetPath)

	if (!fs.lstatSync(sheetPath).isFile())
		return 'Your desired stylesheet name is not available'
}

function init() {
	const connections = new Set()

	function compileAndNotify() {
		compiler(sheetPath)
			.then(css => {
				connections.forEach(ws => ws.send(css))
			})
			.catch(error => {
				connections.forEach(ws => ws.send(COMPILATION_FAILURE_CODE))
				console.info(error)
			})
	}

	const watcher = watch(sheetDir, compileAndNotify)
	watcher.on('error', console.error)
	watcher.on('ready', () => {
		new WebSocketServer({
			server,
			verifyClient: ({ origin = '' }) => ALLOWED_ORIGIN === origin
		})
			.on('connection', ws => {
				connections.add(ws)
				ws.on('close', () => { connections.delete(ws) })
				ws.on('error', () => { connections.delete(ws), ws.terminate() })
				compileAndNotify()
			})

		server.listen(PORT, 'localhost', error => {
			if (error) {
				console.error(error)
				watcher.close()
			}
			else
				console.log('Ready. Watching Directory…\n', sheetDir)
		})
	})
}

