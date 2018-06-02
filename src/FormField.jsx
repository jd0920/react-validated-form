import React, { Component } from 'react'
import PropTypes from 'prop-types'
import fieldValidator from 'validator'
import { FormContext } from './Form'
import DefaultInput from './DefaultInput'

class ValidatedFormFieldProvider extends Component {
  render () {
    return (
      <FormContext.Consumer>
        {(context) => <ValidatedFormField context={context} {...this.props} />}
      </FormContext.Consumer>
    )
  }
}
class ValidatedFormField extends Component {
  componentWillMount () {
    this.validate = this.validate.bind(this)
  }

  componentDidMount () {
    const { name } = this.props
    const { registerField } = this.props.context
    registerField({
      name,
      validator: this.validate.bind(this),
      getValue: this.getValue.bind(this)
    })
  }

  componentWillUnmount () {
    const { name, context: {unregisterField} } = this.props
    unregisterField({name})
  }

  validate () {
    const { validator, type, required } = this.props
    const value = this.formElement.value
    const isEmpty = () => value === ''

    if (typeof validator === 'function') {
      return validator(value)
    }

    if (!isEmpty() && type === 'email') {
      const isValidEmail = fieldValidator.isEmail(value)
      if (!isValidEmail) {
        return 'Email is invalid'
      }
    }

    if (isEmpty() && required) {
      return 'This field is required'
    }
  }

  onChangeHandler (e) {
    const error = this.validate(e.target.value)
    if (error) {
      this.setState({isValid: false, errorMessage: error})
    }
    if (typeof this.props.onChange === 'function') {
      this.props.onChange(e)
    }
  }

  getValue () {
    return this.formElement.value
  }

  render () {
    return this.props.render
      ? this.props.render(...this.props)
      : <DefaultInput ref={elem => (this.formElement = elem)} {...this.props} />
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

export default ValidatedFormFieldProvider
