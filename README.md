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
    switch (process.argv[2]) {
        case '1': {
            const f = () => {
                console.log(hoge.fuga.piyo)
            }
            f()
            break
        }
        case '2': {
            const f = (arg) => {
                throw new Error('hoge', {hoge: 'hoge', fuga: arg})
            }
            f(1)
        }
    }
}
```

### index.js

```js
require('autodebugger').install()

require('./hoge')
```

### execution result

```
$ node src/hoge.js 
11
$ node src/hoge.js 1
11
/Users/erukiti/work/test-autodebugger/src/hoge.js:9
                console.log(hoge.fuga.piyo)
                                     ^

TypeError: Cannot read property 'piyo' of undefined
    at f (/Users/erukiti/work/test-autodebugger/src/hoge.js:9:38)
    at Object.<anonymous> (/Users/erukiti/work/test-autodebugger/src/hoge.js:11:13)
    at Module._compile (module.js:570:32)
    at Object.Module._extensions..js (module.js:579:10)
    at Module.load (module.js:487:32)
    at tryModuleLoad (module.js:446:12)
    at Function.Module._load (module.js:438:3)
    at Module.runMain (module.js:604:10)
    at run (bootstrap_node.js:389:7)
    at startup (bootstrap_node.js:149:9)
$ node src/hoge.js 2
11
/Users/erukiti/work/test-autodebugger/src/hoge.js:16
                throw new Error('hoge', {hoge: 'hoge', fuga: arg})
                ^

Error: hoge
    at f (/Users/erukiti/work/test-autodebugger/src/hoge.js:16:23)
    at Object.<anonymous> (/Users/erukiti/work/test-autodebugger/src/hoge.js:18:13)
    at Module._compile (module.js:570:32)
    at Object.Module._extensions..js (module.js:579:10)
    at Module.load (module.js:487:32)
    at tryModuleLoad (module.js:446:12)
    at Function.Module._load (module.js:438:3)
    at Module.runMain (module.js:604:10)
    at run (bootstrap_node.js:389:7)
    at startup (bootstrap_node.js:149:9)
```

```
$ node src/index.js 
src/hoge.js:3:1: 11
$ node src/index.js 1
src/hoge.js:3:1: 11
------- trace ------
src/hoge.js:3:13: call hoge(10)
src/hoge.js:1:14: enter arrow function (hoge) {"a":10}
src/hoge.js:1:14: exit arrow function (hoge) 11
src/hoge.js:11:13: call f()
src/hoge.js:8:23: enter arrow function (f) {}

(Function.f) src/hoge.js:9:29
(Autodebugger.invoke) node_modules/autodebugger/src/autodebugger/index.ts:129:44
(Object.exports.invoke) node_modules/autodebugger/src/index.ts:15:25
(Object.<anonymous>) src/hoge.js:11:13: f()
(Module._compile) module.js:570:32
(Module._compile) node_modules/source-map-support/source-map-support.js:492:25
(loader) node_modules/babel-register/lib/node.js:144:5
(Object.require.extensions.(anonymous function) [as .js]) node_modules/babel-register/lib/node.js:154:7
(Module.load) module.js:487:32
(tryModuleLoad) module.js:446:12
$ node src/index.js 2
src/hoge.js:3:1: 11
------- trace ------
src/hoge.js:3:13: call hoge(10)
src/hoge.js:1:14: enter arrow function (hoge) {"a":10}
src/hoge.js:1:14: exit arrow function (hoge) 11
src/hoge.js:18:13: call f(1)
src/hoge.js:15:23: enter arrow function (f) {"arg":1}

(Function.f) src/hoge.js:16:23
(Autodebugger.invoke) node_modules/autodebugger/src/autodebugger/index.ts:129:44
(Object.exports.invoke) node_modules/autodebugger/src/index.ts:15:25
(Object.<anonymous>) src/hoge.js:18:13: f(1)
(Module._compile) module.js:570:32
(Module._compile) node_modules/source-map-support/source-map-support.js:492:25
(loader) node_modules/babel-register/lib/node.js:144:5
(Object.require.extensions.(anonymous function) [as .js]) node_modules/babel-register/lib/node.js:154:7
(Module.load) module.js:487:32
(tryModuleLoad) module.js:446:12
```

