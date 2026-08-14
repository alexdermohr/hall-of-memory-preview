(() => {
  const shellToggles = Array.from(document.querySelectorAll('[data-frame-shell-toggle]'));
  const modeButtons = Array.from(document.querySelectorAll('[data-frame-mode]'));
  if (shellToggles.length === 0 && modeButtons.length === 0) return;

  const variantLinks = Array.from(document.querySelectorAll('[data-frame-variant-link]'));
  let shellOn = false;
  let imageMode = 'inner';

  const syncVariantLinks = () => {
    for (const link of variantLinks) {
      const href = link.getAttribute('href');
      if (!href) continue;
      const url = new URL(href, window.location.href);
      if (shellOn) url.searchParams.set('kasten', 'an');
      else url.searchParams.delete('kasten');
      if (imageMode === 'full') url.searchParams.set('bild', 'full');
      else url.searchParams.delete('bild');
      link.setAttribute('href', `${url.pathname}${url.search}${url.hash}`);
    }
  };

  const syncUrl = () => {
    const url = new URL(window.location.href);
    if (shellOn) url.searchParams.set('kasten', 'an');
    else url.searchParams.delete('kasten');
    if (imageMode === 'full') url.searchParams.set('bild', 'full');
    else url.searchParams.delete('bild');
    window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
  };

  const render = (writeUrl = false) => {
    document.body.dataset.demoFrameShell = shellOn ? 'on' : 'off';
    document.body.dataset.demoFrameImageMode = imageMode;
    for (const toggle of shellToggles) {
      toggle.setAttribute('aria-pressed', String(shellOn));
      toggle.setAttribute('aria-label', shellOn ? 'Zusatzkasten ausblenden' : 'Zusatzkasten einblenden');
      const label = toggle.querySelector('[data-frame-shell-label]');
      const text = shellOn ? 'Zusatzkasten: an' : 'Zusatzkasten: aus';
      if (label) label.textContent = text;
      else toggle.textContent = text;
    }
    for (const button of modeButtons) {
      button.setAttribute('aria-pressed', String(button.dataset.frameMode === imageMode));
    }
    syncVariantLinks();
    if (writeUrl) syncUrl();
  };

  const params = new URL(window.location.href).searchParams;
  shellOn = params.get('kasten') === 'an';
  imageMode = params.get('bild') === 'full' ? 'full' : 'inner';
  render(false);

  for (const toggle of shellToggles) {
    toggle.addEventListener('click', () => { shellOn = !shellOn; render(true); });
  }
  for (const button of modeButtons) {
    button.addEventListener('click', () => {
      imageMode = button.dataset.frameMode === 'full' ? 'full' : 'inner';
      render(true);
    });
  }
})();
