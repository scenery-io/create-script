import { sayHello } from './modules/module'
// Import anything as text by appending `?text`
import text from './modules/text.js?text'
import image from './icons/bun.jpg'

// Global constants like `PRODUCT_DISPLAY_NAME` are replaced at build time
ui.setTitle(PRODUCT_DISPLAY_NAME)
const version = new ui.Label(`${PRODUCT_DISPLAY_NAME} ${PRODUCT_VERSION}`)
version.setAlignment(1)
const note = new ui.Label(text)
version.setAlignment(1)

// Images are copied to the assets folder and imported as paths
const imagePath = `${ui.scriptLocation}/${image}`
console.log(imagePath)
const bun = new ui.Image(imagePath)

ui.add(version, note, bun)
ui.show()

// Run imported function from module
sayHello()

// Only run this code in DEVMODE
if (DEVMODE) {
	console.log("I don't appear in the production version")
}
