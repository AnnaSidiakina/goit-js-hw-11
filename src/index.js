import './css/slyles.css';
import fetchImages from './js/ImgApiService';
import appendImagesMarkup from './js/renderImages';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  searchForm: document.querySelector('#search-form'),
  imagesContainer: document.querySelector('.gallery'),
  infiniteScroll: document.querySelector('.more'),
  loadMoreBtn: document.querySelector('.load-more'),
  mybutton: document.getElementById('myBtn'),
};

const observer = new IntersectionObserver(onLoadMore, {
  root: null,
  rootMargin: '300px',
  treshold: 1,
});

refs.searchForm.addEventListener('submit', onSearch);
refs.mybutton.addEventListener('click', topFunction);
// refs.loadMoreBtn.addEventListener('click', onLoadMore);

let simplelightbox = null;
let page = 1;
let query = '';
const perPage = 40;
let fetchedAll = false;

function onSearch(event) {
  event.preventDefault();

  page = 1;
  query = event.currentTarget.searchQuery.value.trim();

  observer.unobserve(refs.infiniteScroll);
  clearImagesContainer();

  //   refs.loadMoreBtn.classList.add('is-hidden');

  if ('' === query) {
    Notify.warning('No empty search');
    return;
  }

  fetchImages(query, page, perPage)
    .then(data => {
      appendImagesMarkup(data.hits);
      simplelightbox = new SimpleLightbox('.gallery a').refresh();
      Notify.success(`Hooray! We found ${data.totalHits} images.`);
      observer.observe(refs.infiniteScroll);
    })
    // if (data.totalHits > perPage) {
    //   refs.loadMoreBtn.classList.remove('is-hidden');
    // }

    .catch(error => {
      Notify.failure('Oooops, something went wrong, try again');
    });
}

async function onLoadMore(data) {
  if (data[0].isIntersecting) {
    if (fetchedAll) {
      Notify.info(
        "We are sorry, but you've reached the end of search results."
      );
      observer.unobserve(refs.infiniteScroll);
      return;
    }

    page += 1;

    await fetchImages(query, page, perPage)
      .then(data => {
        appendImagesMarkup(data.hits);
        simplelightbox = new SimpleLightbox('.gallery a').refresh();

        const fetchedImages = (page - 1) * perPage + data.hits.length;
        if (fetchedImages >= data.totalHits) {
          fetchedAll = true;
        }
        console.log(fetchedAll);
      })
      .catch(error => {
        console.log(error);
        Notify.failure('Oooops, something went wrong, try again');
      });
    simplelightbox.refresh();
  }
}

function clearImagesContainer() {
  refs.imagesContainer.innerHTML = '';
}

// On top button

window.onscroll = function () {
  scrollFunction();
};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    refs.mybutton.style.display = 'block';
  } else {
    refs.mybutton.style.display = 'none';
  }
}

function topFunction() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}
