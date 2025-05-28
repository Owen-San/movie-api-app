const API_KEY = "f5922409d9c4d97a91d713bb7d2a75a9";
const BASE_URL = "https://api.themoviedb.org/3";

const movieListEl =
  document.querySelector(".movie-list") ||
  document.getElementById("movie-results");
const searchInput = document.querySelector(".movie__search");
const searchBtn = document.querySelector(".search__btn");

async function getPopularMovies() {
  showLoading();
  await delay(1000);
  const res = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}`);
  const data = await res.json();
  hideLoading();
  displayMovies(data.results);
}

async function searchMovies(query) {
  if (!query) return getPopularMovies();

  showLoading();
  await delay(1000);
  const res = await fetch(
    `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
      query
    )}`
  );
  const data = await res.json();
  hideLoading();
  displayMovies(data.results);
}

function displayMovies(movies) {
  movieListEl.innerHTML = movies
    .map(
      (movie) => `
      <a href="movie.html?id=${movie.id}" class="movie-link">
        <div class="movie-card">
          <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${
        movie.title
      }" />
          <h3>${movie.title}</h3>
          <p>⭐ ${movie.vote_average.toFixed(1)}</p>
        </div>
      </a>
    `
    )
    .join("");
}

searchBtn.addEventListener("click", () => {
  const query = searchInput.value.trim();
  searchMovies(query);
});

searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const query = searchInput.value.trim();
    searchMovies(query);
  }
});

function showLoading() {
  document.getElementById("loading").style.display = "block";
  movieListEl.innerHTML = "";
}

function hideLoading() {
  document.getElementById("loading").style.display = "none";
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

getPopularMovies();
