const opts = {
    enter: `debugLog({filename: FILENAME, line: START_LINE, column: START_COLUMN, type: 'debug'}, 'enter', {params: PARAMS})`,
    exit: `debugLog({filename: FILENAME, line: START_LINE, column: START_COLUMN, type: 'debug'}, 'exit', {result: RESULT})`,
    renames: {
        'console.log': `debugLog({filename: FILENAME, line: START_LINE, column: START_COLUMN, type: 'log'}, ARGS)`,
        'console.dir': `debugLog({filename: FILENAME, line: START_LINE, column: START_COLUMN, type: 'log'}, ARGS)`,
    }
}

require('babel-register')({
    plugins: [
        ['autodebugger', opts]
    ],
    ignore: ['dist/', 'node_modules/']
})

require('./hoge')
