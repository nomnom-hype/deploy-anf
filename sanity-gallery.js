import { createClient } from "https://esm.sh/@sanity/client";

const sanityConfig = {
  projectId: window.SANITY_CONFIG?.projectId || "yuvqhdn5",
  dataset: "production",
  useCdn: false,
  apiVersion: "2026-07-04",
  perspective: "published",
};

const client = createClient(sanityConfig);

const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const getYouTubeEmbedUrl = (youtubeUrl = "") => {
  if (!youtubeUrl) return "";

  try {
    const url = new URL(youtubeUrl);
    let videoId = "";

    if (url.hostname.includes("youtu.be")) {
      videoId = url.pathname.replace("/", "");
    } else if (url.hostname.includes("youtube.com")) {
      if (url.pathname.startsWith("/watch")) {
        videoId = url.searchParams.get("v") || "";
      } else if (url.pathname.startsWith("/embed/")) {
        videoId = url.pathname.split("/embed/")[1] || "";
      } else if (url.pathname.startsWith("/shorts/")) {
        videoId = url.pathname.split("/shorts/")[1] || "";
      }
    }

    if (!videoId) return "";

    const cleanId = videoId.split(/[?&/]/)[0];
    return `https://www.youtube.com/embed/${encodeURIComponent(cleanId)}?rel=0`;
  } catch (error) {
    console.warn("Invalid YouTube URL from Sanity:", youtubeUrl, error);
    return "";
  }
};

const weddingCardTemplate = (wedding) => {
  const title = escapeHtml(wedding.title || "Untitled Wedding");
  const description = escapeHtml(wedding.description || "");
  const embedUrl = getYouTubeEmbedUrl(wedding.youtubeUrl);
  const photos = Array.isArray(wedding.photos) ? wedding.photos.filter(Boolean) : [];

  const photoMarkup = photos
    .map(
      (photoUrl, index) => `
        <figure class="sanity-wedding-card__photo">
          <img src="${escapeHtml(photoUrl)}" alt="${title} photo ${index + 1}" loading="lazy" decoding="async">
        </figure>
      `
    )
    .join("");

  const videoMarkup = embedUrl
    ? `
      <div class="sanity-wedding-card__video">
        <iframe
          src="${embedUrl}"
          title="${title} wedding video"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen
        ></iframe>
      </div>
    `
    : "";

  return `
    <article class="sanity-wedding-card">
      ${videoMarkup}
      <div class="sanity-wedding-card__body">
        <h2>${title}</h2>
        ${description ? `<p>${description}</p>` : ""}
      </div>
      ${photoMarkup ? `<div class="sanity-wedding-card__photos">${photoMarkup}</div>` : ""}
    </article>
  `;
};

export async function loadGallery() {
  const galleryContainer = document.getElementById("gallery-container");
  if (!galleryContainer) return;

  const query = `
    *[_type == "wedding"] | order(_createdAt desc) {
      title,
      description,
      youtubeUrl,
      "photos": photos[].asset->url
    }
  `;

  try {
    galleryContainer.innerHTML = `<p class="sanity-gallery-loading">Loading stories...</p>`;
    const weddings = await client.fetch(query, {}, { perspective: "published" });

    if (!weddings.length) {
      galleryContainer.innerHTML = `<p class="sanity-gallery-empty">No wedding stories found.</p>`;
      return;
    }

    galleryContainer.innerHTML = weddings.map(weddingCardTemplate).join("");
  } catch (error) {
    console.error("Could not load Sanity wedding gallery:", error);
    galleryContainer.innerHTML = `
      <p class="sanity-gallery-error">
        We could not load the gallery right now. Please try again later.
      </p>
    `;
  }
}

window.loadGallery = loadGallery;

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", loadGallery, { once: true });
} else {
  loadGallery();
}
