const SANITY_PROJECT_ID = 'yuvqhdn5';
const SANITY_DATASET = 'production';
const SANITY_API_VERSION = '2026-07-04';
const SANITY_QUERY_ENDPOINT = `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}`;

const query = `{
  "cacheBust": $cacheBust,
  "siteSettings": coalesce(*[_id == "siteSettings"][0], (*[_type == "siteSettings"] | order(_updatedAt desc))[0]){
    title,
    email,
    phone,
    instagramLabel,
    instagramUrl,
    youtubeLabel,
    youtubeUrl,
    footerNewsletterText,
    footerCopyright,
    "logoUrl": logo.asset->url
  },
  "homePage": coalesce(*[_id == "homePage"][0], (*[_type == "homePage"] | order(_updatedAt desc))[0]){
    "heroHeading": coalesce(heroHeading, title),
    "heroSubheading": coalesce(heroSubheading, lead),
    "aboutHeading": coalesce(aboutHeading, aboutTitle),
    "aboutCopy": coalesce(aboutCopy, aboutText, aboutParagraph),
    "photoSectionHeading": coalesce(photoSectionHeading, photographyHeading),
    "filmSectionHeading": coalesce(filmSectionHeading, filmsHeading),
    "soulCinemaHeading": coalesce(soulCinemaHeading, videoHeading),
    "soulCinemaText": coalesce(soulCinemaText, soulCinemaCopy, videoText),
    "soulCinemaVideoUrl": coalesce(soulCinemaVideoUrl, soulCinemaVideo, videoUrl),
    "heroImageUrl": coalesce(heroImage.asset->url, image.asset->url, photo.asset->url),
    "aboutImageLeftUrl": coalesce(aboutImageLeft.asset->url, leftImage.asset->url),
    "aboutImageRightUrl": coalesce(aboutImageRight.asset->url, rightImage.asset->url),
    "soulCinemaPosterUrl": coalesce(soulCinemaPoster.asset->url, videoPoster.asset->url, poster.asset->url),
    "homeCollage": homeCollage[]{
      alt,
      caption,
      "url": coalesce(image.asset->url, asset->url, photo.asset->url)
    }
  },
  "preWeddingPage": coalesce(*[_id == "preWeddingPage"][0], (*[_type == "preWeddingPage"] | order(_updatedAt desc))[0]){
    "kicker": coalesce(kicker, eyebrow),
    "heading": coalesce(heading, mainHeading),
    "lead": coalesce(lead, description),
    "albumKicker": coalesce(albumKicker, galleryKicker),
    "albumHeading": coalesce(albumHeading, galleryHeading),
    "ctaHeading": coalesce(ctaHeading, storyHeading),
    "ctaText": coalesce(ctaText, storyText),
    "heroImageUrl": coalesce(heroImage.asset->url, image.asset->url, photo.asset->url),
    "collageImages": coalesce(collageImages[]{
      alt,
      caption,
      "url": coalesce(image.asset->url, asset->url, photo.asset->url)
    }, gallery[]{
      alt,
      caption,
      "url": coalesce(image.asset->url, asset->url, photo.asset->url)
    }, photos[]{
      alt,
      caption,
      "url": coalesce(image.asset->url, asset->url, photo.asset->url)
    })
  },
  "preWeddingPageFallback": (*[_type == "preWeddingPage"] | order(count(collageImages) desc, _updatedAt desc))[0]{
    "kicker": coalesce(kicker, eyebrow),
    "heading": coalesce(heading, mainHeading),
    "lead": coalesce(lead, description),
    "albumKicker": coalesce(albumKicker, galleryKicker),
    "albumHeading": coalesce(albumHeading, galleryHeading),
    "ctaHeading": coalesce(ctaHeading, storyHeading),
    "ctaText": coalesce(ctaText, storyText),
    "heroImageUrl": coalesce(heroImage.asset->url, image.asset->url, photo.asset->url),
    "collageImages": coalesce(collageImages[]{
      alt,
      caption,
      "url": coalesce(image.asset->url, asset->url, photo.asset->url)
    }, gallery[]{
      alt,
      caption,
      "url": coalesce(image.asset->url, asset->url, photo.asset->url)
    }, photos[]{
      alt,
      caption,
      "url": coalesce(image.asset->url, asset->url, photo.asset->url)
    })
  },
  "contactPage": coalesce(*[_id == "contactPage"][0], (*[_type == "contactPage"] | order(_updatedAt desc))[0]){
    kicker,
    heading,
    lead,
    editorialHeading,
    editorialIntro,
    editorialCopy,
    email,
    phone,
    address,
    "heroImageUrl": heroImage.asset->url,
    "editorialImageUrl": editorialImage.asset->url
  },
  "careersPage": coalesce(*[_id == "careersPage"][0], (*[_type == "careersPage"] | order(_updatedAt desc))[0]){
    kicker,
    heading,
    lead,
    rolesHeading,
    roles[]{title, level, location},
    applyHeading,
    applyIntro,
    applyCopy,
    email,
    phone,
    "heroImageUrl": heroImage.asset->url,
    "editorialImageUrl": editorialImage.asset->url
  },
  "aboutUs": coalesce(
    *[_id in ["aboutUs", "about-us", "About", "About Us"]][0],
    (*[
      _type in ["aboutUs", "aboutUsPage", "aboutPage", "about"] ||
      lower(coalesce(internalTitle, "")) in ["about", "about us"] ||
      lower(coalesce(title, "")) in ["about", "about us"]
    ] | order(_updatedAt desc))[0]
  ){
    _type,
    internalTitle,
    title,
    "kicker": coalesce(kicker, eyebrow),
    "heading": coalesce(heading, mainHeading),
    "lead": coalesce(lead, description),
    "members": coalesce(members[]{
      "name": coalesce(name, fullName, title),
      "designation": coalesce(designation, role, jobTitle),
      "photoUrl": coalesce(photo.asset->url, image.asset->url, headshot.asset->url)
    }, teamMembers[]{
      "name": coalesce(name, fullName, title),
      "designation": coalesce(designation, role, jobTitle),
      "photoUrl": coalesce(photo.asset->url, image.asset->url, headshot.asset->url)
    }),
    "bigTeamPhotoUrl": coalesce(bigTeamPhoto.asset->url, teamImage.asset->url, groupPhoto.asset->url, image.asset->url)
  },
  "aboutUsFallback": (*[
    _type in ["aboutUs", "aboutUsPage", "aboutPage", "about"] ||
    lower(coalesce(internalTitle, "")) in ["about", "about us"] ||
    lower(coalesce(title, "")) in ["about", "about us"]
  ] | order(count(members) desc, _updatedAt desc))[0]{
    _type,
    internalTitle,
    title,
    "kicker": coalesce(kicker, eyebrow),
    "heading": coalesce(heading, mainHeading),
    "lead": coalesce(lead, description),
    "members": coalesce(members[]{
      "name": coalesce(name, fullName, title),
      "designation": coalesce(designation, role, jobTitle),
      "photoUrl": coalesce(photo.asset->url, image.asset->url, headshot.asset->url)
    }, teamMembers[]{
      "name": coalesce(name, fullName, title),
      "designation": coalesce(designation, role, jobTitle),
      "photoUrl": coalesce(photo.asset->url, image.asset->url, headshot.asset->url)
    }),
    "bigTeamPhotoUrl": coalesce(bigTeamPhoto.asset->url, teamImage.asset->url, groupPhoto.asset->url, image.asset->url)
  },
  "photographyPage": coalesce(*[_id == "photographyPage"][0], (*[_type == "photographyPage"] | order(_updatedAt desc))[0]){
    "clients": clients[]{
      "title": coalesce(title, clientNames, name),
      "slug": coalesce(slug.current, slug),
      "clientNames": coalesce(clientNames, title, name),
      "category": coalesce(category, "Wedding"),
      "date": coalesce(date, displayDate),
      "year": coalesce(year, displayYear),
      "location": coalesce(location, venue),
      "excerpt": coalesce(excerpt, shortStory, description),
      "story": coalesce(story, fullStory, description, excerpt),
      "youtubeUrl": coalesce(youtubeUrl, youtubeLink, videoUrl),
      featuredOnHome,
      "cardImageUrl": coalesce(thumbnail.asset->url, cardImage.asset->url, image.asset->url, photo.asset->url),
      "heroImageUrl": coalesce(heroImage.asset->url, thumbnail.asset->url, cardImage.asset->url, image.asset->url, photo.asset->url),
      "gallery": coalesce(gallery[].asset->url, photos[].asset->url)
    }
  },
  "photographyPageFallback": (*[_type == "photographyPage"] | order(count(clients) desc, _updatedAt desc))[0]{
    "clients": clients[]{
      "title": coalesce(title, clientNames, name),
      "slug": coalesce(slug.current, slug),
      "clientNames": coalesce(clientNames, title, name),
      "category": coalesce(category, "Wedding"),
      "date": coalesce(date, displayDate),
      "year": coalesce(year, displayYear),
      "location": coalesce(location, venue),
      "excerpt": coalesce(excerpt, shortStory, description),
      "story": coalesce(story, fullStory, description, excerpt),
      "youtubeUrl": coalesce(youtubeUrl, youtubeLink, videoUrl),
      featuredOnHome,
      "cardImageUrl": coalesce(thumbnail.asset->url, cardImage.asset->url, image.asset->url, photo.asset->url),
      "heroImageUrl": coalesce(heroImage.asset->url, thumbnail.asset->url, cardImage.asset->url, image.asset->url, photo.asset->url),
      "gallery": coalesce(gallery[].asset->url, photos[].asset->url)
    }
  },
  "ourPhotoClients": *[_type == "ourClients" && coalesce(published, true) && collection == "photography"] | order(coalesce(order, 999), _updatedAt desc){
    "title": coalesce(title, clientNames, name),
    "slug": coalesce(slug.current, slug),
    "clientNames": coalesce(clientNames, title, name),
    "category": coalesce(category, "Wedding"),
    "date": coalesce(date, displayDate),
    "year": coalesce(year, displayYear),
    "location": coalesce(location, venue),
    "excerpt": coalesce(excerpt, shortStory, description),
    "story": coalesce(story, fullStory, description, excerpt),
    "youtubeUrl": coalesce(youtubeUrl, youtubeLink, videoUrl),
    featuredOnHome,
    homeOrder,
    "cardImageUrl": coalesce(thumbnail.asset->url, cardImage.asset->url, image.asset->url, photo.asset->url),
    "heroImageUrl": coalesce(heroImage.asset->url, thumbnail.asset->url, cardImage.asset->url, image.asset->url, photo.asset->url),
    "gallery": coalesce(gallery[].asset->url, photos[].asset->url)
  },
  "safePhotoClients": *[(_type == "client" || _type == "ourClients") && coalesce(published, true) && coalesce(collection, "photography") == "photography"] | order(coalesce(order, 999), _updatedAt desc){
    "title": coalesce(title, clientNames, name),
    "slug": coalesce(slug.current, slug),
    "clientNames": coalesce(clientNames, title, name),
    "category": coalesce(category, "Wedding"),
    "date": coalesce(date, displayDate),
    "year": coalesce(year, displayYear),
    "location": coalesce(location, venue),
    "excerpt": coalesce(excerpt, shortStory, description),
    "story": coalesce(story, fullStory, description, excerpt),
    "youtubeUrl": coalesce(youtubeUrl, youtubeLink, videoUrl),
    featuredOnHome,
    homeOrder,
    "cardImageUrl": coalesce(thumbnail.asset->url, cardImage.asset->url, image.asset->url, photo.asset->url),
    "heroImageUrl": coalesce(heroImage.asset->url, thumbnail.asset->url, cardImage.asset->url, image.asset->url, photo.asset->url),
    "gallery": coalesce(gallery[].asset->url, photos[].asset->url)
  },
  "filmsPage": coalesce(*[_id == "filmsPage"][0], (*[_type == "filmsPage"] | order(_updatedAt desc))[0]){
    "clients": clients[]{
      "title": coalesce(title, clientNames, name),
      "slug": coalesce(slug.current, slug),
      "clientNames": coalesce(clientNames, title, name),
      "category": coalesce(category, "Wedding"),
      "date": coalesce(date, displayDate),
      "year": coalesce(year, displayYear),
      "location": coalesce(location, venue),
      "excerpt": coalesce(excerpt, shortStory, description),
      "story": coalesce(story, fullStory, description, excerpt),
      "videoPreviewUrl": coalesce(videoPreviewUrl, previewVideoUrl, videoUrl),
      "youtubeUrl": coalesce(youtubeUrl, youtubeLink, videoUrl),
      featuredOnHome,
      "posterImageUrl": coalesce(thumbnail.asset->url, posterImage.asset->url, cardImage.asset->url, image.asset->url, photo.asset->url),
      "heroImageUrl": coalesce(heroImage.asset->url, thumbnail.asset->url, posterImage.asset->url, image.asset->url, photo.asset->url),
      "gallery": coalesce(gallery[].asset->url, photos[].asset->url)
    }
  },
  "filmsPageFallback": (*[_type == "filmsPage"] | order(count(clients) desc, _updatedAt desc))[0]{
    "clients": clients[]{
      "title": coalesce(title, clientNames, name),
      "slug": coalesce(slug.current, slug),
      "clientNames": coalesce(clientNames, title, name),
      "category": coalesce(category, "Wedding"),
      "date": coalesce(date, displayDate),
      "year": coalesce(year, displayYear),
      "location": coalesce(location, venue),
      "excerpt": coalesce(excerpt, shortStory, description),
      "story": coalesce(story, fullStory, description, excerpt),
      "videoPreviewUrl": coalesce(videoPreviewUrl, previewVideoUrl, videoUrl),
      "youtubeUrl": coalesce(youtubeUrl, youtubeLink, videoUrl),
      featuredOnHome,
      "posterImageUrl": coalesce(thumbnail.asset->url, posterImage.asset->url, cardImage.asset->url, image.asset->url, photo.asset->url),
      "heroImageUrl": coalesce(heroImage.asset->url, thumbnail.asset->url, posterImage.asset->url, image.asset->url, photo.asset->url),
      "gallery": coalesce(gallery[].asset->url, photos[].asset->url)
    }
  },
  "ourFilmClients": *[_type == "ourClients" && coalesce(published, true) && collection == "films"] | order(coalesce(order, 999), _updatedAt desc){
    "title": coalesce(title, clientNames, name),
    "slug": coalesce(slug.current, slug),
    "clientNames": coalesce(clientNames, title, name),
    "category": coalesce(category, "Wedding"),
    "date": coalesce(date, displayDate),
    "year": coalesce(year, displayYear),
    "location": coalesce(location, venue),
    "excerpt": coalesce(excerpt, shortStory, description),
    "story": coalesce(story, fullStory, description, excerpt),
    "videoPreviewUrl": coalesce(videoPreviewUrl, previewVideoUrl, videoUrl),
    "youtubeUrl": coalesce(youtubeUrl, youtubeLink, videoUrl),
    featuredOnHome,
    homeOrder,
    "posterImageUrl": coalesce(thumbnail.asset->url, posterImage.asset->url, cardImage.asset->url, image.asset->url, photo.asset->url),
    "heroImageUrl": coalesce(heroImage.asset->url, thumbnail.asset->url, posterImage.asset->url, image.asset->url, photo.asset->url),
    "gallery": coalesce(gallery[].asset->url, photos[].asset->url)
  },
  "safeFilmClients": *[(_type == "client" || _type == "ourClients") && coalesce(published, true) && collection == "films"] | order(coalesce(order, 999), _updatedAt desc){
    "title": coalesce(title, clientNames, name),
    "slug": coalesce(slug.current, slug),
    "clientNames": coalesce(clientNames, title, name),
    "category": coalesce(category, "Wedding"),
    "date": coalesce(date, displayDate),
    "year": coalesce(year, displayYear),
    "location": coalesce(location, venue),
    "excerpt": coalesce(excerpt, shortStory, description),
    "story": coalesce(story, fullStory, description, excerpt),
    "videoPreviewUrl": coalesce(videoPreviewUrl, previewVideoUrl, videoUrl),
    "youtubeUrl": coalesce(youtubeUrl, youtubeLink, videoUrl),
    featuredOnHome,
    homeOrder,
    "posterImageUrl": coalesce(thumbnail.asset->url, posterImage.asset->url, cardImage.asset->url, image.asset->url, photo.asset->url),
    "heroImageUrl": coalesce(heroImage.asset->url, thumbnail.asset->url, posterImage.asset->url, image.asset->url, photo.asset->url),
    "gallery": coalesce(gallery[].asset->url, photos[].asset->url)
  },
  "pageContent": (*[_type == "pageContent"] | order(_updatedAt desc)){
    _type,
    internalTitle,
    pageKey,
    kicker,
    title,
    lead,
    body,
    ctaHeading,
    ctaText,
    seoTitle,
    seoDescription,
    "heroImageUrl": coalesce(heroImage.asset->url, image.asset->url, photo.asset->url),
    "editorialImageUrl": coalesce(editorialImage.asset->url, image.asset->url),
    "teamImageUrl": coalesce(teamImage.asset->url, bigTeamPhoto.asset->url, groupPhoto.asset->url),
    "collageImages": coalesce(collageImages[]{
      alt,
      caption,
      "url": coalesce(image.asset->url, asset->url, photo.asset->url)
    }, gallery[]{
      alt,
      caption,
      "url": coalesce(image.asset->url, asset->url, photo.asset->url)
    }, photos[]{
      alt,
      caption,
      "url": coalesce(image.asset->url, asset->url, photo.asset->url)
    })
  },
  "photoStories": *[_type == "photoStory" && coalesce(published, true)] | order(coalesce(archiveOrder, 999), _createdAt desc){
    _id,
    "title": coalesce(title, clientNames, name),
    "clientNames": coalesce(clientNames, title, name),
    "category": coalesce(category, "Wedding"),
    "date": coalesce(date, displayDate),
    "year": coalesce(year, displayYear),
    "location": coalesce(location, venue),
    "excerpt": coalesce(excerpt, shortStory, description),
    "story": coalesce(story, fullStory, description, excerpt),
    "youtubeUrl": coalesce(youtubeUrl, youtubeLink, videoUrl),
    featuredOnHome,
    homeOrder,
    "slug": coalesce(slug.current, slug),
    "cardImageUrl": coalesce(cardImage.asset->url, thumbnail.asset->url, image.asset->url, photo.asset->url),
    "heroImageUrl": coalesce(heroImage.asset->url, cardImage.asset->url, thumbnail.asset->url, image.asset->url, photo.asset->url),
    "gallery": coalesce(gallery[].asset->url, photos[].asset->url)
  },
  "filmStories": *[_type == "filmStory" && coalesce(published, true)] | order(coalesce(archiveOrder, 999), _createdAt desc){
    _id,
    "title": coalesce(title, clientNames, name),
    "clientNames": coalesce(clientNames, title, name),
    "category": coalesce(category, "Wedding"),
    "date": coalesce(date, displayDate),
    "year": coalesce(year, displayYear),
    "location": coalesce(location, venue),
    "excerpt": coalesce(excerpt, shortStory, description),
    "story": coalesce(story, fullStory, description, excerpt),
    "videoPreviewUrl": coalesce(videoPreviewUrl, previewVideoUrl, videoUrl),
    "youtubeUrl": coalesce(youtubeUrl, youtubeLink, videoUrl),
    featuredOnHome,
    homeOrder,
    "slug": coalesce(slug.current, slug),
    "posterImageUrl": coalesce(posterImage.asset->url, thumbnail.asset->url, cardImage.asset->url, image.asset->url, photo.asset->url),
    "heroImageUrl": coalesce(heroImage.asset->url, posterImage.asset->url, thumbnail.asset->url, image.asset->url, photo.asset->url),
    "gallery": coalesce(gallery[].asset->url, photos[].asset->url)
  },
  "teamMembers": *[_type == "teamMember" && coalesce(featured, true)] | order(coalesce(order, 999), _createdAt asc){
    name,
    designation,
    bio,
    "photoUrl": photo.asset->url
  },
  "legacyWeddings": *[_type == "wedding"] | order(_createdAt desc){
    title,
    description,
    youtubeUrl,
    "photos": photos[].asset->url
  }
}`;

let cmsState = null;
let cmsPromise = null;
const wordpressRoute = window.__AVF_WORDPRESS_ROUTE__ || {};

const pageKeyByPath = {
  '/': 'home',
  '/index.html': 'home',
  '/portfolio-photo': 'photography',
  '/anf-films': 'films',
  '/pre-wedding': 'preWedding',
  '/about': 'about',
  '/contact-us': 'contact',
  '/careers': 'careers',
};

const escapeHtml = (value = '') =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

const normalizePath = () => {
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  return path === '/index.html' ? '/' : path;
};

const currentSearch = () => wordpressRoute.search || window.location.search;

const slugify = (value = '') =>
  String(value)
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const storySlug = (story) => story?.slug || slugify(story?.clientNames || story?.title || '');
const storyName = (story) => story?.clientNames || story?.title || 'Client Story';
const fallbackStoryImage = '/assets/collage/13-hero.png';
const storyImage = (story) => story?.cardImageUrl || story?.posterImageUrl || story?.heroImageUrl || story?.gallery?.[0] || fallbackStoryImage;
const storyHeroImage = (story) => story?.heroImageUrl || storyImage(story);

const getPhotoStories = () => {
  const liveClients = cmsArray(cmsState?.ourPhotoClients).filter(Boolean);
  if (liveClients.length) return liveClients;

  const dashboardStories = cmsArray(cmsState?.photographyPage?.clients).filter(Boolean);
  return dashboardStories.length ? dashboardStories : (cmsState?.photoStories || []);
};

const getFilmStories = () => {
  const liveClients = cmsArray(cmsState?.ourFilmClients).filter(Boolean);
  if (liveClients.length) return liveClients;

  const dashboardStories = cmsArray(cmsState?.filmsPage?.clients).filter(Boolean);
  return dashboardStories.length ? dashboardStories : (cmsState?.filmStories || []);
};

const toYoutubeEmbed = (url) => {
  if (!url) return '';

  try {
    const parsed = new URL(url);
    let id = '';

    if (parsed.hostname.includes('youtu.be')) {
      id = parsed.pathname.replace('/', '');
    } else if (parsed.searchParams.get('v')) {
      id = parsed.searchParams.get('v');
    } else if (parsed.pathname.includes('/embed/')) {
      id = parsed.pathname.split('/embed/')[1]?.split('/')[0] || '';
    } else if (parsed.pathname.includes('/shorts/')) {
      id = parsed.pathname.split('/shorts/')[1]?.split('/')[0] || '';
    }

    return id ? `https://www.youtube.com/embed/${id}?rel=0` : url.replace('http://', 'https://');
  } catch (error) {
    return String(url).replace('http://', 'https://');
  }
};

const getPageContent = () => {
  const key = pageKeyByPath[normalizePath()];
  return cmsState?.pageContent?.find((page) => page.pageKey === key);
};

const getEditablePage = () => {
  const path = normalizePath();
  if (path === '/pre-wedding' && cmsState?.preWeddingPage) return cmsState.preWeddingPage;
  if (path === '/contact-us' && cmsState?.contactPage) return cmsState.contactPage;
  if (path === '/careers' && cmsState?.careersPage) return cmsState.careersPage;
  return getPageContent();
};

const cmsArray = (value) => Array.isArray(value) ? value : [];

function mergePageFallback(primary = {}, fallback = {}, arrayKeys = []) {
  const merged = { ...(fallback || {}), ...(primary || {}) };

  arrayKeys.forEach((key) => {
    if (!cmsArray(primary?.[key]).length && cmsArray(fallback?.[key]).length) {
      merged[key] = fallback[key];
    }
  });

  Object.keys(fallback || {}).forEach((key) => {
    if ((primary?.[key] === undefined || primary?.[key] === null || primary?.[key] === '') && fallback?.[key]) {
      merged[key] = fallback[key];
    }
  });

  return merged;
}

function findAboutData(data = {}) {
  const candidates = [
    data.aboutUs,
    data.aboutUsFallback,
    ...cmsArray(data.pageContent),
  ].filter(Boolean);
  const dataList = candidates;
  const aboutData = dataList.find((item) =>
    item?._type === 'about' ||
    item?._type === 'aboutUs' ||
    item?.internalTitle === 'About Us' ||
    item?.title === 'About Us' ||
    String(item?.internalTitle || '').trim().toLowerCase() === 'about' ||
    String(item?.title || '').trim().toLowerCase() === 'about' ||
    item?.pageKey === 'about'
  );

  return aboutData || data.aboutUs || data.aboutUsFallback || {};
}

function normalizeCMSData(data = {}) {
  const aboutData = findAboutData(data);

  return {
    ...data,
    aboutUs: mergePageFallback(aboutData, data.aboutUsFallback, ['members']),
    preWeddingPage: mergePageFallback(data.preWeddingPage, data.preWeddingPageFallback, ['collageImages']),
    photographyPage: mergePageFallback(data.photographyPage, data.photographyPageFallback, ['clients']),
    filmsPage: mergePageFallback(data.filmsPage, data.filmsPageFallback, ['clients']),
    ourPhotoClients: cmsArray(data.safePhotoClients).length ? data.safePhotoClients : data.ourPhotoClients,
    ourFilmClients: cmsArray(data.safeFilmClients).length ? data.safeFilmClients : data.ourFilmClients,
  };
}

function logCMSDebug(data) {
  const photoClients = cmsArray(data?.photographyPage?.clients);
  const filmClients = cmsArray(data?.filmsPage?.clients);
  const ourPhotoClients = cmsArray(data?.ourPhotoClients);
  const ourFilmClients = cmsArray(data?.ourFilmClients);
  const aboutMembers = cmsArray(data?.aboutUs?.members);
  const preWeddingImages = cmsArray(data?.preWeddingPage?.collageImages);

  console.groupCollapsed('[AVF CMS] incoming Sanity data');
  console.log('route:', normalizePath());
  console.log('summary:', {
    aboutMembers: aboutMembers.length,
    aboutBigPhoto: Boolean(data?.aboutUs?.bigTeamPhotoUrl),
    preWeddingImages: preWeddingImages.length,
    ourPhotoClients: ourPhotoClients.length,
    ourFilmClients: ourFilmClients.length,
    photographyClients: photoClients.length,
    legacyPhotoStories: cmsArray(data?.photoStories).length,
    filmClients: filmClients.length,
    legacyFilmStories: cmsArray(data?.filmStories).length,
    firstPhotoClient: ourPhotoClients[0] || photoClients[0] || null,
    firstFilmClient: ourFilmClients[0] || filmClients[0] || null,
  });
  console.log('raw:', data);
  console.groupEnd();
}

async function fetchSanityContent(groqQuery, params = {}) {
  const url = new URL(SANITY_QUERY_ENDPOINT);
  url.searchParams.set('query', groqQuery);
  url.searchParams.set('perspective', 'published');

  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(`$${key}`, JSON.stringify(value));
  });

  const response = await fetch(url.toString(), {
    method: 'GET',
    cache: 'no-store',
    headers: {
      Accept: 'application/json',
    },
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload?.error?.description || payload?.message || `Sanity request failed with ${response.status}`);
  }

  return payload?.result || {};
}

async function loadCMS() {
  if (cmsState) return cmsState;
  if (!cmsPromise) {
    cmsPromise = fetchSanityContent(query, { cacheBust: Date.now() }).then((data) => {
      cmsState = normalizeCMSData(data || {});
      window.__AVF_CMS_STATE__ = cmsState;
      logCMSDebug(cmsState);
      return cmsState;
    }).catch((error) => {
      console.error('Sanity CMS content failed to load. Check Sanity CORS, published documents, and query syntax.', error);
      cmsState = {};
      window.__AVF_CMS_STATE__ = cmsState;
      return cmsState;
    });
  }

  return cmsPromise;
}

const featuredStories = (items = [], count = 4) => {
  const featured = items
    .filter((item) => item.featuredOnHome)
    .sort((a, b) => (a.homeOrder ?? 999) - (b.homeOrder ?? 999));

  return (featured.length ? featured : items).slice(0, count);
};

const setText = (selector, value) => {
  if (!value) return;
  const element = document.querySelector(selector);
  if (element) element.textContent = value;
};

const setHtml = (selector, value) => {
  if (!value) return;
  const element = document.querySelector(selector);
  if (element) element.innerHTML = value;
};

const meaningfulPublicValue = (value, internalValue) => {
  const clean = String(value || '').trim();
  const internal = String(internalValue || '').trim();
  if (!clean) return '';
  return clean.toLowerCase() === internal.toLowerCase() ? '' : clean;
};

function renderImage(src, alt) {
  if (!src) return '';
  return `<img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" loading="lazy" decoding="async">`;
}

function imageItems(items = []) {
  return items.filter((item) => item?.url);
}

function renderHomePhotoCards() {
  const grid = document.querySelector('.avf-featured-stories__grid');
  const stories = featuredStories(getPhotoStories(), 4).filter(storyImage);
  if (!grid || !stories.length) return;

  grid.innerHTML = stories.map((story) => `
    <a class="avf-featured-stories__card" href="/portfolio-photo?story=${escapeHtml(storySlug(story))}">
      <div class="avf-featured-stories__media">
        ${renderImage(storyImage(story), storyName(story))}
      </div>
      <div class="avf-featured-stories__meta">
        <h3 class="avf-featured-stories__name">${escapeHtml(storyName(story))}</h3>
        <p class="avf-featured-stories__date">${escapeHtml(story.year || story.date || '')}</p>
      </div>
    </a>
  `).join('');
}

function renderHomeFilmCards() {
  const grid = document.querySelector('.avf-film-cards__grid');
  const stories = featuredStories(getFilmStories(), 4).filter((story) => story.videoPreviewUrl || storyImage(story) || story.youtubeUrl);
  if (!grid || !stories.length) return;

  grid.innerHTML = stories.map((story, index) => {
    const poster = storyImage(story);
    const video = story.videoPreviewUrl;
    const media = video
      ? `<video class="avf-film-card__video" poster="${escapeHtml(poster)}" playsinline muted loop preload="metadata"><source src="${escapeHtml(video)}"></video>`
      : renderImage(poster, storyName(story));

    return `
      <article class="avf-film-card" data-video-index="${index}">
        <div class="avf-film-card__link" role="group" aria-label="${escapeHtml(storyName(story))}">
          <div class="avf-film-card__media">
            ${media}
          </div>
          <div class="avf-film-card__meta">
            <h3 class="avf-film-card__name">${escapeHtml(storyName(story))}</h3>
            <p class="avf-film-card__date">${escapeHtml(story.year || story.date || '')}</p>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

function renderHomeCollage() {
  const grid = document.querySelector('.anilvideofilms-collage__grid');
  const images = imageItems(cmsState?.homePage?.homeCollage);
  if (!grid || !images.length) return;

  const textTile = grid.querySelector('.anilvideofilms-collage__text')?.outerHTML || `
    <div class="anilvideofilms-collage__tile anilvideofilms-collage__text">
      <p class="anilvideofilms-collage__kicker">some of the most</p>
      <p class="anilvideofilms-collage__title"><span>&ldquo;</span>ICONIC<span>&rdquo;</span></p>
      <p class="anilvideofilms-collage__sub">wedding images</p>
    </div>
  `;

  grid.innerHTML = images.map((item, index) => {
    const tile = `
      <div class="anilvideofilms-collage__tile" data-lightbox-src="${escapeHtml(item.url)}" data-lightbox-alt="${escapeHtml(item.alt || item.caption || `Collage image ${index + 1}`)}" role="button" tabindex="0">
        ${renderImage(item.url, item.alt || item.caption || `Collage image ${index + 1}`)}
      </div>
    `;

    return index === 7 ? `${textTile}${tile}` : tile;
  }).join('');
}

function renderArchiveFilters(containerSelector, buttonClass, separatorClass, categories) {
  const container = document.querySelector(containerSelector);
  if (!container || !categories.length) return;

  container.innerHTML = ['All', ...categories].map((category, index) => `
    <button class="${buttonClass} ${index === 0 ? 'is-active' : ''}" type="button" data-filter="${escapeHtml(category)}">${escapeHtml(category)}</button>
  `).join(`<span class="${separatorClass}">|</span>`);
}

function uniqueCategories(stories) {
  return [...new Set(stories.map((story) => story.category).filter(Boolean))];
}

function renderPhotoArchive() {
  try {
    const grid = document.querySelector('.avf-photo-grid');
    const stories = getPhotoStories();
    if (!grid || !stories.length || new URLSearchParams(currentSearch()).has('story')) return;

    renderArchiveFilters('.avf-photo-filters', 'avf-photo-filter', 'avf-photo-filter-separator', uniqueCategories(stories));
    grid.innerHTML = stories.map((story) => `
      <a class="avf-photo-card" href="/portfolio-photo?story=${escapeHtml(storySlug(story))}" data-category="${escapeHtml(story?.category || 'Wedding')}">
        <div class="avf-photo-card__media">${renderImage(storyImage(story), storyName(story))}</div>
        <div class="avf-photo-card__body">
          <h2 class="avf-photo-card__title">${escapeHtml(storyName(story))}</h2>
          <p class="avf-photo-card__text">${escapeHtml(story?.excerpt || story?.story || '')}</p>
        </div>
      </a>
    `).join('');
  } catch (error) {
    console.error('[AVF CMS] Photography cards failed to render safely.', error);
  }
}

function renderFilmArchive() {
  try {
    const grid = document.querySelector('.avf-film-grid');
    const stories = getFilmStories();
    if (!grid || !stories.length || new URLSearchParams(currentSearch()).has('film')) return;

    renderArchiveFilters('.avf-film-filters', 'avf-film-filter', 'avf-film-filter-separator', uniqueCategories(stories));
    grid.innerHTML = stories.map((story) => `
      <a class="avf-film-card" href="/anf-films?film=${escapeHtml(storySlug(story))}" data-category="${escapeHtml(story?.category || 'Wedding')}">
        <div class="avf-film-card__media">${renderImage(storyImage(story), storyName(story))}</div>
        <div class="avf-film-card__body">
          <div class="avf-film-card__kicker">${escapeHtml([story?.category, story?.date].filter(Boolean).join(' · '))}</div>
          <h2 class="avf-film-card__title">${escapeHtml(storyName(story))}</h2>
          ${story?.excerpt ? `<p class="avf-film-card__text">${escapeHtml(story.excerpt)}</p>` : ''}
        </div>
      </a>
    `).join('');
  } catch (error) {
    console.error('[AVF CMS] Film cards failed to render safely.', error);
  }
}

function renderGallery(selector, frameClass, story) {
  const gallery = document.querySelector(selector);
  const photos = story?.gallery || [];
  if (!gallery || !photos.length) return;

  gallery.innerHTML = photos.map((photo, index) => `
    <button class="${frameClass} avf-pre-collage-item ${index % 4 === 0 ? 'is-wide' : ''}" type="button" data-lightbox-src="${escapeHtml(photo)}" data-lightbox-alt="${escapeHtml(storyName(story))}">
      ${renderImage(photo, `${storyName(story)} gallery ${index + 1}`)}
    </button>
  `).join('');
}

function renderPreWeddingCollage() {
  if (normalizePath() !== '/pre-wedding') return;

  const dedicatedPage = cmsState?.preWeddingPage;
  const legacyPage = cmsState?.pageContent?.find((item) => item.pageKey === 'preWedding');
  const dedicatedImages = imageItems(dedicatedPage?.collageImages);
  const legacyImages = imageItems(legacyPage?.collageImages);
  const page = dedicatedImages.length ? dedicatedPage : legacyPage;
  const images = imageItems(page?.collageImages);
  if (!images.length) return;

  const preCollage = document.querySelector('.avf-pre-collage');
  if (!preCollage) {
    const classicGrid = document.querySelector('.anilvideofilms-collage__grid');
    if (!classicGrid) return;

    const textTile = classicGrid.querySelector('.anilvideofilms-collage__text')?.outerHTML || `
      <div class="anilvideofilms-collage__tile anilvideofilms-collage__text">
        <p class="anilvideofilms-collage__kicker">some of the most</p>
        <p class="anilvideofilms-collage__title"><span>&ldquo;</span>ICONIC<span>&rdquo;</span></p>
        <p class="anilvideofilms-collage__sub">wedding images</p>
      </div>
    `;

    classicGrid.innerHTML = images.map((item, index) => {
      const caption = item.caption || item.alt || `Pre wedding image ${index + 1}`;
      const tile = `
        <div class="anilvideofilms-collage__tile" data-lightbox-src="${escapeHtml(item.url)}" data-lightbox-alt="${escapeHtml(caption)}" role="button" tabindex="0">
          ${renderImage(item.url, caption)}
        </div>
      `;

      return index === 7 ? `${textTile}${tile}` : tile;
    }).join('');
    return;
  }

  preCollage.innerHTML = images.map((item, index) => {
    const number = String(index + 1).padStart(2, '0');
    const caption = item.caption || item.alt || `Frame ${number}`;
    const classes = [
      'avf-pre-collage-item',
      index === 0 || index === 11 ? 'is-large' : '',
      index === 3 || index === 7 ? 'is-wide' : '',
      index === 5 ? 'is-tall' : '',
    ].filter(Boolean).join(' ');

    return `
      <button class="${classes}" style="--delay:${(0.02 + index * 0.05).toFixed(2)}s" data-full="${escapeHtml(item.url)}" data-lightbox-src="${escapeHtml(item.url)}" data-alt="${escapeHtml(caption)}" data-lightbox-alt="${escapeHtml(caption)}" data-index="${number}" type="button">
        ${renderImage(item.url, caption)}
        <span class="avf-pre-corner">${number} · ${escapeHtml(caption)}</span>
      </button>
    `;
  }).join('');
}

function renderYoutube(selector, url) {
  const shell = document.querySelector(selector);
  const embed = toYoutubeEmbed(url);
  if (!shell || !embed) return;

  shell.innerHTML = `<iframe src="${escapeHtml(embed)}" title="Anil Video Films YouTube story" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
}

function clientStoryStyles() {
  return `
    <style data-cms-client-story-styles>
      .avf-photo-story,
      .avf-film-story {
        background: #ffffff;
        color: #22221f;
        overflow: hidden;
      }
      .avf-photo-story-hero,
      .avf-film-hero {
        position: relative;
        min-height: 100svh;
        display: flex;
        align-items: flex-end;
        overflow: clip;
        background: #11140f;
        color: #f9f8f6;
      }
      .avf-photo-story-media,
      .avf-film-hero-media {
        position: absolute;
        inset: 0;
      }
      .avf-photo-story-media img,
      .avf-film-hero-media img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
        filter: brightness(0.82) saturate(1.05);
      }
      .avf-photo-story-hero::after,
      .avf-film-hero::after {
        content: "";
        position: absolute;
        inset: 0;
        background: linear-gradient(180deg, rgba(17, 20, 15, 0.08), rgba(17, 20, 15, 0.18) 42%, rgba(17, 20, 15, 0.78));
      }
      .avf-photo-story-head,
      .avf-film-head {
        position: relative;
        z-index: 1;
        width: min(100% - 48px, 1320px);
        margin: 0 auto;
        padding: 0 0 clamp(64px, 8vw, 112px);
      }
      .avf-photo-back,
      .avf-film-back {
        display: inline-flex;
        margin-bottom: clamp(18px, 2vw, 28px);
        color: rgba(249, 248, 246, 0.82);
        font-family: "Poppins", sans-serif;
        font-size: 10px;
        letter-spacing: 0.32em;
        text-transform: uppercase;
        text-decoration: none;
      }
      .avf-photo-story-title,
      .avf-film-big-title {
        margin: 0;
        max-width: 980px;
        font-family: "Playfair Display", "Times New Roman", serif;
        font-size: clamp(4rem, 10vw, 10rem);
        font-weight: 400;
        line-height: 0.9;
        letter-spacing: -0.07em;
        color: #f9f8f6;
      }
      .avf-photo-story-meta,
      .avf-film-lead {
        margin: 22px 0 0;
        color: rgba(249, 248, 246, 0.72);
        font-family: "Poppins", sans-serif;
        font-size: 10px;
        letter-spacing: 0.32em;
        text-transform: uppercase;
      }
      .avf-photo-story-copy,
      .avf-film-copy {
        width: min(100% - 48px, 1320px);
        margin: 0 auto;
        padding: clamp(80px, 10vw, 140px) 0;
        display: grid;
        grid-template-columns: minmax(220px, 0.42fr) minmax(0, 0.58fr);
        gap: clamp(36px, 8vw, 120px);
        align-items: start;
      }
      .avf-photo-story-copy h2,
      .avf-film-copy h2 {
        margin: 0;
        color: rgba(34, 34, 31, 0.66);
        font-family: "Playfair Display", "Times New Roman", serif;
        font-size: clamp(3rem, 6vw, 7rem);
        font-weight: 400;
        line-height: 0.92;
        letter-spacing: -0.07em;
      }
      .avf-photo-story-copy em,
      .avf-film-copy em {
        color: #4a5d23;
        font-style: italic;
      }
      .avf-photo-story-copy p,
      .avf-film-copy p {
        margin: 0;
        color: rgba(34, 34, 31, 0.78);
        font-family: "Cormorant Garamond", serif;
        font-size: clamp(1.35rem, 2vw, 2rem);
        line-height: 1.45;
      }
      .avf-photo-story-gallery,
      .avf-film-gallery {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        grid-auto-rows: clamp(180px, 22vw, 360px);
        gap: 8px;
        background: #ffffff;
        padding: 8px;
      }
      .avf-photo-story-frame,
      .avf-film-gallery-frame {
        border: 0;
        padding: 0;
        overflow: hidden;
        background: #ffffff;
        cursor: zoom-in;
      }
      .avf-photo-story-frame.is-wide,
      .avf-film-gallery-frame.is-wide {
        grid-column: span 2;
        grid-row: span 2;
      }
      .avf-photo-story-frame img,
      .avf-film-gallery-frame img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
        transition: transform 700ms cubic-bezier(0.22, 1, 0.36, 1);
      }
      .avf-photo-story-frame:hover img,
      .avf-film-gallery-frame:hover img {
        transform: scale(1.045);
      }
      .avf-photo-story-video,
      .avf-film-story-video {
        background: #ffffff;
        padding: clamp(80px, 9vw, 130px) clamp(24px, 6vw, 96px);
      }
      .avf-youtube-video-shell {
        width: min(100%, 1180px);
        margin: 0 auto;
        aspect-ratio: 16 / 9;
        background: #11140f;
      }
      .avf-youtube-video-shell iframe {
        width: 100%;
        height: 100%;
        border: 0;
        display: block;
      }
      .avf-film-story-cta,
      .avf-photo-story-cta {
        background: #ffffff;
      }
      .avf-pre-lightbox {
        position: fixed;
        inset: 0;
        z-index: 9999;
        display: grid;
        place-items: center;
        padding: 24px;
        background: rgba(17, 20, 15, 0.86);
        opacity: 0;
        pointer-events: none;
        transition: opacity 240ms ease;
      }
      .avf-pre-lightbox.is-open {
        opacity: 1;
        pointer-events: auto;
      }
      .avf-pre-lightbox img {
        max-width: min(100%, 1280px);
        max-height: 88svh;
        object-fit: contain;
        box-shadow: 0 24px 80px rgba(0, 0, 0, 0.36);
      }
      .avf-pre-lightbox button {
        position: fixed;
        top: 22px;
        right: 22px;
        width: 44px;
        height: 44px;
        border: 0;
        border-radius: 999px;
        background: #f9f8f6;
        color: #11140f;
        font-size: 24px;
        cursor: pointer;
      }
      @media (max-width: 760px) {
        .avf-photo-story-head,
        .avf-film-head,
        .avf-photo-story-copy,
        .avf-film-copy {
          width: min(100% - 32px, 1320px);
        }
        .avf-photo-story-copy,
        .avf-film-copy {
          grid-template-columns: 1fr;
        }
        .avf-photo-story-gallery,
        .avf-film-gallery {
          grid-template-columns: repeat(2, minmax(0, 1fr));
          grid-auto-rows: clamp(150px, 48vw, 230px);
        }
      }
    </style>
  `;
}

function clientStoryCTA(copy) {
  return `
    <section class="avf-photo-story-cta">
      <div class="avf-pre-cta-inner">
        <p class="avf-pre-cta-kicker">✦ Your Story</p>
        <h2>Let's write yours<br>in <em>olive light</em>.</h2>
        <p class="avf-pre-cta-copy">${escapeHtml(copy)}</p>
        <a href="/contact-us"><span>Contact Us</span><span class="avf-pre-cta-button-icon" aria-hidden="true">↗</span></a>
        <p class="avf-pre-cta-footnote">replies within 24 hours · pan-india travel</p>
      </div>
    </section>
  `;
}

function lightboxMarkup() {
  return `
    <div class="avf-pre-lightbox" aria-hidden="true">
      <button type="button" data-lightbox-close aria-label="Close image">×</button>
      <img alt="">
    </div>
  `;
}

function renderFullPhotoStoryPage(story) {
  const article = document.querySelector('article.sections');
  if (!article) return;

  article.innerHTML = `
    ${clientStoryStyles()}
    <section class="avf-photo-story">
      <section class="avf-photo-story-hero">
        <div class="avf-photo-story-media">${renderImage(storyHeroImage(story), storyName(story))}</div>
        <div class="avf-photo-story-head">
          <a class="avf-photo-back" href="/portfolio-photo">Back</a>
          <h1 class="avf-photo-story-title">${escapeHtml(storyName(story))}</h1>
          <p class="avf-photo-story-meta">${escapeHtml([story.year || story.date, 'Client Story'].filter(Boolean).join(' · '))}</p>
        </div>
      </section>
      <section class="avf-photo-story-copy">
        <h2>The story<br><em>behind</em><br>the frames.</h2>
        <p>${escapeHtml(story.story || story.excerpt || '')}</p>
      </section>
      <section class="avf-photo-story-gallery avf-pre-collage"></section>
      <section class="avf-photo-story-video">
        <div class="avf-youtube-video-shell"></div>
      </section>
      ${clientStoryCTA('Tell us your love story and we will craft a wedding memory made just for the two of you.')}
      ${lightboxMarkup()}
    </section>
  `;
}

function renderFullFilmStoryPage(story) {
  const article = document.querySelector('article.sections');
  if (!article) return;

  article.innerHTML = `
    ${clientStoryStyles()}
    <section class="avf-film-story">
      <section class="avf-film-hero">
        <div class="avf-film-hero-media">${renderImage(storyHeroImage(story), storyName(story))}</div>
        <div class="avf-film-head">
          <a class="avf-film-back" href="/anf-films">Back</a>
          <h1 class="avf-film-big-title">${escapeHtml(storyName(story))}</h1>
          <p class="avf-film-lead">${escapeHtml([story.year || story.date, 'Film Story'].filter(Boolean).join(' · '))}</p>
        </div>
      </section>
      <section class="avf-film-copy">
        <h2>The film<br><em>inside</em><br>the story.</h2>
        <p>${escapeHtml(story.story || story.excerpt || '')}</p>
      </section>
      <section class="avf-film-gallery avf-pre-collage"></section>
      <section class="avf-film-story-video">
        <div class="avf-youtube-video-shell"></div>
      </section>
      ${clientStoryCTA('Tell us your love story and we will craft a wedding film made just for the two of you.')}
      ${lightboxMarkup()}
    </section>
  `;
}

function renderPhotoStoryDetail() {
  try {
    const slug = new URLSearchParams(currentSearch()).get('story');
    if (!slug) return;
    const story = getPhotoStories().find((item) => storySlug(item) === slug);
    if (!story) return;

    if (!document.querySelector('.avf-photo-story')) {
      renderFullPhotoStoryPage(story);
    }

    setHtml('.avf-photo-story-media', renderImage(storyHeroImage(story), storyName(story)));
    setText('.avf-photo-story-title', storyName(story));
    setText('.avf-photo-story-meta', [story?.year || story?.date, 'Client Story'].filter(Boolean).join(' · '));
    setText('.avf-photo-story-copy p', story?.story || story?.excerpt);
    renderGallery('.avf-photo-story-gallery', 'avf-photo-story-frame', story);
    renderYoutube('.avf-photo-story-video .avf-youtube-video-shell', story?.youtubeUrl);
  } catch (error) {
    console.error('[AVF CMS] Photography client page failed to render safely.', error);
  }
}

function renderFilmStoryDetail() {
  try {
    const slug = new URLSearchParams(currentSearch()).get('film');
    if (!slug) return;
    const story = getFilmStories().find((item) => storySlug(item) === slug);
    if (!story) return;

    if (!document.querySelector('.avf-film-story')) {
      renderFullFilmStoryPage(story);
    }

    setHtml('.avf-film-hero-media', renderImage(storyHeroImage(story), storyName(story)));
    setText('.avf-film-big-title', storyName(story));
    setText('.avf-film-lead', [story?.year || story?.date, 'Film Story'].filter(Boolean).join(' · '));
    setText('.avf-film-copy p', story?.story || story?.excerpt);
    renderGallery('.avf-film-gallery', 'avf-film-gallery-frame', story);
    renderYoutube('.avf-film-story-video .avf-youtube-video-shell', story?.youtubeUrl);
  } catch (error) {
    console.error('[AVF CMS] Film client page failed to render safely.', error);
  }
}

function renderTeamMembers() {
  try {
    const about = cmsState?.aboutUs || {};
    const hasAboutDocument = Boolean(about?._type || about?.title || about?.internalTitle || about?.bigTeamPhotoUrl || cmsArray(about?.members).length);
    const aboutMembers = cmsArray(about?.members).filter((member) => member?.photoUrl || member?.name);
    const members = hasAboutDocument ? aboutMembers : cmsArray(cmsState?.teamMembers).filter((member) => member?.photoUrl || member?.name);

    const publicHeading = meaningfulPublicValue(about.heading, about.title || about.internalTitle);

    setText('.avf-about-kicker', about.kicker);
    setText('.avf-about-title', publicHeading);
    setText('.avf-about-lead', about.lead);

    const grid = document.querySelector('.avf-about-grid');
    if (grid && hasAboutDocument) {
      grid.innerHTML = members.map((member) => `
        <article class="avf-about-card">
          <div class="avf-about-card__image">${renderImage(member?.photoUrl || fallbackStoryImage, member?.name || 'Team member')}</div>
          <h2>${escapeHtml(member?.name || 'Anil Video Films')}</h2>
          <p>${escapeHtml(member?.designation || '')}</p>
        </article>
      `).join('');
    } else if (grid && members.length) {
      grid.innerHTML = members.map((member) => `
        <article class="avf-about-card">
          <div class="avf-about-card__image">${renderImage(member?.photoUrl || fallbackStoryImage, member?.name || 'Team member')}</div>
          <h2>${escapeHtml(member?.name || 'Anil Video Films')}</h2>
          <p>${escapeHtml(member?.designation || '')}</p>
        </article>
      `).join('');
    }

    if (about?.bigTeamPhotoUrl) {
      document.querySelectorAll('.avf-about-team-photo img').forEach((img) => {
        img.src = about.bigTeamPhotoUrl;
      });
    }
  } catch (error) {
    console.error('[AVF CMS] About page failed to render safely.', error);
  }
}

function renderHomePageCopy() {
  const home = cmsState?.homePage;
  if (!home) return;

  setText('#photos .avf-featured-stories__heading', home.photoSectionHeading);
  setText('#films .avf-featured-stories__heading', home.filmSectionHeading);
  setText('.anilvideofilms-soul-cinema__text', home.soulCinemaText);
  setText('.anilvideofilms-studio-intro__tagline', home.aboutHeading);
  setText('.anilvideofilms-studio-intro__copy p:not(.anilvideofilms-studio-intro__eyebrow)', home.aboutCopy);

  if (home.heroImageUrl) {
    document.querySelectorAll('.avf-hero img').forEach((img) => {
      img.src = home.heroImageUrl;
    });
  }

  if (home.aboutImageLeftUrl) {
    const leftImage = document.querySelector('.anilvideofilms-studio-intro__image:first-child img');
    if (leftImage) leftImage.src = home.aboutImageLeftUrl;
  }

  if (home.aboutImageRightUrl) {
    const rightImage = document.querySelector('.anilvideofilms-studio-intro__image:last-child img');
    if (rightImage) rightImage.src = home.aboutImageRightUrl;
  }

  if (home.soulCinemaPosterUrl) {
    document.querySelectorAll('.anilvideofilms-soul-cinema__poster').forEach((img) => {
      img.src = home.soulCinemaPosterUrl;
    });
  }

  if (home.soulCinemaVideoUrl) {
    const video = document.querySelector('.anilvideofilms-soul-cinema__video');
    if (video) {
      video.innerHTML = `<source src="${escapeHtml(home.soulCinemaVideoUrl)}">`;
      if (home.soulCinemaPosterUrl) video.setAttribute('poster', home.soulCinemaPosterUrl);
      video.load();
    }
  }

  renderHomeCollage();
}

function renderPageCopy() {
  const page = getEditablePage();
  if (!page) return;

  setText('.avf-photo-archive-title', page.title);
  setText('.avf-photo-archive-lead', page.lead);
  setText('.avf-film-big-title', page.title);
  setText('.avf-film-lead', page.lead);
  setText('.avf-contact-eyebrow', page.kicker);
  setText('.avf-contact-title', page.heading || page.title);
  setText('.avf-contact-lead', page.lead);
  setText('.avf-careers-eyebrow', page.kicker);
  setText('.avf-careers-title', page.heading || page.title);
  setText('.avf-careers-lead', page.lead);
  setText('.avf-pre-eyebrow', page.kicker);
  setText('.avf-pre-title', page.heading);
  setText('.avf-pre-lead', page.lead);
  setText('.avf-pre-chapter', page.albumKicker);
  setText('.avf-pre-album-title', page.albumHeading);
  setText('.avf-pre-cta-title', page.ctaHeading);
  setText('.avf-pre-cta-copy', page.ctaText);
  setText('.avf-contact-editorial-title', page.editorialHeading);
  setText('.avf-contact-editorial-dek', page.editorialIntro);
  setText('.avf-contact-editorial-copy', page.editorialCopy);
  setText('.avf-careers-roles-head h2', page.rolesHeading);
  setText('.avf-careers-apply-copy h2', page.applyHeading);
  setText('.avf-careers-apply-copy p:first-of-type', page.applyIntro);
  setText('.avf-careers-apply-copy p:nth-of-type(2)', page.applyCopy);

  if (page.email) {
    document.querySelectorAll('.avf-contact-action-link[href^="mailto:"], .avf-careers-contact-link[href^="mailto:"], .avf-contact-detail a[href^="mailto:"]').forEach((link) => {
      link.textContent = page.email;
      link.href = `mailto:${page.email}`;
    });
  }

  if (page.phone) {
    document.querySelectorAll('.avf-contact-action-link[href^="tel:"], .avf-careers-contact-link[href^="tel:"], .avf-contact-detail a[href^="tel:"]').forEach((link) => {
      link.textContent = page.phone;
      link.href = `tel:${page.phone.replace(/\s+/g, '')}`;
    });
  }

  if (page.address) {
    const address = document.querySelector('.avf-contact-detail p');
    if (address) address.textContent = page.address;
  }

  const heroImage = page.heroImageUrl;
  if (heroImage) {
    document.querySelectorAll('.avf-photo-archive-media img, .avf-film-hero-media img, .avf-contact-hero-media img, .avf-careers-hero-media img, .avf-pre-hero-media img').forEach((img) => {
      img.src = heroImage;
    });
  }

  if (page.editorialImageUrl) {
    document.querySelectorAll('.avf-contact-editorial-image img, .avf-careers-editorial-image img').forEach((img) => {
      img.src = page.editorialImageUrl;
    });
  }

  if (page.teamImageUrl) {
    document.querySelectorAll('.avf-about-team-photo img').forEach((img) => {
      img.src = page.teamImageUrl;
    });
  }

  if (Array.isArray(page.roles) && page.roles.length) {
    const roleList = document.querySelector('.avf-careers-role-list');
    if (roleList) {
      roleList.innerHTML = page.roles.map((role) => `
        <button class="avf-careers-role" type="button" onclick="document.getElementById('careers-apply').scrollIntoView({ behavior: 'smooth', block: 'start' });">
          <div class="avf-careers-role-title">${escapeHtml(role.title || '')}</div>
          <div class="avf-careers-role-meta">
            <span>${escapeHtml(role.level || '')}</span>
            <span>${escapeHtml(role.location || '')}</span>
            <div class="avf-careers-role-cta">Apply <span aria-hidden="true">→</span></div>
          </div>
        </button>
      `).join('');
    }
  }

  renderPreWeddingCollage();
}

function renderSiteSettings() {
  const settings = cmsState?.siteSettings;
  if (!settings) return;

  const email = settings.email;
  const phone = settings.phone;
  const instagramUrl = settings.instagramUrl;
  const youtubeUrl = settings.youtubeUrl;

  if (email) {
    document.querySelectorAll('a[href^="mailto:"], .avf-footer-email').forEach((item) => {
      item.textContent = email;
      if (item.tagName === 'A') item.href = `mailto:${email}`;
    });
  }

  if (phone) {
    document.querySelectorAll('a[href^="tel:"], .avf-footer-phone').forEach((item) => {
      item.textContent = phone;
      if (item.tagName === 'A') item.href = `tel:${phone.replace(/\s+/g, '')}`;
    });
  }

  if (instagramUrl) {
    document.querySelectorAll('a[href*="instagram.com"]').forEach((link) => {
      link.href = instagramUrl;
      link.setAttribute('aria-label', settings.instagramLabel || 'Instagram');
    });
  }

  if (youtubeUrl) {
    document.querySelectorAll('a[href*="youtube.com"], a[href*="youtu.be"]').forEach((link) => {
      link.href = youtubeUrl;
      link.setAttribute('aria-label', settings.youtubeLabel || 'YouTube');
    });
  }

  if (settings.footerCopyright) {
    document.querySelectorAll('.avf-footer-copyright, .site-footer__copyright').forEach((item) => {
      item.textContent = settings.footerCopyright;
    });
  }
}

function bindCMSLightbox() {
  document.addEventListener('click', (event) => {
    const close = event.target.closest('[data-lightbox-close]');
    if (close) {
      const lightbox = close.closest('.avf-pre-lightbox, .avf-home-lightbox');
      lightbox?.classList.remove('is-open');
      lightbox?.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('avf-lightbox-open');
      return;
    }

    const trigger = event.target.closest('[data-lightbox-src]');
    if (!trigger) return;

    const lightbox = document.querySelector('.avf-pre-lightbox, .avf-home-lightbox');
    const image = lightbox?.querySelector('img');
    if (!lightbox || !image) return;

    image.src = trigger.dataset.lightboxSrc;
    image.alt = trigger.dataset.lightboxAlt || '';
    lightbox.classList.add('is-open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('avf-lightbox-open');
  }, { capture: true });
}

function bindCMSArchiveFilters() {
  document.addEventListener('click', (event) => {
    const filter = event.target.closest('.avf-photo-filter, .avf-film-filter');
    if (!filter) return;

    const isPhoto = filter.classList.contains('avf-photo-filter');
    const filterSelector = isPhoto ? '.avf-photo-filter' : '.avf-film-filter';
    const cardSelector = isPhoto ? '.avf-photo-card[data-category]' : '.avf-film-card[data-category]';
    const value = filter.dataset.filter;

    document.querySelectorAll(filterSelector).forEach((button) => {
      button.classList.toggle('is-active', button === filter);
    });

    document.querySelectorAll(cardSelector).forEach((card) => {
      card.classList.toggle('is-hidden', value !== 'All' && card.dataset.category !== value);
    });
  });
}

function applyCMSContent() {
  if (!cmsState || !Object.keys(cmsState).length) return;

  renderSiteSettings();
  renderPageCopy();
  renderHomePageCopy();
  renderHomePhotoCards();
  renderHomeFilmCards();
  renderHomeCollage();
  renderPreWeddingCollage();
  renderPhotoArchive();
  renderFilmArchive();
  renderPhotoStoryDetail();
  renderFilmStoryDetail();
  renderTeamMembers();
}

bindCMSLightbox();
bindCMSArchiveFilters();

document.addEventListener('avf:route-rendered', () => {
  loadCMS().then(() => {
    requestAnimationFrame(applyCMSContent);
    window.setTimeout(applyCMSContent, 250);
  });
});

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    loadCMS().then(() => {
      requestAnimationFrame(applyCMSContent);
      window.setTimeout(applyCMSContent, 250);
    });
  }, { once: true });
} else {
  loadCMS().then(() => {
    requestAnimationFrame(applyCMSContent);
    window.setTimeout(applyCMSContent, 250);
  });
}
