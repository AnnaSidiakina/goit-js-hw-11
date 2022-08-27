const imagesContainer = document.querySelector('.gallery');

export default function appendImagesMarkup(hits) {
  const markup = hits
    .map(hit => {
      const {
        id,
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      } = hit;
      return `
    <a class="gallery__link" href="${largeImageURL}">
    <div class="photo-card" id=${id}>
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item likes">
      ${likes}
    </p>
    <p class="info-item views">
      ${views}
    </p>
    <p class="info-item comments">
      ${comments}
    </p>
    <p class="info-item downloads">
      ${downloads}
    </p>
  </div>
</div>
</a>`;
    })
    .join('');
  imagesContainer.insertAdjacentHTML('beforeend', markup);
}
