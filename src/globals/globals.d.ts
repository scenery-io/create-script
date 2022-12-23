// Necessary for the Typescript compiler
// to understand unconventional modules
declare module '*?text'
declare module '*.jpg'
declare module '*.png'
// Default constants exposed by `build.js`
declare const DEVMODE: boolean
declare const PRODUCT_NAME: string
declare const PRODUCT_DISPLAY_NAME: string
declare const PRODUCT_VERSION: string
// Add any variables you declared in `.env`
