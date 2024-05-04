import badgePath from './icons/badge@2x.png'
import { createShape } from './modules/shape.js'
// Import anything as text by appending `?text`
import markdown from './text/publish.md?text'

// Global constants like `PRODUCT_DISPLAY_NAME` are replaced at build time
ui.setTitle(PRODUCT_DISPLAY_NAME)
const version = new ui.Label(`## ${PRODUCT_DISPLAY_NAME} ${PRODUCT_VERSION}`)

const main = new ui.HLayout()
const header = new ui.HLayout()
const content = new ui.VLayout()

// The `badge` image is copied to the assets folder and imported as a path
console.log(badgePath)
const badgeImage = new ui.Image(badgePath)
header.setSpaceBetween(12)
header.addStretch()
header.add(badgeImage, version)
header.addStretch()

const buttons = new ui.HLayout()
const createBtn = new ui.Button(' Create JavaScript Shape ')
createBtn.setFixedHeight(32)
// Run function from an imported module
createBtn.onClick = createShape
buttons.add(createBtn)

const text = new ui.HLayout()
text.addStretch()
const publishText = new ui.Label(markdown)
publishText.setFixedWidth(200)
publishText.setAlignment(1)
text.add(publishText)
text.addStretch()

main.addStretch()
main.add(content)
main.addStretch()

content.setSpaceBetween(16)
content.addStretch()
content.add(header, buttons)
content.addStretch()
content.add(text)

// Only run this code in DEVMODE
if (DEVMODE) {
	const testBtn = new ui.Button(' Test Button ')
	testBtn.setFixedHeight(32)
	testBtn.onClick = () => {
		console.warn("I don't appear in the production version")
	}
	buttons.add(testBtn)
}

ui.add(main)
ui.setMinimumWidth(320)
ui.setMinimumHeight(230)
ui.show()
