const API_KEY = "f5922409d9c4d97a91d713bb7d2a75a9";
const BASE_URL = "https://api.themoviedb.org/3";

const movieDetailsEl = document.getElementById("movie-details");
const trailerContainer = document.getElementById("trailer-container");

const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get("id");

async function getMovieDetails(id) {
  const res = await fetch(
    `${BASE_URL}/movie/${id}?api_key=${API_KEY}&append_to_response=videos`
  );
  const data = await res.json();
  displayMovieDetails(data);
  displayTrailer(data.videos.results);
}

function displayMovieDetails(movie) {
  movieDetailsEl.innerHTML = `
    <h1>${movie.title}</h1>
    <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${
    movie.title
  }" />
    <p><strong>Overview:</strong> ${movie.overview}</p>
    <p><strong>Release Date:</strong> ${movie.release_date}</p>
    <p><strong>Rating:</strong> ⭐ ${movie.vote_average.toFixed(1)}</p>
    <p><strong>Genres:</strong> ${movie.genres
      .map((g) => g.name)
      .join(", ")}</p>
  `;
}

function goHome() {
  window.location.href = "index.html";
}

function displayTrailer(videos) {
  const trailer = videos.find(
    (video) => video.type === "Trailer" && video.site === "YouTube"
  );
  if (trailer) {
    trailerContainer.innerHTML = `
      <h2>Watch Trailer</h2>
      <iframe 
        width="100%" 
        height="400" 
        src="https://www.youtube-nocookie.com/embed/${trailer.key}?rel=0&modestbranding=1" 
        frameborder="0" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
        allowfullscreen
        loading="lazy">
      </iframe>
    `;
  } else {
    trailerContainer.innerHTML = `<p>No trailer found.</p>`;
  }
}

getMovieDetails(movieId);
