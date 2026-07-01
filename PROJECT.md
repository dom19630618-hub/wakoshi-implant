# PROJECT.md (Antigravityが必ず読むプロジェクトの中核仕様書)

プロジェクトmdはAntigravityが何よりも最優先する唯一の仕様書である。

## Core Topics (常に先頭に来る目次)
- **このプロジェクトの目的**: 和光市インプラントのLP制作。100%の再現性とメンテナンス性の両立。
- **使用する技術**: HTML/CSS/JS (Vanilla), Cloudflare Pages, Wrangler CLI.
- **設計原則**: UCS (Universal Component System) によるモジュール化。
- **AIエージェント (Gemini / Antigravity / GPT) は、このドキュメントを最優先かつ唯一の設計図として参照し、更新すること。**

---

## 🎨 1. デザインシステム定義

### ブランドカラー（Brand Colors）
| 用途 | カラーコード | 役割・説明 |
| :--- | :--- | :--- |
| **Primary (Main)** | `#B33F5A` | メインテーマカラー（落ち着いた上品なボルドー赤） |
| **Secondary (Vivid)** | `#d64f6d` | アクセント・ホバー用（華やかなローズレッド） |
| **Primary Dark** | `#8c2e43` | 濃色部分用（深みのあるワインレッド） |
| **Background (Light)** | `#FCECEF` | セクション背景等の薄いピンクベージュ |

### スタイリング方針
- **Framework**: Vanilla CSS (`public/css/style.css`) を使用する。
- **コンポーネント背景**: 白に近いピンク（`#fff4f6` や `#FCECEF` のブレンド）などを活用し、単調な白を避ける。
- **余白の一括管理**: セクション（外箱）の上下余白は `--section-padding-y`（PC: 60px / スマホ: 35px）変数を用いてサイト全体で統一する。

---

## 🧩 2. UCS (Universal Component System)

### 概要
`public/js/component_loader.js` を使用し、`use:ComponentName` 構文で外部HTMLを動的に読み込む。

#### 呼び出し例:
```html
<div use:PageHeader data-title="医院情報"></div>
```

### ⚠️ クリティカル例外規定 (Critical Exceptions)
**ギャラリーコンポーネント (`Gallery_CardCarousel`) の取り扱い**:
- **動的読み込みの完全禁止**: JavaScriptの初期化タイミングの問題（スライダー機能の不具合）を避けるため、必ず `index.html` に直接HTML構造を記述（直書き）すること。

---

## 📂 3. ディレクトリ構造
- `/public/index.html`: エントリーポイント
- `/public/modules/`: UCSコンポーネント（PascalCase.html）
- `/public/css/`: デザインシステムCSS
- `/public/js/`: ローダー、スライダー等のロジック
- `/public/images/`: 画像資産
- `/public/fonts/`: ブランドフォント資産 (`aoharu-marker-mini.otf` 等)

---

## 🚀 4. コンポーネント開発ルール
1. **ファイル名**: PascalCase (`Header.html`, `Hero_Image.html`)
2. **HTMLレス**: ページファイルには構造を極力書かず、`use:` のみを記述する。
3. **カプセル化**: スタイルが特定のコンポーネントに強く依存する場合のみ、コンポーネント内に `<style>` を許可するが、可能な限り共通CSSで管理する。

---

## 🛠 5. 開発・デプロイ・ワークフロー (憲法の掟)

作業完了時、AIエージェントは以下の手順を**一括で、かつ自動で**実行すること。

1. **最速デプロイ (Cloudflare Direct Upload)**:
   `npx wrangler pages deploy public` を実行し、即座に本番環境を更新する。
2. **バックグラウンド同期 (Git Sync)**:
   デプロイ成功後、作業の差分を Git にコミットし、リモート（GitHub）へプッシュする。
   - コミットメッセージには、変更の要約を含める。
3. **ガードレールの遵守**:
   `wrangler.toml` に設定された `account_id` と、ローカルの `git config` を常に使用し、誤ったアカウントへのデプロイを物理的に遮断する。

---

## 🔒 6. 環境とガードレール設定
- **Cloudflare Account ID**: `936e369e3f65741309936fa4e241f16b`
- **Cloudflare Email**: `dom19630618@gmail.com`
- **Git Account**: `dom19630618-hub` (Local Identity 修正済み)
