# create-p5-project
CDNjs から [p5js](https://github.com/processing/p5.js/) を取得する p5 project テンプレート生成コマンドである．

[p5-manager](https://github.com/chiunhau/p5-manager)
を参考にした．

p5-manager は p5js のライブラリをローカルにダウンロードしているが，
create-p5-project では p5js をCDN経由で取得している．

p5-manager ほどの機能はなく，p5を動かせる最低限のテンプレートを生成するもの．

### 追記
2021/2/3: 自作モジュールの追加や削除もできるようになった．


## Setup
npmには公開してないので，`create-p5-project`を使うためには
このレポジトリをcloneして，
`npm link`でコマンドのパスを通す必要がある．

いらなくなったら`npm unlink`でコマンドのパスを外せる．


## Commands

### プロジェクトの生成 
プロジェクト(フォルダ)を生成したい場所で使う
```
$ create-p5-project new myproject
```

- 生成されるフォルダとファイル
```
myproject
|-- index.html
`-- scketch.js
```
これで一応p5で遊べる準備はできた．

`index.html`と`scketch.js`は，リポジトリの`templates/`の中に入っているので，
自由にカスタマイズしてつかいまわしてOK．


### p5jsのversion確認
最新のp5jsのversionを確認する．
```
$ create-p5-project version
```
プロジェクトが使っているp5jsのversionを確認しているわけではない．
確認したい場合は`index.html`にあるリンクから見れる．


### http-serverの開始
プロジェクトの中で使う(index.htmlがある場所でしか使えない)
```
$ create-p5-project server
```
立ち上げ後，コマンドラインにあるリンク`http://localhost:5555`からサイトに跳べる．

#### option
- `-p <port>` : ポート指定ができる．デフォルトは`5555`.


### モジュールの追加
プロジェクト内で作った自作のモジュールを自動で`index.html`にリンク付けしてくれる．
```
$ create-p5-project add mod.js
```
`<script src="mod.js"></script>`が`index.html`のheaderに追加される．

#### option
- `-t <module>` : 追加するモジュールをリポジトリ(create-p5-project)の`templates/modules/`内から検索する．
```
$ create-p5-project add -t Test.js
```
`Test.js`がプロジェクト内で生成され，`<script src="Test.js"></script>`が`index.html`のheaderに追加される．

`Test.js`はデフォルトで`templates/modules/`内に入っている．

使いまわしたいライブラリなどがあれば，`templates/modules/`に入れておくと便利かも．


### モジュールの削除
プロジェクトに追加されたモジュールを削除して，`index.html`からリンクを外してくれる．
```
$ create-p5-project remove Test.js
```
`Test.js`がプロジェクト内で削除され，`<script src="Test.js"></script>`の行が`index.html`から消される．

プロジェクト内の`index.html`と`scketch.js`は消せないようにしている．


## TODO
- プロジェクトごとのREADEMEのテンプレート生成
    * project websit へのリンク(github pagesとか)
    * 説明，テーマ，コンセプト，工夫などのテンプレート
- gitは必要ない？