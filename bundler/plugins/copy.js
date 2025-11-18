import { basename } from 'path'
import crypto from 'crypto'
import fs from 'fs'
import { readdir } from 'fs/promises'

// Based on esbuild-copy-static-files with the added option to ignore files
// https://github.com/nickjj/esbuild-copy-static-files/
export default function (options = {}) {
	return {
		name: 'copy-static-files',
		setup(build) {
			const src = options.src || './static'
			const dest = options.dest || './public'
			build.onEnd(async () => {
				const files = await readdir(src).catch(() => {})
				if (!files?.length) {
					return
				}
				fs.cpSync(src, dest, {
					dereference: options.dereference || true,
					errorOnExist: options.errorOnExist || false,
					filter:
						options.filter ||
						((src, dest) => filter(src, dest, options.ignore)),
					force: options.force || true,
					preserveTimestamps: options.preserveTimestamps || true,
					recursive: options.recursive || true,
					ignore: options.ignore || [],
				})
			})
		},
	}
}

function getDigest(string) {
	const hash = crypto.createHash('md5')
	const data = hash.update(string, 'utf-8')
	return data.digest('hex')
}

function getFileDigest(path) {
	if (!fs.existsSync(path)) {
		return null
	}
	if (fs.statSync(path).isDirectory()) {
		return null
	}
	return getDigest(fs.readFileSync(path))
}

function filter(src, dest, ignore) {
	if (ignore.includes(basename(src))) {
		return false
	}
	if (!fs.existsSync(dest)) {
		return true
	}
	if (fs.statSync(dest).isDirectory()) {
		return true
	}
	return getFileDigest(src) !== getFileDigest(dest)
}
