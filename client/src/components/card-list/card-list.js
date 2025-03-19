import React from 'react'
import { Row, Col, Spin, Alert } from 'antd'
import propTypes from 'prop-types'

import CardItem from '../card/card'

const CardList = ({ movies, loading, error, onRateChange, ratedMovies }) => {
  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <Spin size="large" />
      </div>
    )
  }

  return (
    <Row
      gutter={[36, 36]}
      justify="center"
      align="start"
      style={{ minHeight: '100vh', backgroundColor: 'white', paddingTop: 32, margin: 0, maxWidth: 1010 }}
    >
      {error && (
        <Alert
          type="error"
          message={'Увы, не удалось произвести поиск. Попробуйте снова'}
          style={{ marginBottom: '20px', width: '100%' }}
        />
      )}
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
