## Core Topics (常に先頭に来る目次)
- **使用する技術**: HTML/CSS/JS (Vanilla), Cloudflare Pages, Wrangler CLI.
- **設計原則**: UCS (Universal Component System) によるモジュール化。
#
### ブランドカラー（Brand Colors）
- **Primary**: #A32E48 (メイン ボルドー赤)
- **Secondary**: #B33F5A (アクセント ローズレッド)
- **Primary Dark**: #A32E48 (濃色 ダークワイン)
- **Background**: #F8F6F2 (背景 ピンクベージュ)

### スタイリング方針
- **Framework**: Vanilla CSS (`public/css/style.css`) を使用する。
- **コンポーネント背景**: #F8F6F2または#ffffffが基本だがセクションによっては違う色を使うことがある
- **余白の一括管理**: セクション（外箱）の上下余白は `--section-padding-y`（PC: 60px / スマホ: 35px）変数を用いてサイト全体で統一する。

## 🧩 2. UCS (Universal Component System)
- **概要**: `public/js/component_loader.js` を使用し、HTML内の `use:フォルダ/コンポーネント名` を動的展開。

## 📂 3. 独自ディレクトリ構造
- `/public/modules/`: UCSコンポーネント用（日本語命名可）。ページ毎のサブフォルダ(例:`03/`)を利用。
  ※ css, js, assets等は標準構成のため省略。

## 🚀 4. コンポーネント開発ルール
- **命名**: 原則日本語（例: `よくある質問.html`）。PageHeader等は例外。
- **パス**: サブフォルダ内は `use:03/ヒーロー` のように指定。
- **HTMLレス**: ページファイル本体には構造を書かず、`use:` のみを記述。
- **スタイル**: 原則共通CSS管理。特定コンポーネント依存時のみ `<style>` を許容。

## 🛠 5. 開発・デプロイ・ワークフロー
- **完了時手順**: `npx wrangler pages deploy public` で即時デプロイ ➡️ Gitコミット＆プッシュ。
- **ガードレール**: `wrangler.toml` (Account ID等) およびローカル `git config` を厳守すること。
