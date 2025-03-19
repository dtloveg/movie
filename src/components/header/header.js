import React, { Component } from 'react'
import propTypes from 'prop-types'
import { Input, Tabs } from 'antd'
import { debounce } from 'lodash'

export default class Header extends Component {
  state = {
    query: '',
    activeTab: '1',
  }

  handleInputChange = (query) => {
    this.setState({ query })
    if (query.trim()) {
      this.props.onQueryChange(query)
    }
  }

  debouncedInputChange = debounce((query) => {
    this.handleInputChange(query)
    this.clearInput()
  }, 1500)

  onKeyUp = (e) => {
    const query = e.target.value
    this.debouncedInputChange(query)
  }

  clearInput = () => {
    this.setState({ query: '' })
  }
  onChange = (key) => {
    this.setState({ activeTab: key })
    this.props.onTabChange(key)
  }

  items = [
    {
      key: '1',
      label: 'Search',
    },
    {
      key: '2',
      label: 'Rated',
    },
  ]
  render() {
    return (
      <header style={{ backgroundColor: 'white', padding: 32, paddingBottom: 0, maxWidth: 1010 }}>
        <Tabs centered activeKey={this.state.activeTab} items={this.items} onChange={this.onChange} />
        {this.state.activeTab === '1' && (
          <Input
            placeholder="Type to search"
            onKeyUp={this.onKeyUp}
            value={this.state.query}
            onChange={(e) => this.setState({ query: e.target.value })}
          />
        )}
      </header>
    )
  }
}

Header.defaultProps = {
  onKeyUp: () => {},
  onQueryChange: () => {},
  onTabChange: () => {},
}

Header.propTypes = {
  onKeyUp: propTypes.func,
  onQueryChange: propTypes.func,
  onTabChange: propTypes.func,
}
