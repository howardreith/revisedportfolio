(() => {
  const config = window.HOWIE_SITE_CONFIG || { videoSources: {}, contactForm: {} };

  const navToggle = document.querySelector('.nav-toggle');
  const siteNav = document.querySelector('.site-nav');
  if (navToggle && siteNav) {
    navToggle.addEventListener('click', () => {
      const open = siteNav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(open));
    });
  }

  document.querySelectorAll('[data-current-year]').forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  const getYouTubeId = (input) => {
    if (!input || typeof input !== 'string') return '';

    try {
      const url = new URL(input);
      const host = url.hostname.replace(/^www\./, '');
      const parts = url.pathname.split('/').filter(Boolean);

      if (host === 'youtu.be') return parts[0] || '';

      if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'youtube-nocookie.com') {
        if (url.pathname === '/watch') return url.searchParams.get('v') || '';
        if (parts[0] === 'embed' || parts[0] === 'shorts') return parts[1] || '';
      }
    } catch (error) {
      return '';
    }

    return '';
  };

  const normalizeVideoSource = (rawSource) => {
    if (!rawSource) return { kind: 'empty', src: '' };

    if (typeof rawSource === 'object') {
      const src = rawSource.src || '';
      const type = (rawSource.type || '').toLowerCase();
      if (type === 'youtube' && getYouTubeId(src)) return { kind: 'youtube', src };
      if (src) return { kind: 'mp4', src };
      return { kind: 'empty', src: '' };
    }

    if (typeof rawSource === 'string') {
      if (getYouTubeId(rawSource)) return { kind: 'youtube', src: rawSource };
      return rawSource ? { kind: 'mp4', src: rawSource } : { kind: 'empty', src: '' };
    }

    return { kind: 'empty', src: '' };
  };

  const configureVideos = () => {
    document.querySelectorAll('[data-config-video]').forEach((shell) => {
      const key = shell.getAttribute('data-config-video');
      const sourceConfig = normalizeVideoSource(config.videoSources?.[key] || '');
      const video = shell.querySelector('video');
      const poster = shell.querySelector('.video-shell__poster');
      const existingEmbeds = shell.querySelectorAll('[data-config-embed]');

      existingEmbeds.forEach((node) => node.remove());
      if (!video) return;

      video.querySelectorAll('source').forEach((node) => node.remove());

      if (sourceConfig.kind === 'youtube') {
        const videoId = getYouTubeId(sourceConfig.src);
        if (!videoId) {
          video.pause();
          video.hidden = true;
          video.removeAttribute('controls');
          if (poster) poster.hidden = false;
          shell.dataset.videoState = 'placeholder';
          return;
        }

        video.pause();
        video.hidden = true;
        video.removeAttribute('controls');
        video.removeAttribute('src');

        const iframe = document.createElement('iframe');
        iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?rel=0`;
        iframe.title = 'Embedded video';
        iframe.loading = 'lazy';
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
        iframe.allowFullscreen = true;
        iframe.setAttribute('data-config-embed', 'youtube');
        shell.appendChild(iframe);

        if (poster) poster.hidden = true;
        shell.dataset.videoState = 'ready';
        return;
      }

      if (sourceConfig.kind === 'mp4' && sourceConfig.src) {
        const source = document.createElement('source');
        source.type = 'video/mp4';
        source.src = sourceConfig.src;
        video.appendChild(source);
        video.hidden = false;
        video.setAttribute('controls', 'controls');
        if (poster) poster.hidden = true;
        shell.dataset.videoState = 'ready';
        video.load();
        return;
      }

      video.pause();
      video.hidden = true;
      video.removeAttribute('controls');
      video.removeAttribute('src');
      if (poster) poster.hidden = false;
      shell.dataset.videoState = 'placeholder';
    });
  };

  const mediaTabs = Array.from(document.querySelectorAll('.media-tab'));
  const mediaPanels = Array.from(document.querySelectorAll('[data-media-panel]'));
  const performanceTabs = Array.from(document.querySelectorAll('.subtab[data-performance-target]'));
  const performancePanels = Array.from(document.querySelectorAll('[data-performance-gallery]'));

  const legacyMap = {
    tuck: 'tuck',
    gatsby: 'gatsby',
    beauty: 'beauty',
    jekyll: 'jekyll',
    headshots: 'headshots'
  };

  const setMediaPanel = (name) => {
    mediaTabs.forEach((tab) => {
      const active = tab.dataset.mediaTarget === name;
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    mediaPanels.forEach((panel) => {
      const active = panel.dataset.mediaPanel === name;
      panel.classList.toggle('is-active', active);
      panel.hidden = !active;
    });
  };

  const setPerformancePanel = (name) => {
    performanceTabs.forEach((tab) => {
      const active = tab.dataset.performanceTarget === name;
      tab.classList.toggle('is-active', active);
      tab.setAttribute('aria-selected', active ? 'true' : 'false');
    });
    performancePanels.forEach((panel) => {
      const active = panel.dataset.performanceGallery === name;
      panel.classList.toggle('is-active', active);
      panel.hidden = !active;
    });
  };

  if (mediaTabs.length && mediaPanels.length) {
    mediaTabs.forEach((tab) => tab.addEventListener('click', () => setMediaPanel(tab.dataset.mediaTarget)));
    performanceTabs.forEach((tab) => tab.addEventListener('click', () => setPerformancePanel(tab.dataset.performanceTarget)));

    const params = new URLSearchParams(window.location.search);
    const section = params.get('section');
    const show = params.get('show') || legacyMap[params.get('gallery')] || 'showcase';

    const validSection = mediaTabs.some((tab) => tab.dataset.mediaTarget === section) ? section : mediaTabs[0].dataset.mediaTarget;
    setMediaPanel(validSection);

    if (performanceTabs.length) {
      const validShow = performanceTabs.some((tab) => tab.dataset.performanceTarget === show) ? show : performanceTabs[0].dataset.performanceTarget;
      setPerformancePanel(validShow);
    }
  }

  const lightbox = document.getElementById('lightbox');
  const lightboxTriggers = document.querySelectorAll('[data-lightbox-src]');
  if (lightbox && lightboxTriggers.length) {
    const image = lightbox.querySelector('.lightbox__image');
    const caption = lightbox.querySelector('.lightbox__caption');
    const closeButton = lightbox.querySelector('.lightbox__close');

    const closeLightbox = () => {
      lightbox.hidden = true;
      image.src = '';
      image.alt = '';
      caption.textContent = '';
      document.documentElement.style.overflow = '';
    };

    lightboxTriggers.forEach((button) => {
      button.addEventListener('click', () => {
        image.src = button.dataset.lightboxSrc;
        image.alt = button.querySelector('img')?.alt || '';
        caption.textContent = button.dataset.lightboxCaption || '';
        lightbox.hidden = false;
        document.documentElement.style.overflow = 'hidden';
      });
    });

    closeButton?.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (event) => {
      if (event.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !lightbox.hidden) closeLightbox();
    });
  }

  const contactForm = document.querySelector('[data-contact-form]');
  if (contactForm) {
    const endpoint = (config.contactForm?.endpoint || '').trim();
    if (endpoint) {
      contactForm.action = endpoint;
    }
  }

  const copyButtons = document.querySelectorAll('[data-copy-url]');
  if (copyButtons.length) {
    const fallbackCopy = (text) => {
      const helper = document.createElement('textarea');
      helper.value = text;
      helper.setAttribute('readonly', 'readonly');
      helper.style.position = 'absolute';
      helper.style.left = '-9999px';
      document.body.appendChild(helper);
      helper.select();
      document.execCommand('copy');
      document.body.removeChild(helper);
    };

    copyButtons.forEach((button) => {
      const defaultLabel = button.textContent;
      button.addEventListener('click', async () => {
        const text = button.dataset.copyUrl || window.location.href;
        try {
          if (navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(text);
          } else {
            fallbackCopy(text);
          }
          button.textContent = 'Copied';
          window.setTimeout(() => {
            button.textContent = defaultLabel;
          }, 1800);
        } catch (error) {
          fallbackCopy(text);
          button.textContent = 'Copied';
          window.setTimeout(() => {
            button.textContent = defaultLabel;
          }, 1800);
        }
      });
    });
  }

  const shareReelButton = document.getElementById('share-reel-button');

  if (shareReelButton) {
    shareReelButton.addEventListener('click', async () => {
      const reelUrl = `${window.location.origin}/reel/`;

      try {
        await navigator.clipboard.writeText(reelUrl);

        const originalText = shareReelButton.textContent;
        shareReelButton.textContent = 'Copied to Clipboard';
        shareReelButton.disabled = true;

        setTimeout(() => {
          shareReelButton.textContent = originalText;
          shareReelButton.disabled = false;
        }, 1600);
      } catch (error) {
        window.prompt('Copy this reel link:', reelUrl);
      }
    });
  }

  configureVideos();
})();
