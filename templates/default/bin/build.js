import copy from './plugins/copy.js'
import multiloader from './plugins/multiloader.js'
import report from './plugins/report.js'
import { context, build, formatMessages } from 'esbuild'
import fs, { ensureDir, ensureSymlink } from 'fs-extra'
import { existsSync, readdirSync } from 'fs'
import { glob } from 'glob'
import 'dotenv/config'
import { resolve, join } from 'path'
import { platform, homedir } from 'os'
import { lstat, unlink } from 'fs/promises'
import ora from 'ora'

const outdir = 'build'
const devmode = process.env.NODE_ENV === 'development'
const isMac = platform() === 'darwin'
const appData = isMac ? '/Library/Application Support' : '/AppData/Roaming'
const { name, displayName, version } = await fs.readJson('./package.json')
const scriptPath = join(homedir(), appData, 'Cavalry', 'Scripts', displayName)

try {
	if (existsSync(scriptPath)) {
		const link = await lstat(scriptPath)
		if (!link.isSymbolicLink() && readdirSync(scriptPath).length) {
			throw new Error(`Folder exists, please rename ${scriptPath}`)
		}
		await unlink(scriptPath)
	}
	await ensureDir(outdir)
	await ensureSymlink(resolve(outdir), scriptPath)
} catch (error) {
	const formatted = await formatMessages([{ text: error.message }], {
		kind: 'error',
		color: true,
	})
	console.error(formatted.join(''))
	process.exit(1)
}

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

const options = {
	define,
	outdir,
	bundle: true,
	target: ['es2020'],
	platform: 'neutral',
	entryPoints: await glob('src/*.*(js|ts)'),
	minifyWhitespace: !devmode,
	minifyIdentifiers: !devmode,
	plugins: [
		multiloader({ name: displayName }),
		copy({
			src: 'static/_assets',
			dest: `${outdir}/${displayName}_assets`,
			ignore: ['release'],
		}),
		report(),
	],
}

if (devmode) {
	const ctx = await context({ ...options, logLevel: 'info' })
	await ctx.watch()
} else {
	const spinner = ora('Building…\n')
	spinner.start()
	await build({ ...options, logLevel: 'warning' })
	spinner.succeed('Built')
}
