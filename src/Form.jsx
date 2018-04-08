import React from 'react'
import PropTypes from 'prop-types'
import ErrFormFieldsInvalid from './ErrFormFieldsInvalid'

export const FormContext = React.createContext()

class ValidatedForm extends React.Component {
  constructor ({name}) {
    super()
    this._registeredFields = new Map()
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
    let hasInvalidFields = fields.some(field => typeof field[1].validator() === 'string')

    if (hasInvalidFields) { throw new ErrFormFieldsInvalid() }

    const aggregatedValues = fields.map(field => ({[field[0]]: field[1].getValue()}))
    this.props.onSubmit(aggregatedValues)
  }

  render () {
    const contextMethods = {
      registerField: this.registerField.bind(this),
      unregisterField: this.unregisterField.bind(this),
      validateAndSubmit: this.validateAndSubmit.bind(this)
    }
    return (
      <FormContext.Provider value={contextMethods}>
        {this.props.children}
      </FormContext.Provider>
    )
  }
}

ValidatedForm.propTypes = {
  name: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired
}

export default ValidatedForm
