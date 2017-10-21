"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs");
const st = require("stacktrace-js");
const autodebuggerPath = path.join(__dirname, '..', '..', 'dist/');
const defaultOpts = {
    replaceProgram: `
    const autodebugger = require('${autodebuggerPath}')
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
    },
};
class Autodebugger {
    constructor(config = { opts: {}, printTrace: false }) {
        this._trace = [];
        this.isPrintTrace = false;
        const opts = Object.assign({}, defaultOpts, config.opts);
        if (config.printTrace) {
            this.isPrintTrace = true;
        }
        require('source-map-support').install({ hookRequire: true });
        require('babel-register')({
            plugins: [['autodebugger', opts]],
            ignore: ['dist/', 'node_modules/'],
        });
    }
    trace(obj, ...args) {
        const { filename, line, column, type, name, params, result } = obj;
        let col = '\x1b[m';
        const [type_, ...typeInfo] = type.split('.');
        switch (type_) {
            case 'trace': {
                if (this.isPrintTrace) {
                    console.log(`\x1b[35m${path.relative(process.cwd(), filename)}:${name}:${line}:${column}: ${typeInfo[0]} ${args}\x1b[m`);
                }
                else {
                    this._trace.push(obj);
                }
                return;
            }
            case 'log': {
                col = '\x1b[32m';
                break;
            }
            case 'dir': {
                col = '\x1b[33m';
                break;
            }
            case 'debug': {
                col = '\x1b[31m';
                break;
            }
            case 'error': {
                console.dir(args[0]);
                return;
            }
        }
        const argsPrintable = args.map(arg => {
            if (arg[Symbol.toPrimitive]) {
                return arg[Symbol.toPrimitive]('string');
            }
            else if (typeof arg === 'object') {
                if (Array.isArray(arg)) {
                    return arg.map(v => argsPrintable(v));
                }
                else if (arg && arg.constructor.name === 'Object') {
                    return JSON.stringify(arg);
                }
            }
            return arg;
        });
        console.log(`${col}${path.relative(process.cwd(), filename)}:${line}:${column}: ${argsPrintable}\x1b[m`);
    }
    trap(e) {
        if (this._trace.length > 0) {
            console.log('------- trace ------');
            this.isPrintTrace = true;
            this._trace.forEach(obj => this.trace(obj));
            console.log('');
        }
        console.log(e.stack);
        try {
            fs.mkdirSync('.autodebugger');
        }
        catch (e) {
            // nice catch
        }
        st.fromError(e).then(stackframes => {
            const data = {
                trace: this._trace,
                stack: stackframes,
            };
            try {
                const filename = path.join('.autodebugger', `error-${Date.now()}.json`);
                fs.writeFileSync(filename, JSON.stringify(data, null, '  '));
            }
            catch (e) {
                console.error('autodebugger: debug file output error', e);
            }
        });
    }
}
exports.Autodebugger = Autodebugger;
//# sourceMappingURL=index.js.map