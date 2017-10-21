import * as path from 'path'
import * as fs from 'fs'

import * as st from 'stacktrace-js'

const defaultOpts = {
    replaceProgram: `
    const autodebugger = require('autodebugger')
    try {
        BODY
    } catch(e) {
        autodebugger.trap(e)
    }
    `.trim(),
    enter: `autodebugger.trace({filename: FILENAME, line: START_LINE, column: START_COLUMN, name: NAME, type: 'trace.enter', params: PARAMS})`,
    exit: `autodebugger.trace({filename: FILENAME, line: START_LINE, column: START_COLUMN, name: NAME, type: 'trace.exit', result: RESULT})`,
    renames: {
        'console.log': `autodebugger.trace({filename: FILENAME, line: START_LINE, column: START_COLUMN, type: 'log'}, ARGS)`,
        'console.dir': `autodebugger.trace({filename: FILENAME, line: START_LINE, column: START_COLUMN, type: 'dir'}, ARGS)`,
        '*': `autodebugger.invoke({filename: FILENAME, line: START_LINE, column: START_COLUMN, callee: CALLEE, name: CALLEE_NAME, type: 'trace.call'}, ARGS)`
    },
}

export class Autodebugger {
    _trace = []
    isPrintTrace: boolean = false

    constructor(config = {opts: {}, printTrace: false}) {
        const opts = Object.assign({}, defaultOpts, config.opts)

        if (config.printTrace) {
            this.isPrintTrace = true
        }

        require('source-map-support').install({hookRequire: true})

        require('babel-register')({
            plugins: [['autodebugger', opts]],
            ignore: ['dist/', 'node_modules/'],
        })
    }

    trace(obj, ...args) {
        const {filename, line, column, type, name, params, result} = obj
        let col = '\x1b[m'

        const [type_, ...typeInfo] = type.split('.')

        switch (type_) {
            case 'trace': {
                if (this.isPrintTrace) {
                    let s = ''
                    switch (typeInfo[0]) {
                        case 'enter': {
                            s = `enter ${name} ${JSON.stringify(params)}`
                            break
                        }
                        case 'exit': {
                            s = `exit ${name} ${result}`
                            break
                        }
                        case 'call': {
                            s = `call ${name}(${params.map(p => JSON.stringify(p)).join(', ')})`
                        }
                    }
                    console.log(
                        `\x1b[35m${path.relative(
                            process.cwd(),
                            filename,
                        )}:${line}:${column}: ${s}\x1b[m`,
                    )
                } else {
                    this._trace.push(obj)
                }
                return
            }
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
                break
            }
            case 'error': {
                console.dir(args[0])
                return
            }
        }

        const argsPrintable = args.map(arg => {
            if (!arg) {
                return arg
            }
            if (arg[Symbol.toPrimitive]) {
                return arg[Symbol.toPrimitive]('string')
            }
            if (typeof arg === 'object') {
                if (Array.isArray(arg)) {
                    return arg.map(v => argsPrintable(v))
                } else if (arg && arg.constructor.name === 'Object') {
                    return JSON.stringify(arg)
                }
            }
            return arg
        })


        console.log(
            `${col}${path.relative(
                process.cwd(),
                filename,
            )}:${line}:${column}: ${argsPrintable}\x1b[m`,
        )
    }

    invoke(obj, params) {
        if (Array.isArray(params)) {
            obj.params = params
        } else {
            obj.params = [params]
        }

        this.trace(obj)
        return  obj.callee.bind(obj.callee)(...obj.params)
    }

    trap(e) {
        if (this._trace.length > 0) {
            console.log('------- trace ------')
            this.isPrintTrace = true
            this._trace.forEach(obj => this.trace(obj))
            console.log('')
        }

        try {
            fs.mkdirSync('.autodebugger')
        } catch (e) {
            // nice catch
        }

        st.fromError(e).then(stackframes => {
            const data = {
                trace: this._trace,
                stack: stackframes,
            }

            data.stack.forEach(st => {
                const found = data.trace.find(t => {
                    return st.fileName === t.filename && 
                           st.lineNumber === t.line && 
                           st.columnNumber === t.column
                })

                if (found) {
                    console.log(`(${st.functionName}) ${path.relative(process.cwd(), found.filename)}:${found.line}:${found.column}: ${found.name}(${found.params.join(', ')})`)
                } else {
                    console.log(`(${st.functionName}) ${path.relative(process.cwd(), st.fileName)}:${st.lineNumber}:${st.columnNumber}`)
                }
            })

            try {
                const filename = path.join('.autodebugger', `error-${Date.now()}.json`)
                fs.writeFileSync(filename, JSON.stringify(data, null, '  '))
            } catch (e) {
                console.error('autodebugger: debug file output error', e)
            }
        })
    }
}
