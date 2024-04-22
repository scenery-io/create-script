// Import anything as text by appending `?text`
import expression from './expression.js?text'

export function createShape() {
	const shapeId = api.create('javaScriptShape', 'Scenery')
	api.set(shapeId, {
		'generator.expression': expression,
	})
}
