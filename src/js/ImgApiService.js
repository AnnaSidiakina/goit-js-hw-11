import axios from 'axios';

axios.defaults.baseURL = 'https://pixabay.com/api/';
const KEY_API = '29502904-bb8b76f5b0eb667a79f07b05e';

async function fetchImages(query, page, perPage) {
  const response = await axios
    .get(
      `?key=${KEY_API}&q=${query}&per_page=${perPage}&page=${page}&image_type="photo"&orientation="horizontal"&safesearch=true`
    )
    .then(response => {
      if (response.data.total === 0) {
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }
      console.log(response.data);
      return response.data;
    });

  return response;
}

export default fetchImages;
