import { writeFile } from 'fs/promises'
import { basename, join } from 'path'

export default function () {
	return {
		name: 'report',
		setup(build) {
			build.onEnd((result) => {
				const errors = result.errors.map(
					(error) => `console.error("${error.text}")`
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
						basename(entryPath)
					)
					console.log(filePath)
					writeFile(filePath, errors.join('\n'), 'utf-8')
				})
			})
		},
	}
}
