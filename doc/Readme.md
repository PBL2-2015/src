## Gitへのpushまで

rootディレクトリ(node-js-getting-started)上で

```
git add .  
git commit -m "message"  
git push heroku master
```
## .git/configの中身
[core]
  repositoryformatversion = 0
  filemode = true
  bare = false
  logallrefupdates = true
  ignorecase = true
  precomposeunicode = true
[remote "heroku"]
  url = https://git.heroku.com/bresticky.git
  fetch = +refs/heads/*:refs/remotes/heroku/*
[branch "master"]
  remote = heroku
  merge = refs/heads/master


## ローカルで実行する

Procfile(拡張子なし)に

```
web: node app.js
```

と記述後，

```
heroku local
```

コマンドを入力

## appを開く

```
heroku open
```

## ハマったこと

### Application Errorについて

dependenciesに記述不足があった．  
以下参考  
[Heroku：(Application Errorにならないための)Node.jsアプリのデプロイ入門](http://qiita.com/oden/items/9341b672917afb43a817)

パッケージのバージョン確認の方法  
[npmコマンドの使い方](http://qiita.com/yoh-nak/items/8446bf12094c729d00fe)

```
sudo npm ls -g 
```

### Gitにpushできない！

よーわからんかったから作業ファイルを別のところにバックアップをとっておいて  
アプリ毎に与えられている(？)レポジトリをcloneしなおした

以下，公式に書いてあるとおり

```
heroku login  
heroku git:clone -a bresticky  
cd bresticky  
（更新後）  
git add .
git commit -am "message"  
git push heroku master
```

## Herokuのアプリの削除

[Herokuのアプリをターミナルで削除する](http://slowquery.hatenablog.com/entry/2014/04/06/112330)


## ローカルホストの起動

```
heroku local
```


## 学んだこと
・GETとPOSTは共存しない  

TypeError: Cannot read property 'replace' of undefined  
⇒パスのミスがほとんど

・location.href ="" のあとにresponse.renderを呼ぶ  
この順序が大事



## ToDo

<en-todo/>roomIDに基づいてデータストアからの読み込み制御  
<en-todo/>node-js-getting-startedって名前を変える（appをルートにしたい）    
<en-todo/>ブラウザで「戻る」ボタンを押したときのroomIDの変更について考える  
<en-todo/>ブレスト部屋の保存期間に関する議論  
<en-todo/>削除時の挙動について議論  
  ・現状は非表示⇒リロードで再描画される  
  ・削除の状態もデータとして保持しとく？？  
<en-todo/>部屋がないときのエラーページ作成






