const button=document.querySelector('.menu');
const nav=document.querySelector('.site-header nav');
button?.addEventListener('click',()=>{
  const open=nav.classList.toggle('open');
  button.setAttribute('aria-expanded',String(open));
});
nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
  nav.classList.remove('open');
  button?.setAttribute('aria-expanded','false');
}));

// Resolve the real release asset instead of hard-coding a ZIP filename.
// If the release has no unambiguous Windows plugin ZIP, keep the Releases link.
const funKickButtons = document.querySelectorAll('[data-fun-kick-download]');
if (funKickButtons.length) {
  const releasePage = 'https://github.com/funtasiaaudio/FUN-Kick/releases/tag/V1.0.1';
  const releaseApi = 'https://api.github.com/repos/funtasiaaudio/FUN-Kick/releases/tags/V1.0.1';
  const scoreAsset = (name) =>
    (/windows|win64|win_x64|win-x64|win\.zip/i.test(name) ? 4 : 0) +
    (/x64|64bit|64-bit/i.test(name) ? 2 : 0) +
    (/vst3/i.test(name) ? 2 : 0) +
    (/kick/i.test(name) ? 1 : 0);
  const downloadUrlPromise = fetch(releaseApi, {
    headers: { Accept: 'application/vnd.github+json' }
  }).then(response => {
    if (!response.ok) throw new Error('FUN Kick release is unavailable');
    return response.json();
  }).then(release => {
    // Never serve a plugin ZIP belonging to a different version.
    if (String(release.tag_name || '').toLowerCase() !== 'v1.0.1') return null;
    const zipAssets = (release.assets || []).filter(asset =>
      asset.state === 'uploaded' &&
      /\.zip$/i.test(asset.name || '') &&
      !/manual|documentation|docs|source|src|debug|symbol|linux|macos|mac-os|darwin/i.test(asset.name) &&
      /^https:\/\/github\.com\/funtasiaaudio\/FUN-Kick\/releases\/download\//i.test(asset.browser_download_url || '')
    );
    zipAssets.sort((a, b) => scoreAsset(b.name) - scoreAsset(a.name));
    if (!zipAssets.length) return null;
    if (zipAssets.length > 1 && scoreAsset(zipAssets[0].name) === scoreAsset(zipAssets[1].name)) {
      return null; // Do not guess between equally likely assets.
    }
    return zipAssets[0].browser_download_url;
  }).catch(() => null);
  downloadUrlPromise.then(url => {
    funKickButtons.forEach(link => {
      link.href = url || releasePage;
      link.dataset.downloadReady = url ? 'true' : 'false';
      if (!url) link.textContent = link.dataset.downloadFallback || 'VIEW RELEASE';
    });
  });
  funKickButtons.forEach(link => {
    link.addEventListener('click', async event => {
      if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      if (link.dataset.downloadReady === 'true') return;
      event.preventDefault();
      const url = await downloadUrlPromise;
      window.location.assign(url || releasePage);
    });
  });
}



// Promotional card images are loaded only when the corresponding WebP exists.
// Until uploaded, the original GUI screenshots remain visible (non-destructive fallback).
(() => {
  const scriptTag = [...document.scripts].find(s => /(?:^|\/)script\.js(?:\?.*)?$/.test(s.src));
  const baseUrl = scriptTag ? scriptTag.src : document.baseURI;
  const captions = {ja:"元のGUI",ko:"원본 GUI", "zh-tw":"실제 UI",en:"Original GUI"};
  const lang = String(document.documentElement.lang || "en").toLowerCase();
  const caption = lang.startsWith("ja") ? captions.ja : lang.startsWith("ko") ? captions.ko : lang.startsWith("zh") ? "原始 GUI" : captions.en;
  function activate(card,src){
    const direct = card.querySelector("img.product-shot");
    if(direct){
      const old=direct.getAttribute("src");
      const link=document.createElement("a");
      link.className="card-art-link";
      link.href=new URL(old,document.baseURI).href;
      link.target="_blank";
      link.rel="noopener noreferrer";
      link.setAttribute("aria-label",caption+": "+(direct.alt || ""));
      direct.parentNode.insertBefore(link,direct);
      link.appendChild(direct);
      direct.src=src;
      direct.alt=(card.dataset.cardLabel || "FUNtasia Audio")+" promotional artwork";
      direct.classList.add("card-art-active");
      return;
    }
    const gallery=card.querySelector(".dynamics-gallery,.filter-pack-gallery");
    if(!gallery)return;
    const hero=document.createElement("div");
    hero.className="product-promo-art";
    const picture=document.createElement("img");
    picture.src=src;
    picture.alt=(card.dataset.cardLabel || "FUNtasia Audio")+" promotional artwork";
    picture.loading="lazy";
    picture.decoding="async";
    hero.appendChild(picture);
    const links=document.createElement("div");
    links.className="original-gui-links";
    const heading=document.createElement("span");
    heading.textContent=caption+":";
    links.appendChild(heading);
    gallery.querySelectorAll("figure").forEach(figure=>{
      const original=figure.querySelector("img");
      if(!original)return;
      const a=figure.querySelector("a[href]");
      const href=a?a.getAttribute("href"):original.getAttribute("src");
      const anchor=document.createElement("a");
      anchor.href=new URL(href,document.baseURI).href;
      anchor.target="_blank";anchor.rel="noopener noreferrer";
      const figcaption=figure.querySelector("figcaption");
      anchor.textContent=(figcaption?figcaption.textContent:original.alt).trim();
      links.appendChild(anchor);
    });
    hero.appendChild(links);
    gallery.parentNode.insertBefore(hero,gallery);
    gallery.style.display="none";
  }
  function testCard(card){
    const file=card.dataset.cardArt;
    if(!/^card-fun-[a-z0-9-]+\.webp$/.test(file || ""))return;
    const src=new URL(file,baseUrl).href;
    const probe=new Image();
    probe.onload=()=>activate(card,src);
    probe.onerror=()=>{}; // Never replace a working original with a missing asset.
    probe.src=src;
  }
  function start(){
    const cards=[...document.querySelectorAll("article[data-card-art]")];
    if("IntersectionObserver" in window){
      const observer=new IntersectionObserver(entries=>{
        entries.forEach(entry=>{if(entry.isIntersecting){observer.unobserve(entry.target);testCard(entry.target);}});
      },{rootMargin:"900px"});
      cards.forEach(card=>observer.observe(card));
    }else cards.forEach(testCard);
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start,{once:true});
  else start();
})();
