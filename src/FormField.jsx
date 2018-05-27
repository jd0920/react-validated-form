import ContextManager from './ContextManager'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import fieldValidator from 'validator'
import TextInput from './Input/TextInput'

class ValidatedFormField extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isValid: true,
      firstBlur: false,
      errorMessage: ''
    }
  }

  componentWillMount () {
    const { formName } = this.props
    this.validate = this.validate.bind(this)
    this._context = ContextManager.getContext({name: formName}).context
  }

  componentDidMount () {
    const { name } = this.props
    const { registerField } = this._context
    registerField({
      name,
      validator: this.validate.bind(this),
      getValue: this.getValue.bind(this)
    })
  }

  componentWillUnmount () {
    const { name } = this.props
    const { unregisterField } = this._context
    unregisterField({name})
  }

  validate (value = this.formField.getValue()) {
    const { validator, type, required } = this.props
    const isEmpty = () => value === ''
    let validationError = ''

    if (typeof validator === 'function') {
      validationError = validator(value)
    }

    if (!isEmpty() && type === 'email') {
      const isValidEmail = fieldValidator.isEmail(value)
      if (!isValidEmail) {
        validationError = 'Email is invalid'
      }
    }

    if (isEmpty() && required) {
      validationError = 'required'
    }

    if (validationError) {
      this.setState({isValid: false, errorMessage: validationError})
      return validationError
    } else {
      this.setState({isValid: true, errorMessage: ''})
    }
  }

  onChangeHandler (e) {
    this.validate(e.target.value)
    if (typeof this.props.onChange === 'function') {
      this.props.onChange(e)
    }
  }

  getValue () {
    return this.formField.getValue()
  }

  render () {
    return (
      <TextInput
        ref={(formField) => (this.formField = formField)}
        onChange={(e) => this.onChangeHandler(e)}
        name={this.props.name}
        placeholder={this.props.placeholder}
        type={this.props.type}
        required={this.props.required}
        value={this.props.value}
        isValid={this.state.isValid}
        errorMessage={this.state.errorMessage}
        // TODO add handler for blur
      />
    )
  }
}

ValidatedFormField.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['text', 'password', 'email', 'select']).isRequired,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  validator: PropTypes.func,
  options: PropTypes.array
}

export default ValidatedFormField
