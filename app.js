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
let isPagedCarouselMode = isPagedCarouselLayout(layoutMode);
let isSmallCarouselMode = isSmallCarouselLayout(layoutMode);
let isSmallArticleView = false;

function getLayoutMode() {
  const width = layoutContainer.clientWidth;

  if (width <= 412) {
    return 'mobile';
  }

  if (width < 600) {
    return 'compact-1';
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

function isPagedCarouselLayout(mode) {
  return mode === 'mobile';
}

function isSmallCarouselLayout(mode) {
  return mode === 'compact-1' || mode === 'tablet-1';
}

function getInitialCardCount() {
  const width = layoutContainer.clientWidth;

  if (width < 600) {
    return 1;
  }

  if (width >= 1044 && width < 1120) {
    return 3;
  }

  if (width < 1120) {
    const availableWidth = width - 380;
    return Math.max(1, Math.min(4, Math.floor((availableWidth + 8) / 168)));
  }

  return 3;
}

function getExpandedCardCount() {
  const width = layoutContainer.clientWidth;
  return Math.max(2, Math.min(3, Math.floor((width - 40) / 168)));
}

function updateCardCounts() {
  banner.dataset.initialCards = String(getInitialCardCount());
  banner.dataset.expandedCards = String(getExpandedCardCount());
}

banner.dataset.layout = layoutMode;
updateCardCounts();

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
  const firstCard = track.querySelector('.article-card');
  const cardWidth = firstCard ? firstCard.getBoundingClientRect().width : 160;
  const cardGap = Number.parseFloat(getComputedStyle(track).gap) || 12;
  const visibleCards = Math.max(1, Math.round((desktopViewport.clientWidth + cardGap) / (cardWidth + cardGap)));
  return Math.max(0, articles.length - visibleCards);
}

function getDesktopStep() {
  const firstCard = track.querySelector('.article-card');
  const cardWidth = firstCard ? firstCard.getBoundingClientRect().width : 160;
  const cardGap = Number.parseFloat(getComputedStyle(track).gap) || 12;
  return cardWidth + cardGap;
}

function updateDesktopControls() {
  previousButton.disabled = desktopIndex === 0;
  nextButton.disabled = desktopIndex === getMaxDesktopIndex();
}

function getMobilePageStart() {
  // Setelah state pembuka, artikel selalu tampil berpasangan: 1–2 hingga 9–10.
  return mobilePageIndex * 2;
}

function getMobilePageStep() {
  const firstCard = mobilePageTrack.querySelector('.article-card');
  const cardWidth = firstCard ? firstCard.getBoundingClientRect().width : 156;
  const cardGap = Number.parseFloat(getComputedStyle(mobilePageTrack).gap) || 8;
  return cardWidth + cardGap;
}

function updateMobileCarousel() {
  const isArticlePageVisible = mobilePageIndex >= 0;
  bannerContent.classList.toggle('is-page-view', isArticlePageVisible);
  mobilePageTrack.style.transform = isArticlePageVisible
    ? `translateX(-${getMobilePageStart() * getMobilePageStep()}px)`
    : 'translateX(0)';
  mobilePagePreviousButton.disabled = !isArticlePageVisible;
  mobilePageNextButton.disabled = mobilePageIndex === 4;
  previousButton.disabled = !isArticlePageVisible;
  nextButton.disabled = mobilePageIndex === 4;
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

function getSmallCarouselStep() {
  return 1;
}

function getMaxSmallCarouselIndex() {
  const visibleCards = Number.parseInt(banner.dataset.expandedCards, 10) || 2;
  return Math.max(0, articles.length - visibleCards);
}

function keepsHeroWithTwoCards() {
  return isSmallCarouselMode && getInitialCardCount() >= 2;
}

function getMaxHeroTwoCardIndex() {
  return Math.max(0, articles.length - getInitialCardCount());
}

function showNextHeroTwoCards() {
  const maxIndex = getMaxHeroTwoCardIndex();

  if (desktopIndex < maxIndex) {
    desktopIndex = Math.min(desktopIndex + 2, maxIndex);
    updateCarousel();
  }
}

function showPreviousHeroTwoCards() {
  if (desktopIndex > 0) {
    desktopIndex = Math.max(0, desktopIndex - 2);
    updateCarousel();
  }
}

function showNextSmallArticle() {
  if (keepsHeroWithTwoCards()) {
    showNextHeroTwoCards();
    return;
  }

  if (!isSmallArticleView) {
    isSmallArticleView = true;
    desktopIndex = 0;
    updateCarousel();
    return;
  }

  const maxIndex = getMaxSmallCarouselIndex();
  if (desktopIndex < maxIndex) {
    desktopIndex = Math.min(desktopIndex + getSmallCarouselStep(), maxIndex);
    updateCarousel();
  }
}

function showPreviousSmallArticle() {
  if (keepsHeroWithTwoCards()) {
    showPreviousHeroTwoCards();
    return;
  }

  if (!isSmallArticleView) {
    return;
  }

  if (desktopIndex === 0) {
    isSmallArticleView = false;
    desktopIndex = 0;
    updateCarousel();
    return;
  }

  const maxIndex = getMaxSmallCarouselIndex();
  const step = getSmallCarouselStep();
  desktopIndex = desktopIndex === maxIndex
    ? Math.floor((maxIndex - 1) / step) * step
    : Math.max(0, desktopIndex - step);
  updateCarousel();
}

function updateSmallCarouselControls() {
  previousButton.disabled = !isSmallArticleView;
  nextButton.disabled = isSmallArticleView && desktopIndex === getMaxSmallCarouselIndex();
}

function updateHeroTwoCardControls() {
  previousButton.disabled = desktopIndex === 0;
  nextButton.disabled = desktopIndex === getMaxHeroTwoCardIndex();
}

function updateCarousel() {
  if (isPagedCarouselMode) {
    track.style.transform = 'translateX(0)';
    updateMobileCarousel();
    return;
  }

  bannerContent.classList.remove('is-page-view', 'is-dragging');
  mobilePageTrack.style.transform = 'translateX(0)';

  if (isSmallCarouselMode) {
    const keepHero = keepsHeroWithTwoCards();
    bannerContent.classList.toggle('is-small-carousel-view', !keepHero && isSmallArticleView);
    track.style.transform = `translateX(-${desktopIndex * getDesktopStep()}px)`;

    if (keepHero) {
      updateHeroTwoCardControls();
    } else {
      updateSmallCarouselControls();
    }
    return;
  }

  bannerContent.classList.remove('is-small-carousel-view', 'is-tablet-carousel-view');
  track.style.transform = `translateX(-${desktopIndex * getDesktopStep()}px)`;
  updateDesktopControls();
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
  if ((!isPagedCarouselMode && !isSmallCarouselMode) || Math.abs(deltaX) < 28 || Math.abs(deltaX) <= Math.abs(deltaY)) {
    return;
  }

  if (isSmallCarouselMode) {
    if (deltaX < 0) {
      showNextSmallArticle();
    } else {
      showPreviousSmallArticle();
    }
    return;
  }

  if (deltaX < 0) {
    showNextMobilePage();
  } else {
    showPreviousMobilePage();
  }
}

function handleCarouselKeys(event) {
  if (isPagedCarouselMode) {
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

  if (isSmallCarouselMode) {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      showNextSmallArticle();
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      showPreviousSmallArticle();
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

nextButton.addEventListener('click', () => {
  if (isPagedCarouselMode) {
    showNextMobilePage();
    return;
  }

  if (isSmallCarouselMode) {
    showNextSmallArticle();
    return;
  }

  showNextDesktopArticle();
});

previousButton.addEventListener('click', () => {
  if (isPagedCarouselMode) {
    showPreviousMobilePage();
    return;
  }

  if (isSmallCarouselMode) {
    showPreviousSmallArticle();
    return;
  }

  showPreviousDesktopArticle();
});
mobilePageNextButton.addEventListener('click', showNextMobilePage);
mobilePagePreviousButton.addEventListener('click', showPreviousMobilePage);
desktopViewport.addEventListener('keydown', handleCarouselKeys);
mobilePageViewport.addEventListener('keydown', handleCarouselKeys);

bannerContent.addEventListener('touchstart', (event) => {
  if (!isPagedCarouselMode && !isSmallCarouselMode) {
    return;
  }

  const [touch] = event.touches;
  swipeStartX = touch.clientX;
  swipeStartY = touch.clientY;
  isDragging = true;
  bannerContent.classList.add('is-dragging');
}, { passive: true });

bannerContent.addEventListener('touchend', (event) => {
  if ((!isPagedCarouselMode && !isSmallCarouselMode) || !isDragging) {
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
  const nextPagedCarouselMode = isPagedCarouselLayout(nextLayoutMode);
  const nextSmallCarouselMode = isSmallCarouselLayout(nextLayoutMode);
  const nextInitialCardCount = getInitialCardCount();
  const initialCardCountChanged = Number.parseInt(banner.dataset.initialCards, 10) !== nextInitialCardCount;

  if (nextPagedCarouselMode !== isPagedCarouselMode || nextSmallCarouselMode !== isSmallCarouselMode || initialCardCountChanged) {
    desktopIndex = 0;
    mobilePageIndex = -1;
    isSmallArticleView = false;
  }

  layoutMode = nextLayoutMode;
  isPagedCarouselMode = nextPagedCarouselMode;
  isSmallCarouselMode = nextSmallCarouselMode;
  banner.dataset.layout = layoutMode;
  updateCardCounts();
  updateCarousel();
}

const layoutObserver = new ResizeObserver(syncResponsiveLayout);
layoutObserver.observe(layoutContainer);
window.addEventListener('resize', syncResponsiveLayout);
updateCarousel();
