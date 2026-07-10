(function () {
  const wordpressRoute = window.__AVF_WORDPRESS_ROUTE__ || {};
  const normalizePath = (path) => {
    const trimmed = path.replace(/\/+$/, "");
    return trimmed || "/";
  };

  const currentSearch = () => wordpressRoute.search || window.location.search;

  const setMeta = (name, value, attr = "name") => {
    const selector = attr === "property" ? `meta[property="${name}"]` : `meta[name="${name}"]`;
    let tag = document.querySelector(selector);
    if (!tag) {
      tag = document.createElement("meta");
      tag.setAttribute(attr, name);
      document.head.appendChild(tag);
    }
    tag.setAttribute("content", value);
  };

  const setCanonical = (url) => {
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = url;
  };

  const resolveAssetPath = (src) => {
    if (/^(?:https?:)?\/\//.test(src) || src.startsWith("data:")) {
      return src;
    }
    if (src.startsWith("/")) {
      return src;
    }
    return `/${src.replace(/^\.?\//, "")}`;
  };

  const patchGlobalBranding = () => {
    const youtubeIconPath =
      "M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4L15.8 12l-6.2 3.6Z";
    const instagramIconPath =
      "M7.8 2h8.4A5.8 5.8 0 0 1 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8A5.8 5.8 0 0 1 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2Zm0 2A3.8 3.8 0 0 0 4 7.8v8.4A3.8 3.8 0 0 0 7.8 20h8.4a3.8 3.8 0 0 0 3.8-3.8V7.8A3.8 3.8 0 0 0 16.2 4H7.8Zm4.2 3.4A4.6 4.6 0 1 1 12 16.6a4.6 4.6 0 0 1 0-9.2Zm0 2A2.6 2.6 0 1 0 12 14.6a2.6 2.6 0 0 0 0-5.2Zm5-2.55a1.05 1.05 0 1 1-1.05 1.05A1.05 1.05 0 0 1 17 6.85Z";
    const replaceSvgWithYoutube = (svg) => {
      if (!svg) return;
      svg.setAttribute("viewBox", "0 0 24 24");
      svg.innerHTML = `<path fill="currentColor" d="${youtubeIconPath}"/>`;
    };
    const replaceSvgWithInstagram = (svg) => {
      if (!svg) return;
      svg.setAttribute("viewBox", "0 0 24 24");
      svg.innerHTML = `<path fill="currentColor" d="${instagramIconPath}"/>`;
    };

    document
      .querySelectorAll(
        'img[src="./anil-logo.png"], img[src="/anil-logo.png"], img[data-src="./anil-logo.png"], img[data-src="/anil-logo.png"], img[data-image="./anil-logo.png"], img[data-image="/anil-logo.png"], source[srcset*="anil-logo.png"]'
      )
      .forEach((node) => {
        if (node.tagName === "SOURCE") {
          node.setAttribute("srcset", "/assets/logo.png");
          return;
        }

        node.src = "/assets/logo.png";
        if (node.getAttribute("srcset")) {
          node.setAttribute("srcset", "/assets/logo.png");
        }
        if (node.getAttribute("data-src")) {
          node.setAttribute("data-src", "/assets/logo.png");
        }
        if (node.getAttribute("data-image")) {
          node.setAttribute("data-image", "/assets/logo.png");
        }
      });

    document.querySelectorAll('a[href="/anilvideofilms-films"]').forEach((link) => {
      link.setAttribute("href", "/anf-films");
    });

    document
      .querySelectorAll('a[href*="instagram.com"], a[aria-label="Instagram"], .instagram-unauth')
      .forEach((link) => {
        link.setAttribute("href", "https://www.instagram.com/anilvideofilms/");
        link.setAttribute("aria-label", "Instagram");
        link.classList.add("instagram-unauth");
        replaceSvgWithInstagram(link.querySelector("svg"));
      });

    document.querySelectorAll("use").forEach((node) => {
      const href =
        node.getAttribute("href") ||
        node.getAttribute("xlink:href") ||
        node.getAttributeNS("http://www.w3.org/1999/xlink", "href") ||
        "";

      if (!href.includes("instagram-unauth-icon")) {
        return;
      }

      const link = node.closest("a");
      if (link) {
        link.setAttribute("href", "https://www.instagram.com/anilvideofilms/");
        link.setAttribute("aria-label", "Instagram");
        link.classList.add("instagram-unauth");
      }
      replaceSvgWithInstagram(node.closest("svg"));
    });

    document
      .querySelectorAll(
        'a[href*="facebook.com"], a[aria-label="Facebook"], .facebook-unauth, .youtube-unauth'
      )
      .forEach((link) => {
        link.setAttribute("href", "https://www.youtube.com/@Vipulvohra");
        link.setAttribute("aria-label", "YouTube");
        link.classList.remove("facebook-unauth");
        link.classList.add("youtube-unauth");
        link.innerHTML = `
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path fill="currentColor" d="${youtubeIconPath}"/>
          </svg>
        `;
      });

    document
      .querySelectorAll('use[href="#facebook-unauth-icon"], use[xlink\\:href="#facebook-unauth-icon"], use[href*="#facebook-unauth-icon"], use[xlink\\:href*="#facebook-unauth-icon"], use[href="#youtube-unauth-icon"], use[xlink\\:href="#youtube-unauth-icon"], use[href*="#youtube-unauth-icon"], use[xlink\\:href*="#youtube-unauth-icon"]')
      .forEach((node) => {
        const svg = node.closest("svg");
        const link = node.closest("a");
        if (link) {
          link.setAttribute("href", "https://www.youtube.com/@Vipulvohra");
          link.setAttribute("aria-label", "YouTube");
          link.classList.remove("facebook-unauth");
          link.classList.add("youtube-unauth");
        }
        if (svg) {
          replaceSvgWithYoutube(svg);
        }
      });

    document.querySelectorAll("use").forEach((node) => {
      const href =
        node.getAttribute("href") ||
        node.getAttribute("xlink:href") ||
        node.getAttributeNS("http://www.w3.org/1999/xlink", "href") ||
        "";

      if (!href.includes("facebook-unauth-icon") && !href.includes("youtube-unauth-icon")) {
        return;
      }

      const link = node.closest("a");
      if (link) {
        link.setAttribute("href", "https://www.youtube.com/@Vipulvohra");
        link.setAttribute("aria-label", "YouTube");
        link.classList.remove("facebook-unauth");
        link.classList.add("youtube-unauth");
      }
      replaceSvgWithYoutube(node.closest("svg"));
    });

    document
      .querySelectorAll(
        'a[href*="twitter.com"], a[href*="x.com"], a[aria-label="Twitter"], a[aria-label="X Twitter"], a[aria-label="X"], .twitter-unauth, .x-unauth'
      )
      .forEach((link) => {
        link.remove();
      });

    document
      .querySelectorAll('use[href="#twitter-unauth-icon"], use[xlink\\:href="#twitter-unauth-icon"]')
      .forEach((node) => {
        const link = node.closest("a");
        if (link) {
          link.remove();
        }
      });
  };

  const normalizeHeaderNavigation = () => {
    const navItems = [
      { href: "/about", label: "About" },
      { href: "/portfolio-photo", label: "Photography" },
      { href: "/anf-films", label: "Films" },
      { href: "/contact-us", label: "Contact Us" },
      { href: "/pre-wedding", label: "Pre Wedding" },
      { href: "/careers", label: "Career" },
    ];

    const desktopMarkup = navItems
      .map(
        (item) => `
          <div class="header-nav-item header-nav-item--collection">
            <a href="${item.href}" data-animation-role="header-element">
              ${item.label}
            </a>
          </div>
        `
      )
      .join("");

    const mobileMarkup = navItems
      .map(
        (item) => `
          <div class="container header-menu-nav-item header-menu-nav-item--collection">
            <a href="${item.href}">
              <div class="header-menu-nav-item-content">
                ${item.label}
              </div>
            </a>
          </div>
        `
      )
      .join("");

    document.querySelectorAll(".header-nav-list").forEach((navList) => {
      navList.innerHTML = desktopMarkup;
    });

    document.querySelectorAll(".header-menu-nav-wrapper").forEach((wrapper) => {
      wrapper.innerHTML = mobileMarkup;
    });

    document
      .querySelectorAll(
        ".header-nav-item--folder, .header-actions-action--cta, .header-menu-cta, .header-menu-controls, [data-folder='/more'], .header-menu-nav-item > a[data-folder-id='/more']"
      )
      .forEach((node) => node.remove());

    if (!document.getElementById("avf-nav-black-style")) {
      const style = document.createElement("style");
      style.id = "avf-nav-black-style";
      style.textContent = `
        .header-title-logo,
        .header-mobile-logo {
          line-height: 0 !important;
        }

        .header-title-logo img,
        .header-mobile-logo img {
          width: clamp(112px, 12vw, 172px) !important;
          height: auto !important;
          max-height: 128px !important;
          object-fit: contain !important;
          object-position: center !important;
        }

        .header-nav-list a,
        .header-nav-folder-title,
        .header-nav-folder-title-text,
        .header-menu-nav-item a,
        .header-menu-nav-item-content,
        .header-menu-nav-item-content-folder {
          color: #000 !important;
        }

        .header-nav-list a:hover,
        .header-nav-folder-title:hover,
        .header-menu-nav-item a:hover,
        .header-menu-nav-item-content:hover {
          color: #000 !important;
        }
      `;
      document.head.appendChild(style);
    }
  };

  const normalizeFooter = () => {
    const footer = document.getElementById("footer-sections");
    if (!footer) return;

    if (!document.getElementById("avf-footer-clean-style")) {
      const style = document.createElement("style");
      style.id = "avf-footer-clean-style";
      style.textContent = `
        #footer-sections {
          background: #ffffff !important;
        }

        #footer-sections .avf-clean-footer {
          min-height: 300px;
          padding: clamp(54px, 7vw, 96px) clamp(24px, 8vw, 142px) clamp(34px, 4vw, 54px);
          display: grid;
          grid-template-columns: minmax(220px, 1fr) auto minmax(220px, 1fr);
          align-items: center;
          gap: clamp(28px, 7vw, 112px);
          text-align: left;
          color: #6f1d1b;
          background: #ffffff;
          box-sizing: border-box;
        }

        #footer-sections .avf-clean-footer__block {
          display: flex;
          flex-direction: column;
          justify-content: center;
          min-height: 150px;
        }

        #footer-sections .avf-clean-footer__heading {
          margin: 0 0 18px;
          font-family: "Cormorant Garamond", serif;
          font-size: clamp(18px, 1.35vw, 24px);
          line-height: 1;
          font-weight: 500;
          letter-spacing: 0.26em;
          text-transform: uppercase;
          color: #6f1d1b;
        }

        #footer-sections .avf-clean-footer__sub {
          margin: -6px 0 18px;
          font-family: "Cormorant Garamond", serif;
          font-size: clamp(15px, 1vw, 18px);
          line-height: 1.2;
          font-style: italic;
          color: rgba(111, 29, 27, 0.66);
        }

        #footer-sections .avf-clean-footer__logo {
          width: clamp(104px, 10vw, 142px);
          height: auto;
          max-height: 112px;
          object-fit: contain;
          object-position: center;
          display: block;
        }

        #footer-sections .avf-clean-footer__brand {
          display: grid;
          place-items: center;
          width: clamp(118px, 12vw, 170px);
          height: clamp(118px, 12vw, 170px);
          border: 0;
          border-radius: 0;
          background: transparent;
        }

        #footer-sections .avf-clean-footer__contact {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 10px;
          font-family: "Cormorant Garamond", serif;
          font-size: clamp(16px, 1.05vw, 19px);
          line-height: 1.25;
          font-style: italic;
          letter-spacing: 0.01em;
          text-align: left;
        }

        #footer-sections .avf-clean-footer__contact a,
        #footer-sections .avf-clean-footer__contact span {
          color: #6f1d1b;
          text-decoration: none;
          transition: color 0.28s ease, transform 0.28s ease;
        }

        #footer-sections .avf-clean-footer__contact a:hover,
        #footer-sections .avf-clean-footer__newsletter a:hover {
          color: #4a5d23;
          transform: translateY(-1px);
        }

        #footer-sections .avf-clean-footer__social {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          gap: 13px;
          margin: 0 0 18px;
        }

        #footer-sections .avf-clean-footer__divider {
          width: 24px;
          height: 1px;
          background: rgba(111, 29, 27, 0.34);
        }

        #footer-sections .avf-clean-footer__social a {
          width: 24px;
          height: 24px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 0;
          border-radius: 0;
          color: #6f1d1b;
          transition: background 0.28s ease, color 0.28s ease, transform 0.28s ease;
        }

        #footer-sections .avf-clean-footer__social a:hover {
          background: transparent;
          color: #4a5d23;
          transform: translateY(-3px);
        }

        #footer-sections .avf-clean-footer__social svg {
          width: 15px;
          height: 15px;
          display: block;
          fill: currentColor;
        }

        #footer-sections .avf-clean-footer__newsletter {
          align-items: stretch;
          justify-self: end;
          text-align: left;
          width: min(100%, 360px);
        }

        #footer-sections .avf-clean-footer__email-line {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 0 0 10px;
          border-bottom: 1px solid rgba(111, 29, 27, 0.22);
          font-family: "Poppins", sans-serif;
          font-size: 11px;
          line-height: 1;
          letter-spacing: 0.26em;
          text-transform: uppercase;
          color: rgba(111, 29, 27, 0.62);
        }

        #footer-sections .avf-clean-footer__email-line a {
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          color: #6f1d1b;
          text-decoration: none;
          white-space: nowrap;
          transition: color 0.28s ease;
        }

        #footer-sections .avf-clean-footer__email-line svg {
          width: 16px;
          height: 16px;
          margin-left: auto;
          flex: 0 0 auto;
          color: #6f1d1b;
        }

        #footer-sections .avf-clean-footer__copyright {
          display: block;
          padding: 10px clamp(24px, 8vw, 142px);
          background: #f2ebe1;
          color: rgba(111, 29, 27, 0.68);
          font-family: "Cormorant Garamond", serif;
          font-size: 14px;
          line-height: 1.2;
          font-style: italic;
          text-align: center;
        }

        @media (max-width: 680px) {
          #footer-sections .avf-clean-footer {
            grid-template-columns: 1fr;
            min-height: auto;
            padding: 48px 24px 34px;
            text-align: center;
            gap: 32px;
          }

          #footer-sections .avf-clean-footer__block,
          #footer-sections .avf-clean-footer__contact,
          #footer-sections .avf-clean-footer__newsletter {
            align-items: center;
            text-align: center;
            justify-self: center;
          }

          #footer-sections .avf-clean-footer__brand {
            order: -1;
            justify-self: center;
            margin: 0 auto;
            width: clamp(128px, 42vw, 168px);
            height: auto;
          }

          #footer-sections .avf-clean-footer__logo {
            margin: 0 auto;
            width: clamp(118px, 38vw, 154px);
          }

          #footer-sections .avf-clean-footer__social {
            justify-content: center;
          }

          #footer-sections .avf-clean-footer__email-line {
            width: min(100%, 320px);
          }
        }
      `;
      document.head.appendChild(style);
    }

    footer.innerHTML = `
      <section class="avf-clean-footer" aria-label="Footer contact">
        <div class="avf-clean-footer__block avf-clean-footer__follow">
          <p class="avf-clean-footer__heading">Follow Us</p>
          <div class="avf-clean-footer__social" aria-label="Social links">
            <a href="https://www.instagram.com/anilvideofilms/" aria-label="Instagram" target="_blank" rel="noopener">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.75 2h8.5A5.76 5.76 0 0 1 22 7.75v8.5A5.76 5.76 0 0 1 16.25 22h-8.5A5.76 5.76 0 0 1 2 16.25v-8.5A5.76 5.76 0 0 1 7.75 2Zm0 2A3.75 3.75 0 0 0 4 7.75v8.5A3.75 3.75 0 0 0 7.75 20h8.5A3.75 3.75 0 0 0 20 16.25v-8.5A3.75 3.75 0 0 0 16.25 4h-8.5ZM12 7.35A4.65 4.65 0 1 1 7.35 12 4.65 4.65 0 0 1 12 7.35Zm0 2A2.65 2.65 0 1 0 14.65 12 2.65 2.65 0 0 0 12 9.35ZM17.1 6.75a1.15 1.15 0 1 1-1.15 1.15 1.15 1.15 0 0 1 1.15-1.15Z"/></svg>
            </a>
            <span class="avf-clean-footer__divider" aria-hidden="true"></span>
            <a href="https://www.youtube.com/@Vipulvohra" aria-label="YouTube" target="_blank" rel="noopener">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4L15.8 12l-6.2 3.6Z"/></svg>
            </a>
          </div>
          <div class="avf-clean-footer__contact">
            <a href="mailto:contact@anilvideofilms.com">contact@anilvideofilms.com</a>
            <a href="tel:+919463410530">+91 9463410530</a>
          </div>
        </div>
        <div class="avf-clean-footer__brand" aria-label="Anil Video Films">
          <img class="avf-clean-footer__logo" src="/assets/logo.png" alt="Anil Video Films">
        </div>
        <div class="avf-clean-footer__block avf-clean-footer__newsletter">
          <p class="avf-clean-footer__heading">Newsletter</p>
          <p class="avf-clean-footer__sub">Follow our latest stories</p>
          <div class="avf-clean-footer__email-line">
            <a href="mailto:contact@anilvideofilms.com">E-mail</a>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M4 6h16v12H4z"/><path d="m4 8 8 6 8-6"/></svg>
          </div>
        </div>
      </section>
      <small class="avf-clean-footer__copyright">Copyright @ Anil Video Films 2026</small>
    `;
  };

  const image = (src, alt = "") =>
    `<img src="${resolveAssetPath(src)}" alt="${alt}" loading="lazy" decoding="async">`;

  const YOUTUBE_LATEST_VIDEO_ID = "qh2qixN1TjI";
  const HOME_VIDEO_IDS = ["qh2qixN1TjI", "qLPs3ZJY-v0", "t0hsiwOrf08", "hY6I_X3aAo8"];
  const youtubeEmbedSrc = (videoId = YOUTUBE_LATEST_VIDEO_ID) =>
    `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&playsinline=1&loop=1&playlist=${videoId}&rel=0&modestbranding=1`;
  const youtubeEmbed = (title = "Latest film from Vipul Vohra YouTube channel", className = "", videoId = YOUTUBE_LATEST_VIDEO_ID) => `
    <iframe
      class="avf-youtube-embed${className ? ` ${className}` : ""}"
      src="${youtubeEmbedSrc(videoId)}"
      title="${title}"
      loading="lazy"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowfullscreen
    ></iframe>
  `;

  const buildLabelList = (items) =>
    items
      .map(
        (item) =>
          `<span class="avf-pill${item.active ? " is-active" : ""}">${item.label}</span>`
      )
      .join("");

  const initHeroParallax = (imageSelector, heroSelector) => {
    const image = document.querySelector(imageSelector);
    const hero = document.querySelector(heroSelector);
    if (!image || !hero || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let ticking = false;
    const update = () => {
      const rect = hero.getBoundingClientRect();
      const viewport = window.innerHeight || document.documentElement.clientHeight || 1;
      const progress = Math.min(1, Math.max(-1, rect.top / viewport));
      const translate = progress * 10;
      const scale = 1.08 + Math.abs(progress) * 0.018;
      image.style.transform = `translate3d(0, ${translate}%, 0) scale(${scale})`;
      ticking = false;
    };

    const requestUpdate = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
  };

  const initCareersParallax = () =>
    initHeroParallax(".avf-careers-parallax", ".avf-careers-hero");

  const initContactParallax = () =>
    initHeroParallax(".avf-contact-parallax", ".avf-contact-hero");

  const initPhotographyParallax = () =>
    initHeroParallax(".avf-photo-archive-parallax", ".avf-photo-archive-hero");

  const initFilmsParallax = () =>
    initHeroParallax(".avf-film-archive-parallax", ".avf-film-hero");

  const initPreWeddingParallax = () =>
    initHeroParallax(".avf-pre-parallax", ".avf-pre-hero");

  const initHomeHeroParallax = () =>
    initHeroParallax(".avf-hero img", ".avf-hero");

  const initPreWeddingMotion = () => {
    const page = document.querySelector(".avf-pre-shell");
    if (!page || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const revealItems = page.querySelectorAll(".avf-pre-motion-block, .avf-pre-collage-item");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
    );

    revealItems.forEach((item) => observer.observe(item));

    const heroContent = page.querySelector(".avf-pre-hero-content");
    const album = page.querySelector(".avf-pre-album");
    const collage = page.querySelector(".avf-pre-collage");
    const cta = page.querySelector(".avf-pre-cta");
    const ctaInner = page.querySelector(".avf-pre-cta-inner");
    let ticking = false;

    const setProgressVars = () => {
      const viewport = window.innerHeight || document.documentElement.clientHeight || 1;

      if (heroContent) {
        const rect = heroContent.closest(".avf-pre-hero").getBoundingClientRect();
        const progress = Math.min(1, Math.max(0, -rect.top / viewport));
        heroContent.style.setProperty("--pre-hero-copy-y", `${progress * -58}px`);
        heroContent.style.setProperty("--pre-hero-copy-opacity", `${Math.max(0.38, 1 - progress * 0.78)}`);
      }

      if (album && collage) {
        const rect = album.getBoundingClientRect();
        const progress = Math.min(1, Math.max(-0.25, (viewport - rect.top) / (viewport + rect.height)));
        collage.style.setProperty("--pre-collage-y", `${(0.5 - progress) * 34}px`);
        collage.style.setProperty("--pre-collage-scale", `${1 + progress * 0.018}`);
      }

      if (cta && ctaInner) {
        const rect = cta.getBoundingClientRect();
        const progress = Math.min(1, Math.max(0, (viewport - rect.top) / (viewport + rect.height)));
        cta.style.setProperty("--pre-forever-y", `${(0.5 - progress) * 72}px`);
        ctaInner.style.setProperty("--pre-cta-y", `${(0.5 - progress) * 42}px`);
      }

      ticking = false;
    };

    const requestUpdate = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(setProgressVars);
    };

    setProgressVars();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
  };

  const initPageMotion = (rootSelector, options = {}) => {
    const root = document.querySelector(rootSelector);
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    if (!document.getElementById("avf-shared-motion-style")) {
      const style = document.createElement("style");
      style.id = "avf-shared-motion-style";
      style.textContent = `
        html {
          scroll-behavior: smooth;
        }

        .avf-motion-item {
          opacity: 0;
          filter: blur(12px);
          clip-path: inset(12% 0 0 0);
          transform: translate3d(0, 54px, 0) scale(0.985);
          transition:
            opacity 1.05s cubic-bezier(0.16, 1, 0.3, 1),
            filter 1.05s cubic-bezier(0.16, 1, 0.3, 1),
            clip-path 1.05s cubic-bezier(0.16, 1, 0.3, 1),
            transform 1.05s cubic-bezier(0.16, 1, 0.3, 1);
          transition-delay: var(--avf-motion-delay, 0s);
          will-change: transform, opacity, filter, clip-path;
        }

        .avf-motion-item.is-visible {
          opacity: 1;
          filter: blur(0);
          clip-path: inset(0 0 0 0);
          transform: translate3d(0, 0, 0) scale(1);
        }

        .avf-motion-parallax {
          transform:
            translate3d(var(--avf-motion-x, 0), var(--avf-motion-y, 0), 0)
            scale(var(--avf-motion-scale, 1));
          will-change: transform, opacity;
          transition: opacity 0.3s ease;
        }

        img.avf-motion-parallax,
        video.avf-motion-parallax {
          transform-origin: center center;
          backface-visibility: hidden;
        }

        .avf-motion-fade {
          opacity: var(--avf-motion-opacity, 1);
          transform:
            translate3d(0, var(--avf-motion-y, 0), 0)
            scale(var(--avf-motion-scale, 1));
          will-change: transform, opacity;
        }

        @media (prefers-reduced-motion: reduce) {
          .avf-motion-item,
          .avf-motion-parallax,
          .avf-motion-fade {
            opacity: 1 !important;
            transform: none !important;
            transition: none !important;
          }
        }
      `;
      document.head.appendChild(style);
    }

    const revealSelector = options.revealSelector || "";
    const revealItems = revealSelector ? root.querySelectorAll(revealSelector) : [];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
    );

    revealItems.forEach((item, index) => {
      item.classList.add("avf-motion-item");
      item.style.setProperty("--avf-motion-delay", `${Math.min(index % 8, 7) * 0.055}s`);
      observer.observe(item);
    });

    const fadeItems = options.fadeSelector ? Array.from(root.querySelectorAll(options.fadeSelector)) : [];
    fadeItems.forEach((item) => item.classList.add("avf-motion-fade"));

    const parallaxItems = options.parallaxSelector ? Array.from(root.querySelectorAll(options.parallaxSelector)) : [];
    parallaxItems.forEach((item) => item.classList.add("avf-motion-parallax"));

    if (!fadeItems.length && !parallaxItems.length) return;

    let ticking = false;
    const update = () => {
      const viewport = window.innerHeight || document.documentElement.clientHeight || 1;

      fadeItems.forEach((item) => {
        const section = item.closest(options.sectionSelector || "section") || item;
        const rect = section.getBoundingClientRect();
        const progress = Math.min(1, Math.max(0, -rect.top / viewport));
        item.style.setProperty("--avf-motion-y", `${progress * -58}px`);
        item.style.setProperty("--avf-motion-scale", `${1 - progress * 0.018}`);
        item.style.setProperty("--avf-motion-opacity", `${Math.max(0.36, 1 - progress * 0.64)}`);
      });

      parallaxItems.forEach((item) => {
        const section = item.closest(options.sectionSelector || "section") || item;
        const rect = section.getBoundingClientRect();
        const progress = Math.min(1, Math.max(-0.25, (viewport - rect.top) / (viewport + rect.height)));
        const isHeroMedia = item.closest(".avf-hero");
        if (isHeroMedia) {
          item.style.setProperty("--avf-motion-x", "0px");
          item.style.setProperty("--avf-motion-y", `${(0.5 - progress) * 34}px`);
          item.style.setProperty("--avf-motion-scale", "1.08");
          return;
        }
        const direction = Array.from(parallaxItems).indexOf(item) % 2 ? -1 : 1;
        item.style.setProperty("--avf-motion-x", `${direction * (0.5 - progress) * 10}px`);
        item.style.setProperty("--avf-motion-y", `${(0.5 - progress) * 64}px`);
        item.style.setProperty("--avf-motion-scale", `${1 + progress * 0.022}`);
      });

      ticking = false;
    };

    const requestUpdate = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
  };

  const initYoutubeVideoEmbeds = () => {
    if (!document.getElementById("avf-youtube-video-style")) {
      const style = document.createElement("style");
      style.id = "avf-youtube-video-style";
      style.textContent = `
        .anilvideofilms-soul-cinema__frame .avf-youtube-embed,
        .avf-film-card__link .avf-youtube-embed {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          border: 0;
          background: #000;
        }

        .anilvideofilms-soul-cinema__frame .avf-youtube-embed {
          z-index: 0;
          pointer-events: none;
          inset: -3px;
          width: calc(100% + 6px);
          height: calc(100% + 6px);
          background: transparent;
          transform: scale(1.08);
        }

        .anilvideofilms-soul-cinema {
          padding: clamp(2.75rem, 6vw, 7rem) clamp(1.25rem, 5vw, 6.5rem) !important;
          min-height: 0 !important;
        }

        .anilvideofilms-soul-cinema__frame {
          width: min(100%, 1280px) !important;
          min-height: 0 !important;
          aspect-ratio: 16 / 9 !important;
          margin: 0 auto !important;
          background: transparent !important;
          border: 0 !important;
          outline: 0 !important;
          box-shadow: none !important;
        }

        .anilvideofilms-soul-cinema__frame::after {
          content: "";
          position: absolute;
          inset: -2px;
          z-index: 3;
          pointer-events: none;
          background:
            linear-gradient(90deg, #ffffff 0, rgba(255, 255, 255, 0.96) 14px, rgba(255, 255, 255, 0) 70px, rgba(255, 255, 255, 0) calc(100% - 70px), rgba(255, 255, 255, 0.96) calc(100% - 14px), #ffffff 100%),
            linear-gradient(180deg, #ffffff 0, rgba(255, 255, 255, 0.94) 12px, rgba(255, 255, 255, 0) 64px, rgba(255, 255, 255, 0) calc(100% - 64px), rgba(255, 255, 255, 0.94) calc(100% - 12px), #ffffff 100%);
        }

        @media (max-width: 767px) {
          .anilvideofilms-soul-cinema {
            padding: 0 !important;
          }

          .anilvideofilms-soul-cinema__frame {
            width: 100vw !important;
            max-width: none !important;
            margin-left: calc(50% - 50vw) !important;
            border: 0 !important;
            outline: 0 !important;
            box-shadow: none !important;
          }

          .anilvideofilms-soul-cinema__frame::after {
            inset: -18px;
            background:
              linear-gradient(90deg, #ffffff 0, rgba(255, 255, 255, 0.98) 8px, rgba(255, 255, 255, 0) 58px, rgba(255, 255, 255, 0) calc(100% - 58px), rgba(255, 255, 255, 0.98) calc(100% - 8px), #ffffff 100%),
              linear-gradient(180deg, #ffffff 0, rgba(255, 255, 255, 0.96) 8px, rgba(255, 255, 255, 0) 54px, rgba(255, 255, 255, 0) calc(100% - 54px), rgba(255, 255, 255, 0.96) calc(100% - 8px), #ffffff 100%);
          }
        }

        .avf-film-card__link .avf-youtube-embed {
          z-index: 0;
          pointer-events: auto;
        }

        .avf-film-card.has-youtube-embed .avf-film-card__poster,
        .avf-film-card.has-youtube-embed .avf-film-card__controls {
          display: none !important;
        }

        .avf-film-cards .avf-film-card.has-youtube-embed {
          aspect-ratio: 16 / 9;
          min-height: auto;
        }

        .avf-film-cards .avf-film-card.has-youtube-embed .avf-film-card__link {
          cursor: default;
        }

        .avf-film-card.has-youtube-embed .avf-film-card__meta {
          z-index: 2;
        }

        .avf-film-card__media .avf-film-play {
          display: none !important;
        }
      `;
      document.head.appendChild(style);
    }

    const replaceVideo = (video, title, card = null, videoId = YOUTUBE_LATEST_VIDEO_ID) => {
      if (!video || video.dataset.avfYoutubeReplaced === "true") return;
      video.dataset.avfYoutubeReplaced = "true";
      const wrapper = document.createElement("div");
      wrapper.innerHTML = youtubeEmbed(title, "avf-youtube-embed--fill", videoId).trim();
      const iframe = wrapper.firstElementChild;
      if (!iframe) return;
      video.replaceWith(iframe);
      if (card) card.classList.add("has-youtube-embed");
    };

    document.querySelectorAll(".anilvideofilms-soul-cinema__video").forEach((video) => {
      const frame = video.closest(".anilvideofilms-soul-cinema__frame");
      const poster = frame?.querySelector(".anilvideofilms-soul-cinema__poster");
      replaceVideo(video, "Latest Soul Cinema film from Vipul Vohra YouTube channel");
      if (poster) poster.style.opacity = "0";
    });

    document.querySelectorAll(".avf-film-card").forEach((card, index) => {
      const link = card.querySelector(".avf-film-card__link");
      if (link?.closest(".avf-film-cards")) {
        link.removeAttribute("href");
        link.setAttribute("role", "group");
        link.addEventListener("click", (event) => {
          if (event.target?.closest("iframe")) return;
          event.preventDefault();
        });
      }

      const video = link?.querySelector("video");
      const name = card.querySelector(".avf-film-card__name")?.textContent?.trim() || "Featured Film";
      const videoId = link?.closest(".avf-film-cards")
        ? HOME_VIDEO_IDS[index % HOME_VIDEO_IDS.length]
        : YOUTUBE_LATEST_VIDEO_ID;
      replaceVideo(video, `${name} film from Vipul Vohra YouTube channel`, card, videoId);
    });
  };

  const initContactMotion = () =>
    initPageMotion(".avf-contact-shell", {
      revealSelector:
        ".avf-contact-panel > *, .avf-contact-form-grid .avf-field, .avf-submit",
      fadeSelector: ".avf-contact-hero-head",
      parallaxSelector: ".avf-contact-grid",
      sectionSelector: ".avf-contact-stage, .avf-contact-hero",
    });

  const initCareersMotion = () =>
    initPageMotion(".avf-careers-shell", {
      revealSelector:
        ".avf-careers-roles-head, .avf-careers-role, .avf-careers-apply-copy > *, .avf-careers-field, .avf-careers-submit",
      fadeSelector: ".avf-careers-hero-head",
      parallaxSelector: ".avf-careers-role-list, .avf-careers-form-grid",
      sectionSelector: ".avf-careers-hero, .avf-careers-roles, .avf-careers-form-section",
    });

  const initAboutMotion = () =>
    initPageMotion(".avf-about-shell", {
      revealSelector:
        ".avf-about-kicker, .avf-about-title, .avf-about-lead, .avf-about-card__image, .avf-about-card h2, .avf-about-card p, .avf-about-team-photo",
      fadeSelector: ".avf-about-hero",
      parallaxSelector: ".avf-about-grid, .avf-about-team-photo",
      sectionSelector: ".avf-about-hero, .avf-about-team",
    });

  const initPhotographyMotion = () =>
    initPageMotion(".avf-photo-archive, .avf-photo-story", {
      revealSelector:
        ".avf-photo-archive-head > *, .avf-photo-filters, .avf-photo-card__media, .avf-photo-card__body > *, .avf-photo-story-head > *, .avf-photo-story-copy > *, .avf-photo-story-video > *, .avf-photo-story-frame, .avf-photo-story-cta > *",
      fadeSelector: ".avf-photo-archive-head, .avf-photo-story-head",
      parallaxSelector: ".avf-photo-grid, .avf-photo-story-gallery, .avf-photo-story-video .avf-youtube-video-shell",
      sectionSelector: ".avf-photo-archive-hero, .avf-photo-card, .avf-photo-story-hero, .avf-photo-story-copy, .avf-photo-story-video, .avf-photo-story-gallery, .avf-photo-story-cta",
    });

  const initFilmsMotion = () =>
    initPageMotion(".avf-film-archive, .avf-film-story", {
      revealSelector:
        ".avf-film-head > *, .avf-film-card__media, .avf-film-card__body > *, .avf-film-story-video > *, .avf-film-copy > *, .avf-film-gallery-frame, .avf-film-story-cta > *",
      fadeSelector: ".avf-film-head",
      parallaxSelector: ".avf-film-list, .avf-film-gallery, .avf-film-story-video .avf-youtube-video-shell",
      sectionSelector: ".avf-film-hero, .avf-film-card, .avf-film-story-video, .avf-film-copy, .avf-film-gallery, .avf-film-story-cta",
    });

  const initFilmFilters = () => {
    const grid = document.querySelector(".avf-film-grid");
    const filters = document.querySelectorAll(".avf-film-filter");
    const cards = document.querySelectorAll(".avf-film-card[data-category]");
    if (!grid || !filters.length || !cards.length) return;

    const animateShuffle = (value) => {
      const before = new Map();
      cards.forEach((card) => before.set(card, card.getBoundingClientRect()));

      grid.classList.add("is-shuffling");
      cards.forEach((card) => {
        const shouldHide = value !== "All" && card.dataset.category !== value;
        card.classList.toggle("is-hidden", shouldHide);
      });

      requestAnimationFrame(() => {
        const visibleCards = Array.from(cards).filter((card) => !card.classList.contains("is-hidden"));

        visibleCards.forEach((card, index) => {
          const previous = before.get(card);
          const next = card.getBoundingClientRect();
          const deltaX = previous ? previous.left - next.left : 0;
          const deltaY = previous ? previous.top - next.top : 20;
          const delay = index * 55;

          card.animate(
            [
              {
                opacity: 0,
                transform: `translate3d(${deltaX}px, ${deltaY}px, 0) scale(0.94) rotate(${index % 2 ? -1.2 : 1.2}deg)`,
                filter: "blur(8px)",
              },
              {
                opacity: 1,
                transform: "translate3d(0, 0, 0) scale(1) rotate(0deg)",
                filter: "blur(0)",
              },
            ],
            {
              duration: 720,
              delay,
              easing: "cubic-bezier(0.22, 1, 0.36, 1)",
              fill: "both",
            }
          );
        });

        window.setTimeout(() => grid.classList.remove("is-shuffling"), 780 + visibleCards.length * 55);
      });
    };

    filters.forEach((filter) => {
      filter.addEventListener("click", () => {
        const value = filter.dataset.filter;
        if (filter.classList.contains("is-active")) return;
        filters.forEach((item) => item.classList.toggle("is-active", item === filter));
        animateShuffle(value);
      });
    });
  };

  const initPhotoFilters = () => {
    const grid = document.querySelector(".avf-photo-grid");
    const filters = document.querySelectorAll(".avf-photo-filter");
    const cards = document.querySelectorAll(".avf-photo-card[data-category]");
    if (!grid || !filters.length || !cards.length) return;

    const animateShuffle = (value) => {
      const before = new Map();
      cards.forEach((card) => before.set(card, card.getBoundingClientRect()));

      grid.classList.add("is-shuffling");
      cards.forEach((card) => {
        const shouldHide = value !== "All" && card.dataset.category !== value;
        card.classList.toggle("is-hidden", shouldHide);
      });

      requestAnimationFrame(() => {
        const visibleCards = Array.from(cards).filter((card) => !card.classList.contains("is-hidden"));

        visibleCards.forEach((card, index) => {
          const previous = before.get(card);
          const next = card.getBoundingClientRect();
          const deltaX = previous ? previous.left - next.left : 0;
          const deltaY = previous ? previous.top - next.top : 22;

          card.animate(
            [
              {
                opacity: 0,
                transform: `translate3d(${deltaX}px, ${deltaY}px, 0) scale(0.95) rotate(${index % 2 ? -1 : 1}deg)`,
                filter: "blur(8px)",
              },
              {
                opacity: 1,
                transform: "translate3d(0, 0, 0) scale(1) rotate(0deg)",
                filter: "blur(0)",
              },
            ],
            {
              duration: 680,
              delay: index * 48,
              easing: "cubic-bezier(0.22, 1, 0.36, 1)",
              fill: "both",
            }
          );
        });

        window.setTimeout(() => grid.classList.remove("is-shuffling"), 740 + visibleCards.length * 48);
      });
    };

    filters.forEach((filter) => {
      filter.addEventListener("click", () => {
        const value = filter.dataset.filter;
        if (filter.classList.contains("is-active")) return;
        filters.forEach((item) => item.classList.toggle("is-active", item === filter));
        animateShuffle(value);
      });
    });
  };

  const initHomeMotion = () =>
    initPageMotion("body.homepage, body", {
      revealSelector:
        ".avf-hero, .anilvideofilms-studio-intro__tagline, .anilvideofilms-studio-intro__image, .anilvideofilms-studio-intro__copy > *, .anilvideofilms-collage__tile, .avf-featured-stories__card, .anilvideofilms-soul-cinema__content > *, .avf-home-story-cta .avf-pre-cta-inner > *, .page-section:not(.anilvideofilms-collage):not(.anilvideofilms-studio-intro) .content-wrapper, footer .content-wrapper",
      fadeSelector:
        ".anilvideofilms-studio-intro__tagline, .anilvideofilms-soul-cinema__content, .avf-home-story-cta .avf-pre-cta-inner",
      parallaxSelector:
        ".anilvideofilms-studio-intro__image img, .anilvideofilms-collage__grid, .avf-featured-stories__grid, .anilvideofilms-soul-cinema__frame",
      sectionSelector: ".page-section, .avf-hero, footer",
    });

  const prepareHomeDirectionalMotion = () => {
    const tiles = Array.from(document.querySelectorAll(".anilvideofilms-collage__tile"));
    if (!tiles.length) return;

    const columns = 5;
    tiles.forEach((tile, index) => {
      tile.classList.remove("avf-from-left", "avf-from-right", "avf-from-top", "avf-from-bottom");

      const column = index % columns;
      const row = Math.floor(index / columns);

      if (column <= 1) {
        tile.classList.add("avf-from-left");
      } else if (column >= 3) {
        tile.classList.add("avf-from-right");
      } else if (row === 0) {
        tile.classList.add("avf-from-top");
      } else {
        tile.classList.add("avf-from-bottom");
      }
    });
  };

  const insertHomeStoryCTA = () => {
    if (document.querySelector(".avf-home-story-cta")) return;

    if (!document.getElementById("avf-home-story-cta-style")) {
      const style = document.createElement("style");
      style.id = "avf-home-story-cta-style";
      style.textContent = `
        .avf-home-story-cta.avf-pre-cta {
          position: relative;
          min-height: 82svh;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: clamp(86px, 12vw, 150px) clamp(24px, 6vw, 72px);
          background: #ffffff;
          color: #1a1f16;
          text-align: center;
          z-index: 2;
        }
        .avf-home-story-cta.avf-pre-cta::before {
          content: "forever";
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(74, 93, 35, 0.08);
          font-family: "Playfair Display", serif;
          font-size: clamp(9rem, 28vw, 32rem);
          font-style: italic;
          line-height: 1;
          white-space: nowrap;
          pointer-events: none;
          user-select: none;
        }
        .avf-home-story-cta.avf-pre-cta::after {
          content: "";
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 18% 18%, rgba(212, 196, 168, 0.2), transparent 28%),
            radial-gradient(circle at 82% 74%, rgba(74, 93, 35, 0.14), transparent 34%);
          pointer-events: none;
        }
        .avf-home-story-cta .avf-pre-cta-inner {
          position: relative;
          z-index: 1;
          width: min(100%, 980px);
          transform: translate3d(0, var(--pre-cta-y, 0), 0);
          will-change: transform;
        }
        .avf-home-story-cta .avf-pre-cta-kicker {
          margin: 0;
          font-family: "Poppins", sans-serif;
          font-size: 10px;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: #4a5d23;
        }
        .avf-home-story-cta .avf-pre-cta-title {
          margin: 24px 0 0;
          font-family: "Playfair Display", serif;
          font-size: clamp(3rem, 8vw, 7.5rem);
          font-weight: 400;
          line-height: 0.95;
          letter-spacing: -0.05em;
          color: #1a1f16;
        }
        .avf-home-story-cta .avf-pre-cta-title em {
          color: #4a5d23;
          font-style: italic;
        }
        .avf-home-story-cta .avf-pre-cta-copy {
          width: min(100%, 620px);
          margin: 30px auto 0;
          color: rgba(26, 31, 22, 0.7);
          font-family: "Mulish", sans-serif;
          font-size: clamp(1rem, 1.6vw, 1.2rem);
          line-height: 1.8;
          font-weight: 300;
        }
        .avf-home-story-cta .avf-pre-cta-button {
          margin-top: 48px;
          display: inline-flex;
          align-items: center;
          gap: 18px;
          border-radius: 999px;
          background: #4a5d23;
          color: #f9f8f6;
          padding: 13px 14px 13px 28px;
          text-decoration: none;
          transition: background 0.45s ease, transform 0.45s ease;
        }
        .avf-home-story-cta .avf-pre-cta-button:hover {
          background: #1a1f16;
          transform: translateY(-3px);
        }
        .avf-home-story-cta .avf-pre-cta-button span:first-child {
          font-family: "Poppins", sans-serif;
          font-size: 12px;
          letter-spacing: 0.28em;
          text-transform: uppercase;
        }
        .avf-home-story-cta .avf-pre-cta-button-icon {
          width: 44px;
          height: 44px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: #f9f8f6;
          color: #4a5d23;
          font-size: 20px;
          transition: transform 0.45s ease;
        }
        .avf-home-story-cta .avf-pre-cta-button:hover .avf-pre-cta-button-icon {
          transform: rotate(45deg);
        }
        .avf-home-story-cta .avf-pre-cta-footnote {
          margin: 34px 0 0;
          color: rgba(26, 31, 22, 0.48);
          font-family: "Poppins", sans-serif;
          font-size: 10px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
        }
        .avf-home-story-cta .avf-pre-motion-block:nth-child(2) {
          transition-delay: 0.1s;
        }
        .avf-home-story-cta .avf-pre-motion-block:nth-child(3) {
          transition-delay: 0.2s;
        }
        .avf-home-story-cta .avf-pre-motion-block:nth-child(4) {
          transition-delay: 0.3s;
        }
        @media (max-width: 640px) {
          .avf-home-story-cta.avf-pre-cta {
            min-height: 74svh;
            padding: 76px 22px;
          }
          .avf-home-story-cta .avf-pre-cta-button {
            width: auto;
            margin-left: auto;
            margin-right: auto;
            padding-left: 28px;
            padding-right: 14px;
            justify-content: center;
          }
        }
      `;
      document.head.appendChild(style);
    }

    const footer = document.getElementById("footer-sections");
    const section = document.createElement("section");
    section.className = "page-section avf-home-story-cta avf-pre-cta";
    section.setAttribute("aria-label", "Start your story");
    section.innerHTML = `
      <div class="avf-pre-cta-inner">
        <p class="avf-pre-cta-kicker avf-pre-motion-block">✦ Your Story</p>
        <h2 class="avf-pre-cta-title avf-pre-motion-block">Let's write yours<br>in <em>olive light</em>.</h2>
        <p class="avf-pre-cta-copy avf-pre-motion-block">Tell us your love story and we will craft a pre-wedding memory made just for the two of you.</p>
        <a class="avf-pre-cta-button avf-pre-motion-block" href="/contact-us">
          <span>Contact Us</span>
          <span class="avf-pre-cta-button-icon" aria-hidden="true">↗</span>
        </a>
        <p class="avf-pre-cta-footnote">replies within 24 hours · pan-india travel</p>
      </div>
    `;

    if (footer && footer.parentNode) {
      footer.parentNode.insertBefore(section, footer);
    } else {
      document.body.appendChild(section);
    }
  };

  const initPreWeddingLightbox = () => {
    const lightbox = document.querySelector(".avf-pre-lightbox");
    const lightboxFrame = document.querySelector(".avf-pre-lightbox-frame");
    const lightboxImage = document.querySelector(".avf-pre-lightbox-img");
    const lightboxTitle = document.querySelector(".avf-pre-lightbox-title");
    const lightboxCount = document.querySelector(".avf-pre-lightbox-count");
    const closeButton = document.querySelector(".avf-pre-lightbox-close");
    if (!lightbox || !lightboxFrame || !lightboxImage || !lightboxTitle || !lightboxCount || !closeButton) return;

    let lastOrigin = null;

    const getFrameRect = () => lightboxFrame.getBoundingClientRect();

    const setFrameFromOrigin = (origin, destination) => {
      const scaleX = origin.width / destination.width;
      const scaleY = origin.height / destination.height;
      const translateX = origin.left + origin.width / 2 - (destination.left + destination.width / 2);
      const translateY = origin.top + origin.height / 2 - (destination.top + destination.height / 2);

      lightboxFrame.style.transform = `translate3d(${translateX}px, ${translateY}px, 0) scale(${scaleX}, ${scaleY})`;
      lightboxFrame.style.borderRadius = "18px";
    };

    const openLightbox = (button) => {
      const sourceImage = button.querySelector("img");
      lastOrigin = (sourceImage || button).getBoundingClientRect();
      lightboxImage.src = button.dataset.full || "";
      lightboxImage.alt = button.dataset.alt || "";
      lightboxTitle.textContent = button.dataset.alt || "";
      lightboxCount.textContent = `Frame ${button.dataset.index || "01"} / 12`;
      lightbox.classList.remove("is-closing");
      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";

      window.requestAnimationFrame(() => {
        const destination = getFrameRect();
        setFrameFromOrigin(lastOrigin, destination);
        lightboxFrame.getBoundingClientRect();
        lightbox.classList.add("is-expanding");
        lightboxFrame.style.transform = "";
        lightboxFrame.style.borderRadius = "";
      });
    };

    const closeLightbox = () => {
      if (!lastOrigin) {
        lightbox.classList.remove("is-open", "is-expanding", "is-closing");
        lightbox.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
        return;
      }

      const destination = getFrameRect();
      lightbox.classList.add("is-closing");
      lightbox.classList.remove("is-expanding");
      setFrameFromOrigin(lastOrigin, destination);

      window.setTimeout(() => {
        lightbox.classList.remove("is-open", "is-closing");
        lightbox.setAttribute("aria-hidden", "true");
        lightboxFrame.style.transform = "";
        lightboxFrame.style.borderRadius = "";
        document.body.style.overflow = "";
      }, 520);
    };

    document.querySelectorAll(".avf-pre-collage-item").forEach((button) => {
      button.addEventListener("click", () => openLightbox(button));
    });

    closeButton.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) closeLightbox();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && lightbox.classList.contains("is-open")) {
        closeLightbox();
      }
    });
  };

  const initHomeCollageLightbox = () => {
    const tiles = document.querySelectorAll(
      ".anilvideofilms-collage__tile:not(.anilvideofilms-collage__text)"
    );
    if (!tiles.length) return;

    if (!document.getElementById("avf-home-collage-zoom-style")) {
      const style = document.createElement("style");
      style.id = "avf-home-collage-zoom-style";
      style.textContent = `
        .anilvideofilms-collage .content,
        .anilvideofilms-collage .content-wrapper {
          max-width: none !important;
          width: 100% !important;
          padding-left: 0 !important;
          padding-right: 0 !important;
        }

        .anilvideofilms-collage__inner {
          width: 100vw !important;
          margin-left: calc(50% - 50vw) !important;
          transform: none !important;
        }

        .anilvideofilms-collage__grid {
          padding-left: 0 !important;
          padding-right: 0 !important;
        }

        .anilvideofilms-collage__tile:not(.anilvideofilms-collage__text) {
          cursor: zoom-in;
        }

        .anilvideofilms-collage__tile:not(.anilvideofilms-collage__text)::after {
          content: "Click to zoom";
          position: absolute;
          left: 14px;
          bottom: 14px;
          z-index: 2;
          padding: 8px 11px;
          border-radius: 999px;
          background: rgba(249, 248, 246, 0.82);
          color: #1a1f16;
          font-family: "Poppins", sans-serif;
          font-size: 9px;
          line-height: 1;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          opacity: 0;
          transform: translateY(8px) scale(0.96);
          transition: opacity 0.32s ease, transform 0.32s ease;
          pointer-events: none;
        }

        .anilvideofilms-collage__tile:not(.anilvideofilms-collage__text):hover::after {
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        .anilvideofilms-collage__tile img {
          transform: scale(1);
          transition: transform 0.65s cubic-bezier(0.22, 1, 0.36, 1), filter 0.65s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .anilvideofilms-collage__tile:not(.anilvideofilms-collage__text):hover img {
          transform: scale(1.08);
          filter: brightness(0.94) saturate(1.08);
        }

        .avf-home-lightbox {
          position: fixed;
          inset: 0;
          z-index: 99999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: clamp(24px, 5vw, 56px);
          background: rgba(26, 31, 22, 0.74);
          backdrop-filter: blur(18px);
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.35s ease;
        }

        .avf-home-lightbox::before {
          content: "";
          position: absolute;
          inset: 0;
          background: rgba(74, 93, 35, 0.1);
          pointer-events: none;
        }

        .avf-home-lightbox.is-open {
          opacity: 1;
          pointer-events: auto;
        }

        .avf-home-lightbox__frame {
          position: relative;
          z-index: 1;
          max-width: min(92vw, 1120px);
          max-height: 82vh;
          overflow: hidden;
          transform-origin: center center;
          will-change: transform, border-radius;
          transition: transform 0.58s cubic-bezier(0.16, 1, 0.3, 1), border-radius 0.58s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .avf-home-lightbox__img {
          display: block;
          max-width: 100%;
          max-height: 82vh;
          object-fit: contain;
          border-radius: 2px;
          box-shadow: 0 30px 90px rgba(0, 0, 0, 0.28);
        }

        .avf-home-lightbox__close {
          position: absolute;
          top: clamp(20px, 4vw, 40px);
          right: clamp(20px, 5vw, 56px);
          z-index: 3;
          min-width: 92px;
          height: 46px;
          padding: 0 16px;
          border: 1px solid rgba(249, 248, 246, 0.3);
          border-radius: 999px;
          background: rgba(249, 248, 246, 0.12);
          color: #f9f8f6;
          font-family: "Poppins", sans-serif;
          font-size: 11px;
          line-height: 1;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          cursor: pointer;
          opacity: 0;
          transform: rotate(-35deg) scale(0.85);
          transition: background 0.3s ease, color 0.3s ease, opacity 0.28s ease 0.24s, transform 0.28s ease 0.24s;
        }

        .avf-home-lightbox.is-expanding .avf-home-lightbox__close {
          opacity: 1;
          transform: rotate(0) scale(1);
        }

        .avf-home-lightbox__close:hover {
          background: #f9f8f6;
          color: #1a1f16;
        }

        .avf-home-lightbox__hint {
          position: absolute;
          left: 50%;
          bottom: 24px;
          z-index: 2;
          transform: translateX(-50%);
          margin: 0;
          color: rgba(249, 248, 246, 0.62);
          font-family: "Poppins", sans-serif;
          font-size: 10px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          white-space: nowrap;
          opacity: 0;
          transition: opacity 0.28s ease 0.32s;
        }

        .avf-home-lightbox.is-expanding .avf-home-lightbox__hint {
          opacity: 1;
        }

        .avf-home-lightbox.is-closing .avf-home-lightbox__close,
        .avf-home-lightbox.is-closing .avf-home-lightbox__hint {
          opacity: 0;
          transition-delay: 0s;
        }
      `;
      document.head.appendChild(style);
    }

    let lightbox = document.querySelector(".avf-home-lightbox");
    if (!lightbox) {
      lightbox = document.createElement("div");
      lightbox.className = "avf-home-lightbox";
      lightbox.setAttribute("aria-hidden", "true");
      lightbox.innerHTML = `
        <button class="avf-home-lightbox__close" type="button" aria-label="Close fullscreen">× Back</button>
        <div class="avf-home-lightbox__frame">
          <img class="avf-home-lightbox__img" src="" alt="">
        </div>
        <p class="avf-home-lightbox__hint">Click anywhere or press ESC to close</p>
      `;
      document.body.appendChild(lightbox);
    }

    const frame = lightbox.querySelector(".avf-home-lightbox__frame");
    const lightboxImage = lightbox.querySelector(".avf-home-lightbox__img");
    const closeButton = lightbox.querySelector(".avf-home-lightbox__close");
    if (!frame || !lightboxImage || !closeButton) return;

    let lastOrigin = null;

    const setFrameFromOrigin = (origin, destination) => {
      const scaleX = origin.width / destination.width;
      const scaleY = origin.height / destination.height;
      const translateX = origin.left + origin.width / 2 - (destination.left + destination.width / 2);
      const translateY = origin.top + origin.height / 2 - (destination.top + destination.height / 2);
      frame.style.transform = `translate3d(${translateX}px, ${translateY}px, 0) scale(${scaleX}, ${scaleY})`;
      frame.style.borderRadius = "18px";
    };

    const closeLightbox = () => {
      if (!lastOrigin) return;
      const destination = frame.getBoundingClientRect();
      lightbox.classList.add("is-closing");
      lightbox.classList.remove("is-expanding");
      setFrameFromOrigin(lastOrigin, destination);

      window.setTimeout(() => {
        lightbox.classList.remove("is-open", "is-closing");
        lightbox.setAttribute("aria-hidden", "true");
        frame.style.transform = "";
        frame.style.borderRadius = "";
        document.body.style.overflow = "";
      }, 520);
    };

    tiles.forEach((tile, index) => {
      const tileImage = tile.querySelector("img");
      if (!tileImage || tile.dataset.avfZoomReady === "true") return;

      tile.dataset.avfZoomReady = "true";
      tile.setAttribute("role", "button");
      tile.setAttribute("tabindex", "0");
      tile.setAttribute("aria-label", `Open collage image ${index + 1}`);

      const openLightbox = () => {
        lastOrigin = tileImage.getBoundingClientRect();
        lightboxImage.src = tileImage.currentSrc || tileImage.src;
        lightboxImage.alt = tileImage.alt || `Collage image ${index + 1}`;
        lightbox.classList.remove("is-closing");
        lightbox.classList.add("is-open");
        lightbox.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";

        window.requestAnimationFrame(() => {
          const destination = frame.getBoundingClientRect();
          setFrameFromOrigin(lastOrigin, destination);
          frame.getBoundingClientRect();
          lightbox.classList.add("is-expanding");
          frame.style.transform = "";
          frame.style.borderRadius = "";
        });
      };

      tile.addEventListener("click", openLightbox);
      tile.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openLightbox();
        }
      });
    });

    if (lightbox.dataset.avfListenersReady !== "true") {
      lightbox.dataset.avfListenersReady = "true";
      closeButton.addEventListener("click", closeLightbox);
      lightbox.addEventListener("click", (event) => {
        if (event.target === lightbox) closeLightbox();
      });
      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && lightbox.classList.contains("is-open")) {
          closeLightbox();
        }
      });
    }
  };

  const photographyItems = [
    {
      category: "Indian",
      title: "Alia & Ranbir, Mumbai",
      excerpt:
        "Two of the greatest actors of this generation decided to get married in the simplest possible way - on their balcony surrounded by only their closest friends and family members. We spent three days with them and witnessed love in its purest form.",
      media: "./assets/AVF_DEMO (109).jpg",
    },
    {
      category: "Indian",
      title: "Reva & Zach, Udaipur",
      excerpt:
        "A joyful celebration that unfolded with warmth, laughter and an easy sense of belonging. The day moved from quiet moments to a full courtyard of energy in a way that felt completely natural and deeply lived in.",
      media: "./assets/AVF_DEMO (107).jpg",
    },
    {
      category: "Indian",
      title: "Kiara & Siddharth",
      excerpt:
        "A quiet, intimate wedding framed by family, warmth and the kind of tenderness that feels larger than the day itself. Every moment carried a softness that stayed with us long after the ceremony ended.",
      media: "./assets/AVF_DEMO (87).jpg",
    },
    {
      category: "Indian",
      title: "Arpita Mehta & Kunal Rawal, Mumbai",
      excerpt:
        "Friends then, friends now, friends forever. Some bonds do not need a seal or approval - they only get stronger and better with this institution we call marriage. It was a wedding filled with flair, laughter and love.",
      media: "./assets/AVF_DEMO (110).jpg",
    },
    {
      category: "Indian",
      title: "Meghna & Karan, Mumbai",
      excerpt:
        "Rare is an Indian wedding celebrated with intimacy, for intimacy. Rare is the coming together of two souls in love amidst dusky skies and floral details. This one carried that rare, unforgettable energy from start to finish.",
      media: "./assets/IMG_0202.JPG",
    },
    {
      category: "Indian",
      title: "Rhea & Divish",
      excerpt:
        "A story about two people who brought equal parts elegance and edge to every frame. The day felt effortless, playful and entirely their own, which is always the mark of a wedding that stays with us.",
      media: "./assets/AVF_DEMO (55).jpg",
    },
    {
      category: "Indian",
      title: "Ananya & Jahan, Delhi",
      excerpt:
        "A wedding meant for hearts, not for razzmatazz. Amidst intimacy and joy, the couple created a day that was honest, beautiful and deeply personal, with every smile carrying real meaning.",
      media: "./assets/AVF_DEMO (54).jpg",
    },
    {
      category: "Indian",
      title: "Priya & Prateik, Jaipur",
      excerpt:
        "Some places hold memories and some hold dreams. This celebration felt like both - a homecoming in the truest sense, anchored by the people who mattered and by a sense of belonging that was impossible to miss.",
      media: "./assets/AVF_DEMO (32).jpg",
    },
  ];

  const filmsItems = [
    {
      category: "Wedding",
      date: "1/15/26",
      title: "Sobhita and Chay, Hyderabad",
      excerpt: "",
      media: "./assets/reception.png",
    },
    {
      category: "Pre Wedding",
      date: "1/10/26",
      title: "Monika and Vivek",
      excerpt:
        "They say monuments were built to honour love that stood the test of time. But watching these two, it felt like we were witnessing one being made - not in stone, but in laughter, glances, and a kind of stillness that felt eternal.",
      media: "./assets/AVF_DEMO (31).jpg",
    },
    {
      category: "Pre Wedding",
      date: "1/9/26",
      title: "Karishma Mikhail",
      excerpt:
        "Some stories have a way of lingering around you, gently and in the most simplest of ways.. This one is going to stay with us for a long time… Karishma and Mikhail’s signing ceremony was surrounded by the warmest people and an ambience that made everyone want to smile, laugh and dance.",
      media: "./assets/AVF_DEMO (30).jpg",
    },
    {
      category: "Wedding",
      date: "1/7/26",
      title: "Kriti Kharbanda and Pulkit Samrat, Delhi",
      excerpt:
        "From the very first call we had with Kriti and Pulkit we knew this one was going to be special. A full on Punjabi energy was expected but what took us by surprise was the emotional rollercoaster it turned out to be.",
      media: "./assets/AVF_DEMO (53).jpg",
    },
    {
      category: "Pre Wedding",
      date: "12/26/25",
      title: "Priya and Prateik",
      excerpt:
        "Some places hold memories and some hold dreams. This home was both. And years later it became the place where Prateik and Priya began their new chapter together. A homecoming, in the truest sense. With the people who mattered, in a space filled with love, laughter. And a quiet sense of belonging - this was way more than a wedding.",
      media: "./assets/AVF_DEMO (87).jpg",
    },
    {
      category: "Wedding",
      date: "12/10/25",
      title: "Aerin Rahul // Korea, India",
      excerpt:
        "Aerin and Rahul’s story took us on a journey across two countries and cultures. Filmed across Seoul and Udaipur we always envisioned this filmed in Black and White as it blurs the separation between both the traditions because that is how we experienced the wedding.",
      media: "./assets/IMG_0217.JPG",
    },
    {
      category: "Wedding",
      date: "4/9/25",
      title: "Varun and Lavanya, Italy",
      excerpt: "",
      media: "./assets/IMG_0243.JPG",
    },
    {
      category: "Pre Wedding",
      date: "1/5/25",
      title: "Reva and Zach // A Anil Video Films Film",
      excerpt:
        "Exactly today last year we ( and almost the entire Udaipur ) celebrated Reva and Zach’s wedding. We called it our Happy New Year wedding and rightfully so coz what a start it gave to us for 2024 and what a year it has been.",
      media: "./assets/AVF_DEMO (107).jpg",
    },
    {
      category: "Pre Wedding",
      date: "11/20/24",
      title: "Vedika and Omair // Jaisalmer",
      excerpt:
        "Vedika and Omair gave a new meaning to the concept of “do as ye will”. It felt like a ceremony of ethereal beings who knew the power ones’ words holds. As if the words are enough to convey and seal the potent connection they have with one another. Because that’s what it was. A wedding that celebrated each other with heartfelt vows, deep rooted words that now bind them in this holy union. It was beautiful. It was surreal. And did we already say it was ethereal? Not enough? Well, it was ethereal.",
      media: "./assets/AVF_DEMO (108).jpg",
    },
    {
      category: "Engagement / Mehendi",
      date: "11/28/24",
      title: "Sangeeta and Jake, France",
      excerpt:
        "Now what do we write about this wedding? No matter how well we write we won’t be able to justify the experience of shooting this wedding. Epic, soulful, beautiful, modern and above all … heartfelt. Experiences like these are what pushes us forward and like Sangeeta said …. “It’s just the beginning”.",
      media: "./assets/AVF_DEMO (109).jpg",
    },
    {
      category: "Wedding",
      date: "11/1/24",
      title: "Chitralekha and Holm, Jaipur",
      excerpt:
        "Sometimes, in all our lives, comes a connection so profound that makes all of our sufferings and rock bottoms worth it. All the bends and turns, getting lost on our paths and mistakes made, and all the coincidences suddenly feel like divine interventions to get us to our true home. Chitralekha and Holm, we were privileged to witness this journey of yours. If we could dedicate an anthem to you, it would be “God blessed the broken roads that led me straight to you”.",
      media: "./assets/IMG_0275.JPG",
    },
    {
      category: "Wedding",
      date: "11/5/24",
      title: "Saira and Jashan, Arizona",
      excerpt:
        "What can we say about this wedding- if we as filmmakers were going through a surge of emotions while filming the wedding we can only imagine the intensity of emotions that the family was going through. The silent tears and the heartbreak at the thought of your daughter leaving your home became a living, breathing, constant emotion - sometimes choking even us.",
      media: "./assets/IMG_0278.JPG",
    },
    {
      category: "Engagement / Mehendi",
      date: "2/18/24",
      title: "Stefanie Akshay, Tuscany",
      excerpt:
        "Ah ah already loved you. Ah ah already loved you. What a surprise, couldn’t believe my eyes. Didn’t even think about it, didn’t even think about it. Coz ah ah already loved you, ah ah already loved you. - Stef’s song for Akshay.",
      media: "./assets/AVF_DEMO (110).jpg",
    },
    {
      category: "Engagement / Mehendi",
      date: "2/8/24",
      title: "Tamanna and Dan, Tuscany",
      excerpt:
        "Last year has been extraordinary for us and we can’t help thank our stars enough for giving us experiences that will remain with us forever. This wedding was one of those. A picture perfect wedding which almost felt like we are a part of someone else’s dream.",
      media: "./assets/AVF_DEMO (31).jpg",
    },
    {
      category: "Engagement / Mehendi",
      date: "2/8/24",
      title: "Raina and Darshan, Athens",
      excerpt:
        "A love like this in a time and space where we all exist and belong. Truly a timeless tale that will be etched in our hearts for a long time.",
      media: "./assets/AVF_DEMO (30).jpg",
    },
    {
      category: "Engagement / Mehendi",
      date: "2/2/24",
      title: "Zina and Zain, Kashmir",
      excerpt:
        "Documenting a wedding is one thing but translating how we as a filmmakers felt while shooting the wedding is a different thing altogether.",
      media: "./assets/AVF_DEMO (53).jpg",
    },
    {
      category: "Engagement / Mehendi",
      date: "2/2/24",
      title: "11:11 // Amina & Alessandro",
      excerpt: "",
      media: "./assets/AVF_DEMO (107).jpg",
    },
    {
      category: "Engagement / Mehendi",
      date: "3/7/23",
      title: "Taabeer // Hera and Sahin Engagement Film // House on the Clouds",
      excerpt: "",
      media: "./assets/AVF_DEMO (108).jpg",
    },
    {
      category: "Engagement / Mehendi",
      date: "2/8/24",
      title: "Sid & Saloni, Bangkok",
      excerpt:
        "The firecracker-Sid married his dream girl-Saloni, to have and to hold, to love and to amuse, to find unconventional ways to express how much his little red heart loves hers. That time capsule has been counting up since April 2019, and for infinite time to come, for they lived happily ever after…",
      media: "./assets/reception.png",
    },
    {
      category: "Engagement / Mehendi",
      date: "2/6/24",
      title: "Eshieta and Sarthak, Lake Como",
      excerpt:
        "A dream unfolding in front of our eyes… Surreal to a level beyond expectations and what words can describe. Here’s a teaser to a real life fairytale of love.",
      media: "./assets/collage/12-dance-venue.jpg",
    },
    {
      category: "Engagement / Mehendi",
      date: "2/2/24",
      title: "Alisha & Rahul, Amalfi Coast",
      excerpt: "",
      media: "./assets/collage/13-hero.png",
    },
    {
      category: "Engagement / Mehendi",
      date: "2/2/24",
      title: "11:11 // Amina & Alessandro",
      excerpt: "",
      media: "./assets/collage/14-portrait.png",
    },
  ];

  const clientStoryLightboxStyles = `
    .avf-pre-lightbox {
      position: fixed;
      inset: 0;
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: clamp(24px, 5vw, 56px);
      background: rgba(26, 31, 22, 0.72);
      backdrop-filter: blur(18px);
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.35s ease;
    }
    .avf-pre-lightbox::before {
      content: "";
      position: absolute;
      inset: 0;
      background: rgba(74, 93, 35, 0.1);
      pointer-events: none;
    }
    .avf-pre-lightbox.is-open {
      opacity: 1;
      pointer-events: auto;
    }
    .avf-pre-lightbox-meta {
      position: absolute;
      top: clamp(22px, 4vw, 42px);
      left: clamp(22px, 5vw, 56px);
      z-index: 2;
      color: rgba(249, 248, 246, 0.92);
      opacity: 0;
      transform: translateY(-8px);
      transition: opacity 0.28s ease 0.22s, transform 0.28s ease 0.22s;
    }
    .avf-pre-lightbox.is-expanding .avf-pre-lightbox-meta {
      opacity: 1;
      transform: translateY(0);
    }
    .avf-pre-lightbox-count {
      margin: 0;
      font-family: "Poppins", sans-serif;
      font-size: 10px;
      letter-spacing: 0.3em;
      text-transform: uppercase;
      opacity: 0.72;
    }
    .avf-pre-lightbox-title {
      margin: 10px 0 0;
      font-family: "Playfair Display", serif;
      font-size: clamp(26px, 4vw, 42px);
      font-style: italic;
      font-weight: 400;
    }
    .avf-pre-lightbox-close {
      position: absolute;
      top: clamp(20px, 4vw, 40px);
      right: clamp(20px, 5vw, 56px);
      z-index: 3;
      min-width: 92px;
      height: 46px;
      padding: 0 16px;
      border: 1px solid rgba(249, 248, 246, 0.3);
      border-radius: 999px;
      background: rgba(249, 248, 246, 0.12);
      color: #f9f8f6;
      font-family: "Poppins", sans-serif;
      font-size: 11px;
      line-height: 1;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      cursor: pointer;
      opacity: 0;
      transform: rotate(-35deg) scale(0.85);
      transition: background 0.3s ease, color 0.3s ease, opacity 0.28s ease 0.24s, transform 0.28s ease 0.24s;
    }
    .avf-pre-lightbox.is-expanding .avf-pre-lightbox-close {
      opacity: 1;
      transform: rotate(0) scale(1);
    }
    .avf-pre-lightbox-close:hover {
      background: #f9f8f6;
      color: #1a1f16;
    }
    .avf-pre-lightbox-frame {
      position: relative;
      z-index: 1;
      max-width: min(92vw, 1120px);
      max-height: 82vh;
      overflow: hidden;
      transform-origin: center center;
      will-change: transform, border-radius;
      transition:
        transform 0.58s cubic-bezier(0.16, 1, 0.3, 1),
        border-radius 0.58s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .avf-pre-lightbox-img {
      display: block;
      max-width: 100%;
      max-height: 82vh;
      object-fit: contain;
      border-radius: 2px;
      box-shadow: 0 30px 90px rgba(0, 0, 0, 0.28);
    }
    .avf-pre-lightbox-hint {
      position: absolute;
      left: 50%;
      bottom: 24px;
      transform: translateX(-50%);
      margin: 0;
      color: rgba(249, 248, 246, 0.62);
      font-family: "Poppins", sans-serif;
      font-size: 10px;
      letter-spacing: 0.3em;
      text-transform: uppercase;
      white-space: nowrap;
      opacity: 0;
      transition: opacity 0.28s ease 0.32s;
    }
    .avf-pre-lightbox.is-expanding .avf-pre-lightbox-hint {
      opacity: 1;
    }
    .avf-pre-lightbox.is-closing .avf-pre-lightbox-meta,
    .avf-pre-lightbox.is-closing .avf-pre-lightbox-close,
    .avf-pre-lightbox.is-closing .avf-pre-lightbox-hint {
      opacity: 0;
      transition-delay: 0s;
    }
  `;

  const clientStoryLightboxMarkup = `
    <div class="avf-pre-lightbox" aria-hidden="true">
      <div class="avf-pre-lightbox-meta">
        <p class="avf-pre-lightbox-count">Frame 01 / 12</p>
        <h3 class="avf-pre-lightbox-title">The quiet frame</h3>
      </div>
      <button class="avf-pre-lightbox-close" type="button" aria-label="Close image">Close</button>
      <div class="avf-pre-lightbox-frame">
        <img class="avf-pre-lightbox-img" src="" alt="">
      </div>
      <p class="avf-pre-lightbox-hint">Click outside or press esc to close</p>
    </div>
  `;

  const photographyPage = () => {
    const galleryPool = [
      "./assets/AVF_DEMO (109).jpg",
      "./assets/AVF_DEMO (107).jpg",
      "./assets/AVF_DEMO (87).jpg",
      "./assets/AVF_DEMO (110).jpg",
      "./assets/IMG_0202.JPG",
      "./assets/AVF_DEMO (55).jpg",
      "./assets/AVF_DEMO (54).jpg",
      "./assets/AVF_DEMO (32).jpg",
      "./assets/collage/01-arch.jpg",
      "./assets/collage/02-portrait-smile.jpg",
      "./assets/collage/03-blackwhite-couple.jpg",
      "./assets/collage/04-reception.png",
      "./assets/collage/05-floral-smile.jpg",
      "./assets/collage/06-orange-hug.jpg",
      "./assets/collage/07-confetti-sit.jpg",
      "./assets/collage/08-fireworks-walk.jpg",
      "./assets/collage/09-fireworks-dance.jpg",
      "./assets/collage/10-night-dress.jpg",
      "./assets/collage/11-bw-fireworks.jpg",
      "./assets/collage/12-dance-venue.jpg",
      "./assets/collage/13-hero.png",
      "./assets/collage/14-portrait.png",
    ];

    const slugify = (value) =>
      value
        .toLowerCase()
        .replace(/&/g, "and")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

    const stories = photographyItems.map((item, index) => {
      const slug = slugify(item.title);
      const location = item.title.includes(",") ? item.title.split(",").slice(1).join(",").trim() : "India";
      const names = item.title.includes(",") ? item.title.split(",")[0].trim() : item.title;
      const gallery = Array.from({ length: 18 }, (_, galleryIndex) => {
        if (galleryIndex === 0) return item.media;
        return galleryPool[(index * 3 + galleryIndex) % galleryPool.length];
      });

      return {
        ...item,
        slug,
        names,
        location,
        year: index < 4 ? "2026" : "2025",
        gallery,
        story:
          `${item.excerpt} What stayed with us was the way the day moved between scale and softness. ` +
          `There were grand frames, yes, but also tiny pauses: hands finding each other, families exhaling together, and light falling exactly where memory wanted it to. This gallery is a quiet walk through those moments.`,
      };
    });

    const selectedSlug = new URLSearchParams(currentSearch()).get("story");
    const selectedStory = selectedSlug ? stories.find((story) => story.slug === selectedSlug) : null;

    if (selectedStory) {
      const gallery = selectedStory.gallery
        .slice(0, 12)
        .map(
          (src, index) => `
            <button
              class="avf-photo-story-frame avf-pre-collage-item avf-photo-story-frame-seq-${index}"
              type="button"
              data-full="${resolveAssetPath(src)}"
              data-alt="${selectedStory.names} frame ${String(index + 1).padStart(2, "0")}"
              data-index="${String(index + 1).padStart(2, "0")}"
            >
              ${image(src, `${selectedStory.names} gallery image ${index + 1}`)}
              <span class="avf-pre-corner">${String(index + 1).padStart(2, "0")} · ${selectedStory.names}</span>
            </button>
          `
        )
        .join("");

      return `
        <style>
          ${clientStoryLightboxStyles}
          .avf-photo-story {
            background: #ffffff;
            color: #1a1f16;
            overflow: hidden;
          }
          .avf-photo-story-hero {
            position: relative;
            min-height: 92svh;
            display: flex;
            align-items: flex-end;
            overflow: clip;
            background: #1a1f16;
            color: #f9f8f6;
          }
          .avf-photo-story-media {
            position: absolute;
            inset: 0;
            overflow: hidden;
          }
          .avf-photo-story-media img {
            position: absolute;
            inset: -10% 0;
            width: 100%;
            height: 120%;
            object-fit: cover;
            display: block;
            filter: brightness(0.92) saturate(1.04);
          }
          .avf-photo-story-hero::after {
            content: "";
            position: absolute;
            inset: 0;
            background:
              linear-gradient(180deg, rgba(26, 31, 22, 0.16), rgba(26, 31, 22, 0.02) 42%, rgba(26, 31, 22, 0.78)),
              linear-gradient(90deg, rgba(26, 31, 22, 0.5), transparent 58%);
          }
          .avf-photo-story-head {
            position: relative;
            z-index: 1;
            width: min(100% - 48px, 1180px);
            margin: 0 auto;
            padding: 0 0 clamp(64px, 8vw, 104px);
            color: #f9f8f6;
          }
          .avf-photo-back {
            display: inline-flex;
            margin-bottom: 18px;
            color: rgba(249, 248, 246, 0.9);
            font-family: "Poppins", sans-serif;
            font-size: 11px;
            letter-spacing: 0.24em;
            text-transform: uppercase;
            text-decoration: none;
          }
          .avf-photo-story-kicker,
          .avf-photo-archive-kicker {
            margin: 0;
            font-family: "Poppins", sans-serif;
            font-size: 10px;
            letter-spacing: 0.35em;
            text-transform: uppercase;
            color: #f9f8f6;
          }
          .avf-photo-story-title {
            margin: 0;
            max-width: 920px;
            font-family: "Playfair Display", serif;
            font-size: clamp(4rem, 11vw, 11rem);
            font-weight: 400;
            line-height: 0.9;
            letter-spacing: -0.07em;
            color: #f9f8f6;
          }
          .avf-photo-story-meta {
            margin: 28px 0 0;
            font-family: "Poppins", sans-serif;
            font-size: 11px;
            letter-spacing: 0.28em;
            text-transform: uppercase;
            color: rgba(249, 248, 246, 0.9);
          }
          .avf-photo-story-copy {
            display: grid;
            grid-template-columns: 0.8fr 1.2fr;
            align-items: start;
            gap: clamp(32px, 7vw, 90px);
            width: min(100% - 48px, 1180px);
            margin: 0 auto;
            padding: clamp(72px, 9vw, 118px) 0;
            background: #ffffff;
          }
          .avf-photo-story-copy h2 {
            margin: 0;
            font-family: "Playfair Display", serif;
            font-size: clamp(2.8rem, 6vw, 6.4rem);
            line-height: 0.98;
            letter-spacing: -0.05em;
            color: #1a1f16;
          }
          .avf-photo-story-copy h2 em {
            color: #4a5d23;
          }
          .avf-photo-story-copy p {
            margin: 0;
            font-family: "Cormorant Garamond", serif;
            font-size: clamp(1.35rem, 2vw, 2rem);
            line-height: 1.45;
            color: rgba(26, 31, 22, 0.82);
          }
          .avf-photo-story-video {
            position: relative;
            min-height: 78svh;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            background: #ffffff;
            color: #1a1f16;
            padding: clamp(28px, 6vw, 78px);
          }
          .avf-photo-story-video::after {
            display: none;
          }
          .avf-youtube-video-shell {
            position: relative;
            z-index: 1;
            width: min(100%, 1180px);
          }
          .avf-youtube-video-label {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 18px;
            margin: 0 0 16px;
            color: rgba(26, 31, 22, 0.62);
            font-family: "Poppins", sans-serif;
            font-size: 10px;
            letter-spacing: 0.3em;
            text-transform: uppercase;
          }
          .avf-youtube-embed {
            display: block;
            width: 100%;
            aspect-ratio: 16 / 9;
            border: 0;
            background: #000;
            box-shadow: 0 28px 90px rgba(26, 31, 22, 0.14);
          }
          .avf-photo-video-card {
            position: relative;
            z-index: 1;
            width: min(100% - 48px, 820px);
            padding: clamp(34px, 6vw, 72px);
            border: 1px solid rgba(249, 248, 246, 0.22);
            background: rgba(26, 31, 22, 0.38);
            backdrop-filter: blur(18px);
            color: #f9f8f6;
            text-align: center;
          }
          .avf-photo-video-play {
            width: 74px;
            height: 74px;
            margin: 0 auto 28px;
            border-radius: 999px;
            display: grid;
            place-items: center;
            background: rgba(26, 31, 22, 0.58);
            border: 1px solid rgba(249, 248, 246, 0.28);
            color: #f9f8f6;
            font-size: 28px;
          }
          .avf-photo-video-card p {
            margin: 0;
            font-family: "Poppins", sans-serif;
            font-size: 10px;
            letter-spacing: 0.32em;
            text-transform: uppercase;
            color: #f9f8f6;
          }
          .avf-photo-video-card h2 {
            margin: 18px 0 0;
            font-family: "Playfair Display", serif;
            font-size: clamp(2.8rem, 7vw, 7rem);
            font-weight: 400;
            line-height: 0.96;
            color: #f9f8f6;
          }
          .avf-photo-story-gallery {
            display: grid;
            grid-template-columns: repeat(12, minmax(0, 1fr));
            grid-template-rows: repeat(4, minmax(0, 1fr));
            gap: clamp(4px, 0.45vw, 7px);
            width: 100vw;
            height: calc(100svh - clamp(88px, 11vw, 124px));
            margin-left: calc(50% - 50vw);
            padding: 0;
            background: #ffffff;
            box-sizing: border-box;
          }
          .avf-photo-story-frame {
            position: relative;
            min-height: 0;
            border: 0;
            padding: 0;
            border-radius: 2px;
            overflow: hidden;
            background: #ffffff;
            cursor: pointer;
            box-shadow: 0 18px 42px rgba(26, 31, 22, 0.08);
          }
          .avf-photo-story-frame:nth-child(1) { grid-column: 1 / 4; grid-row: 1 / 3; }
          .avf-photo-story-frame:nth-child(2) { grid-column: 4 / 6; grid-row: 1 / 2; }
          .avf-photo-story-frame:nth-child(3) { grid-column: 6 / 8; grid-row: 1 / 2; }
          .avf-photo-story-frame:nth-child(4) { grid-column: 8 / 13; grid-row: 1 / 3; }
          .avf-photo-story-frame:nth-child(5) { grid-column: 4 / 6; grid-row: 2 / 4; }
          .avf-photo-story-frame:nth-child(6) { grid-column: 6 / 8; grid-row: 2 / 4; }
          .avf-photo-story-frame:nth-child(7) { grid-column: 1 / 4; grid-row: 3 / 5; }
          .avf-photo-story-frame:nth-child(8) { grid-column: 8 / 10; grid-row: 3 / 4; }
          .avf-photo-story-frame:nth-child(9) { grid-column: 10 / 13; grid-row: 3 / 4; }
          .avf-photo-story-frame:nth-child(10) { grid-column: 4 / 6; grid-row: 4 / 5; }
          .avf-photo-story-frame:nth-child(11) { grid-column: 6 / 8; grid-row: 4 / 5; }
          .avf-photo-story-frame:nth-child(12) { grid-column: 8 / 13; grid-row: 4 / 5; }
          .avf-photo-story-frame img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
            transform: scale(1.02);
            filter: saturate(0.98) contrast(1.02);
            transition: transform 0.75s cubic-bezier(0.22, 1, 0.36, 1), filter 0.75s ease;
          }
          .avf-photo-story-frame:hover img {
            transform: scale(1.09);
            filter: saturate(1.08) contrast(1.04) brightness(1.02);
          }
          .avf-photo-story-frame .avf-pre-corner {
            position: absolute;
            left: 16px;
            bottom: 16px;
            padding: 9px 12px;
            background: rgba(249, 248, 246, 0.78);
            color: #1a1f16;
            font-family: "Poppins", sans-serif;
            font-size: 9px;
            letter-spacing: 0.22em;
            text-transform: uppercase;
            opacity: 0;
            transform: translateY(10px);
            transition: opacity 0.35s ease, transform 0.35s ease;
          }
          .avf-photo-story-frame:hover .avf-pre-corner {
            opacity: 1;
            transform: translateY(0);
          }
          .avf-photo-story-cta {
            position: relative;
            min-height: 82svh;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: clamp(86px, 12vw, 150px) clamp(24px, 6vw, 72px);
            background: #ffffff;
            color: #1a1f16;
            text-align: center;
          }
          .avf-photo-story-cta::before {
            content: "forever";
            position: absolute;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            color: rgba(74, 93, 35, 0.08);
            font-family: "Playfair Display", serif;
            font-size: clamp(9rem, 28vw, 32rem);
            font-style: italic;
            line-height: 1;
            white-space: nowrap;
            pointer-events: none;
            user-select: none;
          }
          .avf-photo-story-cta::after {
            content: "";
            position: absolute;
            inset: 0;
            background:
              radial-gradient(circle at 18% 18%, rgba(212, 196, 168, 0.2), transparent 28%),
              radial-gradient(circle at 82% 74%, rgba(74, 93, 35, 0.14), transparent 34%);
            pointer-events: none;
          }
          .avf-photo-story-cta .avf-pre-cta-inner {
            position: relative;
            z-index: 1;
            width: min(100%, 980px);
          }
          .avf-photo-story-cta h2 {
            margin: 0;
            font-family: "Playfair Display", serif;
            font-size: clamp(3rem, 8vw, 7.5rem);
            font-weight: 400;
            line-height: 0.95;
            letter-spacing: -0.05em;
            color: #1a1f16;
          }
          .avf-photo-story-cta h2 em {
            color: #4a5d23;
            font-style: italic;
          }
          .avf-photo-story-cta .avf-pre-cta-kicker {
            margin: 0 0 24px;
            font-family: "Poppins", sans-serif;
            font-size: 10px;
            letter-spacing: 0.35em;
            text-transform: uppercase;
            color: #4a5d23;
          }
          .avf-photo-story-cta .avf-pre-cta-copy {
            width: min(100%, 620px);
            margin: 30px auto 0;
            color: rgba(26, 31, 22, 0.7);
            font-family: "Mulish", sans-serif;
            font-size: clamp(1rem, 1.6vw, 1.2rem);
            line-height: 1.8;
            font-weight: 300;
          }
          .avf-photo-story-cta a {
            display: inline-flex;
            align-items: center;
            gap: 18px;
            margin-top: 48px;
            border-radius: 999px;
            background: #4a5d23;
            color: #f9f8f6;
            padding: 13px 14px 13px 28px;
            font-family: "Poppins", sans-serif;
            font-size: 12px;
            letter-spacing: 0.28em;
            text-transform: uppercase;
            text-decoration: none;
            transition: background 0.45s ease, transform 0.45s ease;
          }
          .avf-photo-story-cta a:hover {
            background: #1a1f16;
            transform: translateY(-3px);
          }
          .avf-photo-story-cta .avf-pre-cta-button-icon {
            width: 44px;
            height: 44px;
            border-radius: 999px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            background: #f9f8f6;
            color: #4a5d23;
            font-size: 20px;
            transition: transform 0.45s ease;
          }
          .avf-photo-story-cta a:hover .avf-pre-cta-button-icon {
            transform: rotate(45deg);
          }
          .avf-photo-story-cta .avf-pre-cta-footnote {
            margin: 34px 0 0;
            color: rgba(26, 31, 22, 0.48);
            font-family: "Poppins", sans-serif;
            font-size: 10px;
            letter-spacing: 0.3em;
            text-transform: uppercase;
          }
          @media (max-width: 760px) {
            .avf-photo-story-copy {
              grid-template-columns: 1fr;
              width: min(100% - 32px, 1180px);
              padding: clamp(58px, 14vw, 82px) 0;
            }
            .avf-photo-story-gallery {
              grid-template-columns: repeat(2, minmax(0, 1fr));
              grid-auto-rows: clamp(150px, 48vw, 230px);
              grid-template-rows: none;
              height: auto;
              min-height: 0;
              align-items: stretch;
              gap: 6px;
            }
            .avf-photo-story-frame,
            .avf-photo-story-frame[class*="avf-photo-story-frame--"] {
              grid-column: auto !important;
              grid-row: span 1 !important;
            }
            .avf-photo-story-frame:nth-child(3n + 1) {
              grid-row: span 2 !important;
            }
            .avf-photo-story-frame:nth-child(4n) {
              grid-row: span 1 !important;
            }
          }
        </style>
        <section class="avf-photo-story">
          <section class="avf-photo-story-hero">
            <div class="avf-photo-story-media">${image(selectedStory.media, selectedStory.title)}</div>
            <div class="avf-photo-story-head">
              <a class="avf-photo-back" href="/portfolio-photo">Back</a>
              <h1 class="avf-photo-story-title">${selectedStory.names}</h1>
              <p class="avf-photo-story-meta">${selectedStory.year} · Client Story</p>
            </div>
          </section>
          <section class="avf-photo-story-copy">
            <h2>The story<br><em>behind</em><br>the frames.</h2>
            <p>${selectedStory.story}</p>
          </section>
          <section class="avf-photo-story-gallery avf-pre-collage">${gallery}</section>
          <section class="avf-photo-story-video">
            <div class="avf-youtube-video-shell">
              <p class="avf-youtube-video-label"><span>Motion Story</span><span>Latest from YouTube</span></p>
              ${youtubeEmbed(`${selectedStory.names} latest wedding film from Vipul Vohra YouTube channel`)}
            </div>
          </section>
          <section class="avf-photo-story-cta">
            <div class="avf-pre-cta-inner">
              <p class="avf-pre-cta-kicker">✦ Your Story</p>
              <h2>Let's write yours<br>in <em>olive light</em>.</h2>
              <p class="avf-pre-cta-copy">Tell us your love story and we will craft a wedding memory made just for the two of you.</p>
              <a href="/contact-us"><span>Contact Us</span><span class="avf-pre-cta-button-icon" aria-hidden="true">↗</span></a>
              <p class="avf-pre-cta-footnote">replies within 24 hours · pan-india travel</p>
            </div>
          </section>
          ${clientStoryLightboxMarkup}
        </section>
      `;
    }

    const photoCategories = ["All", ...Array.from(new Set(stories.map((item) => item.category)))];
    const filters = photoCategories
      .map(
        (category, index) => `
          <button class="avf-photo-filter ${index === 0 ? "is-active" : ""}" type="button" data-filter="${category}">
            ${category}
          </button>
        `
      )
      .join('<span class="avf-photo-filter-separator">|</span>');

    const cards = stories
      .map(
        (item) => `
          <a class="avf-photo-card" href="/portfolio-photo?story=${item.slug}" data-category="${item.category}">
            <div class="avf-photo-card__media">
              ${image(item.media, item.title)}
            </div>
            <div class="avf-photo-card__body">
              <h2 class="avf-photo-card__title">${item.names}</h2>
              <p class="avf-photo-card__text">${item.excerpt || "A wedding story told through quiet frames, honest emotion, and the kind of small details that stay long after the celebration ends."}</p>
            </div>
          </a>
        `
      )
      .join("");

    return `
      <style>
        .avf-photo-archive {
          background: #f9f8f6;
          color: #1a1f16;
          overflow: hidden;
        }
        .avf-photo-archive-hero {
          position: relative;
          min-height: 100svh;
          display: flex;
          align-items: flex-end;
          overflow: clip;
          background: #1a1f16;
          color: #f9f8f6;
        }
        .avf-photo-archive-media {
          position: absolute;
          inset: 0;
          overflow: hidden;
        }
        .avf-photo-archive-media img {
          position: absolute;
          top: -10%;
          left: 0;
          width: 100%;
          height: 120%;
          object-fit: cover;
          filter: brightness(0.92) saturate(1.08);
          transform: translate3d(0, 0, 0) scale(1.06);
          will-change: transform;
        }
        .avf-photo-archive-hero::after {
          content: "";
          position: absolute;
          inset: 0;
          background:
            linear-gradient(180deg, rgba(26, 31, 22, 0.18), rgba(26, 31, 22, 0.04) 42%, rgba(26, 31, 22, 0.82)),
            linear-gradient(90deg, rgba(26, 31, 22, 0.58), transparent 60%);
        }
        .avf-photo-archive-head {
          position: relative;
          z-index: 1;
          width: min(100% - 48px, 1240px);
          margin: 0 auto;
          padding: 0 0 clamp(70px, 9vw, 110px);
        }
        .avf-photo-archive-kicker {
          margin: 0;
          font-family: "Poppins", sans-serif;
          font-size: 10px;
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: #d4c4a8;
        }
        .avf-photo-archive-title {
          margin: 22px 0 0;
          font-family: "Playfair Display", serif;
          font-size: clamp(4rem, 11vw, 11rem);
          font-weight: 400;
          line-height: 0.9;
          letter-spacing: -0.07em;
        }
        .avf-photo-archive-title em {
          color: #d4c4a8;
        }
        .avf-photo-archive-lead {
          max-width: 660px;
          margin: 32px 0 0;
          color: rgba(249, 248, 246, 0.78);
          font-family: "Cormorant Garamond", serif;
          font-size: clamp(1.25rem, 2vw, 1.9rem);
          line-height: 1.42;
        }
        .avf-photo-list {
          background: #f9f8f6;
          padding: clamp(70px, 9vw, 118px) 0 clamp(82px, 10vw, 132px);
        }
        .avf-photo-filters {
          width: min(100% - 48px, 1360px);
          margin: 0 auto clamp(44px, 6vw, 72px);
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 18px;
          font-family: "Poppins", sans-serif;
          font-size: 12px;
          font-weight: 700;
        }
        .avf-photo-filter {
          border: 0;
          padding: 0;
          background: transparent;
          color: rgba(26, 31, 22, 0.7);
          font: inherit;
          cursor: pointer;
          transition: color 0.25s ease, transform 0.25s ease;
        }
        .avf-photo-filter:hover,
        .avf-photo-filter.is-active {
          color: #1a1f16;
          transform: translateY(-2px);
        }
        .avf-photo-filter-separator {
          color: rgba(26, 31, 22, 0.6);
        }
        .avf-photo-grid {
          width: min(100% - 48px, 1360px);
          margin: 0 auto;
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: clamp(40px, 4.5vw, 72px) clamp(26px, 3vw, 44px);
          align-items: start;
        }
        .avf-photo-grid.is-shuffling {
          pointer-events: none;
        }
        .avf-photo-card {
          display: block;
          color: #1a1f16;
          text-decoration: none;
        }
        .avf-photo-card__media {
          aspect-ratio: 3 / 4;
          overflow: hidden;
          background: #d8d1c6;
          border-radius: 1px;
          box-shadow: 0 24px 70px rgba(26, 31, 22, 0.08);
        }
        .avf-photo-card__media img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.85s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .avf-photo-card:hover .avf-photo-card__media img {
          transform: scale(1.055);
        }
        .avf-photo-card__body {
          padding-top: 22px;
        }
        .avf-photo-card__title {
          margin: 0;
          font-family: "Playfair Display", serif;
          font-size: clamp(1.75rem, 2.1vw, 2.75rem);
          line-height: 1.05;
          letter-spacing: -0.045em;
          font-weight: 600;
          color: #1a1f16;
        }
        .avf-photo-card__text {
          margin: 16px 0 0;
          font-family: "Cormorant Garamond", serif;
          font-size: clamp(1rem, 1.1vw, 1.2rem);
          line-height: 1.45;
          font-weight: 700;
          color: rgba(26, 31, 22, 0.9);
        }
        .avf-photo-card__link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-top: 16px;
          color: #1a1f16;
          font-family: "Cormorant Garamond", serif;
          font-size: 1.1rem;
          font-weight: 800;
          text-decoration: none;
          transition: color 0.3s ease, transform 0.3s ease;
        }
        .avf-photo-card__link:hover {
          color: #4a5d23;
        }
        .avf-photo-card:hover .avf-photo-card__link {
          color: #4a5d23;
          transform: translateX(4px);
        }
        .avf-photo-card__kicker {
          margin: 16px 0 0;
          font-family: "Cormorant Garamond", serif;
          font-size: 1rem;
          font-weight: 700;
          color: rgba(26, 31, 22, 0.72);
        }
        .avf-photo-card.is-hidden {
          display: none;
        }
        @media (max-width: 1100px) {
          .avf-photo-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }
        @media (max-width: 760px) {
          .avf-photo-grid {
            grid-template-columns: 1fr;
            width: min(100% - 32px, 520px);
          }
          .avf-photo-filters {
            width: min(100% - 32px, 520px);
          }
        }
      </style>
      <section class="avf-photo-archive">
        <section class="avf-photo-archive-hero">
          <div class="avf-photo-archive-media">
            <img class="avf-photo-archive-parallax" src="/assets/AVF_DEMO (109).jpg" alt="Anil Video Films photography archive" loading="eager" decoding="async">
          </div>
          <div class="avf-photo-archive-head">
            <h1 class="avf-photo-archive-title">The<br><em>Photography</em><br>Archive.</h1>
            <p class="avf-photo-archive-lead">Each wedding is its own world. Step inside the full story, the gallery, and the small pauses that made each celebration unforgettable.</p>
          </div>
        </section>
        <section class="avf-photo-list">
          <div class="avf-photo-filters">${filters}</div>
          <div class="avf-photo-grid">${cards}</div>
        </section>
      </section>
    `;
  };

  const filmsPage = () => {
    const galleryPool = [
      "./assets/reception.png",
      "./assets/AVF_DEMO (31).jpg",
      "./assets/AVF_DEMO (30).jpg",
      "./assets/AVF_DEMO (53).jpg",
      "./assets/AVF_DEMO (87).jpg",
      "./assets/IMG_0217.JPG",
      "./assets/IMG_0243.JPG",
      "./assets/AVF_DEMO (107).jpg",
      "./assets/AVF_DEMO (108).jpg",
      "./assets/AVF_DEMO (109).jpg",
      "./assets/IMG_0275.JPG",
      "./assets/IMG_0278.JPG",
      "./assets/collage/12-dance-venue.jpg",
      "./assets/collage/13-hero.png",
      "./assets/collage/14-portrait.png",
    ];

    const slugify = (value) =>
      value
        .toLowerCase()
        .replace(/&/g, "and")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

    const stories = filmsItems.slice(0, 10).map((item, index) => {
      const slug = slugify(item.title);
      const names = item.title.split(",")[0].replace("//", "·").trim();
      const location = item.title.includes(",") ? item.title.split(",").slice(1).join(",").trim() : "Destination";
      const gallery = Array.from({ length: 12 }, (_, galleryIndex) => {
        if (galleryIndex === 0) return item.media;
        return galleryPool[(index * 2 + galleryIndex) % galleryPool.length];
      });

      return {
        ...item,
        slug,
        names,
        location,
        year: item.date?.split("/")?.[2] ? `20${item.date.split("/")[2]}` : "2026",
        gallery,
        story:
          (item.excerpt || "A film built around feeling, rhythm, family, and the quiet electricity of two people beginning again.") +
          " We shaped this story like a memory rather than a record: the voices, the rooms, the music, the pauses, and the movement all becoming one living keepsake.",
      };
    });

    const selectedSlug = new URLSearchParams(currentSearch()).get("film");
    const selectedStory = selectedSlug ? stories.find((story) => story.slug === selectedSlug) : null;

    const sharedStyles = `
      .avf-film-archive,
      .avf-film-story {
        background: #ffffff;
        color: #1a1f16;
        overflow: hidden;
      }
      .avf-film-hero {
        position: relative;
        min-height: 100svh;
        display: flex;
        align-items: flex-end;
        overflow: clip;
        background: #1a1f16;
        color: #f9f8f6;
      }
      .avf-film-hero-media {
        position: absolute;
        inset: 0;
        overflow: hidden;
      }
      .avf-film-hero-media img {
        position: absolute;
        top: -10%;
        left: 0;
        width: 100%;
        height: 120%;
        object-fit: cover;
        filter: brightness(0.72) saturate(1.08);
        transform: translate3d(0, 0, 0) scale(1.06);
        will-change: transform;
      }
      .avf-film-hero::after {
        content: "";
        position: absolute;
        inset: 0;
        background:
          linear-gradient(180deg, rgba(26, 31, 22, 0.14), rgba(26, 31, 22, 0.02) 42%, rgba(26, 31, 22, 0.84)),
          linear-gradient(90deg, rgba(26, 31, 22, 0.58), transparent 62%);
      }
      .avf-film-head {
        position: relative;
        z-index: 1;
        width: min(100% - 48px, 1240px);
        margin: 0 auto;
        padding: 0 0 clamp(70px, 9vw, 112px);
        color: #f9f8f6;
      }
      .avf-film-kicker {
        margin: 0;
        font-family: "Poppins", sans-serif;
        font-size: 10px;
        letter-spacing: 0.35em;
        text-transform: uppercase;
        color: #f9f8f6;
      }
      .avf-film-big-title {
        margin: 0;
        font-family: "Playfair Display", serif;
        font-size: clamp(4rem, 11vw, 11rem);
        font-weight: 400;
        line-height: 0.9;
        letter-spacing: -0.07em;
        color: #f9f8f6;
      }
      .avf-film-big-title em {
        color: #f9f8f6;
      }
      .avf-film-lead {
        max-width: 680px;
        margin: 32px 0 0;
        color: rgba(249, 248, 246, 0.9);
        font-family: "Cormorant Garamond", serif;
        font-size: clamp(1.25rem, 2vw, 1.9rem);
        line-height: 1.42;
      }
      .avf-film-play {
        width: 74px;
        height: 74px;
        border-radius: 999px;
        display: grid;
        place-items: center;
        background: rgba(26, 31, 22, 0.58);
        border: 1px solid rgba(249, 248, 246, 0.28);
        color: #f9f8f6;
        font-size: 28px;
        box-shadow: 0 22px 60px rgba(0, 0, 0, 0.22);
      }
    `;

    if (selectedStory) {
      const gallery = selectedStory.gallery
        .slice(0, 12)
        .map(
          (src, index) => `
            <button
              class="avf-film-gallery-frame avf-pre-collage-item avf-film-gallery-frame-seq-${index}"
              type="button"
              data-full="${resolveAssetPath(src)}"
              data-alt="${selectedStory.names} film frame ${String(index + 1).padStart(2, "0")}"
              data-index="${String(index + 1).padStart(2, "0")}"
            >
              ${image(src, `${selectedStory.names} film still ${index + 1}`)}
              <span class="avf-pre-corner">${index % 2 === 0 ? "Film still" : "Photo frame"} · ${String(index + 1).padStart(2, "0")}</span>
            </button>
          `
        )
        .join("");

      return `
        <style>
          ${sharedStyles}
          ${clientStoryLightboxStyles}
          .avf-film-back {
            display: inline-flex;
            margin-bottom: 18px;
            color: rgba(249, 248, 246, 0.82);
            font-family: "Poppins", sans-serif;
            font-size: 11px;
            letter-spacing: 0.24em;
            text-transform: uppercase;
            text-decoration: none;
          }
          .avf-film-story-video {
            position: relative;
            min-height: 82svh;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
            background: #ffffff;
            padding: clamp(28px, 6vw, 78px);
          }
          .avf-film-story-video::after {
            display: none;
          }
          .avf-youtube-video-shell {
            position: relative;
            z-index: 1;
            width: min(100%, 1180px);
          }
          .avf-youtube-video-label {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 18px;
            margin: 0 0 16px;
            color: rgba(26, 31, 22, 0.62);
            font-family: "Poppins", sans-serif;
            font-size: 10px;
            letter-spacing: 0.3em;
            text-transform: uppercase;
          }
          .avf-youtube-embed {
            display: block;
            width: 100%;
            aspect-ratio: 16 / 9;
            border: 0;
            background: #000;
            box-shadow: 0 28px 90px rgba(26, 31, 22, 0.14);
          }
          .avf-film-video-panel {
            position: relative;
            z-index: 1;
            width: min(100% - 48px, 880px);
            padding: clamp(34px, 6vw, 72px);
            border: 1px solid rgba(249, 248, 246, 0.22);
            background: rgba(26, 31, 22, 0.4);
            backdrop-filter: blur(18px);
            color: #f9f8f6;
            text-align: center;
          }
          .avf-film-video-panel .avf-film-play {
            margin: 0 auto 28px;
          }
          .avf-film-video-panel h2 {
            margin: 18px 0 0;
            font-family: "Playfair Display", serif;
            font-size: clamp(3rem, 8vw, 8rem);
            font-weight: 400;
            line-height: 0.94;
            color: #f9f8f6;
          }
          .avf-film-copy {
            display: grid;
            grid-template-columns: 0.85fr 1.15fr;
            align-items: start;
            gap: clamp(32px, 7vw, 90px);
            width: min(100% - 48px, 1180px);
            margin: 0 auto;
            padding: clamp(72px, 9vw, 118px) 0;
            background: #ffffff;
          }
          .avf-film-copy h2 {
            margin: 0;
            font-family: "Playfair Display", serif;
            font-size: clamp(2.8rem, 6vw, 6.4rem);
            line-height: 0.98;
            letter-spacing: -0.05em;
          }
          .avf-film-copy h2 em {
            color: #4a5d23;
          }
          .avf-film-copy p {
            margin: 0;
            font-family: "Cormorant Garamond", serif;
            font-size: clamp(1.35rem, 2vw, 2rem);
            line-height: 1.45;
            color: rgba(26, 31, 22, 0.82);
          }
          .avf-film-gallery {
            display: grid;
            grid-template-columns: repeat(12, minmax(0, 1fr));
            grid-template-rows: repeat(4, minmax(0, 1fr));
            gap: clamp(4px, 0.45vw, 7px);
            width: 100vw;
            height: calc(100svh - clamp(88px, 11vw, 124px));
            margin-left: calc(50% - 50vw);
            padding: 0;
            background: #ffffff;
            box-sizing: border-box;
          }
          .avf-film-gallery-frame {
            position: relative;
            min-height: 0;
            border: 0;
            padding: 0;
            border-radius: 2px;
            cursor: pointer;
            box-shadow: 0 18px 42px rgba(26, 31, 22, 0.08);
            overflow: hidden;
            background: #ffffff;
          }
          .avf-film-gallery-frame:nth-child(1) { grid-column: 1 / 4; grid-row: 1 / 3; }
          .avf-film-gallery-frame:nth-child(2) { grid-column: 4 / 6; grid-row: 1 / 2; }
          .avf-film-gallery-frame:nth-child(3) { grid-column: 6 / 8; grid-row: 1 / 2; }
          .avf-film-gallery-frame:nth-child(4) { grid-column: 8 / 13; grid-row: 1 / 3; }
          .avf-film-gallery-frame:nth-child(5) { grid-column: 4 / 6; grid-row: 2 / 4; }
          .avf-film-gallery-frame:nth-child(6) { grid-column: 6 / 8; grid-row: 2 / 4; }
          .avf-film-gallery-frame:nth-child(7) { grid-column: 1 / 4; grid-row: 3 / 5; }
          .avf-film-gallery-frame:nth-child(8) { grid-column: 8 / 10; grid-row: 3 / 4; }
          .avf-film-gallery-frame:nth-child(9) { grid-column: 10 / 13; grid-row: 3 / 4; }
          .avf-film-gallery-frame:nth-child(10) { grid-column: 4 / 6; grid-row: 4 / 5; }
          .avf-film-gallery-frame:nth-child(11) { grid-column: 6 / 8; grid-row: 4 / 5; }
          .avf-film-gallery-frame:nth-child(12) { grid-column: 8 / 13; grid-row: 4 / 5; }
          .avf-film-gallery-frame.is-wide {
            grid-column: auto;
          }
          .avf-film-gallery-frame img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            display: block;
            transform: scale(1.02);
            transition: transform 0.75s cubic-bezier(0.22, 1, 0.36, 1), filter 0.75s ease;
          }
          .avf-film-gallery-frame:hover img {
            transform: scale(1.09);
            filter: brightness(0.92) saturate(1.08);
          }
          .avf-film-gallery-frame .avf-pre-corner {
            position: absolute;
            left: 16px;
            bottom: 16px;
            padding: 9px 12px;
            background: rgba(249, 248, 246, 0.78);
            color: #1a1f16;
            font-family: "Poppins", sans-serif;
            font-size: 9px;
            letter-spacing: 0.22em;
            text-transform: uppercase;
            opacity: 0;
            transform: translateY(10px);
            transition: opacity 0.35s ease, transform 0.35s ease;
          }
          .avf-film-gallery-frame:hover .avf-pre-corner {
            opacity: 1;
            transform: translateY(0);
          }
          .avf-film-gallery-frame__legacy {
            min-height: clamp(220px, 28vw, 430px);
            margin: 0;
            overflow: hidden;
            background: #ffffff;
          }
          .avf-film-story-cta {
            position: relative;
            min-height: 82svh;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: clamp(86px, 12vw, 150px) clamp(24px, 6vw, 72px);
            background: #ffffff;
            color: #1a1f16;
            text-align: center;
          }
          .avf-film-story-cta::before {
            content: "forever";
            position: absolute;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            color: rgba(74, 93, 35, 0.08);
            font-family: "Playfair Display", serif;
            font-size: clamp(9rem, 28vw, 32rem);
            font-style: italic;
            line-height: 1;
            white-space: nowrap;
            pointer-events: none;
            user-select: none;
          }
          .avf-film-story-cta::after {
            content: "";
            position: absolute;
            inset: 0;
            background:
              radial-gradient(circle at 18% 18%, rgba(212, 196, 168, 0.2), transparent 28%),
              radial-gradient(circle at 82% 74%, rgba(74, 93, 35, 0.14), transparent 34%);
            pointer-events: none;
          }
          .avf-film-story-cta .avf-pre-cta-inner {
            position: relative;
            z-index: 1;
            width: min(100%, 980px);
          }
          .avf-film-story-cta .avf-pre-cta-kicker {
            margin: 0 0 24px;
            font-family: "Poppins", sans-serif;
            font-size: 10px;
            letter-spacing: 0.35em;
            text-transform: uppercase;
            color: #4a5d23;
          }
          .avf-film-story-cta h2 {
            margin: 0;
            font-family: "Playfair Display", serif;
            font-size: clamp(3rem, 8vw, 7.5rem);
            font-weight: 400;
            line-height: 0.95;
            letter-spacing: -0.05em;
            color: #1a1f16;
          }
          .avf-film-story-cta h2 em {
            color: #4a5d23;
            font-style: italic;
          }
          .avf-film-story-cta .avf-pre-cta-copy {
            width: min(100%, 620px);
            margin: 30px auto 0;
            color: rgba(26, 31, 22, 0.7);
            font-family: "Mulish", sans-serif;
            font-size: clamp(1rem, 1.6vw, 1.2rem);
            line-height: 1.8;
            font-weight: 300;
          }
          .avf-film-story-cta a {
            display: inline-flex;
            align-items: center;
            gap: 18px;
            margin-top: 48px;
            border-radius: 999px;
            background: #4a5d23;
            color: #f9f8f6;
            padding: 13px 14px 13px 28px;
            font-family: "Poppins", sans-serif;
            font-size: 12px;
            letter-spacing: 0.28em;
            text-transform: uppercase;
            text-decoration: none;
            transition: background 0.45s ease, transform 0.45s ease;
          }
          .avf-film-story-cta a:hover {
            background: #1a1f16;
            transform: translateY(-3px);
          }
          .avf-film-story-cta .avf-pre-cta-button-icon {
            width: 44px;
            height: 44px;
            border-radius: 999px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            background: #f9f8f6;
            color: #4a5d23;
            font-size: 20px;
            transition: transform 0.45s ease;
          }
          .avf-film-story-cta a:hover .avf-pre-cta-button-icon {
            transform: rotate(45deg);
          }
          .avf-film-story-cta .avf-pre-cta-footnote {
            margin: 34px 0 0;
            color: rgba(26, 31, 22, 0.48);
            font-family: "Poppins", sans-serif;
            font-size: 10px;
            letter-spacing: 0.3em;
            text-transform: uppercase;
          }
          @media (max-width: 760px) {
            .avf-film-copy {
              grid-template-columns: 1fr;
              width: min(100% - 32px, 1180px);
              padding: clamp(58px, 14vw, 82px) 0;
            }
            .avf-film-gallery {
              grid-template-columns: repeat(2, minmax(0, 1fr));
              grid-auto-rows: clamp(150px, 48vw, 230px);
              grid-template-rows: none;
              height: auto;
              min-height: 0;
              align-items: stretch;
              gap: 6px;
            }
            .avf-film-gallery-frame,
            .avf-film-gallery-frame.is-wide {
              grid-column: auto !important;
              grid-row: span 1 !important;
            }
            .avf-film-gallery-frame:nth-child(3n + 1) {
              grid-row: span 2 !important;
            }
            .avf-film-gallery-frame:nth-child(4n) {
              grid-row: span 1 !important;
            }
          }
        </style>
        <section class="avf-film-story">
          <section class="avf-film-hero">
            <div class="avf-film-hero-media">${image(selectedStory.media, selectedStory.title)}</div>
            <div class="avf-film-head">
              <a class="avf-film-back" href="/anf-films">Back</a>
              <h1 class="avf-film-big-title">${selectedStory.names}</h1>
              <p class="avf-film-lead">${selectedStory.year} · Film Story</p>
            </div>
          </section>
          <section class="avf-film-copy">
            <h2>The film<br><em>inside</em><br>the story.</h2>
            <p>${selectedStory.story}</p>
          </section>
          <section class="avf-film-gallery avf-pre-collage">${gallery}</section>
          <section class="avf-film-story-video">
            <div class="avf-youtube-video-shell">
              <p class="avf-youtube-video-label"><span>Featured Film</span><span>Latest from YouTube</span></p>
              ${youtubeEmbed(`${selectedStory.names} latest film from Vipul Vohra YouTube channel`)}
            </div>
          </section>
          <section class="avf-film-story-cta">
            <div class="avf-pre-cta-inner">
              <p class="avf-pre-cta-kicker">✦ Your Story</p>
              <h2>Let's write yours<br>in <em>olive light</em>.</h2>
              <p class="avf-pre-cta-copy">Tell us your love story and we will craft a wedding film made just for the two of you.</p>
              <a href="/contact-us"><span>Contact Us</span><span class="avf-pre-cta-button-icon" aria-hidden="true">↗</span></a>
              <p class="avf-pre-cta-footnote">replies within 24 hours · pan-india travel</p>
            </div>
          </section>
          ${clientStoryLightboxMarkup}
        </section>
      `;
    }

    const cards = stories
      .map(
        (item) => `
          <a class="avf-film-card" href="/anf-films?film=${item.slug}" data-category="${item.category}">
            <div class="avf-film-card__media">
              ${image(item.media, item.title)}
            </div>
            <div class="avf-film-card__body">
              <div class="avf-film-card__kicker">${item.category} · ${item.date}</div>
              <h2 class="avf-film-card__title">${item.title}</h2>
              ${item.excerpt ? `<p class="avf-film-card__text">${item.excerpt.slice(0, 138)}${item.excerpt.length > 138 ? "..." : ""}</p>` : ""}
            </div>
          </a>
        `
      )
      .join("");

    return `
      <style>
        ${sharedStyles}
        .avf-film-list {
          width: min(100% - 48px, 1360px);
          margin: 0 auto;
          padding: clamp(68px, 9vw, 128px) 0 clamp(86px, 10vw, 140px);
          background: #ffffff;
        }
        .avf-film-filters {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: clamp(16px, 2.5vw, 34px);
          margin: 0 0 clamp(38px, 5vw, 64px);
          font-family: "Playfair Display", serif;
          font-size: clamp(0.9rem, 1vw, 1.05rem);
          font-weight: 700;
          color: #111;
        }
        .avf-film-filter {
          appearance: none;
          border: 0;
          border-radius: 0;
          background: transparent;
          color: inherit;
          padding: 0;
          font: inherit;
          cursor: pointer;
          transition: color 220ms ease, transform 220ms ease;
        }
        .avf-film-filter:hover,
        .avf-film-filter.is-active {
          color: #4a5d23;
          transform: translateY(-1px);
        }
        .avf-film-filter-separator {
          color: rgba(17, 17, 17, 0.68);
        }
        .avf-film-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: clamp(42px, 5vw, 72px) clamp(18px, 1.8vw, 28px);
          transition: min-height 320ms ease;
        }
        .avf-film-grid.is-shuffling .avf-film-card {
          pointer-events: none;
        }
        .avf-film-card {
          display: block;
          color: #111;
          text-decoration: none;
          will-change: transform, opacity, filter;
          transition: opacity 260ms ease, transform 260ms ease, filter 260ms ease;
        }
        .avf-film-card.is-hidden {
          display: none;
        }
        .avf-film-card__media {
          position: relative;
          aspect-ratio: 1.48 / 1;
          overflow: hidden;
          background: #d8d1c6;
        }
        .avf-film-card__media img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          filter: brightness(0.84) saturate(1.05);
          transition: transform 0.85s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .avf-film-card:hover .avf-film-card__media img {
          transform: scale(1.06);
        }
        .avf-film-card__media .avf-film-play {
          display: none !important;
        }
        .avf-film-card__body {
          padding-top: 16px;
        }
        .avf-film-card__kicker {
          margin: 0;
          font-family: "Poppins", sans-serif;
          font-size: 12px;
          line-height: 1.35;
          letter-spacing: 0;
          text-transform: none;
          color: #111;
        }
        .avf-film-card__title {
          margin: 10px 0 0;
          font-family: "Playfair Display", serif;
          font-size: clamp(1.55rem, 2vw, 2.25rem);
          line-height: 1.06;
          letter-spacing: -0.04em;
          font-weight: 400;
          color: #111;
        }
        .avf-film-card__text {
          margin: 14px 0 0;
          font-family: "Playfair Display", serif;
          font-size: clamp(0.95rem, 1vw, 1.08rem);
          line-height: 1.52;
          font-weight: 700;
          color: rgba(17, 17, 17, 0.92);
        }
        .avf-film-card:hover {
          transform: translateY(-4px);
        }
        @media (max-width: 760px) {
          .avf-film-list {
            width: min(100% - 32px, 1360px);
          }
          .avf-film-grid {
            grid-template-columns: 1fr;
          }
          .avf-film-filters {
            gap: 14px;
          }
        }
      </style>
      <section class="avf-film-archive">
        <section class="avf-film-hero">
          <div class="avf-film-hero-media">
            <img class="avf-film-archive-parallax" src="/assets/reception.png" alt="Anil Video Films film archive" loading="eager" decoding="async">
          </div>
          <div class="avf-film-head">
            <h1 class="avf-film-big-title">The<br><em>Film</em><br>Archive.</h1>
            <p class="avf-film-lead">Each film is a living memory: voices, vows, movement, music, and the emotion that photographs can only begin to suggest.</p>
          </div>
        </section>
        <section class="avf-film-list">
          <nav class="avf-film-filters" aria-label="Film categories">
            <button class="avf-film-filter is-active" type="button" data-filter="All">All</button>
            <span class="avf-film-filter-separator">|</span>
            <button class="avf-film-filter" type="button" data-filter="Wedding">Wedding</button>
            <span class="avf-film-filter-separator">|</span>
            <button class="avf-film-filter" type="button" data-filter="Engagement / Mehendi">Engagement / Mehendi</button>
            <span class="avf-film-filter-separator">|</span>
            <button class="avf-film-filter" type="button" data-filter="Pre Wedding">Pre Wedding</button>
          </nav>
          <div class="avf-film-grid">${cards}</div>
        </section>
      </section>
    `;
  };

  const aboutPage = () => {
    const team = [
      { name: "Anil Vohra", role: "Founder / Creative Director", image: "/assets/AVF_DEMO (67).jpg" },
      { name: "Riya Sharma", role: "Lead Photographer", image: "/assets/IMG_0202.JPG" },
      { name: "Kabir Mehta", role: "Director of Films", image: "/assets/AVF_DEMO (87).jpg" },
      { name: "Meera Kapoor", role: "Wedding Producer", image: "/assets/IMG_0217.JPG" },
      { name: "Arjun Sethi", role: "Cinematographer", image: "/assets/AVF_DEMO (31).jpg" },
      { name: "Naina Arora", role: "Photo Editor", image: "/assets/portrait.png" },
      { name: "Dev Malhotra", role: "Film Editor", image: "/assets/rig.png" },
      { name: "Sana Gill", role: "Client Experience", image: "/assets/AVF_DEMO (56).jpg" },
    ];

    const cards = team
      .map(
        (member) => `
          <article class="avf-about-card">
            <div class="avf-about-card__image">
              ${image(member.image, member.name)}
            </div>
            <h2>${member.name}</h2>
            <p>${member.role}</p>
          </article>
        `
      )
      .join("");

    return `
      <style>
        .avf-about-shell {
          background: #ffffff;
          color: #2b2521;
          overflow: hidden;
        }
        .avf-about-hero {
          width: min(100% - 48px, 1380px);
          margin: 0 auto;
          padding: clamp(64px, 6.5vw, 96px) 0 clamp(24px, 3.4vw, 44px);
        }
        .avf-about-kicker {
          margin: 0 0 14px;
          color: rgba(111, 29, 27, 0.62);
          font-family: "Poppins", sans-serif;
          font-size: 10px;
          letter-spacing: 0.35em;
          text-transform: uppercase;
        }
        .avf-about-title {
          margin: 0;
          max-width: 860px;
          color: #6f1d1b;
          font-family: "Playfair Display", "Times New Roman", serif;
          font-size: clamp(3.35rem, 8.1vw, 8.5rem);
          font-weight: 400;
          line-height: 0.9;
          letter-spacing: -0.07em;
        }
        .avf-about-title em {
          color: #4a5d23;
          font-style: italic;
        }
        .avf-about-lead {
          max-width: 700px;
          margin: 18px 0 0;
          color: rgba(43, 37, 33, 0.7);
          font-family: "Cormorant Garamond", serif;
          font-size: clamp(1.25rem, 1.9vw, 2.05rem);
          line-height: 1.22;
          font-style: italic;
        }
        .avf-about-team {
          width: min(100% - 48px, 1480px);
          margin: 0 auto;
          padding: 0 0 clamp(58px, 7vw, 96px);
        }
        .avf-about-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: clamp(22px, 2.8vw, 38px) clamp(18px, 2.5vw, 34px);
        }
        .avf-about-card {
          display: block;
          color: #2b2521;
        }
        .avf-about-card__image {
          position: relative;
          aspect-ratio: 1 / 0.68;
          border-radius: clamp(18px, 2vw, 28px);
          overflow: hidden;
          background: #171713;
          isolation: isolate;
        }
        .avf-about-card__image img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          filter: saturate(0.92) contrast(1.03) brightness(0.94);
          transform: scale(1.01);
          transition: transform 650ms cubic-bezier(0.2, 0.8, 0.2, 1), filter 650ms ease;
        }
        .avf-about-card:hover .avf-about-card__image img {
          filter: saturate(1.06) contrast(1.08) brightness(1.02);
          transform: scale(1.08);
        }
        .avf-about-card h2 {
          margin: 12px 0 0;
          color: #6f1d1b;
          font-family: "Playfair Display", "Times New Roman", serif;
          font-size: clamp(1.55rem, 2.15vw, 3rem);
          font-weight: 400;
          line-height: 0.9;
          letter-spacing: -0.07em;
        }
        .avf-about-card p {
          margin: 8px 0 0;
          font-family: "Poppins", sans-serif;
          font-size: 10px;
          letter-spacing: 0.24em;
          line-height: 1.35;
          text-transform: uppercase;
          color: rgba(43, 37, 33, 0.58);
        }
        .avf-about-team-photo {
          position: relative;
          margin-top: clamp(24px, 3vw, 42px);
          border-radius: clamp(20px, 2.2vw, 34px);
          overflow: hidden;
          background: #171713;
          aspect-ratio: 16 / 4.35;
          isolation: isolate;
        }
        .avf-about-team-photo img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 48%;
          display: block;
          filter: saturate(0.96) contrast(1.04) brightness(0.96);
          transform: scale(1.01);
          transition: transform 800ms cubic-bezier(0.2, 0.8, 0.2, 1), filter 800ms ease;
        }
        .avf-about-team-photo:hover img {
          filter: saturate(1.08) contrast(1.08) brightness(1.03);
          transform: scale(1.05);
        }
        @media (max-width: 980px) {
          .avf-about-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
          .avf-about-team-photo {
            aspect-ratio: 16 / 6.4;
          }
        }
        @media (max-width: 620px) {
          .avf-about-hero,
          .avf-about-team {
            width: min(100% - 28px, 1480px);
          }
          .avf-about-hero {
            padding-top: clamp(138px, 34vw, 176px);
            padding-bottom: 32px;
          }
          .avf-about-kicker {
            max-width: 280px;
            margin-bottom: 18px;
            font-size: 9px;
            line-height: 1.8;
            letter-spacing: 0.28em;
          }
          .avf-about-title {
            font-size: clamp(3rem, 16vw, 4.75rem);
          }
          .avf-about-lead {
            font-size: clamp(1.12rem, 6vw, 1.55rem);
          }
          .avf-about-grid {
            gap: 18px;
          }
          .avf-about-card {
            min-height: 0;
          }
          .avf-about-card__image {
            aspect-ratio: 1 / 0.76;
            border-radius: 18px;
          }
          .avf-about-card h2 {
            font-size: clamp(1.75rem, 9vw, 3rem);
          }
          .avf-about-card p {
            font-size: 8px;
            letter-spacing: 0.18em;
          }
          .avf-about-team-photo {
            margin-top: 22px;
            aspect-ratio: 1 / 0.62;
            border-radius: 18px;
          }
        }
      </style>
      <section class="avf-about-shell">
        <header class="avf-about-hero">
          <p class="avf-about-kicker">— About Anil Video Films</p>
          <h1 class="avf-about-title">The people<br><em>behind</em><br>forever.</h1>
          <p class="avf-about-lead">A compact studio of photographers, filmmakers, editors, producers, and quiet obsessives who believe weddings deserve memory with pulse.</p>
        </header>
        <section class="avf-about-team" aria-label="Team members">
          <div class="avf-about-grid">${cards}</div>
          <figure class="avf-about-team-photo" aria-label="Anil Video Films team">
            ${image("/assets/IMG_0278.JPG", "Anil Video Films team")}
          </figure>
        </section>
      </section>
    `;
  };

  const contactPage = () => `
    <style>
      .avf-contact-shell {
        background: #f9f8f6;
        color: #111;
        padding: 0;
      }
      .avf-contact-wrap {
        width: 100%;
        margin: 0 auto;
        padding: 0 clamp(24px, 5vw, 64px);
      }
      .avf-contact-hero {
        position: relative;
        min-height: 100svh;
        display: flex;
        align-items: flex-end;
        overflow: clip;
        color: #f9f8f6;
      }
      .avf-contact-hero-media {
        position: absolute;
        inset: 0;
        overflow: hidden;
        background: #121212;
      }
      .avf-contact-hero-media img {
        position: absolute;
        top: -10%;
        left: 0;
        width: 100%;
        height: 120%;
        object-fit: cover;
        object-position: center top;
        display: block;
        filter: brightness(1.12) saturate(1.04);
        transform: translate3d(0, 0, 0) scale(1.06);
        will-change: transform;
      }
      .avf-contact-hero-wash {
        position: absolute;
        inset: 0;
        background:
          linear-gradient(180deg, rgba(12, 12, 12, 0.02) 0%, rgba(12, 12, 12, 0.1) 30%, rgba(12, 12, 12, 0.66) 100%),
          linear-gradient(90deg, rgba(12, 12, 12, 0.22) 0%, rgba(12, 12, 12, 0.04) 52%, rgba(12, 12, 12, 0.18) 100%);
      }
      .avf-contact-hero-head {
        position: relative;
        z-index: 1;
        width: min(100% - 48px, 1240px);
        margin: 0 auto;
        padding: 0 0 clamp(70px, 9vw, 112px);
      }
      .avf-contact-eyebrow {
        margin: 0;
        font-family: "Poppins", sans-serif;
        font-size: 10px;
        line-height: 1;
        font-weight: 500;
        letter-spacing: 0.35em;
        text-transform: uppercase;
        color: #d4c4a8;
        opacity: 1;
      }
      .avf-contact-title {
        margin: 22px 0 0;
        max-width: 980px;
        font-family: "Playfair Display", serif;
        font-size: clamp(4rem, 11vw, 11rem);
        line-height: 0.9;
        font-weight: 400;
        letter-spacing: -0.07em;
        color: #ffffff;
        text-shadow: 0 10px 24px rgba(0, 0, 0, 0.18);
        cursor: default;
      }
      .avf-contact-title em {
        color: #d4c4a8;
        font-style: italic;
      }
      .avf-contact-lead {
        max-width: 680px;
        margin: 32px 0 0;
        font-family: "Cormorant Garamond", serif;
        font-size: clamp(1.25rem, 2vw, 1.9rem);
        line-height: 1.42;
        font-weight: 400;
        color: rgba(249, 248, 246, 0.78);
      }
      .avf-contact-stage {
        background: #f9f8f6;
      }
      .avf-contact-stage .avf-contact-wrap {
        padding: 0;
      }
      .avf-contact-grid {
        display: grid;
        grid-template-columns: repeat(12, minmax(0, 1fr));
        gap: 0;
      }
      .avf-contact-panel {
        background: #4a5d23;
        color: #f9f8f6;
        grid-column: 9 / span 4;
        grid-row: 1;
        padding: 48px clamp(24px, 4vw, 48px) 96px;
        display: grid;
        align-content: start;
        gap: 0;
      }
      .avf-contact-panel .avf-contact-eyebrow {
        color: rgba(249, 248, 246, 0.7);
      }
      .avf-contact-detail {
        margin-top: 16px;
      }
      .avf-contact-detail span {
        display: none;
      }
      .avf-contact-detail a,
      .avf-contact-detail p {
        margin: 0;
        font-family: "Cormorant Garamond", serif;
        font-size: clamp(28px, 2vw, 34px);
        line-height: 1.35;
        font-weight: 400;
        color: #f9f8f6;
      }
      .avf-contact-detail a {
        width: fit-content;
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .avf-contact-icon-row {
        display: flex;
        align-items: flex-start;
        gap: 12px;
      }
      .avf-contact-icon {
        width: 20px;
        height: 20px;
        flex: 0 0 auto;
        opacity: 0.8;
        margin-top: 6px;
      }
      .avf-contact-note {
        margin: 56px 0 0;
        font-family: "Cormorant Garamond", serif;
        font-size: clamp(24px, 1.6vw, 30px);
        line-height: 1.4;
        font-style: italic;
        color: rgba(249, 248, 246, 0.9);
      }
      .avf-contact-form-shell {
        grid-column: 1 / span 8;
        grid-row: 1;
        padding: 48px clamp(24px, 5vw, 64px) 96px;
      }
      .avf-contact-form-head {
        display: none;
      }
      .avf-contact-form {
        display: grid;
        gap: 36px;
      }
      .avf-contact-form-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 28px 32px;
      }
      .avf-field.is-span-2 {
        grid-column: 1 / -1;
      }
      .avf-field label {
        display: block;
        margin-bottom: 10px;
        font-family: "Cormorant Garamond", serif;
        font-size: clamp(20px, 1.4vw, 24px);
        line-height: 1.08;
        font-weight: 700;
        color: #111;
      }
      .avf-field input,
      .avf-field select,
      .avf-field textarea {
        width: 100%;
        border: 0;
        border-bottom: 1px solid rgba(17, 17, 17, 0.75);
        background: transparent;
        padding: 8px 0 10px;
        font: inherit;
        font-family: "Cormorant Garamond", serif;
        font-size: clamp(16px, 1.05vw, 19px);
        line-height: 1.35;
        color: #111;
        border-radius: 0;
        box-sizing: border-box;
        outline: none;
        box-shadow: none;
      }
      .avf-field input:focus,
      .avf-field select:focus,
      .avf-field textarea:focus {
        border-bottom-color: #111;
      }
      .avf-field select {
        appearance: none;
        background-image:
          linear-gradient(45deg, transparent 50%, #111 50%),
          linear-gradient(135deg, #111 50%, transparent 50%);
        background-position:
          calc(100% - 24px) calc(50% - 4px),
          calc(100% - 16px) calc(50% - 4px);
        background-size: 8px 8px, 8px 8px;
        background-repeat: no-repeat;
        padding-right: 48px;
      }
      .avf-field textarea {
        min-height: 120px;
        resize: vertical;
      }
      .avf-submit {
        justify-self: start;
        border: 0;
        background: #4a5d23;
        color: #fff;
        padding: 14px 24px;
        border-radius: 999px;
        font-family: "Mulish", sans-serif;
        font-size: 0.95rem;
        line-height: 1;
        font-weight: 600;
        letter-spacing: 0;
        text-transform: none;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 8px;
      }
      .avf-contact-hero {
        display: none;
      }
      .avf-contact-shell {
        background: #f9f8f6;
      }
      .avf-contact-stage {
        padding: clamp(86px, 10vw, 138px) clamp(24px, 7vw, 132px);
      }
      .avf-contact-grid {
        max-width: 1400px;
        margin: 0 auto;
        grid-template-columns: minmax(280px, 0.88fr) minmax(320px, 1fr);
        gap: clamp(54px, 9vw, 148px);
        align-items: start;
      }
      .avf-contact-panel {
        grid-column: 1;
        background: transparent;
        color: #2b2521;
        padding: 0;
        box-shadow: none;
      }
      .avf-contact-form-shell {
        grid-column: 2;
        padding: 4px 0 0;
      }
      .avf-contact-editorial-title {
        margin: 0;
        color: #6f1d1b;
        font-family: "Playfair Display", "Times New Roman", serif;
        font-size: clamp(4rem, 11vw, 11rem);
        line-height: 0.9;
        font-weight: 400;
        letter-spacing: -0.07em;
        text-transform: none;
      }
      .avf-contact-editorial-dek {
        margin: 24px 0 0;
        color: rgba(111, 29, 27, 0.78);
        font-family: "Cormorant Garamond", serif;
        font-size: clamp(22px, 1.75vw, 31px);
        line-height: 1.42;
        font-style: italic;
      }
      .avf-contact-editorial-copy {
        max-width: 620px;
        margin: 24px 0 0;
        color: rgba(43, 37, 33, 0.66);
        font-family: "Mulish", sans-serif;
        font-size: clamp(15px, 1vw, 17px);
        line-height: 1.8;
      }
      .avf-contact-editorial-image {
        width: min(100%, 390px);
        aspect-ratio: 4 / 4.6;
        margin: clamp(24px, 3vw, 38px) 0 0;
        overflow: hidden;
        background: #d8d1c6;
        box-shadow: 0 26px 70px rgba(43, 37, 33, 0.12);
      }
      .avf-contact-editorial-image img {
        width: 100%;
        height: 100%;
        display: block;
        object-fit: cover;
        filter: brightness(0.9) saturate(0.92) contrast(1.04);
      }
      .avf-contact-editorial-details {
        margin: clamp(34px, 4vw, 54px) 0 0;
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 22px;
      }
      .avf-contact-editorial-details .avf-contact-eyebrow {
        color: #6f1d1b;
        font-family: "Cormorant Garamond", serif;
        font-size: clamp(25px, 2vw, 34px);
        line-height: 1;
        font-weight: 400;
        letter-spacing: 0.18em;
      }
      .avf-contact-detail a,
      .avf-contact-detail p {
        color: rgba(43, 37, 33, 0.66);
        font-size: clamp(18px, 1.2vw, 22px);
        line-height: 1.2;
        font-style: italic;
      }
      .avf-contact-panel .avf-contact-editorial-details {
        display: none;
      }
      .avf-contact-icon {
        display: none;
      }
      .avf-contact-form-grid {
        gap: 26px 34px;
      }
      .avf-field label {
        color: rgba(111, 29, 27, 0.68);
        font-family: "Poppins", sans-serif;
        font-size: 11px;
        line-height: 1;
        font-weight: 500;
        letter-spacing: 0.34em;
        text-transform: uppercase;
      }
      .avf-field input,
      .avf-field select,
      .avf-field textarea {
        border-bottom-color: rgba(111, 29, 27, 0.18);
        color: #2b2521;
      }
      .avf-field input:focus,
      .avf-field select:focus,
      .avf-field textarea:focus {
        border-bottom-color: #6f1d1b;
      }
      .avf-field select {
        background-image:
          linear-gradient(45deg, transparent 50%, #6f1d1b 50%),
          linear-gradient(135deg, #6f1d1b 50%, transparent 50%);
      }
      .avf-field textarea {
        min-height: 160px;
      }
      .avf-submit {
        border-radius: 0;
        background: #6f1d1b;
        color: #f9f8f6;
        min-width: 220px;
        min-height: 58px;
        justify-content: center;
        font-family: "Poppins", sans-serif;
        font-size: 11px;
        letter-spacing: 0.34em;
        text-transform: uppercase;
        transition: background 0.3s ease, transform 0.3s ease;
      }
      .avf-submit:hover {
        background: #4a5d23;
        transform: translateY(-2px);
      }
      .avf-contact-action-details {
        margin: clamp(34px, 4vw, 54px) 0 0;
        display: grid;
        grid-template-columns: 1fr;
        gap: 14px;
      }
      .avf-contact-action-link {
        width: fit-content;
        display: inline-flex;
        align-items: center;
        gap: 12px;
        color: rgba(43, 37, 33, 0.72);
        font-family: "Cormorant Garamond", serif;
        font-size: clamp(17px, 1.1vw, 21px);
        line-height: 1.1;
        font-style: italic;
        text-decoration: none;
        transition: color 0.25s ease, transform 0.25s ease;
      }
      .avf-contact-action-link:hover {
        color: #6f1d1b;
        transform: translateX(3px);
      }
      .avf-contact-action-link svg {
        width: 18px;
        height: 18px;
        flex: 0 0 auto;
        color: #6f1d1b;
      }
      .avf-contact-action-link--icon {
        width: 28px;
        height: 28px;
        justify-content: center;
      }
      @media (max-width: 900px) {
        .avf-contact-shell {
          padding-top: 0;
        }
        .avf-contact-hero {
          min-height: 100svh;
        }
        .avf-contact-hero-head {
          width: min(100% - 32px, 1240px);
          padding: 0 0 48px;
        }
        .avf-contact-hero-media {
          min-height: 100%;
        }
        .avf-contact-grid,
        .avf-contact-form-grid {
          grid-template-columns: 1fr;
        }
        .avf-contact-panel,
        .avf-contact-form-shell {
          grid-column: 1 / -1;
        }
        .avf-field.is-span-2 {
          grid-column: auto;
        }
        .avf-contact-panel,
        .avf-contact-form-shell {
          padding-top: 48px;
          padding-bottom: 48px;
        }
        .avf-contact-stage {
          padding: 78px 22px;
        }
        .avf-contact-grid {
          display: flex;
          flex-direction: column;
          gap: 42px;
          max-width: 560px;
          margin: 0 auto;
        }
        .avf-contact-panel,
        .avf-contact-form-shell {
          width: 100%;
          padding: 0;
        }
        .avf-contact-panel {
          order: 1;
        }
        .avf-contact-form-shell {
          order: 2;
        }
        .avf-contact-editorial-title {
          font-size: clamp(4rem, 17vw, 7rem);
          line-height: 0.9;
          letter-spacing: -0.07em;
          word-break: normal;
          overflow-wrap: normal;
        }
        .avf-contact-editorial-dek {
          margin-top: 18px;
          font-size: clamp(21px, 7vw, 32px);
          line-height: 1.22;
        }
        .avf-contact-editorial-copy {
          margin-top: 18px;
          font-size: 16px;
          line-height: 1.65;
        }
        .avf-contact-editorial-image {
          width: min(100%, 360px);
          margin-left: auto;
          margin-right: auto;
        }
        .avf-contact-editorial-details {
          grid-template-columns: 1fr;
          gap: 18px;
          margin-top: 30px;
        }
        .avf-contact-form-grid {
          gap: 26px;
        }
        .avf-field label {
          margin-bottom: 6px;
          font-size: 18px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #6f1d1b;
        }
        .avf-field input,
        .avf-field select,
        .avf-field textarea {
          font-size: 20px;
          line-height: 1.25;
        }
        .avf-submit {
          justify-self: center;
          min-width: 220px;
          justify-content: center;
        }
      }
    </style>
    <section class="avf-contact-shell">
      <section class="avf-contact-hero">
        <div class="avf-contact-hero-media">
          <img class="avf-contact-parallax" src="/assets/IMG_0202.JPG" alt="Anil Video Films contact" loading="eager" decoding="async">
        </div>
        <div class="avf-contact-hero-wash"></div>
        <div class="avf-contact-hero-head">
          <div class="avf-contact-eyebrow">— Contact</div>
          <h1 class="avf-contact-title">Tell us<br><em>everything</em>.</h1>
          <p class="avf-contact-lead">The date, the place, the colour of your grandmother's saree, the song your mother hummed on your birthdays. We read everything. We reply to everything.</p>
        </div>
      </section>
      <div class="avf-contact-stage">
        <div class="avf-contact-wrap">
          <div class="avf-contact-grid">
          <aside class="avf-contact-panel">
            <h1 class="avf-contact-editorial-title">Contact<br>Us</h1>
            <p class="avf-contact-editorial-dek">Tell us the date, the place, the feeling, and every little detail you want remembered.</p>
            <p class="avf-contact-editorial-copy">We read every message carefully and reply with the same warmth we bring to the wedding day. Share a paragraph, a Pinterest board, a voice note, or simply the beginning of your story.</p>
            <figure class="avf-contact-editorial-image">
              <img src="/assets/IMG_0202.JPG" alt="Anil Video Films contact">
            </figure>
            <div class="avf-contact-editorial-details">
              <div>
                <div class="avf-contact-eyebrow">E-mail</div>
                <div class="avf-contact-detail"><a href="mailto:contact@anilvideofilms.com">contact@anilvideofilms.com</a></div>
              </div>
              <div>
                <div class="avf-contact-eyebrow">Address</div>
                <div class="avf-contact-detail"><p>Studio 24, Rajouri Garden, New Delhi 110027</p></div>
              </div>
              <div>
                <div class="avf-contact-eyebrow">Call Me</div>
                <div class="avf-contact-detail"><a href="tel:+919463410530">+91 9463410530</a></div>
              </div>
            </div>
          </aside>
          <div class="avf-contact-form-shell">
            <form class="avf-contact-form" data-avf-mail-form data-avf-mail-subject="New wedding enquiry from Anil Video Films website">
              <div class="avf-contact-form-grid">
                <div class="avf-field">
                  <label>Full Name</label>
                  <input type="text" name="name" placeholder="Your name">
                </div>
                <div class="avf-field">
                  <label>Email</label>
                  <input type="email" name="email" placeholder="you@example.com">
                </div>
                <div class="avf-field">
                  <label>Phone</label>
                  <input type="tel" name="phone" placeholder="+91">
                </div>
                <div class="avf-field">
                  <label>Event Date</label>
                  <input type="date" name="event-date">
                </div>
                <div class="avf-field">
                  <label>Event Location</label>
                  <input type="text" name="location" placeholder="City, venue or destination">
                </div>
                <div class="avf-field">
                  <label>Service</label>
                  <select name="service">
                    <option>Wedding Photography</option>
                    <option>Wedding Film</option>
                    <option>Pre Wedding</option>
                    <option>Engagement / Mehndi</option>
                    <option>Other</option>
                  </select>
                </div>
                <div class="avf-field is-span-2">
                  <label>Tell us your story</label>
                  <textarea name="details" placeholder="A few sentences about the two of you, the wedding, what you love about photographs."></textarea>
                </div>
              </div>
              <button class="avf-submit" type="submit">Send Enquiry <span aria-hidden="true">→</span></button>
              <div class="avf-contact-action-details" aria-label="Contact links">
                <a class="avf-contact-action-link" href="mailto:contact@anilvideofilms.com">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M4 6h16v12H4z"/><path d="m4 8 8 6 8-6"/></svg>
                  contact@anilvideofilms.com
                </a>
                <a class="avf-contact-action-link" href="tel:+919463410530">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 11.2 19a19.3 19.3 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7l.4 2.6a2 2 0 0 1-.6 1.8L7.1 9.9a16 16 0 0 0 7 7l1.8-1.8a2 2 0 0 1 1.8-.6l2.6.4A2 2 0 0 1 22 16.9Z"/></svg>
                  +91 9463410530
                </a>
                <a class="avf-contact-action-link" href="https://www.instagram.com/anilvideofilms/" aria-label="Instagram" target="_blank" rel="noopener">
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7.75 2h8.5A5.76 5.76 0 0 1 22 7.75v8.5A5.76 5.76 0 0 1 16.25 22h-8.5A5.76 5.76 0 0 1 2 16.25v-8.5A5.76 5.76 0 0 1 7.75 2Zm0 2A3.75 3.75 0 0 0 4 7.75v8.5A3.75 3.75 0 0 0 7.75 20h8.5A3.75 3.75 0 0 0 20 16.25v-8.5A3.75 3.75 0 0 0 16.25 4h-8.5ZM12 7.35A4.65 4.65 0 1 1 7.35 12 4.65 4.65 0 0 1 12 7.35Zm0 2A2.65 2.65 0 1 0 14.65 12 2.65 2.65 0 0 0 12 9.35ZM17.1 6.75a1.15 1.15 0 1 1-1.15 1.15 1.15 1.15 0 0 1 1.15-1.15Z"/></svg>
                  anilvideofilms
                </a>
                <a class="avf-contact-action-link" href="https://www.youtube.com/@Vipulvohra" aria-label="YouTube" target="_blank" rel="noopener">
                  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4L15.8 12l-6.2 3.6Z"/></svg>
                  youtube.com/@Vipulvohra
                </a>
              </div>
            </form>
          </div>
        </div>
        </div>
      </div>
    </section>
  `;

  const careersPage = () => `
    <style>
      .avf-careers-shell {
        background: #f9f8f6;
        color: #111;
      }
      .avf-careers-hero {
        position: relative;
        color: #f9f8f6;
        padding: 0;
        min-height: 100svh;
        display: flex;
        align-items: flex-end;
        overflow: clip;
      }
      .avf-careers-hero-head {
        position: relative;
        z-index: 1;
        width: min(100% - 48px, 1240px);
        margin: 0 auto;
        padding: 0 0 clamp(70px, 9vw, 112px);
      }
      .avf-careers-hero-media {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        background: #121212;
      }
      .avf-careers-hero-media img {
        position: absolute;
        top: -10%;
        left: 0;
        width: 100%;
        height: 120%;
        object-fit: cover;
        object-position: center top;
        display: block;
        filter: brightness(1.18) saturate(1.04);
        transform: translate3d(0, 0, 0) scale(1.06);
        will-change: transform;
      }
      .avf-careers-hero-wash {
        position: absolute;
        inset: 0;
        background:
          linear-gradient(180deg, rgba(12, 12, 12, 0.02) 0%, rgba(12, 12, 12, 0.08) 28%, rgba(12, 12, 12, 0.62) 100%),
          linear-gradient(90deg, rgba(12, 12, 12, 0.18) 0%, rgba(12, 12, 12, 0.02) 52%, rgba(12, 12, 12, 0.16) 100%);
      }
      .avf-careers-eyebrow {
        margin: 0 0 1rem;
        font-family: "Poppins", sans-serif;
        font-size: 10px;
        line-height: 1;
        font-weight: 500;
        letter-spacing: 0.35em;
        text-transform: uppercase;
        color: #d4c4a8;
        opacity: 1;
      }
      .avf-careers-hero h1,
      .avf-careers-roles-head h2,
      .avf-careers-apply-copy h2,
      .avf-careers-role-title,
      .avf-careers-role-cta,
      .avf-careers-field label {
        font-family: "Cormorant Garamond", serif;
      }
      .avf-careers-hero h1 {
        margin: 22px 0 0;
        max-width: 980px;
        font-family: "Playfair Display", serif;
        font-size: clamp(4rem, 11vw, 11rem);
        line-height: 0.9;
        font-weight: 400;
        letter-spacing: -0.07em;
        color: #ffffff;
        text-shadow: 0 10px 24px rgba(0, 0, 0, 0.18);
        cursor: default;
      }
      .avf-careers-hero h1 em {
        color: #d4c4a8;
        font-style: italic;
      }
      .avf-careers-lead {
        max-width: 680px;
        margin: 32px 0 0;
        color: rgba(249, 248, 246, 0.78);
        font-family: "Cormorant Garamond", serif;
        font-size: clamp(1.25rem, 2vw, 1.9rem);
        line-height: 1.42;
        font-weight: 400;
      }
      .avf-hover-line {
        display: block;
      }
      .avf-hover-letter {
        display: inline-block;
        min-width: 0.24em;
        color: inherit;
        transition: transform 220ms ease, color 220ms ease;
        transform-origin: center bottom;
      }
      .avf-hover-letter.is-space {
        min-width: 0.3em;
      }
      .avf-careers-hero h1:hover .avf-hover-letter {
        color: #d4c4a8;
      }
      .avf-careers-hero h1:hover .avf-hover-letter {
        transform: translateY(-2px);
      }
      .avf-hover-word-nowrap {
        white-space: nowrap;
      }
      .avf-careers-roles,
      .avf-careers-form-section {
        background: #f9f8f6;
      }
      .avf-careers-roles {
        padding: 52px 0 0;
      }
      .avf-careers-roles-head {
        padding: 0 clamp(24px, 5vw, 64px);
        margin-bottom: 24px;
      }
      .avf-careers-roles-head h2 {
        margin: 12px 0 0;
        font-size: clamp(36px, 7vw, 72px);
        line-height: 0.95;
        font-weight: 400;
      }
      .avf-careers-role-list {
        border-top: 1px solid rgba(17, 17, 17, 0.1);
      }
      .avf-careers-role {
        display: flex;
        flex-direction: column;
        gap: 8px;
        width: 100%;
        padding: 22px clamp(24px, 5vw, 64px);
        border: 0;
        border-bottom: 1px solid rgba(17, 17, 17, 0.1);
        background: transparent;
        color: inherit;
        text-align: left;
      }
      .avf-careers-role-title {
        font-size: clamp(28px, 3vw, 40px);
        line-height: 1.05;
        font-style: italic;
      }
      .avf-careers-role-meta {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 16px 24px;
      }
      .avf-careers-role-meta span {
        font-family: "Poppins", sans-serif;
        font-size: 0.68rem;
        line-height: 1;
        font-weight: 500;
        letter-spacing: 0.08em;
        opacity: 0.6;
      }
      .avf-careers-role-cta {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        font-size: 1rem;
        line-height: 1;
        font-style: italic;
        opacity: 0.7;
      }
      .avf-careers-form-section {
        scroll-margin-top: 120px;
        padding: 0;
      }
      .avf-careers-form-grid {
        display: grid;
        grid-template-columns: repeat(12, minmax(0, 1fr));
        gap: 0;
      }
      .avf-careers-apply-copy {
        align-content: start;
        background: #4a5d23;
        color: #f9f8f6;
        display: grid;
        grid-column: span 4;
        padding: 52px clamp(24px, 4vw, 48px) 96px;
        box-shadow: inset 0 0 0 1px rgba(249, 248, 246, 0.18);
      }
      .avf-careers-apply-copy .avf-careers-eyebrow {
        color: rgba(249, 248, 246, 0.68);
      }
      .avf-careers-apply-copy h2 {
        color: #f9f8f6;
        margin: 12px 0 0;
        font-size: clamp(34px, 6vw, 58px);
        line-height: 0.95;
        font-weight: 400;
      }
      .avf-careers-apply-copy p {
        max-width: 28rem;
        margin: 18px 0 0;
        font-family: "Cormorant Garamond", serif;
        font-size: clamp(18px, 1.4vw, 22px);
        line-height: 1.35;
        color: rgba(249, 248, 246, 0.82);
        opacity: 0.9;
      }
      .avf-careers-form {
        grid-column: span 8;
        padding: 52px clamp(24px, 5vw, 64px) 96px;
      }
      .avf-careers-fields {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 24px 28px;
      }
      .avf-careers-field {
        display: grid;
        gap: 10px;
      }
      .avf-careers-field.is-span-2 {
        grid-column: 1 / -1;
      }
      .avf-careers-field label {
        font-size: clamp(20px, 1.4vw, 24px);
        line-height: 1.08;
        font-weight: 700;
      }
      .avf-careers-input,
      .avf-careers-select,
      .avf-careers-textarea {
        width: 100%;
        box-sizing: border-box;
        border: 0;
        border-bottom: 1px solid rgba(17, 17, 17, 0.75);
        background: transparent;
        color: #111;
        font-family: "Cormorant Garamond", serif;
        font-size: clamp(16px, 1.05vw, 19px);
        line-height: 1.35;
        padding: 8px 0 10px;
        border-radius: 0;
        appearance: none;
        outline: none;
      }
      .avf-careers-input:focus,
      .avf-careers-select:focus,
      .avf-careers-textarea:focus {
        border-bottom-color: #111;
      }
      .avf-careers-select-wrap {
        position: relative;
      }
      .avf-careers-select-wrap::after {
        content: "";
        position: absolute;
        right: 22px;
        top: calc(50% - 4px);
        width: 8px;
        height: 8px;
        border-right: 2px solid #111;
        border-bottom: 2px solid #111;
        transform: rotate(45deg);
        pointer-events: none;
      }
      .avf-careers-select {
        padding-right: 46px;
      }
      .avf-careers-textarea {
        min-height: 120px;
        resize: vertical;
      }
      .avf-careers-submit {
        margin-top: 32px;
        display: inline-flex;
        align-items: center;
        gap: 8px;
        border: 0;
        border-radius: 999px;
        background: #4a5d23;
        color: #fff;
        padding: 12px 20px;
        font-family: "Mulish", sans-serif;
        font-size: 0.82rem;
        line-height: 1;
        font-weight: 600;
        cursor: pointer;
      }
      .avf-careers-hero,
      .avf-careers-roles {
        display: none;
      }
      .avf-careers-shell,
      .avf-careers-form-section {
        background: #f9f8f6;
      }
      .avf-careers-form-section {
        padding: clamp(86px, 10vw, 138px) clamp(24px, 7vw, 132px);
      }
      .avf-careers-form-grid {
        max-width: 1400px;
        margin: 0 auto;
        grid-template-columns: minmax(280px, 0.88fr) minmax(320px, 1fr);
        gap: clamp(54px, 9vw, 148px);
        align-items: start;
      }
      .avf-careers-apply-copy {
        grid-column: 1;
        background: transparent;
        color: #2b2521;
        padding: 0;
        box-shadow: none;
      }
      .avf-careers-form {
        grid-column: 2;
        padding: 4px 0 0;
      }
      .avf-careers-apply-copy .avf-careers-eyebrow {
        display: none;
      }
      .avf-careers-apply-copy h2 {
        margin: 0;
        color: #6f1d1b;
        font-family: "Playfair Display", "Times New Roman", serif;
        font-size: clamp(4rem, 11vw, 11rem);
        line-height: 0.9;
        font-weight: 400;
        letter-spacing: -0.07em;
        text-transform: none;
      }
      .avf-careers-apply-copy p {
        max-width: 620px;
        margin: 24px 0 0;
        color: rgba(43, 37, 33, 0.66);
        font-family: "Mulish", sans-serif;
        font-size: clamp(15px, 1vw, 17px);
        line-height: 1.8;
      }
      .avf-careers-apply-copy p:first-of-type {
        color: rgba(111, 29, 27, 0.78);
        font-family: "Cormorant Garamond", serif;
        font-size: clamp(22px, 1.75vw, 31px);
        line-height: 1.42;
        font-style: italic;
      }
      .avf-careers-editorial-image {
        width: min(100%, 390px);
        aspect-ratio: 4 / 4.6;
        margin: clamp(24px, 3vw, 38px) 0 0;
        overflow: hidden;
        background: #d8d1c6;
        box-shadow: 0 26px 70px rgba(43, 37, 33, 0.12);
      }
      .avf-careers-editorial-image img {
        width: 100%;
        height: 100%;
        display: block;
        object-fit: cover;
        filter: brightness(0.9) saturate(0.92) contrast(1.04);
      }
      .avf-careers-details {
        margin: clamp(34px, 4vw, 54px) 0 0;
        display: grid;
        grid-template-columns: 1fr;
        gap: 14px;
      }
      .avf-careers-contact-link {
        width: fit-content;
        display: inline-flex;
        align-items: center;
        gap: 12px;
        color: rgba(43, 37, 33, 0.72);
        font-family: "Cormorant Garamond", serif;
        font-size: clamp(17px, 1.1vw, 21px);
        line-height: 1.1;
        font-style: italic;
        text-decoration: none;
        transition: color 0.25s ease, transform 0.25s ease;
      }
      .avf-careers-contact-link:hover {
        color: #6f1d1b;
        transform: translateX(3px);
      }
      .avf-careers-contact-link svg {
        width: 18px;
        height: 18px;
        flex: 0 0 auto;
        color: #6f1d1b;
      }
      .avf-careers-contact-link--icon {
        width: 28px;
        height: 28px;
        justify-content: center;
      }
      .avf-careers-apply-copy .avf-careers-details {
        display: none;
      }
      .avf-careers-fields {
        gap: 26px 34px;
      }
      .avf-careers-field label {
        color: rgba(111, 29, 27, 0.68);
        font-family: "Poppins", sans-serif;
        font-size: 11px;
        line-height: 1;
        font-weight: 500;
        letter-spacing: 0.34em;
        text-transform: uppercase;
      }
      .avf-careers-input,
      .avf-careers-select,
      .avf-careers-textarea {
        border-bottom-color: rgba(111, 29, 27, 0.18);
        color: #2b2521;
      }
      .avf-careers-input:focus,
      .avf-careers-select:focus,
      .avf-careers-textarea:focus {
        border-bottom-color: #6f1d1b;
      }
      .avf-careers-select-wrap::after {
        border-right-color: #6f1d1b;
        border-bottom-color: #6f1d1b;
      }
      .avf-careers-textarea {
        min-height: 160px;
      }
      .avf-careers-submit {
        border-radius: 0;
        background: #6f1d1b;
        color: #f9f8f6;
        min-width: 240px;
        min-height: 58px;
        justify-content: center;
        font-family: "Poppins", sans-serif;
        font-size: 11px;
        letter-spacing: 0.34em;
        text-transform: uppercase;
        transition: background 0.3s ease, transform 0.3s ease;
      }
      .avf-careers-submit:hover {
        background: #4a5d23;
        transform: translateY(-2px);
      }
      @media (max-width: 900px) {
        .avf-careers-hero {
          min-height: 100svh;
        }
        .avf-careers-hero-head {
          width: min(100% - 32px, 1240px);
          padding: 0 0 48px;
        }
        .avf-hover-letter {
          min-width: 0.2em;
        }
        .avf-careers-hero-media {
          min-height: 100%;
        }
        .avf-careers-form-grid,
        .avf-careers-fields {
          grid-template-columns: 1fr;
        }
        .avf-careers-apply-copy,
        .avf-careers-form {
          grid-column: 1 / -1;
          padding-top: 48px;
          padding-bottom: 48px;
        }
        .avf-careers-form-section {
          padding: 78px 22px;
        }
        .avf-careers-apply-copy,
        .avf-careers-form {
          padding: 0;
        }
        .avf-careers-details {
          grid-template-columns: 1fr;
        }
      }
    </style>
    <section class="avf-careers-shell">
      <section class="avf-careers-hero">
        <div class="avf-careers-hero-media">
          <img class="avf-careers-parallax" src="/assets/AVF_DEMO (67).jpg" alt="Anil Video Films team at work" loading="eager" decoding="async">
        </div>
        <div class="avf-careers-hero-wash"></div>
        <div class="avf-careers-hero-head">
          <div class="avf-careers-eyebrow">— Careers</div>
          <h1>Make<br><em>weddings</em><br>last!</h1>
          <p class="avf-careers-lead">Join a studio that believes wedding work should feel cinematic, emotional, and built to outlive trends.</p>
        </div>
      </section>

      <section class="avf-careers-roles">
        <div class="avf-careers-roles-head">
          <div class="avf-careers-eyebrow">— Open Roles</div>
          <h2>Currently hiring.</h2>
        </div>
        <div class="avf-careers-role-list">
          <button class="avf-careers-role" type="button" onclick="document.getElementById('careers-apply').scrollIntoView({ behavior: 'smooth', block: 'start' });">
            <div class="avf-careers-role-title">Wedding Photographer</div>
            <div class="avf-careers-role-meta">
              <span>Mid–Senior</span>
              <span>Delhi · Travel</span>
              <div class="avf-careers-role-cta">Apply <span aria-hidden="true">→</span></div>
            </div>
          </button>
          <button class="avf-careers-role" type="button" onclick="document.getElementById('careers-apply').scrollIntoView({ behavior: 'smooth', block: 'start' });">
            <div class="avf-careers-role-title">Cinematographer (DOP)</div>
            <div class="avf-careers-role-meta">
              <span>Senior</span>
              <span>Delhi · Travel</span>
              <div class="avf-careers-role-cta">Apply <span aria-hidden="true">→</span></div>
            </div>
          </button>
          <button class="avf-careers-role" type="button" onclick="document.getElementById('careers-apply').scrollIntoView({ behavior: 'smooth', block: 'start' });">
            <div class="avf-careers-role-title">Film Editor</div>
            <div class="avf-careers-role-meta">
              <span>Mid</span>
              <span>Delhi · Hybrid</span>
              <div class="avf-careers-role-cta">Apply <span aria-hidden="true">→</span></div>
            </div>
          </button>
          <button class="avf-careers-role" type="button" onclick="document.getElementById('careers-apply').scrollIntoView({ behavior: 'smooth', block: 'start' });">
            <div class="avf-careers-role-title">Photo Editor / Retoucher</div>
            <div class="avf-careers-role-meta">
              <span>Junior–Mid</span>
              <span>Delhi · Hybrid</span>
              <div class="avf-careers-role-cta">Apply <span aria-hidden="true">→</span></div>
            </div>
          </button>
          <button class="avf-careers-role" type="button" onclick="document.getElementById('careers-apply').scrollIntoView({ behavior: 'smooth', block: 'start' });">
            <div class="avf-careers-role-title">Producer / Wedding Manager</div>
            <div class="avf-careers-role-meta">
              <span>Mid</span>
              <span>Delhi · On-site</span>
              <div class="avf-careers-role-cta">Apply <span aria-hidden="true">→</span></div>
            </div>
          </button>
        </div>
      </section>

      <section class="avf-careers-form-section" id="careers-apply">
        <div class="avf-careers-form-grid">
          <div class="avf-careers-apply-copy">
            <div class="avf-careers-eyebrow">— Apply</div>
            <h2>Careers</h2>
            <p>Join a studio that believes wedding work should feel cinematic, emotional, and built to outlive trends.</p>
            <p>We are a small studio with very large feelings. Send us your work, your eye, your rhythm, and the kind of stories you want to help preserve.</p>
            <figure class="avf-careers-editorial-image">
              <img src="/assets/AVF_DEMO (67).jpg" alt="Anil Video Films careers">
            </figure>
          </div>
          <form class="avf-careers-form" data-avf-mail-form data-avf-mail-subject="New career application from Anil Video Films website">
            <div class="avf-careers-fields">
              <div class="avf-careers-field">
                <label>Full Name</label>
                <input class="avf-careers-input" type="text" name="name">
              </div>
              <div class="avf-careers-field">
                <label>Email</label>
                <input class="avf-careers-input" type="email" name="email">
              </div>
              <div class="avf-careers-field">
                <label>Phone</label>
                <input class="avf-careers-input" type="tel" name="phone">
              </div>
              <div class="avf-careers-field">
                <label>Role</label>
                <div class="avf-careers-select-wrap">
                  <select class="avf-careers-select" name="role">
                    <option>Wedding Photographer</option>
                    <option>Cinematographer (DOP)</option>
                    <option>Film Editor</option>
                    <option>Photo Editor / Retoucher</option>
                    <option>Producer / Wedding Manager</option>
                  </select>
                </div>
              </div>
              <div class="avf-careers-field">
                <label>Years of Experience</label>
                <input class="avf-careers-input" type="text" name="experience" placeholder="e.g. 4 years">
              </div>
              <div class="avf-careers-field">
                <label>Portfolio Link</label>
                <input class="avf-careers-input" type="url" name="portfolio" placeholder="https://">
              </div>
              <div class="avf-careers-field is-span-2">
                <label>Cover Letter</label>
                <textarea class="avf-careers-textarea" name="cover-letter" placeholder="A short note — why you, why us."></textarea>
              </div>
            </div>
            <button class="avf-careers-submit" type="submit">Send Application <span aria-hidden="true">→</span></button>
            <div class="avf-careers-details" aria-label="Career contact links">
              <a class="avf-careers-contact-link" href="mailto:contact@anilvideofilms.com">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M4 6h16v12H4z"/><path d="m4 8 8 6 8-6"/></svg>
                contact@anilvideofilms.com
              </a>
              <a class="avf-careers-contact-link" href="tel:+919463410530">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 11.2 19a19.3 19.3 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7l.4 2.6a2 2 0 0 1-.6 1.8L7.1 9.9a16 16 0 0 0 7 7l1.8-1.8a2 2 0 0 1 1.8-.6l2.6.4A2 2 0 0 1 22 16.9Z"/></svg>
                +91 9463410530
              </a>
              <a class="avf-careers-contact-link" href="https://www.instagram.com/anilvideofilms/" aria-label="Instagram" target="_blank" rel="noopener">
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7.75 2h8.5A5.76 5.76 0 0 1 22 7.75v8.5A5.76 5.76 0 0 1 16.25 22h-8.5A5.76 5.76 0 0 1 2 16.25v-8.5A5.76 5.76 0 0 1 7.75 2Zm0 2A3.75 3.75 0 0 0 4 7.75v8.5A3.75 3.75 0 0 0 7.75 20h8.5A3.75 3.75 0 0 0 20 16.25v-8.5A3.75 3.75 0 0 0 16.25 4h-8.5ZM12 7.35A4.65 4.65 0 1 1 7.35 12 4.65 4.65 0 0 1 12 7.35Zm0 2A2.65 2.65 0 1 0 14.65 12 2.65 2.65 0 0 0 12 9.35ZM17.1 6.75a1.15 1.15 0 1 1-1.15 1.15 1.15 1.15 0 0 1 1.15-1.15Z"/></svg>
                anilvideofilms
              </a>
              <a class="avf-careers-contact-link" href="https://www.youtube.com/@Vipulvohra" aria-label="YouTube" target="_blank" rel="noopener">
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4L15.8 12l-6.2 3.6Z"/></svg>
                youtube.com/@Vipulvohra
              </a>
            </div>
          </form>
        </div>
      </section>
    </section>
  `;

  const preWeddingPage = () => `
    <style>
      .avf-pre-shell {
        background: #f9f8f6;
        color: #1a1f16;
        padding: 0;
        overflow: hidden;
      }
      .avf-pre-motion-block {
        opacity: 0;
        transform: translate3d(0, 34px, 0);
        transition:
          opacity 0.9s cubic-bezier(0.22, 1, 0.36, 1),
          transform 0.9s cubic-bezier(0.22, 1, 0.36, 1);
      }
      .avf-pre-motion-block.is-visible {
        opacity: 1;
        transform: translate3d(0, 0, 0);
      }
      .avf-pre-hero {
        position: relative;
        min-height: 100svh;
        overflow: clip;
        background: #1a1f16;
        color: #f9f8f6;
        display: flex;
        align-items: flex-end;
      }
      .avf-pre-hero-media {
        position: absolute;
        inset: 0;
        overflow: hidden;
        background: #1a1f16;
      }
      .avf-pre-hero-media img {
        position: absolute;
        top: -10%;
        left: 0;
        width: 100%;
        height: 120%;
        object-fit: cover;
        object-position: center top;
        display: block;
        filter: brightness(1.04) saturate(1.05);
        transform: translate3d(0, 0, 0) scale(1.06);
        will-change: transform;
      }
      .avf-pre-hero-wash {
        position: absolute;
        inset: 0;
        background:
          linear-gradient(180deg, rgba(26, 31, 22, 0.3) 0%, rgba(26, 31, 22, 0) 46%, rgba(26, 31, 22, 0.72) 100%),
          linear-gradient(90deg, rgba(26, 31, 22, 0.42) 0%, rgba(26, 31, 22, 0.04) 52%, rgba(26, 31, 22, 0.24) 100%);
      }
      .avf-pre-hero-tint {
        position: absolute;
        inset: 0;
        background: rgba(74, 93, 35, 0.1);
        mix-blend-mode: multiply;
      }
      .avf-pre-hero-content {
        position: relative;
        z-index: 1;
        width: min(100% - 48px, 1240px);
        margin: 0 auto;
        padding: 0 0 clamp(70px, 9vw, 112px);
        opacity: var(--pre-hero-copy-opacity, 1);
        transform: translate3d(0, var(--pre-hero-copy-y, 0), 0);
        will-change: transform, opacity;
      }
      .avf-pre-eyebrow {
        margin: 0;
        font-family: "Poppins", sans-serif;
        text-transform: uppercase;
        letter-spacing: 0.35em;
        font-size: 10px;
        color: #d4c4a8;
      }
      .avf-pre-title {
        margin: 22px 0 0;
        max-width: 980px;
        font-family: "Playfair Display", serif;
        font-size: clamp(4rem, 11vw, 11rem);
        line-height: 0.9;
        font-weight: 400;
        letter-spacing: -0.07em;
        color: #f9f8f6;
      }
      .avf-pre-title span {
        display: block;
      }
      .avf-pre-title .is-first {
        font-style: normal;
      }
      .avf-pre-title .is-second {
        padding-left: 0;
      }
      .avf-pre-title .amp {
        color: #d4c4a8;
        font-style: italic;
      }
      .avf-pre-lead {
        max-width: 680px;
        margin: 32px 0 0;
        color: rgba(249, 248, 246, 0.78);
        font-family: "Cormorant Garamond", serif;
        font-size: clamp(1.25rem, 2vw, 1.9rem);
        line-height: 1.42;
        font-weight: 400;
      }
      .avf-pre-copy {
        margin: 32px 0 0;
        display: flex;
        justify-content: space-between;
        gap: 24px;
        flex-wrap: wrap;
        font-family: "Poppins", sans-serif;
        text-transform: uppercase;
        letter-spacing: 0.3em;
        font-size: clamp(10px, 0.95vw, 13px);
        color: rgba(249, 248, 246, 0.78);
      }
      .avf-pre-pulse {
        color: #d4c4a8;
        animation: avf-pre-pulse 1.8s ease-in-out infinite;
      }
      .avf-pre-album {
        position: relative;
        background: #f9f8f6;
        min-height: 100svh;
        padding: clamp(22px, 3vw, 36px) 0 clamp(14px, 2vw, 24px);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        z-index: 1;
      }
      .avf-pre-album-inner {
        width: 100%;
        margin: 0;
      }
      .avf-pre-album-head {
        margin: 0 0 clamp(14px, 2vw, 22px);
        padding: 0 clamp(22px, 5vw, 56px);
        display: flex;
        align-items: flex-end;
        justify-content: space-between;
        gap: 28px;
        flex-wrap: wrap;
      }
      .avf-pre-chapter {
        margin: 0;
        font-family: "Poppins", sans-serif;
        font-size: 9px;
        line-height: 1.4;
        letter-spacing: 0.3em;
        text-transform: uppercase;
        color: #4a5d23;
      }
      .avf-pre-album-title {
        margin: 8px 0 0;
        font-family: "Playfair Display", serif;
        font-size: clamp(26px, 4vw, 44px);
        line-height: 1;
        letter-spacing: -0.04em;
        color: #1a1f16;
        font-weight: 400;
      }
      .avf-pre-album-title em {
        color: #4a5d23;
        font-style: italic;
      }
      .avf-pre-tap {
        max-width: 280px;
        margin: 0;
        font-family: "Poppins", sans-serif;
        font-size: 10px;
        line-height: 1.8;
        letter-spacing: 0.3em;
        text-transform: uppercase;
        color: rgba(26, 31, 22, 0.6);
      }
      .avf-pre-collage {
        display: grid;
        grid-template-columns: repeat(12, minmax(0, 1fr));
        grid-template-rows: repeat(4, minmax(0, 1fr));
        gap: clamp(4px, 0.45vw, 7px);
        width: 100vw;
        height: calc(100svh - clamp(88px, 11vw, 124px));
        margin-left: calc(50% - 50vw);
        transform: translate3d(0, var(--pre-collage-y, 0), 0) scale(var(--pre-collage-scale, 1));
        transform-origin: top center;
        will-change: transform;
      }
      .avf-pre-collage-item {
        position: relative;
        min-height: 0;
        border: 0;
        padding: 0;
        border-radius: 2px;
        overflow: hidden;
        background: #d8d1c6;
        cursor: pointer;
        box-shadow: 0 18px 42px rgba(26, 31, 22, 0.08);
        opacity: 0;
        transform: translate3d(0, 28px, 0) scale(0.985);
        transition:
          opacity 0.85s cubic-bezier(0.22, 1, 0.36, 1),
          transform 0.85s cubic-bezier(0.22, 1, 0.36, 1),
          box-shadow 0.45s ease;
        transition-delay: var(--delay, 0s);
      }
      .avf-pre-collage-item.is-visible {
        opacity: 1;
        transform: translate3d(0, 0, 0) scale(1);
      }
      .avf-pre-collage-item:nth-child(1) { grid-column: 1 / 4; grid-row: 1 / 3; }
      .avf-pre-collage-item:nth-child(2) { grid-column: 4 / 6; grid-row: 1 / 2; }
      .avf-pre-collage-item:nth-child(3) { grid-column: 6 / 8; grid-row: 1 / 2; }
      .avf-pre-collage-item:nth-child(4) { grid-column: 8 / 13; grid-row: 1 / 3; }
      .avf-pre-collage-item:nth-child(5) { grid-column: 4 / 6; grid-row: 2 / 4; }
      .avf-pre-collage-item:nth-child(6) { grid-column: 6 / 8; grid-row: 2 / 4; }
      .avf-pre-collage-item:nth-child(7) { grid-column: 1 / 4; grid-row: 3 / 5; }
      .avf-pre-collage-item:nth-child(8) { grid-column: 8 / 10; grid-row: 3 / 4; }
      .avf-pre-collage-item:nth-child(9) { grid-column: 10 / 13; grid-row: 3 / 4; }
      .avf-pre-collage-item:nth-child(10) { grid-column: 4 / 6; grid-row: 4 / 5; }
      .avf-pre-collage-item:nth-child(11) { grid-column: 6 / 8; grid-row: 4 / 5; }
      .avf-pre-collage-item:nth-child(12) { grid-column: 8 / 13; grid-row: 4 / 5; }
      .avf-pre-collage-item img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
        transform: scale(1.02);
        transition: transform 0.7s cubic-bezier(0.22, 1, 0.36, 1), filter 0.7s cubic-bezier(0.22, 1, 0.36, 1);
      }
      .avf-pre-collage-item:hover img {
        transform: scale(1.09);
        filter: brightness(0.92) saturate(1.08);
      }
      .avf-pre-corner {
        position: absolute;
        left: 16px;
        bottom: 16px;
        padding: 9px 12px;
        background: rgba(249, 248, 246, 0.78);
        color: #1a1f16;
        font-family: "Poppins", sans-serif;
        font-size: 9px;
        letter-spacing: 0.22em;
        text-transform: uppercase;
        opacity: 0;
        transform: translateY(10px);
        transition: opacity 0.35s ease, transform 0.35s ease;
      }
      .avf-pre-collage-item:hover .avf-pre-corner {
        opacity: 1;
        transform: translateY(0);
      }
      .avf-pre-cta {
        position: relative;
        min-height: 82svh;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: clamp(86px, 12vw, 150px) clamp(24px, 6vw, 72px);
        background: #ffffff;
        color: #1a1f16;
        text-align: center;
        z-index: 2;
      }
      .avf-pre-cta::before {
        content: "forever";
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        color: rgba(74, 93, 35, 0.08);
        font-family: "Playfair Display", serif;
        font-size: clamp(9rem, 28vw, 32rem);
        font-style: italic;
        line-height: 1;
        white-space: nowrap;
        transform: translate3d(0, var(--pre-forever-y, 0), 0);
        will-change: transform;
        pointer-events: none;
        user-select: none;
      }
      .avf-pre-cta::after {
        content: "";
        position: absolute;
        inset: 0;
        background:
          radial-gradient(circle at 18% 18%, rgba(212, 196, 168, 0.2), transparent 28%),
          radial-gradient(circle at 82% 74%, rgba(74, 93, 35, 0.14), transparent 34%);
        pointer-events: none;
      }
      .avf-pre-cta-inner {
        position: relative;
        z-index: 1;
        width: min(100%, 980px);
        transform: translate3d(0, var(--pre-cta-y, 0), 0);
        will-change: transform;
      }
      .avf-pre-cta-kicker {
        margin: 0;
        font-family: "Poppins", sans-serif;
        font-size: 10px;
        letter-spacing: 0.35em;
        text-transform: uppercase;
        color: #4a5d23;
      }
      .avf-pre-cta-title {
        margin: 24px 0 0;
        font-family: "Playfair Display", serif;
        font-size: clamp(3rem, 8vw, 7.5rem);
        font-weight: 400;
        line-height: 0.95;
        letter-spacing: -0.05em;
        color: #1a1f16;
      }
      .avf-pre-cta-title em {
        color: #4a5d23;
        font-style: italic;
      }
      .avf-pre-cta-copy {
        width: min(100%, 620px);
        margin: 30px auto 0;
        color: rgba(26, 31, 22, 0.7);
        font-family: "Mulish", sans-serif;
        font-size: clamp(1rem, 1.6vw, 1.2rem);
        line-height: 1.8;
        font-weight: 300;
      }
      .avf-pre-cta-button {
        margin-top: 48px;
        display: inline-flex;
        align-items: center;
        gap: 18px;
        border-radius: 999px;
        background: #4a5d23;
        color: #f9f8f6;
        padding: 13px 14px 13px 28px;
        text-decoration: none;
        transition: background 0.45s ease, transform 0.45s ease;
      }
      .avf-pre-cta-button:hover {
        background: #1a1f16;
        transform: translateY(-3px);
      }
      .avf-pre-cta-button span:first-child {
        font-family: "Poppins", sans-serif;
        font-size: 12px;
        letter-spacing: 0.28em;
        text-transform: uppercase;
      }
      .avf-pre-cta-button-icon {
        width: 44px;
        height: 44px;
        border-radius: 999px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background: #f9f8f6;
        color: #4a5d23;
        font-size: 20px;
        transition: transform 0.45s ease;
      }
      .avf-pre-cta-button:hover .avf-pre-cta-button-icon {
        transform: rotate(45deg);
      }
      .avf-pre-cta-footnote {
        margin: 34px 0 0;
        color: rgba(26, 31, 22, 0.48);
        font-family: "Poppins", sans-serif;
        font-size: 10px;
        letter-spacing: 0.3em;
        text-transform: uppercase;
      }
      .avf-pre-cta .avf-pre-motion-block:nth-child(2) {
        transition-delay: 0.1s;
      }
      .avf-pre-cta .avf-pre-motion-block:nth-child(3) {
        transition-delay: 0.2s;
      }
      .avf-pre-cta .avf-pre-motion-block:nth-child(4) {
        transition-delay: 0.3s;
      }
      .avf-pre-lightbox {
        position: fixed;
        inset: 0;
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: clamp(24px, 5vw, 56px);
        background: rgba(26, 31, 22, 0.72);
        backdrop-filter: blur(18px);
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.35s ease;
      }
      .avf-pre-lightbox::before {
        content: "";
        position: absolute;
        inset: 0;
        background: rgba(74, 93, 35, 0.1);
        pointer-events: none;
      }
      .avf-pre-lightbox.is-open {
        opacity: 1;
        pointer-events: auto;
      }
      .avf-pre-lightbox-meta {
        position: absolute;
        top: clamp(22px, 4vw, 42px);
        left: clamp(22px, 5vw, 56px);
        z-index: 2;
        color: rgba(249, 248, 246, 0.92);
        opacity: 0;
        transform: translateY(-8px);
        transition: opacity 0.28s ease 0.22s, transform 0.28s ease 0.22s;
      }
      .avf-pre-lightbox.is-expanding .avf-pre-lightbox-meta {
        opacity: 1;
        transform: translateY(0);
      }
      .avf-pre-lightbox-count {
        margin: 0;
        font-family: "Poppins", sans-serif;
        font-size: 10px;
        letter-spacing: 0.3em;
        text-transform: uppercase;
        opacity: 0.72;
      }
      .avf-pre-lightbox-title {
        margin: 10px 0 0;
        font-family: "Playfair Display", serif;
        font-size: clamp(26px, 4vw, 42px);
        font-style: italic;
        font-weight: 400;
      }
      .avf-pre-lightbox-close {
        position: absolute;
        top: clamp(20px, 4vw, 40px);
        right: clamp(20px, 5vw, 56px);
        z-index: 3;
        min-width: 92px;
        height: 46px;
        padding: 0 16px;
        border: 1px solid rgba(249, 248, 246, 0.3);
        border-radius: 999px;
        background: rgba(249, 248, 246, 0.12);
        color: #f9f8f6;
        font-family: "Poppins", sans-serif;
        font-size: 11px;
        line-height: 1;
        letter-spacing: 0.18em;
        text-transform: uppercase;
        cursor: pointer;
        opacity: 0;
        transform: rotate(-35deg) scale(0.85);
        transition: background 0.3s ease, color 0.3s ease, opacity 0.28s ease 0.24s, transform 0.28s ease 0.24s;
      }
      .avf-pre-lightbox.is-expanding .avf-pre-lightbox-close {
        opacity: 1;
        transform: rotate(0) scale(1);
      }
      .avf-pre-lightbox-close:hover {
        background: #f9f8f6;
        color: #1a1f16;
      }
      .avf-pre-lightbox-frame {
        position: relative;
        z-index: 1;
        max-width: min(92vw, 1120px);
        max-height: 82vh;
        overflow: hidden;
        transform-origin: center center;
        will-change: transform, border-radius;
        transition:
          transform 0.58s cubic-bezier(0.16, 1, 0.3, 1),
          border-radius 0.58s cubic-bezier(0.16, 1, 0.3, 1);
      }
      .avf-pre-lightbox-img {
        display: block;
        max-width: 100%;
        max-height: 82vh;
        object-fit: contain;
        border-radius: 2px;
        box-shadow: 0 30px 90px rgba(0, 0, 0, 0.28);
      }
      .avf-pre-lightbox-hint {
        position: absolute;
        left: 50%;
        bottom: 24px;
        transform: translateX(-50%);
        margin: 0;
        color: rgba(249, 248, 246, 0.62);
        font-family: "Poppins", sans-serif;
        font-size: 10px;
        letter-spacing: 0.3em;
        text-transform: uppercase;
        white-space: nowrap;
        opacity: 0;
        transition: opacity 0.28s ease 0.32s;
      }
      .avf-pre-lightbox.is-expanding .avf-pre-lightbox-hint {
        opacity: 1;
      }
      .avf-pre-lightbox.is-closing .avf-pre-lightbox-meta,
      .avf-pre-lightbox.is-closing .avf-pre-lightbox-close,
      .avf-pre-lightbox.is-closing .avf-pre-lightbox-hint {
        opacity: 0;
        transition-delay: 0s;
      }
      @keyframes avf-pre-pulse {
        0%, 100% { opacity: 0.4; transform: scale(0.92); }
        50% { opacity: 1; transform: scale(1); }
      }
      @keyframes avf-pre-rise {
        from {
          opacity: 0;
          transform: translateY(48px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      @media (prefers-reduced-motion: reduce) {
        .avf-pre-motion-block,
        .avf-pre-collage-item,
        .avf-pre-hero-content,
        .avf-pre-cta-inner,
        .avf-pre-cta::before {
          opacity: 1 !important;
          transform: none !important;
          transition: none !important;
          animation: none !important;
        }
      }
      @media (max-width: 920px) {
        .avf-pre-hero {
          min-height: 100svh;
        }
        .avf-pre-title .is-second {
          padding-left: 0;
        }
        .avf-pre-copy {
          letter-spacing: 0.2em;
        }
        .avf-pre-collage {
          grid-template-columns: repeat(6, minmax(0, 1fr));
          grid-template-rows: repeat(6, minmax(0, 1fr));
          width: 100vw;
          height: calc(100svh - 118px);
          transform: translate3d(0, var(--pre-collage-y, 0), 0) scale(var(--pre-collage-scale, 1));
        }
        .avf-pre-collage-item,
        .avf-pre-collage-item.is-wide,
        .avf-pre-collage-item.is-tall,
        .avf-pre-collage-item.is-large {
          grid-column: auto;
          grid-row: auto;
          min-height: 0;
        }
        .avf-pre-collage-item:nth-child(1) { grid-column: 1 / 4; grid-row: 1 / 3; }
        .avf-pre-collage-item:nth-child(2) { grid-column: 4 / 7; grid-row: 1 / 2; }
        .avf-pre-collage-item:nth-child(3) { grid-column: 4 / 7; grid-row: 2 / 3; }
        .avf-pre-collage-item:nth-child(4) { grid-column: 1 / 4; grid-row: 3 / 4; }
        .avf-pre-collage-item:nth-child(5) { grid-column: 4 / 7; grid-row: 3 / 5; }
        .avf-pre-collage-item:nth-child(6) { grid-column: 1 / 4; grid-row: 4 / 5; }
        .avf-pre-collage-item:nth-child(7) { grid-column: 1 / 3; grid-row: 5 / 6; }
        .avf-pre-collage-item:nth-child(8) { grid-column: 3 / 5; grid-row: 5 / 6; }
        .avf-pre-collage-item:nth-child(9) { grid-column: 5 / 7; grid-row: 5 / 6; }
        .avf-pre-collage-item:nth-child(10) { grid-column: 1 / 3; grid-row: 6 / 7; }
        .avf-pre-collage-item:nth-child(11) { grid-column: 3 / 5; grid-row: 6 / 7; }
        .avf-pre-collage-item:nth-child(12) { grid-column: 5 / 7; grid-row: 6 / 7; }
      }
      @media (max-width: 640px) {
        .avf-pre-album-head {
          align-items: flex-start;
        }
        .avf-pre-collage {
          grid-template-columns: repeat(2, minmax(0, 1fr));
          grid-template-rows: repeat(6, minmax(0, 1fr));
          height: calc(100svh - 118px);
          transform: translate3d(0, var(--pre-collage-y, 0), 0) scale(var(--pre-collage-scale, 1));
        }
        .avf-pre-collage .avf-pre-collage-item:nth-child(n) {
          grid-column: auto;
          grid-row: auto;
          min-height: 0;
        }
        .avf-pre-lightbox-meta {
          max-width: calc(100% - 96px);
        }
        .avf-pre-lightbox-hint {
          display: none;
        }
        .avf-pre-cta {
          min-height: 74svh;
          padding: 76px 22px;
        }
        .avf-pre-cta-button {
          width: auto;
          margin-left: auto;
          margin-right: auto;
          padding-left: 28px;
          padding-right: 14px;
          justify-content: center;
        }
      }
    </style>
    <section class="avf-pre-shell">
      <section class="avf-pre-hero">
        <div class="avf-pre-hero-media">
          <img class="avf-pre-parallax" src="/assets/collage/13-hero.png" alt="Anil Video Films pre-wedding story" loading="eager" decoding="async">
        </div>
        <div class="avf-pre-hero-wash"></div>
        <div class="avf-pre-hero-tint"></div>
        <div class="avf-pre-hero-content">
          <p class="avf-pre-eyebrow">A PRE-WEDDING STORY — ANIL VIDEO FILMS</p>
          <h1 class="avf-pre-title">
            <span class="is-first">Pre</span>
            <span class="is-second"><span class="amp">Wedding</span></span>
            <span>Story.</span>
          </h1>
          <p class="avf-pre-lead">A cinematic beginning before the wedding day: intimate frames, quiet movement, and a story that feels made only for you.</p>
        </div>
      </section>
      <section id="frames" class="avf-pre-album">
        <div class="avf-pre-album-inner">
          <div class="avf-pre-album-head avf-pre-motion-block">
            <div>
              <p class="avf-pre-chapter">✦ The Album</p>
              <h2 class="avf-pre-album-title">Twelve <em>frames</em>,<br>a thousand <em>heartbeats</em>.</h2>
            </div>
            <p class="avf-pre-tap">Tap any frame · expand to fullscreen</p>
          </div>
          <div class="avf-pre-collage">
            <button class="avf-pre-collage-item is-large" style="--delay:0.02s" data-full="/assets/collage/01-arch.jpg" data-alt="The quiet arch" data-index="01">${image("./assets/collage/01-arch.jpg", "The quiet arch")}<span class="avf-pre-corner">01 · The quiet arch</span></button>
            <button class="avf-pre-collage-item" style="--delay:0.07s" data-full="/assets/collage/02-portrait-smile.jpg" data-alt="A smile between takes" data-index="02">${image("./assets/collage/02-portrait-smile.jpg", "A smile between takes")}<span class="avf-pre-corner">02 · A smile between takes</span></button>
            <button class="avf-pre-collage-item" style="--delay:0.12s" data-full="/assets/collage/03-blackwhite-couple.jpg" data-alt="Black and white pause" data-index="03">${image("./assets/collage/03-blackwhite-couple.jpg", "Black and white pause")}<span class="avf-pre-corner">03 · Black and white pause</span></button>
            <button class="avf-pre-collage-item is-wide" style="--delay:0.17s" data-full="/assets/collage/04-reception.png" data-alt="Reception glow" data-index="04">${image("./assets/collage/04-reception.png", "Reception glow")}<span class="avf-pre-corner">04 · Reception glow</span></button>
            <button class="avf-pre-collage-item" style="--delay:0.22s" data-full="/assets/collage/05-floral-smile.jpg" data-alt="Floral smile" data-index="05">${image("./assets/collage/05-floral-smile.jpg", "Floral smile")}<span class="avf-pre-corner">05 · Floral smile</span></button>
            <button class="avf-pre-collage-item is-tall" style="--delay:0.27s" data-full="/assets/collage/06-orange-hug.jpg" data-alt="Orange evening hug" data-index="06">${image("./assets/collage/06-orange-hug.jpg", "Orange evening hug")}<span class="avf-pre-corner">06 · Orange evening hug</span></button>
            <button class="avf-pre-collage-item" style="--delay:0.32s" data-full="/assets/collage/07-confetti-sit.jpg" data-alt="Confetti sit-down" data-index="07">${image("./assets/collage/07-confetti-sit.jpg", "Confetti sit-down")}<span class="avf-pre-corner">07 · Confetti sit-down</span></button>
            <button class="avf-pre-collage-item is-wide" style="--delay:0.37s" data-full="/assets/collage/08-fireworks-walk.jpg" data-alt="Fireworks walk" data-index="08">${image("./assets/collage/08-fireworks-walk.jpg", "Fireworks walk")}<span class="avf-pre-corner">08 · Fireworks walk</span></button>
            <button class="avf-pre-collage-item" style="--delay:0.42s" data-full="/assets/collage/09-fireworks-dance.jpg" data-alt="Fireworks dance" data-index="09">${image("./assets/collage/09-fireworks-dance.jpg", "Fireworks dance")}<span class="avf-pre-corner">09 · Fireworks dance</span></button>
            <button class="avf-pre-collage-item" style="--delay:0.47s" data-full="/assets/collage/10-night-dress.jpg" data-alt="Night dress portrait" data-index="10">${image("./assets/collage/10-night-dress.jpg", "Night dress portrait")}<span class="avf-pre-corner">10 · Night dress portrait</span></button>
            <button class="avf-pre-collage-item" style="--delay:0.52s" data-full="/assets/collage/11-bw-fireworks.jpg" data-alt="Monochrome fireworks" data-index="11">${image("./assets/collage/11-bw-fireworks.jpg", "Monochrome fireworks")}<span class="avf-pre-corner">11 · Monochrome fireworks</span></button>
            <button class="avf-pre-collage-item is-large" style="--delay:0.57s" data-full="/assets/collage/12-dance-venue.jpg" data-alt="The venue dance" data-index="12">${image("./assets/collage/12-dance-venue.jpg", "The venue dance")}<span class="avf-pre-corner">12 · The venue dance</span></button>
          </div>
        </div>
      </section>
      <section class="avf-pre-cta" id="book">
        <div class="avf-pre-cta-inner">
          <p class="avf-pre-cta-kicker avf-pre-motion-block">✦ Your Story</p>
          <h2 class="avf-pre-cta-title avf-pre-motion-block">Let's write yours<br>in <em>olive light</em>.</h2>
          <p class="avf-pre-cta-copy avf-pre-motion-block">Tell us your love story and we will craft a pre-wedding memory made just for the two of you.</p>
          <a class="avf-pre-cta-button avf-pre-motion-block" href="/contact-us">
            <span>Contact Us</span>
            <span class="avf-pre-cta-button-icon" aria-hidden="true">↗</span>
          </a>
          <p class="avf-pre-cta-footnote">replies within 24 hours · pan-india travel</p>
        </div>
      </section>
      <div class="avf-pre-lightbox" aria-hidden="true">
        <div class="avf-pre-lightbox-meta">
          <p class="avf-pre-lightbox-count">Frame 01 / 12</p>
          <p class="avf-pre-lightbox-title">The quiet arch</p>
        </div>
        <button class="avf-pre-lightbox-close" type="button" aria-label="Close fullscreen">× Back</button>
        <div class="avf-pre-lightbox-frame">
          <img class="avf-pre-lightbox-img" src="" alt="">
        </div>
        <p class="avf-pre-lightbox-hint">Click anywhere or press ESC to close</p>
      </div>
    </section>
  `;

  const initMailtoForms = () => {
    const recipient = "contact@anilvideofilms.com";
    const labels = {
      name: "Full Name",
      email: "Email",
      phone: "Phone",
      "event-date": "Event Date",
      location: "Event Location",
      service: "Service",
      details: "Story / Message",
      role: "Role",
      experience: "Years of Experience",
      portfolio: "Portfolio Link",
      "cover-letter": "Cover Letter",
    };

    document.querySelectorAll("[data-avf-mail-form]").forEach((form) => {
      if (form.dataset.avfMailReady === "true") return;
      form.dataset.avfMailReady = "true";

      form.addEventListener("submit", (event) => {
        event.preventDefault();
        const data = new FormData(form);
        const lines = [];

        data.forEach((value, key) => {
          const text = String(value || "").trim();
          if (!text) return;
          lines.push(`${labels[key] || key}: ${text}`);
        });

        const subject = form.getAttribute("data-avf-mail-subject") || "New enquiry from Anil Video Films website";
        const body = [
          "Hello Anil Video Films,",
          "",
          "Here are my details:",
          "",
          ...lines,
          "",
          "Sent from anilvideofilms.com",
        ].join("\n");

        window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      });
    });
  };

  const ROUTES = {
    "/about": {
      title: "About",
      canonical: "https://www.houseontheclouds.com/about",
      bg: "#ffffff",
      html: aboutPage,
    },
    "/portfolio-photo": {
      title: "Photography",
      canonical: "https://www.houseontheclouds.com/portfolio-photo",
      bg: "#f0e9de",
      html: photographyPage,
    },
    "/anf-films": {
      title: "Films",
      canonical: "https://www.houseontheclouds.com/anf-films",
      bg: "#f0e9de",
      html: filmsPage,
    },
    "/contact-us": {
      title: "Contact Us",
      canonical: "https://www.houseontheclouds.com/contact-us",
      bg: "#f9f8f6",
      html: contactPage,
    },
    "/careers": {
      title: "Careers",
      canonical: "https://www.houseontheclouds.com/careers",
      bg: "#f2ebe1",
      html: careersPage,
    },
    "/pre-wedding": {
      title: "Pre-Wedding",
      canonical: "https://www.houseontheclouds.com/pre-wedding",
      bg: "#efe8df",
      html: preWeddingPage,
    },
  };

  const path = normalizePath(wordpressRoute.path || location.pathname);
  const route = ROUTES[path];
  if (!route) {
    patchGlobalBranding();
    normalizeHeaderNavigation();
    normalizeFooter();
    initYoutubeVideoEmbeds();
    if (path === "/" || path === "/index.html") {
      insertHomeStoryCTA();
      prepareHomeDirectionalMotion();
      initHomeCollageLightbox();
      initHomeHeroParallax();
      initHomeMotion();
    }
    return;
  }

  document.documentElement.classList.add("avf-route-page");

  const render = () => {
    const article = document.querySelector("article.sections");
    if (!article) return false;

    article.innerHTML = route.html();
    document.title = `${route.title} | Anil Video Films`;
    setCanonical(route.canonical);
    setMeta("og:title", `${route.title} | Anil Video Films`, "property");
    setMeta("og:url", route.canonical, "property");
    setMeta("twitter:title", `${route.title} | Anil Video Films`);
    setMeta("twitter:url", route.canonical);
    setMeta("description", `${route.title} page for Anil Video Films.`);
    document.body.style.background = route.bg;

    patchGlobalBranding();
    normalizeHeaderNavigation();
    normalizeFooter();
    initYoutubeVideoEmbeds();
    if (path === "/about") {
      initAboutMotion();
    }
    if (path === "/portfolio-photo") {
      initPhotographyParallax();
      initPhotographyMotion();
      initPhotoFilters();
      initPreWeddingLightbox();
    }
    if (path === "/anf-films") {
      initFilmsParallax();
      initFilmsMotion();
      initFilmFilters();
      initPreWeddingLightbox();
    }
    if (path === "/contact-us") {
      initMailtoForms();
      initContactParallax();
      initContactMotion();
    }
    if (path === "/careers") {
      initMailtoForms();
      initCareersParallax();
      initCareersMotion();
    }
    if (path === "/pre-wedding") {
      initPreWeddingParallax();
      initPreWeddingLightbox();
      initPreWeddingMotion();
    }
    document.dispatchEvent(new CustomEvent("avf:route-rendered", { detail: { path } }));
    document.documentElement.classList.remove("avf-route-page");
    return true;
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", render, { once: true });
  } else {
    render();
  }
})();
