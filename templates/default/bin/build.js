import copy from './plugins/copy.js'
import multiloader from './plugins/multiloader.js'
import report from './plugins/report.js'
import { context, build } from 'esbuild'
import fs, { ensureDir, ensureSymlink } from 'fs-extra'
import { glob } from 'glob'
import 'dotenv/config'
import { resolve, join } from 'path'
import { platform, homedir } from 'os'

const outdir = 'build'
const devmode = process.env.NODE_ENV === 'development'
const { name, displayName, version } = await fs.readJson('./package.json')
const define = {
	DEVMODE: JSON.stringify(devmode),
	PRODUCT_NAME: JSON.stringify(name),
	PRODUCT_DISPLAY_NAME: JSON.stringify(displayName),
	PRODUCT_VERSION: JSON.stringify(version),
}

for (const key in process.env) {
	// NOTE: Ignores offending Windows keys
	const invalid = key.includes('(x86)')
	if (!invalid) {
		define[key] = JSON.stringify(process.env[key])
	}
}

try {
	const isMac = platform() === 'darwin'
	const appData = isMac ? '/Library/Application Support' : '/AppData/Roaming'
	const scriptPath = join(
		homedir(),
		appData,
		'Cavalry',
		'Scripts',
		displayName
	)
	await ensureDir(outdir)
	await ensureSymlink(resolve(outdir), scriptPath)
} catch (error) {
	console.log(error)
}

const options = {
	define,
	outdir,
	bundle: true,
	logLevel: 'info',
	target: ['es2020'],
	platform: 'neutral',
	entryPoints: await glob('src/*.*(js|ts)'),
	minifyWhitespace: !devmode,
	minifyIdentifiers: !devmode,
	plugins: [
		multiloader({ name: displayName }),
		copy({ dest: outdir, ignore: ['release'] }),
		report(),
	],
}

if (devmode) {
	const ctx = await context()
	await ctx.watch()
} else {
	await build(options)
}
