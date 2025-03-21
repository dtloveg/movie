export default class ApiService {
  _apiBase = 'https://api.themoviedb.org/3/search/movie'
  apiKey = 'c31e1dbe66b5f77945e15adf0572ef6f'
  apiToken =
    'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjMzFlMWRiZTY2YjVmNzc5NDVlMTVhZGYwNTcyZWY2ZiIsIm5iZiI6MTc0MTUyMTYxOS4xMTUsInN1YiI6IjY3Y2Q4MmQzMjc5NGIwZDU5ODJhNzQ0YyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.KtWp7u-0IAlPPIqFCsKjJvmW4sAHn19JjRX-ShjMidE'

  async getMovies(url) {
    const res = await fetch(`${this._apiBase}${url}`)
    if (!res.ok) {
      throw new Error(`Could not fetch ${url}` + `, received ${res.status}`)
    }
    return await res.json()
  }

  async getDataForPage(query, page) {
    const res = await this.getMovies(`?query=${query}&api_key=${this.apiKey}&page=${page}`)
    console.log(`API response for query: ${query}, page: ${page}`, res)
    if (!res || !res.results) {
      throw new Error('Что-то пошло не так')
    }
    return {
      movies: res.results,
      totalCount: res.total_results,
    }
  }

  async getGenres() {
    const res = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${this.apiKey}`)
    if (!res.ok) {
      throw new Error(`Could not fetch genres, received ${res.status}`)
    }
    return await res.json()
  }

  async createGuestSession() {
    const res = await fetch(`https://api.themoviedb.org/3/authentication/guest_session/new?api_key=${this.apiKey}`, {
      method: 'POST',
    })
    if (!res.ok) {
      const errorMessage = await res.text()
      throw new Error(`Could not create guest session, received ${res.status}: ${errorMessage}`)
    }
    const data = await res.json()
    return data.guest_session_id
  }

  async getRatedMovies(guestSessionId, currentPage) {
    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${this.apiToken}`,
      },
    }
    const res = await fetch(
      `https://api.themoviedb.org/3/guest_session/${guestSessionId}/rated/movies?language=en-US&page=${currentPage}&sort_by=created_at.asc`,
      options
    )
    if (!res.ok) {
      throw new Error(`Could not fetch rated movies, received ${res.status}`)
    }
    return await res.json()
  }

  async rateMovie(guestSessionId, movieId, rating) {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/rating?api_key=${this.apiKey}&guest_session_id=${guestSessionId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify({ value: rating }),
      }
    )

    if (!res.ok) {
      throw new Error(`Could not rate movie, received ${res.status}`)
    }

    return await res.json()
  }
}
