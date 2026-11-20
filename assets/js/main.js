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
