import { writeFile } from 'fs/promises'
import { basename, join } from 'path'

export default function () {
	return {
		name: 'report',
		setup(build) {
			build.onEnd((result) => {
				const errors = result.errors.map(
					(error) => `console.error(${JSON.stringify(error.text)})`
				)
				if (!errors.length) {
					return
				}
				errors.push(
					`console.error("Script has ${errors.length} build errors. Check the terminal for details.")`
				)
				build.initialOptions.entryPoints.forEach((entryPath) => {
					const filePath = join(
						build.initialOptions.outdir,
						basename(entryPath).replace('.ts', '.js')
					)
					writeFile(filePath, errors.join('\n'), 'utf-8')
					console.log(`Errors written to ${filePath}`)
				})
			})
		},
	}
}
