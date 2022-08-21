import { Notify } from 'notiflix/build/notiflix-notify-aio';
import getPhoto from './getPhoto';
import createList from './createList';

const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loadMore = document.querySelector('.load-more');

form.addEventListener ('submit', onSearchBtn)
loadMore.addEventListener('click', onLoadMoreBtn);

let value = null;
let stepPage = 1;

loadMore.classList.add('is-hidden');

function  onSearchBtn (e)  {
    e.preventDefault();
    value = e.target.searchQuery.value.toLowerCase().trim();
    
    if (!value) {
        gallery.innerHTML = '';
        loadMore.classList.add('is-hidden');
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        return;
      } else {
        gallery.innerHTML = '';

        getPhoto(value, stepPage)
          .then(notifyInfo)
          .catch(error => console.log(error));
      }
    }

    async function onLoadMoreBtn() {
      stepPage += 1;
      getPhoto(value, stepPage)
        .then(data => addList(data, stepPage))
        .catch(error => console.log(error));
    }

    function addList(response, step) {
      const dataTotalPhoto = response.data.totalHits;
      const dataPhoto = response.data.hits;
      const totalPages = dataTotalPhoto / 40;
    
      if (step > totalPages) {
        loadMore.classList.add('is-hidden');
        Notify.failure(
          "We're sorry, but you've reached the end of search results."
        );
      }
      createList(dataPhoto);
    }


function notifyInfo(response) {
    const dataHits = response.data.hits;
    const totalHits = response.data.totalHits;
    addLoadMore(response);
  
    if (dataHits.length !== 0) {
      Notify.info(`Hooray! We found ${totalHits} images.`);
      
      createList(dataHits);
      loadMore.classList.remove('is-hidden');
    } else {
      gallery.innerHTML = '';
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
  }

  function addLoadMore(response) {
    const photoPerPage = 40;
    const dataTotalHits = response.data.totalHits;
  
    if (dataTotalHits > photoPerPage) {
      loadMore.classList.remove('is-hidden');
    } else {
      loadMore.classList.add('is-hidden');
      Notify.failure(
        "We're sorry, but you've reached the end of search results."
      );
    }
  }