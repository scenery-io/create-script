import { execSync } from 'child_process'
import { toValidPackageName, packageManager, __dirname } from './utils.js'
import { join } from 'path'
import { cp, rename, writeFile } from 'fs/promises'
import { readFileSync } from 'fs'

export async function create(cwd, script, options) {
	const templatePath = join(__dirname, 'templates', 'default')
	const ignore = ['package-lock.json']
	if (!options.examples) {
		ignore.push('text', 'icons/', 'modules/')
	}
	if (options.template === 'basic') {
		ignore.push('.env.example', '.prettierrc.json', 'CHANGELOG.md')
	}
	await cp(templatePath, cwd, {
		force: true,
		recursive: true,
		filter: async (path) => {
			if (path === templatePath) {
				return true
			}
			const include = !ignore.some((entry) =>
				path.replace(templatePath, '').includes(entry)
			)
			return include
		},
	})
	await rename(
		join(cwd, 'src', 'Script.js'),
		join(cwd, 'src', `${script}.js`)
	)
	await rename(join(cwd, 'gitignore'), join(cwd, '.gitignore'))
	const packagePath = join(cwd, 'package.json')
	const pkg = JSON.parse(readFileSync(packagePath, 'utf-8'))
	pkg.name = toValidPackageName(script)
	pkg.displayName = script
	await writeFile(packagePath, JSON.stringify(pkg, undefined, 2))

	if (!options.examples) {
		await writeFile(
			join(cwd, 'src', `${script}.js`),
			'console.log(PRODUCT_DISPLAY_NAME, PRODUCT_VERSION)'
		)
	}
	if (options.template === 'basic') {
		const extensionsPath = join(cwd, '.vscode', 'extensions.json')
		const settingsPath = join(cwd, '.vscode', 'settings.json')
		await writeFile(
			extensionsPath,
			JSON.stringify(
				{
					recommendations: ['supasupply.stallion'],
				},
				undefined,
				2
			)
		)
		await writeFile(
			settingsPath,
			JSON.stringify(
				{
					'files.associations': {
						'*.cv': 'json',
						'*.cvc': 'json',
						'*.pal': 'json',
					},
				},
				undefined,
				2
			)
		)
	}
	execSync(`cd "${cwd}" && ${packageManager} install`)
}
