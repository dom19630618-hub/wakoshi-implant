# 🏗 中央管理式コンポーネント方式（UCS）設計・開発ガイドライン

本ドキュメントは、Webサイト制作（LP）における開発ルール、コンポーネント管理、およびディレクトリ構造を定義するものである。
開発者およびAIエージェント（Antigravity）は、本ガイドラインに厳格に従い、一貫性のある保守性の高いコードベースを維持すること。

---

## 🎨 1. デザインシステム定義

### ブランドカラー（Brand Colors）
全てのUIコンポーネントは、以下のカラーパレットに基づいて設計すること。

| 用途 | カラーコード | 備考 |
| :--- | :--- | :--- |
| **Primary (Main)** | `#cd1f5b` | メインアクセント、重要ボタン、見出し強調 |
| **Secondary** | `#d63a6e` | プライマリのバリエーション、ホバー状態など |
| **Tertiary** | `#B33F5A` | 落ち着いた深みのある赤 |
| **Background (Light)** | `#FCECEF` | 非常に薄いピンク、セクション背景用 |
| **Background (White)** | `#fff4f6` | ほぼ白に近いピンク、カード背景など |

### スタイリング方針
- **Framework**: Tailwind CSS を標準とする。
- **原則**: コンポーネント固有のCSSファイルは作成せず、Utility Classで完結させること。
- **例外**: アニメーション定義など、Tailwindで表現不可能な場合のみ `<style>` タグをコンポーネントHTML内に含めることを許可する。

---

## 🧩 2. UCS（Universal Component System）基本仕様

### 概要
LP（ランディングページ）の構築において、HTMLファイルへのコード直書きを廃止し、独立した部品（コンポーネント）を動的に読み込むアーキテクチャを採用する。

- **Component Loader**: `public/js/component_loader.js` がページロード時に `use:ComponentName` 構文を検出し、対応するHTMLファイルを `/modules/` から非同期に取得（Fetch）してDOMに注入する。
- **Modules**: 全てのUI部品は `/public/modules/` ディレクトリに断片化されたHTMLファイルとして配置する。

### 呼び出し構文（Syntax）
`index.html` などのページファイルには、コンポーネントのプレースホルダーのみを記述する。

```html
<!-- 正しい記述例 -->
<main>
    use:Hero_画像付き
    use:Features_Grid
    use:CTA_Box
</main>
use:Footer
```

### ディレクトリ構成（Directory Structure）
```ansi
project-root/
  ├── public/                 # 公開ルート
  │   ├── index.html          # エントリーポイント（UCS構文のみ記述）
  │   ├── js/
  │   │   ├── component_loader.js  # コアローダー
  │   │   └── gallery_loader.js    # ギャラリー専用ローダー
  │   └── modules/            # コンポーネント格納ディレクトリ
  │       ├── Hero_画像付き.html
  │       ├── Header.html
  │       ├── Footer.html
  │       ├── gallery.json    # データファイル（必要な場合）
  │       └── ...
  └── package.json            # 開発依存関係
```

---

## ⚠️ 3. 【最重要】クリティカル例外規定（Critical Exceptions）

### 🔥 ギャラリーコンポーネントの取り扱い
**対象コンポーネント**: `Gallery_CardCarousel`

#### ルール：コンポーネント化（動的読み込み）の完全禁止
ギャラリーコンポーネントは、`component_loader.js` による `use:` 構文での読み込みを行ってはならない。
必ず **`index.html` に直接HTML構造を記述（直書き）すること**。

#### 理由（Reasons）
1.  **Hydration Timing**: 動的読み込みの場合、DOM生成のタイミングが遅れ、JavaScriptによるスライダー初期化（Hydration）や幅計算が正しく行われないリスクがある（高さ0判定による消失バグなど）。
2.  **Stable Structure**: カルーセルライブラリや複雑なJSロジックは、ページロード直後にDOMが確実に存在していることを前提とするため。

#### 実装パターン（Implementation Pattern）
`index.html` には以下のように構造を直接配置する。

```html
<!-- index.html -->
<div class="w-full overflow-hidden bg-white py-8 relative group" id="gallery-container">
    <div class="gallery-track w-max flex gap-4 ...">
        <!-- JSにより動的にカードが注入される -->
    </div>
    <template id="gallery-card-template">
        <!-- カードのひな形 -->
    </template>
</div>
```

---

## 📜 4. コンポーネント開発・運用ルール

### 生成・開発ルール
1.  **ファイル名**: PascalCase（アッパーキャメルケース）を使用する。
    *   例: `Hero_Image.html`, `Feature_List.html`
2.  **HTMLレス原則**: `index.html` などの親ファイルには、レイアウト用の `<div>` コンテナすら書かず、可能な限り `use:ComponentName` だけを羅列する構成を目指す。
3.  **外部スクリプトの禁止**: コンポーネントHTMLファイル内 (`/modules/*.html`) で `<script src="...">` を使用してはならない。必要なライブラリは `index.html` で一元管理する。

### 禁止事項（Prohibitions）
- ❌ **LP直書きHTML**: コンポーネント化できる要素を `index.html` に直接書くこと（※ギャラリーを除く）。
- ❌ **特定LP専用の記述**: コンポーネント内に、特定のキャンペーンや一時的なLPでしか使わないIDやクラスをハードコードすること。再利用性を常に意識する。
- ❌ **インラインJavaScriptの乱用**: コンポーネントHTML内に複雑な `<script>` タグを埋め込むことは避ける。汎用的なロジックは `/public/js/*.js` に切り出し、分離する。

---

## 📂 5. 推奨コンポーネント一覧

今後作成または整備すべき標準コンポーネントセット。

| コンポーネント名 | ファイル名例 | 役割・概要 |
| :--- | :--- | :--- |
| **Hero** | `Hero_画像付き.html` | ファーストビュー。画像＋キャッチコピー。 |
| **Header** | `Header.html` | サイト共通ヘッダー。ナビゲーション。 |
| **Footer** | `Footer.html` | サイト共通フッター。コピーライト、リンク。 |
| **Message** | `Message_Intro.html` | 挨拶文やリード文のセクション。 |
| **Features** | `Features_Grid.html` | 特徴をグリッドやリストで紹介するセクション。 |
| **CTA** | `CTA_固定ヘッダー.html` | コンバージョン（予約・購入）への誘導エリア。 |
| **FAQ** | `FAQ_即時荷重.html` | よくある質問リスト（アコーディオン等）。 |
| **Access** | `Access_和光.html` | 地図、住所、診療時間情報。 |
| **Compare** | `Compare_DentureImplant.html` | 比較表（Before/After や プラン比較）。 |
| **Gallery** | *(直書き推奨)* | 症例写真や院内風景のスライダー。 |

---

## 🛠 6. バージョン管理とデプロイ
- **Git**: 変更完了後は必ずコミットし、リモートリポジトリ（GitHub）へプッシュする。
- **動作確認**: ローカル開発時は `npm run dev` (BrowserSync) を使用し、クラウド環境（Cloudflare Pagesなど）とのパス互換性（相対パス `./modules/` の使用）に留意する。

このガイドラインは、プロジェクトの成長に伴い適宜見直しを行うが、**「UCSの基本思想」と「ギャラリーの例外規定」は恒久的なルールとして厳守すること。**
