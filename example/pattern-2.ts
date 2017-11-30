class Hoge {
  public fuga(param) {
    param()
  }
}

const hoge = new Hoge()
hoge.fuga(() => console.log('fuga'))
hoge.fuga(1)
