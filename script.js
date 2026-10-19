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
