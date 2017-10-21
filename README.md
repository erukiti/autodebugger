# autodebugger

## How to use

```sh
$ npm install autodebugger -D
```

## example

### hoge.js

```js
const hoge = a => a + 1

console.log(hoge(10))

if (process.argv.length > 2) {
    console.log(hoge.fuga.piyo)
}
```

### index.js

```js
require('autodebugger').install()

require('./hoge')
```

### execution result

```
$ node example/hoge.js
11
$ node example/hoge.js 1
11
/Users/erukiti/work/autodebugger/example/hoge.js:6
    console.log(hoge.fuga.piyo)
                         ^

TypeError: Cannot read property 'piyo' of undefined
    at Object.<anonymous> (/Users/erukiti/work/autodebugger/example/hoge.js:6:26)
    at Module._compile (module.js:570:32)
    at Object.Module._extensions..js (module.js:579:10)
    at Module.load (module.js:487:32)
    at tryModuleLoad (module.js:446:12)
    at Function.Module._load (module.js:438:3)
    at Module.runMain (module.js:604:10)
    at run (bootstrap_node.js:389:7)
    at startup (bootstrap_node.js:149:9)
    at bootstrap_node.js:504:3
```

```
$ node example/index.js 
example/hoge.js:3:0: 11
$ node example/index.js 1
example/hoge.js:3:0: 11
------- trace ------
example/hoge.js:arrow function (hoge):1:13: enter 
example/hoge.js:arrow function (hoge):1:13: exit 

TypeError: Cannot read property 'piyo' of undefined
    at Object.<anonymous> (/Users/erukiti/work/autodebugger/example/hoge.js:6:17)
    at Module._compile (module.js:570:32)
    at loader (/Users/erukiti/work/autodebugger/node_modules/babel-register/lib/node.js:144:5)
    at Object.require.extensions.(anonymous function) [as .js] (/Users/erukiti/work/autodebugger/node_modules/babel-register/lib/node.js:154:7)
    at Module.load (module.js:487:32)
    at tryModuleLoad (module.js:446:12)
    at Function.Module._load (module.js:438:3)
    at Module.require (module.js:497:17)
    at require (internal/module.js:20:19)
    at Object.<anonymous> (/Users/erukiti/work/autodebugger/example/index.js:4:1)
```

