import { execSync } from 'child_process'
import { toValidPackageName, packageManager, __dirname } from './utils.js'
import { cpSync, readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

export function create(cwd, script, options) {
	const templatePath = join(__dirname, 'templates', 'default')
	const ignore = ['package-lock.json']
	if (!options.examples) {
		ignore.push('text', 'icons/', 'modules/', 'Script.js')
	}
	if (!options.license) {
		ignore.push('LICENSE.txt')
	}
	if (options.template === 'basic') {
		ignore.push('.env.example', '.prettierrc.json', 'CHANGELOG.md')
	}
	cpSync(templatePath, cwd, {
		recursive: true,
		filter: (path) => !ignore.find((entry) => path.includes(entry)),
	})
	if (!options.examples) {
		writeFileSync(
			join(cwd, 'src', `${script}.js`),
			'console.log(PRODUCT_NAME, PRODUCT_VERSION)'
		)
	}
	if (options.template === 'basic') {
		const extensionsPath = join(cwd, '.vscode', 'extensions.json')
		const settingsPath = join(cwd, '.vscode', 'settings.json')
		writeFileSync(
			extensionsPath,
			JSON.stringify(
				{
					recommendations: ['supasupply.stallion'],
				},
				undefined,
				2
			)
		)
		writeFileSync(
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
	const packagePath = join(cwd, 'package.json')
	const pkg = JSON.parse(readFileSync(packagePath, 'utf-8'))
	pkg.name = toValidPackageName(script)
	pkg.displayName = script
	writeFileSync(packagePath, JSON.stringify(pkg, undefined, 2))
	execSync(`cd "${cwd}" && ${packageManager} install`)
}
