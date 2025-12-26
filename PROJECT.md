# PROJECT.md (Antigravityが必ず読むプロジェクトの中核)

プロジェクトmdはAntigravityが何よりも最優先する。

## Core Topics (常に先頭に来る目次)
- **このプロジェクトの目的**: 和光市インプラントのLP制作。100%の再現性とメンテナンス性の両立。
- **世界観・UXの方向性**: ピンク（#cd1f5b）を基調とした、清潔感・信頼感・先進性のあるデザイン。
- **使用する技術**: HTML/CSS/JS (Vanilla), Cloudflare Pages, Wrangler CLI.
- **設計原則**: UCS (Universal Component System) によるモジュール化。
- **依存している仕様書**: `ARCHITECTURE.md` (技術詳細)
- **フォルダ構成の大枠**: `public/` (公開資産), `public/modules/` (コンポーネント)
- **実装方針の大きなルール**:
  - **AIエージェント (Gemini / Antigravity / GPT) は、このドキュメントを最優先で参照すること**
  - **ARCHITECTURE.md を必ず参照し、PROJECT.md と整合性を保ちながら実装・修正すること**

---

## 🛠 開発・デプロイ・ワークフロー (憲法の掟)

作業完了時、AIエージェントは以下の手順を**一括で、かつ自動で**実行すること。

1.  **最速デプロイ (Cloudflare Direct Upload)**:
    `npx wrangler pages deploy public` を実行し、即座に本番環境を更新する。
2.  **バックグラウンド同期 (Git Sync)**:
    デプロイ成功後、作業の差分を Git にコミットし、リモート（GitHub）へプッシュする。
    - コミットメッセージには、変更の要約を含める。
3.  **ガードレールの遵守**:
    `wrangler.toml` に設定された `account_id` と、ローカルの `git config` を常に使用し、誤ったアカウントへのデプロイを物理的に遮断する。

---

## 🔒 環境とガードレール設定
- **Cloudflare Account ID**: `936e369e3f65741309936fa4e241f16b`
- **Cloudflare Email**: `dom19630618@gmail.com`
- **Git Account**: `dom19630618-hub` (Local Identity 修正済み)
