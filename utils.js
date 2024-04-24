import { fileURLToPath } from 'url'
import { dirname } from 'path'

export const packageManager = getPackageManager() || 'npm'
export const __filename = fileURLToPath(import.meta.url)
export const __dirname = dirname(__filename)

/**
 * Supports npm, pnpm, Yarn, cnpm, bun and any other package manager that sets the npm_config_user_agent env variable.
 * Thanks to https://github.com/zkochan/packages/tree/main/which-pm-runs for this code!
 */
export function getPackageManager() {
	if (!process.env.npm_config_user_agent) {
		return undefined
	}
	const userAgent = process.env.npm_config_user_agent
	const pmSpec = userAgent.split(' ')[0]
	const separatorPos = pmSpec.lastIndexOf('/')
	const name = pmSpec.substring(0, separatorPos)
	return name === 'npminstall' ? 'cnpm' : name
}

export function toValidPackageName(name) {
	return name
		.trim()
		.toLowerCase()
		.replace(/\s+/g, '-')
		.replace(/^[._]/, '')
		.replace(/[^a-z0-9~.-]+/g, '-')
}
