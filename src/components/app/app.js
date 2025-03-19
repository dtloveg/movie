import React, { Component } from 'react'
import 'antd/dist/reset.css'
import { Spin, Alert } from 'antd'

import CardList from '../card-list'
import Header from '../header'
import Paginations from '../pagination'
import ApiService from '../../services/api-service'

export default class App extends Component {
  state = {
    query: '',
    currentPage: 1,
    totalPages: 0,
    loading: false,
    movies: [],
    genres: [],
    error: false,
    noResults: false,
    ratedMovies: {},
    activeTab: '1',
    guestSessionId: null,
  }

  apiService = new ApiService()

  async componentDidMount() {
    try {
      const genresData = await this.apiService.getGenres()
      this.setState({ genres: genresData.genres })
      const guestSessionId = await this.apiService.createGuestSession()
      this.setState({ guestSessionId })
      this.loadRatedMovies()
    } catch (error) {
      console.error('Error fetching genres or creating guest session:', error)
    }
  }

  loadRatedMovies = () => {
    const ratedMovies = JSON.parse(localStorage.getItem('ratedMovies')) || {}
    this.setState({ ratedMovies })
  }

  handleQueryChange = async (query) => {
    this.setState({ query, currentPage: 1, noResults: false })
    await this.fetchTotalPages(query)
    await this.fetchMovies(query, 1)
  }

  fetchTotalPages = async (query) => {
    if (!query.trim()) {
      this.setState({ totalPages: 0 })
      return
    }
    try {
      const totalPages = await this.apiService.getPages(query)
      this.setState({ totalPages })
      console.log(totalPages)
    } catch (error) {
      console.error('Error fetching total pages:', error)
    }
  }

  handlePageChange = async (page) => {
    this.setState({ currentPage: page, loading: true, noResults: false })
    await this.fetchMovies(this.state.query, page)
  }

  fetchMovies = async (query, page) => {
    if (!query.trim()) {
      this.setState({ movies: [], loading: false, totalPages: 0 })
      return
    }
    this.setState({ loading: true })
    try {
      const movies = await this.apiService.getDataForPage(query, page)
      if (movies.length === 0) {
        this.setState({ movies: [], noResults: true, loading: false })
      } else {
        const moviesWithRatings = movies.map((movie) => ({
          ...movie,
          rating: this.state.ratedMovies[movie.id] || 0,
        }))
        this.setState({ movies: moviesWithRatings, loading: false, error: false, noResults: false })
      }
    } catch {
      this.setState({ loading: false, error: true })
    }
  }
  handleTabChange = (key) => {
    this.setState({ activeTab: key, currentPage: 1 })
  }

  handleRateChange = async (movieId, rating) => {
    const movieData = this.state.movies.find((movie) => movie.id === movieId)

    if (movieData) {
      const newRatedMovies = {
        ...this.state.ratedMovies,
        [movieId]: rating,
      }

      const movieToStore = {
        id: movieData.id,
        title: movieData.title,
        poster_path: movieData.poster_path,
        release_date: movieData.release_date,
        genre_ids: movieData.genre_ids,
        overview: movieData.overview,
        vote_average: movieData.vote_average,
        rating: rating,
      }

      localStorage.setItem('ratedMovies', JSON.stringify(newRatedMovies))
      localStorage.setItem(`movie_${movieId}`, JSON.stringify(movieToStore))

      this.setState({ ratedMovies: newRatedMovies })

      if (this.state.guestSessionId) {
        try {
          await this.apiService.rateMovie(this.state.guestSessionId, movieId, rating)
        } catch (error) {
          console.error('Error sending rating:', error)
        }
      }
    }
  }

  getCurrentMovies = () => {
    const { activeTab, ratedMovies, movies, currentPage } = this.state
    const moviesPerPage = 20

    if (activeTab === '1') {
      return movies.slice((currentPage - 1) * moviesPerPage, currentPage * moviesPerPage)
    } else {
      const ratedMoviesArray = Object.keys(ratedMovies)
        .map((id) => {
          const movie = JSON.parse(localStorage.getItem(`movie_${id}`))
          return movie ? { ...movie, rating: ratedMovies[id] } : null
        })
        .filter((movie) => movie !== null)

      return ratedMoviesArray.slice((currentPage - 1) * moviesPerPage, currentPage * moviesPerPage)
    }
  }

  render() {
    const { currentPage, loading, error, noResults, ratedMovies, activeTab } = this.state

    const moviesToDisplay = this.getCurrentMovies()
    const totalMoviesCount = activeTab === '1' ? this.state.totalPages : Object.keys(ratedMovies).length / 20
    const totalPagesToShow = Math.ceil(totalMoviesCount)

    return (
      <>
        <Header onQueryChange={this.handleQueryChange} onTabChange={this.handleTabChange} />
        {loading && (
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Spin size="large" />
          </div>
        )}
        {error && (
          <Alert
            type="error"
            message={'Увы, не удалось произвести поиск. Попробуйте снова'}
            style={{ maxWidth: '1010px', margin: '20px auto' }}
          />
        )}
        {noResults && (
          <Alert
            type="info"
            message={'Увы, по Вашему запросу ничего не найдено. Попробуйте изменить запрос.'}
            style={{ maxWidth: '1010px', textAlign: 'center' }}
          />
        )}
        <CardList
          movies={moviesToDisplay}
          loading={loading}
          error={error}
          onRateChange={this.handleRateChange}
          ratedMovies={ratedMovies}
        />
        {totalPagesToShow > 0 && (
          <Paginations currentPage={currentPage} totalPages={totalPagesToShow} onPageChange={this.handlePageChange} />
        )}
      </>
    )
  }
}
