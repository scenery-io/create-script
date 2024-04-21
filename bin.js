#!/usr/bin/env node
import { existsSync, readFileSync, readdirSync } from 'fs'
import * as p from '@clack/prompts'
import { bgCyan, black, bold, cyan, underline } from 'kleur/colors'
import { setTimeout } from 'node:timers/promises'
import { join } from 'path'

// Based on create-svelte and the clack example
// https://github.com/sveltejs/kit/blob/e7489aa558244ff0a356b07c62199f25e7afb025/packages/create-svelte/bin.js
// https://github.com/natemoo-re/clack/blob/45ee73bf33b25f9a8c7e1bb6117ccc165478bf4d/examples/basic/index.ts

/**
 * Supports npm, pnpm, Yarn, cnpm, bun and any other package manager that sets the npm_config_user_agent env variable.
 * Thanks to https://github.com/zkochan/packages/tree/main/which-pm-runs for this code!
 */
function packageManager() {
	if (!process.env.npm_config_user_agent) {
		return undefined
	}
	const userAgent = process.env.npm_config_user_agent
	const pmSpec = userAgent.split(' ')[0]
	const separatorPos = pmSpec.lastIndexOf('/')
	const name = pmSpec.substring(0, separatorPos)
	return name === 'npminstall' ? 'cnpm' : name
}

async function main() {
	const { name, version } = JSON.parse(readFileSync('package.json', 'utf-8'))
	let cwd = process.argv[2] || '.'

	console.clear()
	console.log()

	p.intro(bgCyan(black(` ${name} ${version} `)))
	p.log.message(`Problems? ${underline(cyan('https://scenery.io/support'))}`)

	const script = await p.text({
		message: "What's the name of your script?",
		placeholder: '',
		validate(value) {
			if (value.length === 0) {
				return `Name is required`
			}
		},
	})

	if (p.isCancel(script)) {
		process.exit(1)
	}

	if (cwd === '.') {
		const dir = await p.text({
			message: 'Where should we create your project?',
			placeholder: '  (press Enter to use current directory)',
			validate(value) {
				if (!existsSync(value || cwd)) {
					return 'Directory does not exist'
				}
			},
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
			if (force !== true) {
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
			features: () =>
				p.multiselect({
					message: 'Select features (use arrow keys/space bar)',
					required: false,
					initialValues: ['docs', 'license'],
					options: [
						{
							value: 'docs',
							label: 'Generate user documentation',
						},
						{
							value: 'license',
							label: 'Add standard software license',
						},
					],
				}),
			types: () =>
				p.select({
					message: 'Add type checking with TypeScript?',
					initialValue: 'checkjs',
					options: [
						{
							label: 'Yes, using JavaScript',
							value: 'checkjs',
						},
						{
							label: 'Yes, using TypeScript',
							value: 'typescript',
						},
						{ label: 'No', value: 'none' },
					],
				}),
			tech: () =>
				p.multiselect({
					message:
						'Select additional options (use arrow keys/space bar)',
					required: false,
					options: [
						{
							value: 'prettier',
							label: 'Use Prettier for automatic code formatting',
						},
						{
							value: 'env',
							label: 'Add .env for environment variables',
						},
					],
				}),
		},
		{ onCancel: () => process.exit(1) }
	)

	let choices = [bold(script)]

	if (options.examples) {
		choices.push('✔ Example code')
	}

	if (options.features.includes('docs')) {
		choices.push('✔ Generate user documentation')
	}

	if (options.features.includes('license')) {
		choices.push('✔ Add standard software license')
	}

	if (options.types === 'typescript') {
		choices.push('✔ Typescript')
	}

	if (options.types === 'checkjs') {
		choices.push('✔ Type-checked JavaScript')
	}

	if (options.tech.includes('prettier')) {
		choices.push('✔ Prettier')
	}

	if (options.tech.includes('env')) {
		choices.push('✔ Environment Variables')
	}

	p.note(choices.join('\n'), 'Choices')

	// TODO: Show relative path
	const path = join(cwd, script)
	const pm = packageManager()
	if (pm) {
		const s = p.spinner()
		s.start(`Installing via ${pm}`)
		// TODO: Create template and install
		await setTimeout(2500)
		s.stop(`Installed via ${pm}`)
		p.note(`cd ${path}\n${pm} run dev`, 'Next steps')
	} else {
		p.log.warn(
			`Unknown package manager.\nPlease run its install command in ${path}`
		)
	}

	p.log.success(
		`Want to publish ${script} on Scenery?\nLet's talk! ${underline(cyan('https://scenery.io/support'))}`
	)

	p.outro('Done')
}

main().catch(console.error)
