# ARCHITECTURE.md (技術詳細仕様書)

本ドキュメントは `PROJECT.md`（憲法）に基づき、具体的な実装技術と設計の詳細を定義する。

---

## 🎨 1. デザインシステム定義

### ブランドカラー（Brand Colors）
| 用途 | カラーコード |
| :--- | :--- |
| **Primary (Main)** | `#cd1f5b` |
| **Secondary** | `#d63a6e` |
| **Tertiary** | `#B33F5A` |
| **Background (Light)** | `#FCECEF` |

### スタイリング方針
- **Framework**: Vanilla CSS (`public/css/style.css`)
- **コンポーネント背景**: 白に近いピンク（`#fff4f6`）などを活用し、単調な白を避ける。
- **フォント**: Noto Sans JP。

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
- **動的読み込みの完全禁止**: JavaScriptの初期化タイミングの問題を避けるため、必ず `index.html` に直接HTML構造を記述（直書き）すること。

---

## 📂 3. ディレクトリ構造
- `/public/index.html`: エントリーポイント
- `/public/modules/`: UCSコンポーネント（PascalCase.html）
- `/public/css/`: デザインシステムCSS
- `/public/js/`: ローダー、スライダー等のロジック
- `/public/images/`: 画像資産

---

## 🚀 4. コンポーネント開発ルール
1.  **ファイル名**: PascalCase (`Header.html`, `Hero_Image.html`)
2.  **HTMLレス**: ページファイルには構造を極力書かず、`use:` のみを羅列すること。
3.  **カプセル化**: スタイルが特定のコンポーネントに強く依存する場合のみ、コンポーネント内に `<style>` を許可するが、可能な限り共通CSSで管理する。
