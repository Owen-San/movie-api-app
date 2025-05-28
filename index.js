const API_KEY = 'f5922409d9c4d97a91d713bb7d2a75a9';

async function fetchMovies(query) {
  const res = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
  const data = await res.json();
  return data.results;
}
