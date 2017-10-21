import {Autodebugger} from './autodebugger'

let autodebugger = null

export const install = (config) => {
    autodebugger = new Autodebugger(config)
}
export const trace = (...args) => {
    return autodebugger.trace(...args)
}
export const trap = (...args) => {
    return autodebugger.trap(...args)
}
export const invoke = (...args) => {
    return autodebugger.invoke(...args)
}
