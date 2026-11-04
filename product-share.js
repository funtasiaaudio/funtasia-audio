/* FUNtasia Audio product-card sharing: no purchase claim or tracking. */
(() => {
  const locale = (document.documentElement.lang || 'en').toLowerCase();
  const labels = locale.startsWith('ja') ? {share:'シェア', copy:'Instagram用URLをコピー', image:'画像を保存', copied:'コピーしました', failed:'URLを選択してコピーしてください'} :
    locale.startsWith('de') ? {share:'Teilen', copy:'Instagram-Link kopieren', image:'Bild speichern', copied:'Kopiert', failed:'Link manuell kopieren'} :
    locale.startsWith('fr') ? {share:'Partager', copy:'Copier le lien Instagram', image:'Enregistrer l’image', copied:'Copié', failed:'Copiez le lien manuellement'} :
    locale.startsWith('ru') ? {share:'Поделиться', copy:'Копировать ссылку для Instagram', image:'Сохранить изображение', copied:'Скопировано', failed:'Скопируйте ссылку вручную'} :
    {share:'Share', copy:'Copy URL for Instagram', image:'Save image', copied:'Copied', failed:'Copy the URL manually'};
  const css = document.createElement('style');
  css.textContent = '.product-share{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-top:14px}.product-share-label{font-size:11px;letter-spacing:.08em;opacity:.7}.product-share a,.product-share button{font:inherit;font-size:12px;line-height:1.4;color:inherit;background:transparent;border:1px solid currentColor;border-radius:999px;padding:6px 11px;cursor:pointer;text-decoration:none;opacity:.85}.product-share a:hover,.product-share button:hover{opacity:1}.product-share :focus-visible{outline:2px solid currentColor;outline-offset:3px}.product-share-status{font-size:11px;opacity:.75}';
  document.head.appendChild(css);
  const used = new Set(Array.from(document.querySelectorAll('[id]')).map(e => e.id));
  document.querySelectorAll('article.product-card').forEach((card, index) => {
    if (card.querySelector('.product-share')) return;
    const title = (card.querySelector('h3')?.textContent || card.dataset.cardLabel || '').trim();
    if (!title) return;
    if (!card.id) {
      const base = 'product-' + title.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
      let id = base || 'product-' + (index + 1), n = 2;
      while (used.has(id)) id = base + '-' + n++;
      card.id = id; used.add(id);
    }
    const url = new URL('#' + encodeURIComponent(card.id), location.href).href;
    const shareText = 'FUNtasia Audio | ' + title;
    const wrap = document.createElement('div'); wrap.className = 'product-share';
    const label = document.createElement('span'); label.className = 'product-share-label'; label.textContent = labels.share;
    const x = document.createElement('a'); x.textContent = 'X'; x.href = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(shareText) + '&url=' + encodeURIComponent(url); x.target = '_blank'; x.rel = 'noopener noreferrer'; x.setAttribute('aria-label', title + ' — X');
    const copy = document.createElement('button'); copy.type = 'button'; copy.textContent = 'Instagram · ' + labels.copy;
    const status = document.createElement('span'); status.className = 'product-share-status'; status.setAttribute('role','status');
    copy.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(url); status.textContent = labels.copied; }
      catch (_) { window.prompt(labels.failed, url); }
    });
    wrap.append(label,x,copy);
    const img = card.querySelector('img.product-shot, img');
    if (img) {
      const image = document.createElement('a'); image.textContent = labels.image;
      image.href = new URL(img.getAttribute('src'), document.baseURI).href;
      image.download = (card.id || 'funtasia-product') + '-share-image';
      image.setAttribute('aria-label', title + ' — ' + labels.image);
      wrap.append(image);
    }
    wrap.append(status);
    (card.querySelector('.product-copy') || card).append(wrap);
  });
})();
