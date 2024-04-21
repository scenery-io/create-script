import Zip from 'adm-zip'
import { join } from 'path'
import fs from 'fs-extra'

const outdir = 'dist'
const assetsPath = 'static/release'
const packagePath = 'package.json'
const buildPath = 'build'
const { displayName, version } = await fs.readJson(packagePath)
const path = join(outdir, `${displayName}_${version}.zip`)
const zip = new Zip()
zip.addLocalFolder(buildPath, displayName)
if (fs.existsSync(assetsPath)) {
	zip.addLocalFolder(assetsPath)
}
fs.ensureDir(outdir)
zip.writeZip(path)
