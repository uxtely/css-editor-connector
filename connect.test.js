#!/usr/bin/env node

/**
 * Copyright (c) Uxtely LLC. All rights reserved.
 * Licensed under the ISC license found in the LICENSE
 * file in the root directory of this source tree.
 */

const fs = require('fs');
const { spawnSync } = require('child_process');

process.env.AD_SKIP_ORIGIN_CHECK = 'yes';

for (const file of fs.readdirSync('tests'))
	if (file.endsWith('.test.js'))
		spawnSync('node', [`tests/${file}`], { stdio: 'inherit' });
