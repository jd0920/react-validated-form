import React, { Component } from 'react'
import { FormContext } from './Form'

class ValidatedFormTrigger extends Component {
  render () {
    return (
      <FormContext.Consumer>
        {(context) => React.cloneElement(this.props.children, {onClick: context.validateAndSubmit})}
      </FormContext.Consumer>
    )
  }
}

export default ValidatedFormTrigger
