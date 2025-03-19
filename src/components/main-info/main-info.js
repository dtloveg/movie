import React from 'react'
import propTypes from 'prop-types'
import { Flex, Typography } from 'antd'
import { format, parseISO } from 'date-fns'

import 'antd/dist/reset.css'
import './main-info.css'
import { useGenres } from '../context/genres-context'

const MainInfo = ({ title, releaseDate, genre_ids, vote_average }) => {
  const genres = useGenres()
  const movieGenres = genre_ids.map((id) => {
    const genre = genres.find((g) => g.id === id)
    return genre ? (
      <Typography.Text key={id} keyboard style={{ display: 'inline-block', color: 'rgba(0, 0, 0, 0.65)' }}>
        {genre.name}
      </Typography.Text>
    ) : null
  })

  const newReleaseDate = releaseDate ? format(parseISO(releaseDate), 'PP') : ''
  let className = 'rating'

  if (vote_average <= 3) {
    className += ' rating-red'
  } else if (vote_average > 3 && vote_average <= 5) {
    className += ' rating-orange'
  } else if (vote_average > 5 && vote_average <= 7) {
    className += ' rating-yellow'
  } else if (vote_average > 7) {
    className += ' rating-green'
  }

  return (
    <>
      <Flex justify="space-between" align="flex-start" style={{ width: '100%' }}>
        <Typography.Title level={5} style={{ margin: 0, maxWidth: 180, maxHeight: 50, overflowY: 'hidden' }}>
          {title}
        </Typography.Title>
        <div className={className} style={{ marginLeft: 'auto' }}>
          {vote_average.toFixed(1)}
        </div>
      </Flex>
      <Typography.Text style={{ color: '#827E7E' }}>{newReleaseDate}</Typography.Text>
      <div style={{ marginTop: '5px' }}>{movieGenres}</div>
    </>
  )
}

MainInfo.propTypes = {
  title: propTypes.string.isRequired,
  releaseDate: propTypes.string.isRequired,
  genre_ids: propTypes.array.isRequired,
  vote_average: propTypes.number.isRequired,
}

export default MainInfo
