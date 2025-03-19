export default class ApiService {
  _apiBase = 'https://api.themoviedb.org/3/search/movie'
  apiKey = 'c31e1dbe66b5f77945e15adf0572ef6f'

  async getMovies(url) {
    const res = await fetch(`${this._apiBase}${url}`)
    if (!res.ok) {
      throw new Error(`Could not fetch ${url}` + `, received ${res.status}`)
    }
    return await res.json()
  }
  async getMovie(query) {
    const res = await this.getMovies(`?query=${query}&api_key=${this.apiKey}`)
    if (!res || !res.results || res.results.length === 0) {
      throw new Error('Фильмы не найдены')
    }
    return res.results.filter((movie) => movie.title.toLowerCase().includes(query.toLowerCase()))
  }

  async getPages(query) {
    const res = await this.getMovies(`?query=${query}&api_key=${this.apiKey}`)
    return res.total_pages
  }

  async getDataForPage(query, page) {
    const res = await this.getMovies(`?query=${query}&api_key=${this.apiKey}&page=${page}`)
    if (!res || !res.results) {
      throw new Error('Что-то пошло не так')
    }
    return res.results
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

  async getMovieRatings(guestSessionId, movieId) {
    const res = await this.fetchJson(
      `${this._apiBase}/movie/${movieId}/rating?api_key=${this.apiKey}&guest_session_id=${guestSessionId}`
    )
    return res
  }

  async rateMovie(guestSessionId, movieId, rating) {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/rating?api_key=${this.apiKey}&guest_session_id=${guestSessionId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
