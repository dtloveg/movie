import React from 'react'
import propTypes from 'prop-types'
import { Pagination } from 'antd'

const Paginations = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <Pagination
      align="center"
      showSizeChanger={false}
      total={totalPages}
      current={currentPage}
      pageSize={20}
      onChange={onPageChange}
      style={{ backgroundColor: 'white', paddingTop: 16, margin: 0, maxWidth: 1010 }}
    />
  )
}

export default Paginations

Paginations.propTypes = {
  currentPage: propTypes.number,
  totalPages: propTypes.number,
  onPageChange: propTypes.func,
}
