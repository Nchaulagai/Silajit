import { products } from './products.js';

const productGrid = document.querySelector('#product-grid');

if (productGrid) {
  productGrid.innerHTML = products.map((product) => `
    <article class="product-card">
      <div class="product-photo-scene">
        <img class="product-photo" src="${product.image}" alt="${product.imageAlt}" width="${product.imageWidth}" height="${product.imageHeight}" loading="lazy" decoding="async">
      </div>
      <div class="product-info">
        <div class="weight">${product.weight} · ${product.number}</div>
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <a class="product-link" href="https://wa.me/971555472170?text=${encodeURIComponent(product.enquiry)}" target="_blank" rel="noopener">Enquire about ${product.weight.replace('grams', 'g')} <span aria-hidden="true">↗</span></a>
      </div>
    </article>
  `).join('');
}

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reduceMotion) {
  document.querySelectorAll('.product-photo-scene').forEach((scene) => {
    const photo = scene.querySelector('.product-photo');
    scene.addEventListener('pointermove', (event) => {
      if (event.pointerType !== 'mouse') return;
      const bounds = scene.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      photo.style.setProperty('--photo-tilt-x', `${-y * 8}deg`);
      photo.style.setProperty('--photo-tilt-y', `${x * 11}deg`);
    });
    scene.addEventListener('pointerleave', () => {
      photo.style.setProperty('--photo-tilt-x', '0deg');
      photo.style.setProperty('--photo-tilt-y', '0deg');
    });
  });
}

// Toggle the compact navigation on small screens.
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('#primary-navigation');

if (navToggle && navLinks) {
  const closeNav = () => {
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open navigation menu');
    navLinks.classList.remove('is-open');
  };

  navToggle.addEventListener('click', () => {
    const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'Open navigation menu' : 'Close navigation menu');
    navLinks.classList.toggle('is-open', !isOpen);
  });

  navLinks.addEventListener('click', (event) => {
    if (event.target.closest('a')) closeNav();
  });

  document.addEventListener('click', (event) => {
    if (!navLinks.contains(event.target) && !navToggle.contains(event.target)) closeNav();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeNav();
  });
}

// Native modal dialog provides focus management and Escape-key support.
const imageViewer = document.createElement('dialog');
imageViewer.className = 'image-viewer';
imageViewer.setAttribute('aria-label', 'Expanded image');
imageViewer.innerHTML = '<button class="image-viewer-close" type="button" aria-label="Close image">&times;</button><img class="image-viewer-content" alt=""><p class="image-viewer-caption"></p>';
document.body.append(imageViewer);

const viewerImage = imageViewer.querySelector('.image-viewer-content');
const viewerCaption = imageViewer.querySelector('.image-viewer-caption');
const closeViewer = () => {
  if (imageViewer.open) imageViewer.close();
};

imageViewer.querySelector('.image-viewer-close').addEventListener('click', closeViewer);
imageViewer.addEventListener('click', (event) => {
  if (event.target === imageViewer) closeViewer();
});

document.querySelectorAll('.image-gallery img, .product-photo').forEach((image) => {
  image.tabIndex = 0;
  image.setAttribute('role', 'button');
  image.setAttribute('aria-label', `Enlarge image: ${image.alt}`);
  image.setAttribute('aria-haspopup', 'dialog');
  image.draggable = false;

  const openViewer = () => {
    if (!image.complete || !image.naturalWidth) return;
    viewerImage.src = image.currentSrc || image.src;
    viewerImage.alt = image.alt;
    viewerCaption.textContent = image.closest('figure')?.querySelector('figcaption')?.textContent || image.alt;
    imageViewer.showModal();
  };

  image.addEventListener('click', openViewer);
  image.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openViewer();
    }
  });
});
