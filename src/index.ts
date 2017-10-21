import {Autodebugger} from './autodebugger'

let autodebugger = null

export const install = (config) => {
    autodebugger = new Autodebugger(config)
}
export const trace = (...args) => {
    autodebugger.trace(...args)
}
export const trap = (...args) => {
    autodebugger.trap(...args)
}
