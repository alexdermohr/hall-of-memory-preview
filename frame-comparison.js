(() => {
  const toggles = Array.from(document.querySelectorAll('[data-frame-shell-toggle]'));
  if (toggles.length === 0) return;

  const variantLinks = Array.from(document.querySelectorAll('[data-frame-variant-link]'));
  const shellTargets = Array.from(document.querySelectorAll('.demo-hero-image-wrap, .frame-comparison-preview'));

  const syncVariantLinks = (shellOff) => {
    for (const link of variantLinks) {
      const href = link.getAttribute('href');
      if (!href) continue;
      const url = new URL(href, window.location.href);
      if (shellOff) url.searchParams.set('kasten', 'aus');
      else url.searchParams.delete('kasten');
      link.setAttribute('href', `${url.pathname}${url.search}${url.hash}`);
    }
  };

  const apply = (shellOff, syncUrl) => {
    document.body.dataset.demoFrameShell = shellOff ? 'off' : 'on';

    for (const target of shellTargets) {
      target.style.borderColor = shellOff ? 'transparent' : '';
      target.style.boxShadow = shellOff ? 'none' : '';
    }

    for (const toggle of toggles) {
      toggle.setAttribute('aria-pressed', String(shellOff));
      toggle.dataset.frameShellState = shellOff ? 'off' : 'on';
      toggle.setAttribute('aria-label', shellOff ? 'Außenkasten einblenden' : 'Außenkasten ausblenden');
      const label = toggle.querySelector('[data-frame-shell-label]');
      if (label) label.textContent = shellOff ? 'Außenkasten: aus' : 'Außenkasten: an';
      else toggle.textContent = shellOff ? 'Außenkasten: aus' : 'Außenkasten: an';
    }

    syncVariantLinks(shellOff);

    if (syncUrl) {
      const url = new URL(window.location.href);
      if (shellOff) url.searchParams.set('kasten', 'aus');
      else url.searchParams.delete('kasten');
      window.history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
    }
  };

  const initialShellOff = new URL(window.location.href).searchParams.get('kasten') === 'aus';
  apply(initialShellOff, false);

  for (const toggle of toggles) {
    toggle.addEventListener('click', () => {
      apply(document.body.dataset.demoFrameShell !== 'off', true);
    });
  }
})();
