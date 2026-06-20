export const APP_HIDE_CHROME_CSS = `
  #preloader, #original-load, #subsModal, #search-wrapper, #search,
  .header-area, .top-header, .original-nav-area, #stickyNav, #originalNav,
  .page-header, .header-basic, .menu-navbar, .header-search-box,
  .footer-area, .footer-social-area, .page-footer, .footer-col,
  .hero-area, .hero-slides, .page-hero, .hero-text-area, .hero-image-area,
  .classy-navbar-toggler, .navbarToggler, .modal, .subscribe,
  .sidebar-widget-area, .footer-cols {
    display: none !important;
    visibility: hidden !important;
    height: 0 !important;
    overflow: hidden !important;
  }

  html, body {
    margin: 0 !important;
    padding: 0 !important;
    background: #f8fafc !important;
    -webkit-text-size-adjust: 100%;
  }

  #main, .main-content-wrapper, .blog-content, .post-content,
  .single-blog-content, .container, .container-fluid {
    max-width: 100% !important;
    width: 100% !important;
    padding-left: 12px !important;
    padding-right: 12px !important;
    margin-top: 0 !important;
  }

  .row > [class*='col-lg-8'], .row > [class*='col-md-8'] {
    flex: 0 0 100% !important;
    max-width: 100% !important;
  }

  .post-headline, .post-content, .single-blog-thumbnail img {
    border-radius: 12px;
  }

  .post-thumbnail img, .single-blog-thumbnail img {
    max-width: 100% !important;
    height: auto !important;
  }

  a, button {
    -webkit-tap-highlight-color: rgba(15, 76, 129, 0.15);
  }
`;

export const APP_USER_AGENT = 'MemoryUpgradesApp/1.0 (Mobile; Official App)';

export function buildAppChromeScript(): string {
  const css = APP_HIDE_CHROME_CSS.replace(/`/g, '\\`').replace(/\n/g, ' ');

  return `
    (function () {
      function injectStyles() {
        if (document.getElementById('memory-upgrades-app-chrome')) {
          return;
        }
        var style = document.createElement('style');
        style.id = 'memory-upgrades-app-chrome';
        style.textContent = \`${css}\`;
        (document.head || document.documentElement).appendChild(style);
        document.documentElement.classList.add('memory-upgrades-app');
      }

      injectStyles();
      document.addEventListener('DOMContentLoaded', injectStyles);
      true;
    })();
  `;
}