import { temporaryWrite } from 'tempy'
import Watcher from 'watcher'
import fetch from 'node-fetch'
import { glob } from 'glob'
import { resolve } from 'path'
import { readFileSync } from 'fs'
import ora from 'ora'

const spinner = ora('Encrypting…')
const failed = 'Unable to encrypt. Is Stallion running in Cavalry?'
spinner.start()
try {
	const entryPoints = await glob('build/*.js')
	if (!entryPoints.length) {
		throw new Error('No scripts found in build folder')
	}
	const paths = entryPoints.map((path) => {
		const inputPath = resolve(path)
		return { inputPath, outputPath: inputPath.replace('.js', '.jsc') }
	})
	const script = `
        (() => {
            const paths = ${JSON.stringify(paths)}
            paths.forEach(({ inputPath, outputPath }) => {
                const content = api.readFromFile(inputPath)
                const encrypted = api.encrypt(content)
                api.writeToFile(outputPath, encrypted, true)
            })
        })()
        `
	const path = await temporaryWrite(script, { extension: 'js' })
	const res = await fetch('http://127.0.0.1:8080/post', {
		method: 'POST',
		body: JSON.stringify({ path }),
	})
	if (!res.ok) {
		throw new Error(failed)
	}
	const body = await res.text()
	const success = body?.toLowerCase() === 'success'
	if (!success) {
		throw new Error(failed)
	}
	await new Promise((resolve, reject) => {
		const watcher = new Watcher('build')
		const watch = new Set(paths.map((path) => path.outputPath))
		watcher.on('error', reject)
		watcher.on('add', (filePath) => {
			if (watch.has(filePath)) {
				watch.delete(filePath)
			}
			if (!watch.size) {
				watcher.close()
				resolve()
			}
		})
	})
	const encrypted = paths.reduce((result, { outputPath }) => {
		const content = readFileSync(outputPath, 'utf-8')
		const spaces = content.match(/\s/g)?.length
		if (spaces) {
			return false
		}
		return result
	}, true)
	if (!encrypted) {
		throw new Error('Failed to encrypt')
	}
	spinner.succeed('Encrypted')
} catch (error) {
	let text = error.message
	if (error.code === 'ECONNREFUSED') {
		text = failed
	}
	spinner.fail(text)
	console.log()
	process.exit(1)
}
