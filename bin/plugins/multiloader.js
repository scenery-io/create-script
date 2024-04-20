import { copy, exists } from 'fs-extra'
import { readFile } from 'fs/promises'
import { basename, dirname, extname, join, resolve } from 'path'

export default function () {
	return {
		name: 'multiloader',
		setup(build) {
			const Suffix = {
				BASE64: /\?base64$/,
				TEXT: /\?text$/,
			}
			build.onResolve({ filter: /\.jpg|png$/i }, (args) => {
				return {
					namespace: 'copy-file',
					path: resolve(args.resolveDir, args.path),
				}
			})
			build.onLoad(
				{ filter: /.*/, namespace: 'copy-file' },
				// TODO: Cache files and ignore unchanged
				async (args) => {
					let warnings = []
					const outdir = build.initialOptions.outdir
					// TODO: Prefix `_assets` with script name
					const assetsPath = join(outdir, '_assets')
					const filename = basename(args.path)
					const ext = extname(filename)
					if (ext === '.png' || ext === '.jpg') {
						const importdir = dirname(args.path)
						const filename2x = filename.replace(ext, `@2x${ext}`)
						const path2x = join(importdir, filename2x)
						const output2x = join(assetsPath, filename2x)
						const has2x = await exists(path2x)
						if (!has2x) {
							warnings.push({
								text: `Missing @2x version of ${filename} in ${importdir}`,
							})
						} else {
							await copy(path2x, output2x)
						}
					}
					await copy(args.path, join(assetsPath, filename))
					return {
						// TODO: Prefix `_assets` with script name
						contents: join('_assets', filename),
						loader: 'text',
						warnings,
					}
				}
			)
			// TODO: Support importing as base64
			// build.onResolve({ filter: Suffix.BASE64 }, (args) => {
			// 	return {
			// 		namespace: 'base64-file',
			// 		path: resolve(
			// 			args.resolveDir,
			// 			args.path.replace(Suffix.BASE64, '')
			// 		),
			// 	}
			// })
			// build.onLoad(
			// 	{ filter: /.*/, namespace: 'base64-file' },
			// 	async (args) => {
			// 		return {
			// 			contents: await readFile(args.path),
			// 			loader: 'base64',
			// 		}
			// 	}
			// )
			build.onResolve({ filter: Suffix.TEXT }, (args) => {
				return {
					namespace: 'text-file',
					path: resolve(
						args.resolveDir,
						args.path.replace(Suffix.TEXT, '')
					),
				}
			})
			build.onLoad(
				{ filter: /.*/, namespace: 'text-file' },
				async (args) => {
					return {
						contents: await readFile(args.path),
						loader: 'text',
					}
				}
			)
		},
	}
}
