# autodebugger


## example

### hoge.js

```js
const {debugLog} = require('../dist')

const hoge = a => a + 1

console.log(hoge(10))
```

### index.js

```js
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
```

### execution result

```
$ node example/hoge.js
11
```

```
$ node example/index.js 
example/hoge.js:3:13: enter { params: { a: 10 } }
example/hoge.js:3:13: exit { result: 11 }
example/hoge.js:5:0: 11
```
