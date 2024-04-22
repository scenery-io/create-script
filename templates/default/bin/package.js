import Zip from 'adm-zip'
import { join } from 'path'
import fs from 'fs-extra'
import ora from 'ora'

const spinner = ora('Packaging…')
spinner.start()
try {
	const outdir = 'dist'
	const assetsPath = 'static/release'
	const packagePath = 'package.json'
	const buildPath = 'build'
	const { displayName, version } = await fs.readJson(packagePath)
	const zipName = `${displayName}_${version}.zip`
	const path = join(outdir, zipName)
	const zip = new Zip()
	zip.addLocalFolder(buildPath, displayName)
	if (fs.existsSync(assetsPath)) {
		zip.addLocalFolder(assetsPath)
	}
	zip.getEntries().forEach((entry) => {
		if (entry.name.endsWith('.js')) {
			zip.deleteFile(entry)
		}
	})
	fs.ensureDir(outdir)
	zip.writeZip(path)
	spinner.succeed('Packaged\n')
} catch (error) {
	spinner.fail(error.message)
	console.log()
	process.exit(1)
}
