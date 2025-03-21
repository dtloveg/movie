import React from 'react'
import { Row, Col } from 'antd'
import propTypes from 'prop-types'

import CardItem from '../card/card'

const CardList = ({ movies, onRateChange, ratedMovies }) => {
  return (
    <Row
      gutter={[36, 36]}
      justify="center"
      align="start"
      style={{ backgroundColor: 'white', paddingTop: 32, margin: 0, maxWidth: 1010 }}
    >
      {movies.map((movie) => (
        <Col className="col" key={movie.id} style={{ display: 'flex', justifyContent: 'center' }}>
          <CardItem movie={movie} onRateChange={onRateChange} ratedMovies={ratedMovies} />
        </Col>
      ))}
    </Row>
  )
}

CardList.propTypes = {
  movies: propTypes.array.isRequired,
  loading: propTypes.bool.isRequired,
  error: propTypes.bool.isRequired,
  onRateChange: propTypes.func,
  ratedMovies: propTypes.object,
}

export default CardList
