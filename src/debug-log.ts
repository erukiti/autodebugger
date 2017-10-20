import * as path from 'path'

export const debugLog = (obj, ...args) => {
    const {filename, line, column, type} = obj
    let col = ''
    switch (type) {
        case 'log': {
            col = '\x1b[32m'
            break
        }
        case 'dir': {
            col = '\x1b[33m'
            break
        }
        case 'debug': {
            col = '\x1b[31m'
        }
    }

    console.log(`${col}${path.relative(process.cwd(), filename)}:${line}:${column}:`, ...args)
}
