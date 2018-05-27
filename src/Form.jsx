import React from 'react'
import PropTypes from 'prop-types'
import ContextManager from './ContextManager'
import ErrFormFieldsInvalid from './ErrFormFieldsInvalid'

class ValidatedForm extends React.Component {
  constructor ({name}) {
    super()
    this._registeredFields = new Map()
  }

  componentWillMount () {
    const { name } = this.props
    const contextMethods = {
      registerField: this.registerField.bind(this),
      unregisterField: this.unregisterField.bind(this),
      validateAndSubmit: this.validateAndSubmit.bind(this)
    }
    ContextManager.setContext({name, ...contextMethods})
  }

  registerField ({name, validator, getValue}) {
    if (!this._registeredFields.has(name)) {
      this._registeredFields.set(name, {validator, getValue})
    }
  }

  unregisterField ({name}) {
    this._registeredFields.delete(name)
  }

  validateAndSubmit () {
    const fields = Array.from(this._registeredFields)
    const validationResults = fields.map(field => field[1].validator())
    const invalidFields = validationResults.filter(error => error)
    if (invalidFields.length > 0) { return }
    const aggregatedValues = fields.map(field => ({[field[0]]: field[1].getValue()}))
    this.props.onSubmit(aggregatedValues)
  }

  render () { return this.props.children }
}

ValidatedForm.propTypes = {
  name: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired
}

export default ValidatedForm
