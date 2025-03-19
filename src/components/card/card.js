import React, { Component } from 'react'
import { Card, Rate } from 'antd'
import propTypes from 'prop-types'

import 'antd/dist/reset.css'
import MainInfo from '../main-info'
import Description from '../description'

import icon from './no-product.png'
import './card.css'

export default class CardItem extends Component {
  handleRateChange = (value) => {
    const { movie, onRateChange } = this.props
    onRateChange(movie.id, value)
  }
  render() {
    const { movie, ratedMovies } = this.props
    if (!movie) {
      return <div>No movie data available</div>
    }

    const imageUrl = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : icon

    return (
      <Card hoverable styles={{ body: { padding: 0 } }}>
        <div className="card">
          <img className="img" alt={movie.title} src={imageUrl} />
          <div className="main-info">
            <MainInfo
              title={movie.title}
              releaseDate={movie.release_date}
              genre_ids={movie.genre_ids}
              vote_average={movie.vote_average}
            />
          </div>
          <div className="desc">
            <Description overview={movie.overview} />
          </div>
          <Rate
            className="rate"
            allowHalf
            defaultValue={0}
            count={10}
            style={{ fontSize: '16px', paddingBottom: 10 }}
            value={ratedMovies[movie.id] || 0}
            onChange={this.handleRateChange}
          />
        </div>
      </Card>
    )
  }
}

CardItem.propTypes = {
  movie: propTypes.shape({
    id: propTypes.number.isRequired,
    title: propTypes.string.isRequired,
    poster_path: propTypes.string.isRequired,
    release_date: propTypes.string.isRequired,
    genre: propTypes.string.isRequired,
    genre_ids: propTypes.array.isRequired,
    overview: propTypes.string.isRequired,
    rating: propTypes.number.isRequired,
    vote_average: propTypes.number.isRequired,
  }).isRequired,
  onRateChange: propTypes.func,
  ratedMovies: propTypes.object,
}
