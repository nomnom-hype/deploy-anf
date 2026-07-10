(function () {
  "use strict";

  const PHOTO_SUBPAGES = [
    "/subpages/photography/alia-and-ranbir-mumbai/index.html",
    "/subpages/photography/reva-and-zach-udaipur/index.html",
    "/subpages/photography/kiara-and-siddharth/index.html",
    "/subpages/photography/arpita-mehta-and-kunal-rawal-mumbai/index.html",
    "/subpages/photography/meghna-and-karan-mumbai/index.html",
    "/subpages/photography/rhea-and-divish/index.html",
    "/subpages/photography/ananya-and-jahan-delhi/index.html",
    "/subpages/photography/priya-and-prateik-jaipur/index.html"
  ];

  const FILM_SUBPAGES = [
    "/subpages/films/sobhita-and-chay-hyderabad/index.html",
    "/subpages/films/monika-and-vivek/index.html",
    "/subpages/films/karishma-mikhail/index.html",
    "/subpages/films/kriti-kharbanda-and-pulkit-samrat-delhi/index.html",
    "/subpages/films/priya-and-prateik/index.html",
    "/subpages/films/aerin-rahul-korea-india/index.html",
    "/subpages/films/varun-and-lavanya-italy/index.html",
    "/subpages/films/reva-and-zach-a-anil-video-films-film/index.html",
    "/subpages/films/vedika-and-omair-jaisalmer/index.html",
    "/subpages/films/sangeeta-and-jake-france/index.html"
  ];

  const PLACEHOLDER_IMAGE = "/assets/collage/01-arch.jpg";

  const escapeHtml = (value) => String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

  const normalizePath = (path) => {
    if (!path) return "";
    if (/^(https?:)?\/\//i.test(path) || path.startsWith("data:")) return path;
    return path.startsWith("/") ? path : `/${path.replace(/^\.?\//, "")}`;
  };

  const pagePath = () => {
    const path = window.location.pathname || "/";
    if (path.endsWith("/")) return `${path}index.html`;
    if (path.endsWith(".html")) return path;
    return `${path}/index.html`;
  };

  async function fetchText(path) {
    const url = `${path}${path.includes("?") ? "&" : "?"}_cms=${Date.now()}`;
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) throw new Error(`Could not load ${path}: ${response.status}`);
    return response.text();
  }

  function parseScalar(value) {
    const raw = String(value || "").trim();
    if (raw === "") return "";
    if (raw === "true") return true;
    if (raw === "false") return false;
    if (raw === "null") return null;
    if ((raw.startsWith('"') && raw.endsWith('"')) || (raw.startsWith("'") && raw.endsWith("'"))) {
      return raw.slice(1, -1).replace(/\\"/g, '"').replace(/\\n/g, "\n");
    }
    if (/^-?\d+(\.\d+)?$/.test(raw)) return Number(raw);
    return raw;
  }

  function nextMeaningfulLine(lines, startIndex) {
    for (let index = startIndex + 1; index < lines.length; index += 1) {
      const trimmed = lines[index].trim();
      if (trimmed && !trimmed.startsWith("#")) return trimmed;
    }
    return "";
  }

  function parseYaml(yaml) {
    const root = {};
    const lines = String(yaml || "").replace(/\r/g, "").split("\n");
    const stack = [{ indent: -1, value: root }];

    lines.forEach((line, index) => {
      if (!line.trim() || line.trim().startsWith("#")) return;
      const indent = line.match(/^\s*/)[0].length;
      const trimmed = line.trim();

      while (stack.length > 1 && indent <= stack[stack.length - 1].indent) stack.pop();
      const parent = stack[stack.length - 1].value;

      if (trimmed.startsWith("- ")) {
        if (!Array.isArray(parent)) return;
        const itemText = trimmed.slice(2).trim();
        const colonIndex = itemText.indexOf(":");
        if (colonIndex > -1) {
          const item = {};
          const key = itemText.slice(0, colonIndex).trim();
          const value = itemText.slice(colonIndex + 1).trim();
          item[key] = parseScalar(value);
          parent.push(item);
          stack.push({ indent, value: item });
        } else {
          parent.push(parseScalar(itemText));
        }
        return;
      }

      const colonIndex = trimmed.indexOf(":");
      if (colonIndex < 0) return;

      const key = trimmed.slice(0, colonIndex).trim();
      const value = trimmed.slice(colonIndex + 1).trim();
      if (value) {
        parent[key] = parseScalar(value);
        return;
      }

      const container = nextMeaningfulLine(lines, index).startsWith("- ") ? [] : {};
      parent[key] = container;
      stack.push({ indent, value: container });
    });

    return root;
  }

  function extractFrontMatter(html) {
    const match = String(html || "").match(/^---\s*\n([\s\S]*?)\n---/);
    return match ? parseYaml(match[1]) : {};
  }

  async function loadFrontMatter(path) {
    const html = await fetchText(path);
    return { ...extractFrontMatter(html), _path: path };
  }

  async function loadAll(paths) {
    const results = await Promise.allSettled(paths.map(loadFrontMatter));
    return results
      .filter((item) => item.status === "fulfilled")
      .map((item) => item.value);
  }

  function removeVisibleFrontMatter() {
    Array.from(document.body.childNodes).forEach((node) => {
      if (node.nodeType === Node.TEXT_NODE && /^\s*---[\s\S]*---\s*$/.test(node.textContent || "")) {
        node.remove();
      }
    });
  }

  function markdownToHtml(markdown) {
    return String(markdown || "")
      .split(/\n{2,}/)
      .map((paragraph) => `<p>${escapeHtml(paragraph).replace(/\n/g, "<br>")}</p>`)
      .join("");
  }

  function youtubeEmbedUrl(url) {
    const raw = String(url || "").trim();
    if (!raw) return "";

    const cleanId = (value) => {
      const id = String(value || "").split(/[?&#/]/)[0].trim();
      return /^[a-zA-Z0-9_-]{6,}$/.test(id) ? id : "";
    };

    try {
      const parsed = new URL(raw, window.location.origin);
      const host = parsed.hostname.replace(/^www\./, "");
      let videoId = "";

      if (host === "youtu.be") {
        videoId = cleanId(parsed.pathname.slice(1));
      } else if (host.endsWith("youtube.com") || host.endsWith("youtube-nocookie.com")) {
        videoId = cleanId(parsed.searchParams.get("v"));

        if (!videoId) {
          const pathParts = parsed.pathname.split("/").filter(Boolean);
          const videoPathKeys = ["embed", "shorts", "live", "v"];
          const keyIndex = pathParts.findIndex((part) => videoPathKeys.includes(part));
          if (keyIndex > -1) videoId = cleanId(pathParts[keyIndex + 1]);
        }
      }

      return videoId ? `https://www.youtube.com/embed/${encodeURIComponent(videoId)}?rel=0` : "";
    } catch (error) {
      const directId = cleanId(raw);
      return directId ? `https://www.youtube.com/embed/${encodeURIComponent(directId)}?rel=0` : "";
    }
  }

  function setImage(selector, src, alt) {
    const image = document.querySelector(selector);
    if (!image || !src) return;
    image.src = normalizePath(src);
    image.removeAttribute("srcset");
    image.removeAttribute("data-src");
    image.alt = alt || image.alt || "";
  }

  function collageTile(src, index) {
    return `<div class="anilvideofilms-collage__tile"><img src="${escapeHtml(normalizePath(src || PLACEHOLDER_IMAGE))}" alt="Gallery image ${index + 1}" loading="lazy" decoding="async"></div>`;
  }

  function renderCollage(images) {
    const grid = document.querySelector(".anilvideofilms-collage__grid");
    const items = Array.isArray(images) ? images.filter(Boolean) : [];
    if (!grid || !items.length) return;
    grid.innerHTML = items.map(collageTile).join("");
  }

  function storyCard(item, kind) {
    const name = item?.client_name || item?.title || "Anil Video Films";
    const date = item?.wedding_date || item?.date || "2026";
    const href = item?._path || "#";
    const image = item?.card_image || item?.hero_image || item?.member_photo || PLACEHOLDER_IMAGE;
    const label = kind === "film" ? "Open film story" : "Open photo story";

    return `
      <a class="avf-featured-stories__card avf-decap-card" href="${escapeHtml(href)}" aria-label="${escapeHtml(label)} for ${escapeHtml(name)}">
        <img src="${escapeHtml(normalizePath(image))}" alt="${escapeHtml(name)}" loading="lazy" decoding="async">
        <div class="avf-featured-stories__meta">
          <p class="avf-featured-stories__name">${escapeHtml(name)}</p>
          <p class="avf-featured-stories__date">${escapeHtml(date)}</p>
        </div>
      </a>`;
  }

  function archiveCard(item, kind) {
    const name = item?.client_name || item?.title || "Client Story";
    const meta = item?.category || (kind === "film" ? "Wedding Film" : "Wedding Photography");
    const story = item?.short_story || item?.description || item?.full_story_body || "";
    const image = item?.card_image || item?.hero_image || PLACEHOLDER_IMAGE;
    const href = item?._path || "#";

    return `
      <article class="avf-decap-archive-card">
        <a href="${escapeHtml(href)}" aria-label="Open ${escapeHtml(name)}">
          <img src="${escapeHtml(normalizePath(image))}" alt="${escapeHtml(name)}" loading="lazy" decoding="async">
        </a>
        <p class="avf-decap-archive-card__meta">${escapeHtml(meta)}${item?.wedding_date ? ` • ${escapeHtml(item.wedding_date)}` : ""}</p>
        <h3>${escapeHtml(name)}</h3>
        ${story ? `<p>${escapeHtml(story)}</p>` : ""}
      </article>`;
  }

  function ensureArchiveContainer(kind) {
    const existing = document.querySelector("[data-decap-archive-grid]") || document.querySelector(".avf-decap-archive-grid");
    if (existing) return existing;

    const article = document.querySelector("article.sections") || document.querySelector("main") || document.body;
    const section = document.createElement("section");
    section.className = "avf-decap-archive";
    section.innerHTML = `
      <style>
        .avf-decap-archive{background:#fff;padding:clamp(56px,7vw,110px) clamp(18px,5vw,80px)}
        .avf-decap-archive-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:clamp(22px,2.4vw,42px)}
        .avf-decap-archive-card img{width:100%;aspect-ratio:4/3;object-fit:cover;display:block}
        .avf-decap-archive-card__meta{font:600 12px/1.3 Poppins,sans-serif;margin:16px 0 10px;color:#4a5d23}
        .avf-decap-archive-card h3{font:400 clamp(28px,2.3vw,46px)/.95 "Playfair Display",serif;margin:0 0 14px;color:#1a1f16}
        .avf-decap-archive-card p{font:600 15px/1.55 "Cormorant Garamond",serif;color:#1f1f1f}
        @media(max-width:980px){.avf-decap-archive-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
        @media(max-width:640px){.avf-decap-archive-grid{grid-template-columns:1fr}}
      </style>
      <div class="avf-decap-archive-grid" data-decap-archive-grid data-kind="${kind}"></div>`;
    article.appendChild(section);
    return section.querySelector("[data-decap-archive-grid]");
  }

  function renderAbout(data) {
    const members = data?.team_members || data?.team || [];
    const article = document.querySelector("article.sections") || document.querySelector("main") || document.body;
    let section = document.querySelector("[data-decap-about]");

    if (!section) {
      section = document.createElement("section");
      section.className = "avf-decap-about";
      section.setAttribute("data-decap-about", "");
      section.innerHTML = `
        <style>
          .avf-decap-about{background:#fff;padding:clamp(36px,5vw,72px) clamp(18px,5vw,80px) clamp(70px,8vw,120px);color:#7b2020}
          .avf-decap-about h1{font:400 clamp(58px,8vw,150px)/.82 "Playfair Display",serif;letter-spacing:-.06em;margin:0 0 42px;max-width:760px}
          .avf-decap-about h1 em{display:block;color:#4a5d23;font-family:"Cormorant Garamond",serif;font-style:italic}
          .avf-decap-about__grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:clamp(24px,3.2vw,58px)}
          .avf-decap-about__card img{width:100%;aspect-ratio:1/1;object-fit:cover;border-radius:20px;display:block}
          .avf-decap-about__card h3{font:400 clamp(32px,3vw,58px)/.86 "Playfair Display",serif;letter-spacing:-.06em;margin:16px 0 6px;color:#7b2020}
          .avf-decap-about__card p{font:600 12px/1 Poppins,sans-serif;letter-spacing:.28em;text-transform:uppercase;color:#8c8c8c;margin:0}
          .avf-decap-about__team-photo{margin-top:clamp(34px,5vw,80px)}
          .avf-decap-about__team-photo img{width:100%;max-height:58vh;object-fit:cover;border-radius:22px;display:block}
          @media(max-width:900px){.avf-decap-about__grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
          @media(max-width:560px){.avf-decap-about{padding-top:92px}.avf-decap-about__card h3{font-size:36px}}
        </style>
        <h1>${escapeHtml(data?.headline || "The people")}<em>${escapeHtml(data?.headline_italic || "behind forever.")}</em></h1>
        <div class="avf-decap-about__grid"></div>
        <div class="avf-decap-about__team-photo"></div>`;
      article.insertBefore(section, article.firstElementChild || null);
    }

    const grid = section.querySelector(".avf-decap-about__grid");
    const teamPhoto = section.querySelector(".avf-decap-about__team-photo");
    if (grid) {
      grid.innerHTML = (members || []).slice(0, 8).map((member) => `
        <article class="avf-decap-about__card">
          <img src="${escapeHtml(normalizePath(member?.member_photo || PLACEHOLDER_IMAGE))}" alt="${escapeHtml(member?.member_name || "Team member")}" loading="lazy" decoding="async">
          <h3>${escapeHtml(member?.member_name || "Team Member")}</h3>
          <p>${escapeHtml(member?.designation || "Anil Video Films")}</p>
        </article>`).join("");
    }
    if (teamPhoto && data?.big_team_photo) {
      teamPhoto.innerHTML = `<img src="${escapeHtml(normalizePath(data.big_team_photo))}" alt="Anil Video Films team" loading="lazy" decoding="async">`;
    }
  }

  async function renderHome(data) {
    if (data?.hero_section?.bg_image) setImage(".avf-hero img", data.hero_section.bg_image, data?.hero_section?.title);
    if (data?.section_one?.left_photo) setImage(".anilvideofilms-studio-intro__image:first-child img, .anilvideofilms-modern-approach__left img", data.section_one.left_photo, "Studio image");
    if (data?.section_one?.right_photo) setImage(".anilvideofilms-studio-intro__image:last-child img, .anilvideofilms-modern-approach__right img", data.section_one.right_photo, "Studio image");
    const copy = document.querySelector(".anilvideofilms-studio-intro__copy p, .anilvideofilms-modern-approach__copy p");
    if (copy && data?.section_one?.middle_text) copy.textContent = data.section_one.middle_text;
    renderCollage(data?.section_two_collage || []);

    if (data?.section_four_video?.youtube_url) {
      const frame = document.querySelector(".anilvideofilms-soul-cinema__frame");
      const embed = youtubeEmbedUrl(data.section_four_video.youtube_url);
      if (frame && embed) {
        frame.innerHTML = `<iframe title="Featured wedding film" src="${escapeHtml(embed)}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen style="position:absolute;inset:0;width:100%;height:100%;border:0"></iframe>`;
      }
    }

    const selected = [...await loadAll(PHOTO_SUBPAGES), ...await loadAll(FILM_SUBPAGES)]
      .filter((item) => item?.show_on_homepage === true)
      .slice(0, 4);
    const grid = document.querySelector(".avf-featured-stories__grid");
    if (grid && selected.length) {
      grid.innerHTML = selected.map((item) => storyCard(item, item._path.includes("/films/") ? "film" : "photo")).join("");
    }
  }

  async function renderArchive(kind) {
    const grid = ensureArchiveContainer(kind);
    const pages = await loadAll(kind === "film" ? FILM_SUBPAGES : PHOTO_SUBPAGES);
    if (grid && pages.length) grid.innerHTML = pages.map((item) => archiveCard(item, kind)).join("");
  }

  function renderClientPage(data, kind) {
    const title = data?.client_name || data?.title || "Client Story";
    const hero = data?.hero_image || data?.card_image || PLACEHOLDER_IMAGE;
    const gallery = kind === "film" ? (data?.client_film_stills_gallery || []) : (data?.client_photo_gallery || []);
    const article = document.querySelector("article.sections") || document.querySelector("main") || document.body;
    let section = document.querySelector("[data-decap-client]");

    if (!section) {
      section = document.createElement("section");
      section.className = "avf-decap-client";
      section.setAttribute("data-decap-client", "");
      section.innerHTML = `
        <style>
          .avf-decap-client{background:#fff;color:#1a1f16}
          .avf-decap-client__hero{position:relative;min-height:82vh;display:grid;place-items:end start;overflow:hidden;padding:clamp(90px,12vw,170px) clamp(18px,6vw,96px)}
          .avf-decap-client__hero img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:brightness(.72);z-index:0}
          .avf-decap-client__hero h1{position:relative;z-index:1;color:#f9f8f6;font:400 clamp(54px,8vw,142px)/.85 "Playfair Display",serif;letter-spacing:-.065em;margin:0;max-width:900px}
          .avf-decap-client__story{display:grid;grid-template-columns:minmax(220px,.7fr) minmax(280px,1.3fr);gap:clamp(28px,6vw,90px);padding:clamp(52px,8vw,120px) clamp(18px,6vw,96px)}
          .avf-decap-client__story h2{font:400 clamp(48px,6vw,110px)/.82 "Playfair Display",serif;letter-spacing:-.06em;margin:0;color:#666}
          .avf-decap-client__story h2 em{display:block;color:#4a5d23;font-family:"Cormorant Garamond",serif;font-style:italic}
          .avf-decap-client__story-text{font:400 clamp(20px,2vw,31px)/1.38 "Cormorant Garamond",serif;color:#4a4a4a}
          .avf-decap-client__video{padding:0 clamp(18px,6vw,96px) clamp(44px,6vw,90px)}
          .avf-decap-client__video-frame{position:relative;aspect-ratio:16/9;background:#111}
          .avf-decap-client__video-frame iframe{position:absolute;inset:0;width:100%;height:100%;border:0}
          .avf-decap-client__gallery{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:4px;background:#fff;padding:4px}
          .avf-decap-client__gallery img{width:100%;height:100%;aspect-ratio:1/1;object-fit:cover;display:block}
          @media(max-width:900px){.avf-decap-client__story{grid-template-columns:1fr}.avf-decap-client__gallery{grid-template-columns:repeat(2,minmax(0,1fr))}}
        </style>
        <div class="avf-decap-client__hero"><img alt=""><h1></h1></div>
        <div class="avf-decap-client__story"><h2>The story<em>inside</em></h2><div class="avf-decap-client__story-text"></div></div>
        <div class="avf-decap-client__video"></div>
        <div class="avf-decap-client__gallery"></div>`;
      article.insertBefore(section, article.firstElementChild || null);
    }

    setImage("[data-decap-client] .avf-decap-client__hero img", hero, title);
    const heading = section.querySelector(".avf-decap-client__hero h1");
    const story = section.querySelector(".avf-decap-client__story-text");
    const videoWrap = section.querySelector(".avf-decap-client__video");
    const galleryGrid = section.querySelector(".avf-decap-client__gallery");
    if (heading) heading.textContent = title;
    if (story) story.innerHTML = markdownToHtml(data?.full_story_body || data?.description || "");
    if (videoWrap && kind === "film" && data?.video_url) {
      videoWrap.innerHTML = `<div class="avf-decap-client__video-frame"><iframe title="${escapeHtml(title)} film" src="${escapeHtml(youtubeEmbedUrl(data.video_url))}" allowfullscreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"></iframe></div>`;
    }
    if (galleryGrid && gallery.length) {
      galleryGrid.innerHTML = gallery.map((src, index) => `<img src="${escapeHtml(normalizePath(src))}" alt="${escapeHtml(title)} gallery ${index + 1}" loading="lazy" decoding="async">`).join("");
    }
  }

  async function init() {
    removeVisibleFrontMatter();

    try {
      const current = await loadFrontMatter(pagePath());
      const path = window.location.pathname;

      if (path.includes("/main-pages/01-about/")) {
        renderAbout(current);
        return;
      }
      if (path.includes("/main-pages/02-photography/")) {
        await renderArchive("photo");
        return;
      }
      if (path.includes("/main-pages/03-films/")) {
        await renderArchive("film");
        return;
      }
      if (path.includes("/main-pages/06-pre-wedding/")) {
        renderCollage(current?.pre_wedding_collage || current?.section_two_collage || []);
        return;
      }
      if (path.includes("/subpages/photography/")) {
        renderClientPage(current, "photo");
        return;
      }
      if (path.includes("/subpages/films/")) {
        renderClientPage(current, "film");
        return;
      }
      if (path === "/" || path === "/index.html" || path.endsWith("/deploy%20anf/index.html")) {
        await renderHome(current);
      }
    } catch (error) {
      console.warn("[Decap CMS] Content render skipped:", error);
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();
