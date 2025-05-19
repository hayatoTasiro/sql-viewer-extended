# SQL Log Viewer（拡張版）

SequelizeのSQLログを整形・色分け・検索表示するElectronアプリです。
このバージョンでは以下の機能を含んでいます。

## 🆕 拡張された機能

- ✅ **ログファイル選択ダイアログ**
- ✅ **SQLクリックでコピー**
- ✅ SQL整形・スキーマ名除去
- ✅ クエリ種別で色分け（SELECT, INSERT, UPDATE, DELETE）
- ✅ 検索フィルタ

## 📦 セットアップ

```bash
npm install
npm start
```

## 🏗 使用ライブラリ

- Electron
- chokidar（ファイル監視）
- sql-formatter（SQL整形）

## 🖼 使用手順

1. アプリ起動後、`ログファイルを選択`ボタンを押す
2. `sql.log`を選択
3. SELECT/INSERTなどが色分け表示されます
4. クエリをクリックすると内容がクリップボードにコピーされます
5. 検索欄でフィルターも可能です

---