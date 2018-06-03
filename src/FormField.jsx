/* eslint-disable no-return-assign */
import React, { Component } from 'react'
import fieldValidator from 'validator'
import { FormContext } from './Form'

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
  constructor () {
    super()
    this.state = {isValid: true, errorMessage: ''}
  }
  componentDidMount () {
    const { registerField } = this.props.context
    const renderPropData = this.props.render()

    registerField({
      name: renderPropData.props.name,
      validator: this.validate.bind(this),
      getValue: this.getValue.bind(this)
    })
  }

  componentWillUnmount () {
    const renderPropData = this.props.render()
    const { context: {unregisterField} } = this.props
    unregisterField({name: renderPropData.props.name})
  }

  validate () {
    const {props: {type, required}} = this.props.render()
    const { validator } = this.props
    const value = this.input.value

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
    return this.input.value
  }

  render () {
    const componentToRender = this.props.render()

    return React.cloneElement(componentToRender, {
      inputRef: (input) => this.input = input,
      onChange: this.onChangeHandler.bind(this),
      isValid: this.state.isValid,
      errorMessage: this.state.errorMessage
    })
  }
}

export default ValidatedFormFieldProvider
