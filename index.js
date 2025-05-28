const API_KEY = 'f5922409d9c4d97a91d713bb7d2a75a9';
const BASE_URL = 'https://api.themoviedb.org/3';
const movieListEl = document.querySelector('.movie-list');

async function getMovies() {
  const response = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}`);
  const data = await response.json();
  const movies = data.results;

  movieListEl.innerHTML = movies.map(movie => `
    <div class="movie-card">
      <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" />
      <h3>${movie.title}</h3>
      <p>⭐ ${movie.vote_average}</p>
    </div>
  `).join('');
}

getMovies();
