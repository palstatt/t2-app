import { MaterialIcon, H1, H2, colors } from 'is-ui-library'
import { connect } from 'react-redux'
import React, { Component } from 'react'
import styled from 'styled-components'
import posed from 'react-pose'
import { navigateToPageAction } from '../../actions'

const navigationOptions = [
  {
    text: 'issues queue',
    page: 'issuesQueue'
  },
  {
    text: 'follow-up',
    page: 'followUp'
  },
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

class MenuBar extends Component {

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

  handleClickNav = (page) => {
    this.props.changePage(page)
    this.props.closeMenu()
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
            {navigationOptions.map(({text, page}) =>
            <NavContainer
              key={text}
              onClick={() => this.handleClickNav(page)}
            >
              <NavText>{text.toUpperCase()}</NavText>
            </NavContainer>
          )}
        </Container>
      </Wrapper>
    )
  }
}

const mapStateToProps = state => {
  return {
    currentPage: state.currentPage
  }
}

const mapDispatch = dispatch => {
  return {
    changePage: (page) => dispatch(navigateToPageAction(page))
  }
}

export default connect(mapStateToProps, mapDispatch)(MenuBar)
