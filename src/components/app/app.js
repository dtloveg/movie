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
    totalMoviesCount: 0,
    moviesToDisplay: [],
  }

  apiService = new ApiService()

  async componentDidMount() {
    try {
      const genresData = await this.apiService.getGenres()
      this.setState({ genres: genresData.genres })
      const guestSessionId = await this.apiService.createGuestSession()
      this.setState({ guestSessionId }, () => {
        this.getCurrentMovies()
      })
      this.loadRatedMovies()
    } catch (error) {
      console.error('Error fetching genres or creating guest session:', error)
    }
  }

  loadRatedMovies = () => {
    const ratedMovies = JSON.parse(localStorage.getItem('ratedMovies')) || {}
    this.setState({ ratedMovies })
  }
  fetchMovies = async (query, page) => {
    if (!query.trim()) {
      this.setState({ movies: [], loading: false, totalPages: 0 })
      return
    }
    this.setState({ loading: true })
    try {
      const { movies, totalCount } = await this.apiService.getDataForPage(query, page)
      if (movies.length === 0) {
        this.setState({ movies: [], noResults: true, loading: false, totalMoviesCount: 0 })
      } else {
        const moviesWithRatings = movies.map((movie) => ({
          ...movie,
          rating: this.state.ratedMovies[movie.id] || 0,
        }))

        this.setState(
          {
            movies: moviesWithRatings,
            loading: false,
            error: false,
            noResults: false,
            totalMoviesCount: totalCount,
          },
          () => {
            this.getCurrentMovies()
          }
        )
      }
    } catch {
      this.setState({ loading: false, error: true })
    }
  }

  handleQueryChange = async (query) => {
    this.setState({ query, currentPage: 1, noResults: false }, async () => {
      await this.fetchMovies(query, 1)
      await this.getCurrentMovies()
    })
  }

  getCurrentMovies = async () => {
    const { activeTab, guestSessionId, currentPage, ratedMovies } = this.state

    if (activeTab === '2' && guestSessionId) {
      const totalRatedMoviesCount = Object.keys(ratedMovies).length
      if (totalRatedMoviesCount === 0) {
        this.setState({ moviesToDisplay: [] })
        return
      }

      try {
        const fetchedRatedMovies = await this.apiService.getRatedMovies(guestSessionId, currentPage)
        const moviesArray = fetchedRatedMovies.results || []

        if (Array.isArray(moviesArray)) {
          const moviesWithRatings = moviesArray.map((movie) => ({
            ...movie,
            rating: this.state.ratedMovies[movie.id] || 0,
          }))
          this.setState({ moviesToDisplay: moviesWithRatings })
        } else {
          console.error('Expected moviesArray to be an array, but got:', moviesArray)
          this.setState({ moviesToDisplay: [], error: true })
        }
      } catch (error) {
        console.error('Error fetching rated movies:', error)
        this.setState({ error: true, moviesToDisplay: [] })
      }
    } else {
      this.setState({ moviesToDisplay: this.state.movies })
    }
  }

  handleRateChange = async (movieId, rating) => {
    const movieData = this.state.movies.find((movie) => movie.id === movieId)

    if (movieData) {
      const newRatedMovies = {
        ...this.state.ratedMovies,
        [movieId]: rating,
      }

      localStorage.setItem('ratedMovies', JSON.stringify(newRatedMovies))

      this.setState({ ratedMovies: newRatedMovies })
      this.setState((prevState) => {
        const updatedMovies = prevState.movies.map((movie) => {
          if (movie.id === movieId) {
            return { ...movie, rating: rating }
          }
          return movie
        })
        return { movies: updatedMovies }
      })

      if (this.state.guestSessionId) {
        try {
          await this.apiService.rateMovie(this.state.guestSessionId, movieId, rating)
        } catch (error) {
          console.error('Error sending rating:', error)
        }
      }
    }
  }

  handleTabChange = async (key) => {
    this.setState({ activeTab: key, currentPage: 1, loading: true }, async () => {
      await this.getCurrentMovies()
      this.setState({ loading: false })
    })
  }

  handlePageChange = async (page) => {
    this.setState({ currentPage: page, loading: true, noResults: false }, async () => {
      await this.fetchMovies(this.state.query, page)
      this.setState({ loading: false })
    })
  }

  render() {
    const { currentPage, loading, error, noResults, ratedMovies, activeTab, totalMoviesCount } = this.state

    const totalRatedMoviesCount = Object.keys(ratedMovies).length
    const totalPagesToShow = activeTab === '1' ? totalMoviesCount : totalRatedMoviesCount

    return (
      <>
        <Header onQueryChange={this.handleQueryChange} onTabChange={this.handleTabChange} activeTab={activeTab} />
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
        {noResults && activeTab === '2' && (
          <Alert
            type="info"
            message={'У вас пока нет оцененных фильмов.'}
            style={{ maxWidth: '1010px', textAlign: 'center' }}
          />
        )}
        <CardList
          movies={this.state.moviesToDisplay}
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
