const articles = [
  {
    image: './Assets/article-01.png',
    title: 'Disambut Gibran Pakai Peci, Prabowo Kembali ke Indonesia Usai Lawatan dari India',
  },
  {
    image: './Assets/article-02.png',
    title: 'Disambut Gibran, Prabowo Tiba di Tanah Air Usai Hadiri KTT BRICS 2026',
  },
  {
    image: './Assets/article-03.png',
    title: 'Minta Maaf, Gibran Besuk Korban Keracunan MBG di Karo',
  },
  {
    image: './Assets/article-01.png',
    title: 'Gibran Kunjungi Korban Keracunan MBG di Karo: Atas Nama Pemerintah Saya Mohon Maaf',
  },
  {
    image: './Assets/article-02.png',
    title: 'Gibran Jenguk Korban Keracunan MBG di Karo, Janji Evaluasi Program',
  },
  {
    image: './Assets/article-03.png',
    title: 'Saat Wapres Gibran Jenguk Siswa Korban Keracunan MBG di Karo, Minta Maaf Atas Nama Pemerintah',
  },
  {
    image: './Assets/article-01.png',
    title: 'Wapres Gibran Kunjungi Korban Keracunan MBG di Karo',
  },
  {
    image: './Assets/article-02.png',
    title: 'Dugaan Keracunan MBG di Karo, Gibran: Semua Biaya Pengobatan Kami Tanggung',
  },
  {
    image: './Assets/article-03.png',
    title: 'Wapres Gibran Kunjungi Karo, Jenguk Korban Dugaan Keracunan MBG',
  },
  {
    image: './Assets/article-01.png',
    title: 'Wapres Gibran Pastikan Korban Keracunan MBG di Karo Dapat Perawatan Terbaik dan Biaya Ditanggung Pemerintah',
  },
];

const bannerContent = document.querySelector('#banner-content');
const banner = document.querySelector('.anniversary-banner');
const layoutContainer = document.querySelector('.widget-preview');
const track = document.querySelector('#article-track');
const mobilePageTrack = document.querySelector('#mobile-page-track');
const nextButton = document.querySelector('.carousel-next');
const previousButton = document.querySelector('.carousel-previous');
const mobilePageNextButton = document.querySelector('.mobile-page-next');
const mobilePagePreviousButton = document.querySelector('.mobile-page-previous');
const desktopViewport = document.querySelector('.article-viewport');
const mobilePageViewport = document.querySelector('.mobile-page-viewport');
let desktopIndex = 0;
let mobilePageIndex = -1;
let swipeStartX = 0;
let swipeStartY = 0;
let isDragging = false;
let layoutMode = getLayoutMode();
let isMobileMode = layoutMode === 'mobile';

function getLayoutMode() {
  const width = layoutContainer.clientWidth;

  if (width < 600) {
    return 'mobile';
  }

  if (width < 720) {
    return 'tablet-1';
  }

  if (width < 900) {
    return 'tablet-2';
  }

  if (width < 1120) {
    return 'tablet-3';
  }

  return 'desktop';
}

banner.dataset.layout = layoutMode;

function createArticleCard(article) {
  const card = document.createElement('a');
  card.className = 'article-card';
  card.href = '#';
  card.setAttribute('aria-label', article.title);

  const image = document.createElement('img');
  image.className = 'article-image';
  image.src = article.image;
  image.alt = '';

  const title = document.createElement('p');
  title.className = 'article-title';
  title.textContent = article.title;

  card.append(image, title);
  return card;
}

articles.forEach((article) => track.append(createArticleCard(article)));
articles.forEach((article) => mobilePageTrack.append(createArticleCard(article)));

function getMaxDesktopIndex() {
  const cardWidth = 160;
  const cardGap = 12;
  const visibleCards = Math.max(1, Math.floor((desktopViewport.clientWidth + cardGap) / (cardWidth + cardGap)));
  return Math.max(0, articles.length - visibleCards);
}

function updateDesktopControls() {
  previousButton.disabled = desktopIndex === 0;
  nextButton.disabled = desktopIndex === getMaxDesktopIndex();
}

function getMobilePageStart() {
  // Setelah state pembuka, artikel selalu tampil berpasangan: 1–2 hingga 9–10.
  return mobilePageIndex * 2;
}

function updateMobileCarousel() {
  const isArticlePageVisible = mobilePageIndex >= 0;
  bannerContent.classList.toggle('is-page-view', isArticlePageVisible);
  mobilePageTrack.style.transform = isArticlePageVisible
    ? `translateX(-${getMobilePageStart() * 164}px)`
    : 'translateX(0)';
  mobilePagePreviousButton.disabled = !isArticlePageVisible;
  mobilePageNextButton.disabled = mobilePageIndex === 4;
}

function updateCarousel() {
  if (isMobileMode) {
    track.style.transform = 'translateX(0)';
    updateMobileCarousel();
    return;
  }

  bannerContent.classList.remove('is-page-view', 'is-dragging');
  mobilePageTrack.style.transform = 'translateX(0)';
  track.style.transform = `translateX(-${desktopIndex * 172}px)`;
  updateDesktopControls();
}

function showNextDesktopArticle() {
  if (desktopIndex < getMaxDesktopIndex()) {
    desktopIndex += 1;
    updateCarousel();
  }
}

function showPreviousDesktopArticle() {
  if (desktopIndex > 0) {
    desktopIndex -= 1;
    updateCarousel();
  }
}

function showNextMobilePage() {
  if (mobilePageIndex < 4) {
    mobilePageIndex += 1;
    updateCarousel();
  }
}

function showPreviousMobilePage() {
  if (mobilePageIndex >= 0) {
    mobilePageIndex -= 1;
    updateCarousel();
  }
}

function handleMobileSwipe(deltaX, deltaY) {
  if (!isMobileMode || Math.abs(deltaX) < 28 || Math.abs(deltaX) <= Math.abs(deltaY)) {
    return;
  }

  if (deltaX < 0) {
    showNextMobilePage();
  } else {
    showPreviousMobilePage();
  }
}

function handleCarouselKeys(event) {
  if (isMobileMode) {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      showNextMobilePage();
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      showPreviousMobilePage();
    }
    return;
  }

  if (event.key === 'ArrowRight') {
    event.preventDefault();
    showNextDesktopArticle();
  }

  if (event.key === 'ArrowLeft') {
    event.preventDefault();
    showPreviousDesktopArticle();
  }
}

nextButton.addEventListener('click', showNextDesktopArticle);
previousButton.addEventListener('click', showPreviousDesktopArticle);
mobilePageNextButton.addEventListener('click', showNextMobilePage);
mobilePagePreviousButton.addEventListener('click', showPreviousMobilePage);
desktopViewport.addEventListener('keydown', handleCarouselKeys);
mobilePageViewport.addEventListener('keydown', handleCarouselKeys);

bannerContent.addEventListener('touchstart', (event) => {
  if (!isMobileMode) {
    return;
  }

  const [touch] = event.touches;
  swipeStartX = touch.clientX;
  swipeStartY = touch.clientY;
  isDragging = true;
  bannerContent.classList.add('is-dragging');
}, { passive: true });

bannerContent.addEventListener('touchend', (event) => {
  if (!isMobileMode || !isDragging) {
    return;
  }

  const [touch] = event.changedTouches;
  isDragging = false;
  bannerContent.classList.remove('is-dragging');
  handleMobileSwipe(touch.clientX - swipeStartX, touch.clientY - swipeStartY);
}, { passive: true });

bannerContent.addEventListener('touchcancel', () => {
  isDragging = false;
  bannerContent.classList.remove('is-dragging');
}, { passive: true });

function syncResponsiveLayout() {
  const nextLayoutMode = getLayoutMode();
  const nextMobileMode = nextLayoutMode === 'mobile';

  if (nextMobileMode !== isMobileMode) {
    desktopIndex = 0;
    mobilePageIndex = -1;
  }

  layoutMode = nextLayoutMode;
  isMobileMode = nextMobileMode;
  banner.dataset.layout = layoutMode;
  updateCarousel();
}

const layoutObserver = new ResizeObserver(syncResponsiveLayout);
layoutObserver.observe(layoutContainer);
window.addEventListener('resize', syncResponsiveLayout);
updateCarousel();
