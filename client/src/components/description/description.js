import React, { Component } from 'react'
import propTypes from 'prop-types'
import { Typography } from 'antd'
import 'antd/dist/reset.css'
import './description.css'

export default class Description extends Component {
  cutDescription(text, limit) {
    text = text.trim()
    if (text.length <= limit) return text
    const lastSpaceIndex = text.lastIndexOf(' ', limit)
    if (lastSpaceIndex !== -1) {
      text = text.slice(0, lastSpaceIndex)
      if (text.endsWith(',') || text.endsWith('.')) {
        text = text.slice(0, -1)
      }
    } else {
      text = text.slice(0, limit)
    }

    return text.trim() + '...'
  }

  render() {
    const { overview } = this.props
    const newOverwiew = this.cutDescription(overview, 200)
    return <Typography.Paragraph style={{ maxHeight: 99, fontSize: 12 }}>{newOverwiew}</Typography.Paragraph>
  }
}

Description.propTypes = {
  overview: propTypes.string.isRequired,
}
