import glamorous from 'glamorous'
import React from 'react'

const InputWrapper = glamorous.div({
  position: 'relative',
  width: '100%'
})

const baseLabel = {
  position: 'absolute',
  fontWeight: 500,
  fontSize: 10,
  color: '#AAAAAA'
}
const LabelDefaults = {
  ...baseLabel,
  ...{
    opacity: 0,
    transition: 'top 0.25s ease-in, opacity 0.25s linear',
    top: -5,
    left: 10,
    marginBottom: 5
  }
}
const OptionalDefaults = {
  ...baseLabel,
  ...{
    top: 5,
    right: 10
  }
}
const ValidationErrorDefaults = {
  position: 'absolute',
  right: 10,
  bottom: 5,
  color: 'red',
  fontSize: 11
}
const Label = glamorous.label(({visible}) => {
  let obj = {...LabelDefaults}
  if (visible) {
    obj.top = 5
    obj.opacity = 1
  }
  return obj
})
const OptionalLabel = glamorous.label(() => ({...OptionalDefaults}))
const ValidationErrorMessage = glamorous.span(() => ({...ValidationErrorDefaults}))

class Wrapper extends React.Component {
  render () {
    const { placeholder, placeholderNoLabel, hasContent } = this.props
    const PlaceholderLabelVisible = Boolean(placeholder && !placeholderNoLabel && hasContent)
    return (
      <InputWrapper>
        <Label visible={PlaceholderLabelVisible}>
          {this.props.placeholder}
        </Label>
        {!this.props.required && !this.props.optionalNoLabel &&
          <OptionalLabel>optional</OptionalLabel>
        }
        {this.props.children}
        {!this.props.isValid &&
          <ValidationErrorMessage>{this.props.errorMessage}</ValidationErrorMessage>
        }
      </InputWrapper>
    )
  }
}

export default Wrapper
