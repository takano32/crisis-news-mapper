
## nodejs 10.16.3 をセットアップする

Firebaseでサポートされているのは
`nodejs v8系` または `nodejs v10系` なので、
`10.16.3 LTS` を使う

### Linux の場合
```
apt install nodejs
npm install n
n install 10.16.3
apt remove nodejs
```

### Windows10 の場合
```
choco install nodejs-lts
```

## `firebase-tools` をセットアップする
```
npm install -g firebase-tools
firebase login
firebase projects:list
```

## GOOGLE_APPLICATION_CREDENTIALS環境変数をセットする
  - `news-mapper/key.json` というファイルが必要
  - Windows 10 の場合
    - `$env:GOOGLE_APPLICATION_CREDENTIALS="[PATH]"`
  - Linux の場合
    - `export GOOGLE_APPLICATION_CREDENTIALS="[PATH]"`


## 依存関係をインストールしてビルド
```
cd functions
npm install
npm run build
```

## 起動
```
cd ..
firebase serve
```

## ブラウザで確認
  - http://localhost:5000/