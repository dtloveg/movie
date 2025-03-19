import React, { createContext, useContext, Component } from 'react'
import propTypes from 'prop-types'

import ApiService from '../../services/api-service'

const GenresContext = createContext([])

export default class GenresProvider extends Component {
  state = {
    genres: [],
  }
  apiService = new ApiService()

  async componentDidMount() {
    try {
      const data = await this.apiService.getGenres()
      this.setState({ genres: data.genres })
    } catch (error) {
      console.error('Error fetching genres:', error)
    }
  }

  render() {
    return <GenresContext.Provider value={this.state.genres}>{this.props.children}</GenresContext.Provider>
  }
}

export const useGenres = () => {
  return useContext(GenresContext)
}

GenresProvider.propTypes = {
  children: propTypes.node.isRequired,
}
