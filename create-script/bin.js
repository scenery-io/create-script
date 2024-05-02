#!/usr/bin/env node
import { existsSync, readFileSync, readdirSync } from 'fs'
import * as p from '@clack/prompts'
import { bold, green, gray, underline } from 'kleur/colors'
import { create } from './main.js'
import { packageManager, __dirname } from './utils.js'
import { join } from 'path'

// Based on create-svelte and the clack example
// https://github.com/sveltejs/kit/blob/e7489aa558244ff0a356b07c62199f25e7afb025/packages/create-svelte/bin.js
// https://github.com/natemoo-re/clack/blob/45ee73bf33b25f9a8c7e1bb6117ccc165478bf4d/examples/basic/index.ts

async function main() {
	const { name, version } = JSON.parse(
		readFileSync(join(__dirname, 'package.json'), 'utf-8')
	)
	let cwd = process.argv[2] || '.'

	console.clear()
	console.log()

	p.intro(gray(`${name} ${version}`))
	p.log.message(`Problems? ${underline(green('https://scenery.io/support'))}`)

	const script = (
		await p.text({
			message: "What's the name of your script?",
			placeholder: '',
			validate(value) {
				if (!value.length) {
					return `Name is required`
				}
			},
		})
	).trim()

	if (p.isCancel(script)) {
		process.exit(1)
	}

	if (cwd === '.') {
		const dir = await p.text({
			message: 'Where should we create your project?',
			placeholder: `./${script}`,
			defaultValue: `./${script}`,
		})
		if (p.isCancel(dir)) {
			process.exit(1)
		}
		if (dir) {
			cwd = dir
		}
	}

	if (existsSync(cwd)) {
		if (readdirSync(cwd).length > 0) {
			const force = await p.confirm({
				message: 'Directory not empty. Continue?',
				initialValue: false,
			})
			if (!force) {
				process.exit(1)
			}
		}
	}

	const options = await p.group(
		{
			examples: () =>
				p.confirm({
					message: 'Add example code?',
				}),
			template: () =>
				p.select({
					message: 'Which template do you want?',
					options: [
						{
							label: 'Basic',
							value: 'basic',
							hint: 'the bare minimum',
						},
						{
							label: 'Full-featured',
							value: 'full',
							hint: 'with prettier and .env',
						},
					],
				}),
			license: () =>
				p.confirm({
					message: 'Add standard software license?',
				}),
		},
		{ onCancel: () => process.exit(1) }
	)

	let choices = [bold(script)]
	if (options.examples) {
		choices.push('✔ Example code')
	}
	if (options.template === 'basic') {
		choices.push('✔ Basic template')
	}
	if (options.template === 'full') {
		choices.push('✔ Full-featured template')
	}
	if (options.license) {
		choices.push('✔ Add standard software license')
	}

	p.note(choices.join('\n'), 'Choices')

	const spinner = p.spinner()
	try {
		spinner.start(`Installing via ${packageManager}`)
		await create(cwd, script, options)
		spinner.stop(`Installed via ${packageManager}`)

		const note = []
		if (cwd !== '.') {
			note.push(`cd ${cwd}`)
		}
		note.push(`${packageManager} run dev`)
		p.note(note.join('\n'), 'Next steps')

		p.log.success(
			`Want to publish ${script} on Scenery?\nLet's talk! ${underline(green('https://scenery.io/support'))}`
		)
		p.outro('Done')
	} catch (error) {
		spinner.stop()
		p.log.error(error.message)
		p.outro('Failed')
	}
}

main().catch(console.error)
