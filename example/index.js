const yargs = require('yargs')
const fs = require('fs')

const argv = process.argv.slice(2)
if (argv.length === 0) {
  console.log('usage example [--no-debug] pattern-number')
  console.log('  pattern number 0 - 2')
  process.exit(1)
}

if (argv[0] === '--no-debug') {
  argv.shift()
} else {
  const autodebug = require('../')
  autodebug.install({ includeTypeScript: true, plugins: ['@babel/plugin-transform-typescript'] })
  console.log('autodebug is installed')
}

const patterns = ['throw Error', 'top level error', 'TypeScript']
console.log(patterns[argv[0]])
const src = require.resolve(`./pattern-${argv[0]}`)

console.log('-----------')
console.log(
  fs
    .readFileSync(src)
    .toString()
    .trim()
)
console.log('-----------')
console.log()

require(src)
