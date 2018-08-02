import React, { Component } from 'react'
import styled, { ThemeProvider } from 'styled-components'
import posed from 'react-pose'
import { colors, shadows } from 'is-ui-library'
import { easing, tween } from 'popmotion'

const themes = {
  default: {
    bg: colors.secondary,
    border: colors.secondary,
    fg: colors.white,
  },
  defaultHover: {
    bg: colors.white,
    border: colors.secondary,
    fg: colors.primary,
  },
  active: {
    bg: colors.black,
    border: colors.black,
    fg: colors.white,
  },
  activeHover: {
    bg: colors.white,
    border: colors.black,
    fg: colors.black,
  }
}

const customTransition = (props) => tween({
      ...props,
      duration: 50,
      ease: easing.easeInOut
  })

const ButtonContainer = styled.div`
  color: ${props => props.theme.fg};
  background: ${props => props.theme.bg};
  border: ${props => !props.mobile ? `4px solid${props.theme.border}` : ''};
  position: fixed;
  bottom: ${props => props.small ? 16 : 40}px;
  right: ${props => props.small ? 16 : 40}px;
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
  height: ${props => props.small ? 56 : 80}px;
  width: ${props => props.small ? 56 : 80}px;
  border-radius: 80px;
  cursor: pointer;
  overflow: hidden;
  box-shadow: ${shadows.basic};
  transition: .15s;
`

const IconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
`

const sendIconProps = {
  inactive: { scale: 1, rotate: '0deg', opacity: 1, transition: props => customTransition(props), },
  active: { scale: 0, rotate: '45deg', opacity: 0 , transition: props => customTransition(props), }
}
const SendIcon = styled(posed.i(sendIconProps)).attrs({
  children: 'send',
  className: 'material-icons',
})`
  color: ${props => props.theme.fg};
  position: absolute;
  user-select: none;
  font-size: ${props => props.small ? 32 : 40}px;
  transition: .15s ease;
`

const closeIconProps = {
  initialPose: 'inactive',
  active: { scale: 1, rotate: '0deg', opacity: 1, transition: props => customTransition(props), },
  inactive: { scale: 0, rotate: '-45deg', opacity: 0 , transition: props => customTransition(props), }
}
const CloseIcon = styled(posed.i(closeIconProps)).attrs({
  children: 'close',
  className: 'material-icons',
})`
  color: ${props => props.theme.fg};
  position: absolute;
  opacity: 0;
  user-select: none;
  font-size: ${props => props.small ? 32 : 40}px;
  transition: .15s ease;
`

export default class FeedbackButton extends Component {

  state = {
    hover: false,
  }

  getTheme = () => {
    const { active, mobile } = this.props
    const { hover } = this.state
    switch(true) {
			case (active && !hover && !mobile):
			case (mobile && active):
        return themes.active
      case (active && hover && !mobile):
				return themes.activeHover
			case (mobile && !active):
      case (!active && !hover && !mobile):
        return themes.default
      case (!active && hover && !mobile):
        return themes.defaultHover
      default:
        return themes.default
    }
  }

  render() {
    const { active, small, mobile } = this.props
    return(
      <ThemeProvider theme={this.getTheme()}>
        <ButtonContainer
            small={small}
						mobile={mobile}
            onClick={() => this.props.onToggle()}
            onMouseEnter={() => this.setState({hover: true})}
            onMouseLeave={() => this.setState({hover: false})}
          >
            <IconContainer>
              <CloseIcon
                small={small}
                pose={active ? 'active' : 'inactive'}
              />
              <SendIcon
                small={small}
                pose={active ? 'active' : 'inactive'}
              />
            </IconContainer>
          </ButtonContainer>
      </ThemeProvider>
    )
  }
}
