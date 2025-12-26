# 🔐 プロジェクト別アカウント固定ガイド（Cloudflare & Git）

本ドキュメントは、複数のプロジェクトやアカウントを使い分ける際に、誤った送信先（Cloudflare / GitHub）へのデプロイやプッシュを防ぐための設定手順を定義します。

---

## ☁️ 1. Cloudflare Account ID の固定

`wrangler.toml` に `account_id` を明記することで、ログイン中のアカウントと一致しない場合にデプロイを遮断します。

### 設定手順
1. 使用するアカウントでログイン:
   ```bash
   npx wrangler login
   ```
2. 正しい Account ID を取得:
   ```bash
   npx wrangler whoami
   ```
3. `wrangler.toml` のルートに ID を追加（コメントも推奨）:
   ```toml
   name = "project-name"
   pages_build_output_dir = "public"

   # Safety Guardrails
   # Cloudflare Email: target-email@example.com
   account_id = "your-account-id-here"
   ```

---

## 🐙 2. Git Local Identity の固定

プロジェクト（フォルダ）単位でコミットユーザーを固定し、グローバル設定による誤った Author 情報を防ぎます。

### 設定手順
プロジェクトのルートディレクトリで以下を実行します：
```bash
git config --local user.name "your-github-username"
git config --local user.email "your-email@example.com"
```

### 確認コマンド
```bash
git config --local --list
```

---

## ✅ 3. 運用ルール
- **新しいプロジェクト開始時**: 必ず上記設定を行い、誤送信を防ぐ「ガードレール」を構築すること。
- **デプロイ前チェック**: `npx wrangler project list` を実行し、現在のアカウント内に目的のプロジェクトが存在するか確認すること。
- **Git リモートURLの確認**: `git remote -v` で、意図したリポジトリに紐付いているか確認すること。
