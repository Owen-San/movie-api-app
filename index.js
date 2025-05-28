document.addEventListener("DOMContentLoaded", () => {
  const API_KEY = "f5922409d9c4d97a91d713bb7d2a75a9";
  const BASE_URL = "https://api.themoviedb.org/3";

  const trendingEl = document.getElementById("trending-movies");
  const popularEl = document.getElementById("popular-movies");
  const topRatedEl = document.getElementById("top-rated-movies");

  const searchInput = document.querySelector(".search-bar__input");
  const searchBtn = document.querySelector(".search-bar__btn");

  const loading = document.getElementById("loading");
  const content = document.getElementById("content");

  const searchSection = document.getElementById("search-results");
  const searchHeading = document.getElementById("search-results-heading");
  const searchResultsEl = document.getElementById("search-movie-row");
  const filterSelect = document.getElementById("search-filter");

  const backToHomeBtn = document.getElementById("back-to-home");

  let currentSearchResults = [];

  async function fetchMovies(url) {
    const res = await fetch(url);
    const data = await res.json();
    return data.results || [];
  }

  function renderMovies(movies, container) {
    container.innerHTML = movies
      .map((movie) => {
        const rating =
          typeof movie.vote_average === "number"
            ? movie.vote_average.toFixed(1)
            : "N/A";
        const poster = movie.poster_path
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          : `assets/no-img.png`;
        return `
        <a href="movie.html?id=${movie.id}" class="movie-link">
          <div class="movie-card">
            <img src="${poster}" alt="${movie.title}" />
            <h3>${movie.title}</h3>
            <p>⭐ ${rating}</p>
          </div>
        </a>
      `;
      })
      .join("");
  }

  function sortMovies(movies, type) {
    return [...movies].sort((a, b) => {
      if (type === "title") return a.title.localeCompare(b.title);
      if (type === "rating") return b.vote_average - a.vote_average;
      if (type === "date")
        return new Date(b.release_date) - new Date(a.release_date);
      return 0;
    });
  }

  function showLoading() {
    if (loading) loading.style.display = "block";
    if (content) content.style.display = "none";
    if (searchSection) searchSection.style.display = "none";
    if (backToHomeBtn) backToHomeBtn.style.display = "none";
  }

  function hideLoading() {
    setTimeout(() => {
      if (loading) loading.style.display = "none";
      const query = getQueryParam("query");
      if (query) {
        if (searchSection) searchSection.style.display = "block";
        if (backToHomeBtn) backToHomeBtn.style.display = "block";
      } else {
        if (content) content.style.display = "block";
        if (backToHomeBtn) backToHomeBtn.style.display = "none";
      }
    }, 1000);
  }

  function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }

  async function handleSearch(query) {
    if (!query) return;

    showLoading();

    const url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
      query
    )}`;
    currentSearchResults = await fetchMovies(url);

    if (searchHeading) {
      searchHeading.textContent = `🔍 Results for "${query}"`;
    }

    const sorted = sortMovies(
      currentSearchResults,
      filterSelect?.value || "title"
    );
    renderMovies(sorted, searchResultsEl);

    hideLoading();
  }

  async function loadHomeSections() {
    showLoading();

    const [trending, popular, topRated] = await Promise.all([
      fetchMovies(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}`),
      fetchMovies(`${BASE_URL}/movie/popular?api_key=${API_KEY}`),
      fetchMovies(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}`),
    ]);

    renderMovies(trending, trendingEl);
    renderMovies(popular, popularEl);
    renderMovies(topRated, topRatedEl);

    hideLoading();
  }

  function goHome() {
    window.location.href = "index.html";
  }

  searchBtn?.addEventListener("click", () => {
    const query = searchInput.value.trim();
    if (query) {
      window.location.href = `index.html?query=${encodeURIComponent(query)}`;
    }
  });

  searchInput?.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      const query = searchInput.value.trim();
      if (query) {
        window.location.href = `index.html?query=${encodeURIComponent(query)}`;
      }
    }
  });

  filterSelect?.addEventListener("change", () => {
    const sorted = sortMovies(currentSearchResults, filterSelect.value);
    renderMovies(sorted, searchResultsEl);
  });

  document.querySelectorAll(".scroll-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const rowId = btn.getAttribute("data-row");
      const direction = parseInt(btn.getAttribute("data-direction"));
      const row = document.getElementById(rowId);
      if (row) {
        row.scrollBy({
          left: direction * 300,
          behavior: "smooth",
        });
      }
    });
  });

  const query = getQueryParam("query");
  if (query) {
    searchInput.value = query;
    handleSearch(query);
  } else {
    loadHomeSections();
  }

  window.goHome = goHome;
});
