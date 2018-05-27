import React from 'react'
import Wrapper from './Wrapper'
import glamorous from 'glamorous'
import PropTypes from 'prop-types'

const StyledInput = glamorous.input({
  display: 'block',
  height: 45,
  width: '100%',
  border: `1px solid #cccccc`,
  padding: 10,
  transition: 'padding 0.25s ease-in',
  fontSize: 14,
  color: '#666666',
  fontWeight: 500,
  outline: 'none'
}, ({isValid, required, value}) => {
  let obj = {}
  if (!isValid) {
    obj = {
      border: '1px solid red',
      '::placeholder': {
        color: 'red'
      }
    }
  }
  if (required) {
    obj.borderRight = '2px solid red'
  }
  if (value !== '') {
    obj.padding = '15px 10px 5px 10px'
  }
  return obj
})

class Input extends React.Component {
  constructor (props) {
    super()
    this.state = {value: props.value || ''}
  }

  _handleEvent (e) {
    const supportedEvents = ['onChange', 'onBlur']
    const event = supportedEvents.find(_event => _event.toLowerCase().endsWith(e.type))
    const caseInsensitiveEvent = event.toLowerCase()
    if (e.type === 'change') { this.setState({value: e.target.value}) }
    if (caseInsensitiveEvent.endsWith(e.type)) {
      // Bubble event back up to parent if provided
      if (typeof this.props[event] === 'function') { this.props[event](e) }
    }
  }

  getValue () { return this.input.value }

  render () {
    return (
      <Wrapper isValid={this.props.isValid} hasContent={this.state.value !== ''} {...this.props}>
        <StyledInput
          innerRef={(input) => (this.input = input)}
          type={this.props.type === 'password' ? 'password' : 'text'}
          name={this.props.name}
          placeholder={this.props.placeholder}
          onBlur={(e) => this._handleEvent(e)}
          onChange={(e) => this._handleEvent(e)}
          value={this.state.value}
          isValid={this.props.isValid}
        />
      </Wrapper>
    )
  }
}

Input.propTypes = {
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  onBlur: PropTypes.func,
  onChange: PropTypes.func
}

Input.defaultProps = {
  type: 'text'
}

export default Input
