const hoge = a => a + 1

console.log(hoge(10))

if (process.argv.length > 2) {
    switch (process.argv[2]) {
        case '1': {
            console.log(hoge.fuga.piyo)
            break
        } 
        case '2': {
            throw new Error('hoge', {hoge: 'hoge', fuga: 1})
        }
        case '3': {
            console.log({hoge: 'fuga'})
        }

    }
}
