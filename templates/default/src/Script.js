import scenery from './icons/scenery.png'
import { createShape } from './modules/shape.js'

// Global constants like `PRODUCT_DISPLAY_NAME` are replaced at build time
ui.setTitle(PRODUCT_DISPLAY_NAME)
const version = new ui.Label(`## ${PRODUCT_NAME} ${PRODUCT_VERSION}`)
version.setAlignment(1)

// The `scenery` image is copied to the assets folder and imported as a path
const imagePath = `${ui.scriptLocation}/${scenery}`
console.log(imagePath)

const jsBtn = new ui.Button('Create JavaScript Shape')
jsBtn.setFixedHeight(32)
// Run function from an imported module
jsBtn.onClick = createShape

const mainLayout = new ui.VLayout()
mainLayout.setMargins(64, 0, 64, 0)
const layout = new ui.HLayout()
layout.addStretch()
layout.add(jsBtn)
layout.addStretch()

const publishText = new ui.Label(
	'Want to publish on Scenery? Come talk to us on [Discord](https://discord.com/invite/dAmKYcfaff) or send us [a message](https://scenery.io/support?source=create-script)!'
)
publishText.setFixedWidth(200)
publishText.setAlignment(1)

mainLayout.add(version, layout, publishText)
mainLayout.addStretch()

// Only run this code in DEVMODE
if (DEVMODE) {
	const testBtn = new ui.Button('Test Button')
	testBtn.onClick = () => {
		console.log("I don't appear in the production version")
	}
	mainLayout.add(testBtn)
}

ui.add(mainLayout)
ui.show()
