class FaqItem extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        // 属性から値を取得
        const question = this.getAttribute('question') || '質問';
        const isOpen = this.hasAttribute('open');

        // 元の子要素（回答内容）を一意のコンテナに退避するか、innerHTMLとして取得
        // Light DOMで展開するため、内部構造を構築してからコンテンツを移動させる

        // 既存のコンテンツ（回答）を保存
        const answerContent = this.innerHTML;

        // 内部構造のHTMLテンプレート
        const html = `
      <details class="faq__item" ${isOpen ? 'open' : ''}>
        <summary class="faq__summary">
          <span class="faq__q-label">Q.</span>
          <span class="faq__q-text">${question}</span>
          <span class="faq__marker"></span>
        </summary>
        <div class="faq__answer">
          <div class="faq__answer-body">
            <span class="faq__a-label">A.</span>
            <div class="faq__answer-content">${answerContent}</div>
          </div>
        </div>
      </details>
    `;

        // コンテンツを置き換え
        this.innerHTML = html;

        // クラス付与（スタイリングの補助用、display: contents等を当てる必要がある場合など）
        // 現状のCSS構成だと、<faq-item>自体が邪魔をする可能性があるため、
        // faq-item { display: block; } をCSSに追加するか、
        // ここで style を当てる。
        this.style.display = 'block';
    }
}

// カスタム要素の登録
customElements.define('faq-item', FaqItem);
