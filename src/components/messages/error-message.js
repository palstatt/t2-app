import { connect } from 'react-redux'
import React, { Component } from 'react'
import styled, { keyframes } from 'styled-components'
import { clearMessagesAction } from '../../actions'
import { MaterialIcon, colors, shadows } from 'is-ui-library'

const glow = keyframes`
  0%, 100% {
    opacity: 0.75;
  }

  50% {
    opacity: 1;
  }
`

const MessagesContainer = styled.div`
  background: ${colors.white};
  box-shadow: ${shadows.basic};
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  z-index: 100;
  padding: 8px;
  right: 16px;
  bottom: 16px;
  border-radius: 4px;
  transition: .2s ease;
`

const WarningIcon = styled(MaterialIcon).attrs({
  children: 'warning',
  color: colors.warning
})`
  animation: ${glow} 1.5s ease-in-out infinite;
  display: block;
  transform-origin: center center;
`

class ErrorMessage extends Component {

  state = {

  }

  render() {
    const { clearMessages } = this.props
    return (
      <MessagesContainer
        onClick={() => clearMessages()}
      >
        <WarningIcon />
      </MessagesContainer>
    )
  }
}

const mapDispatch = dispatch => {
  return {
    clearMessages: () => dispatch(clearMessagesAction())
  }
}

export default connect(null, mapDispatch)(ErrorMessage)
