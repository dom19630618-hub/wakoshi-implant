# Webサイト ブランドカラー

- **メインカラー**: `#cd1f5b` (ビビッドピンク)
- **H# 中央管理式コンポーネント開発ルール

LP制作は「中央管理式コンポーネント方式（Universal Component System）」で統一する。

## 1. 概念
- コンポーネントは `/modules/` ディレクトリ内でHTML/JSONとして一元管理する。
- LP（`index.html`等）には `use:コンポーネント名` と記述するだけで、対応するHTMLが展開される。
- これにより、コンポーネントを1箇所修正すれば全LPに反映される状態を維持する。

## 2. 呼び出しルール
- **記述形式**: `use:ComponentName`
- **動作**: 
  - システムは `/modules/ComponentName.html` を探し、その内容を `use:ComponentName` の箇所に展開する。
  - これは「HTMLを展開する命令」であり、ブラウザ上にテキストとして表示されてはならない。

## 3. ファイル構成例
- `/modules/Hero_画像付き.html`
- `/modules/Gallery_CardCarousel.html` (JS/CSS/JSONロジック含む)
- `/modules/Footer.html`

## 4. クリティカルな遵守事項
- LPファイルには具体的なHTMLコードを書かず、可能な限り `use:xxx` で構成すること。
- デザインは Tailwind CSS で統一する。
- 新規LP作成時は、既存コンポーネントを組み合わせることを最優先する。 `#d63a6e`
- **FAQ ローズレッド**: `#B33F5A`
- **淡色アクセント**: `#FCECEF`, `#fff4f6`
