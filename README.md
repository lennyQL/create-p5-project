# create-p5-project
CDNjs から [p5js](https://github.com/processing/p5.js/) を取得する p5 project テンプレート生成コマンドである．
[p5-manager](https://github.com/chiunhau/p5-manager)
を参考にした．

p5-manager は p5js のライブラリをローカルにダウンロードしているが，
create-p5-project はp5jsをCDNを使ってライブラリを取得している．

p5-managerほどの機能はない，テンプレートを生成する最低限のもの．


## Templates
生成されるのは最低限p5を動かせるプロジェクトのテンプレートだけ
```
# プロジェクト生成
$ create-p5-project new project

# 生成されるフォルダとファイル
project
|-- index.html
`-- scketch.js
```


## Path
npmには公開してないので，`create-p5-project`を使うためには，
プロジェクトをcloneして，
`npm link`でコマンドのパスを通す必要がある．

いらなくなったら`npm unlink`でコマンドのパスを外せる．


## Commands
```
# プロジェクト生成 
## <project>にプロジェクトの名前を入れる
## プロジェクト(フォルダ)を生成したい場所で使う
$ create-p5-project new <project>


# 最新のp5jsのversion確認
$ create-p5-project version


# http-server開始
## プロジェクトの中で使う(index.htmlがある場所でしか使えない)
## default port: 5555
## option: '-p <port>'でポートしてできる
$ create-p5-project server
```

