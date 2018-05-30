import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import posed, { PoseGroup } from 'react-pose'
import { MaterialIcon, H1, H2, colors } from 'is-ui-library'
import { Scrim } from '../../components'

const navigationOptions = [
  {
    text: 'issues queue'
  },
  {
    text: 'my issues'
  },
  {
    text: 'settings'
  }
]

const wrapperProps = {
  enter: {
    x: '0%',
    staggerChildren: 100
  },
  exit: {
    x: '-100%',
  }
}

const Wrapper = styled(posed.div(wrapperProps))`
  background: ${colors.black};
  display: flex;
  justify-content: center;
  align-items: stretch;
  position: fixed;
  left: -32px;
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 24px 24px 24px 56px;
  height: 100vh;
  z-index: 600;
`

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
  margin-bottom: 24px;
`

const CloseButton = styled(MaterialIcon).attrs({
  children: 'close',
  large: true,
})`
  color: ${colors.white};
  line-height: normal;
`

const TitleText = styled(H1)`
  color: ${colors.light_grey};
  line-height: normal;
`

const navContainerProps = {
  enter: {
    y: '0%',
    opacity: 1,
    delay: 50
  },
  exit: {
    y: '50%',
    opacity: 0,
    delay: 100
  }
}

const NavContainer = styled(posed.div(navContainerProps))`
  margin-bottom: 24px;
`

const NavText = styled(H2)`
  color: ${colors.white};
`

export default class MenuBar extends Component {

  state = {

  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside)
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside)
  }

  handleClickOutside = (e) => {
    if (!this.wrapperRef.contains(e.target)) {
      this.props.closeMenu()
    }
  }

  render() {
    const { closeMenu } = this.props
    return (
      <Wrapper>
        <Container
          key={'container'}
          innerRef={wrapperRef => this.wrapperRef = wrapperRef}
        >
            <HeaderContainer>
              <CloseButton onClick={() => closeMenu()}/>
              <TitleText>TIER 2</TitleText>
            </HeaderContainer>
            {navigationOptions.map(({text}) =>
            <NavContainer key={text}>
              <NavText>{text.toUpperCase()}</NavText>
            </NavContainer>
          )}
        </Container>
      </Wrapper>
    )
  }
}
