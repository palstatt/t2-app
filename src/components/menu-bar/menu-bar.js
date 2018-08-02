import { MaterialIcon, H2, P, colors } from 'is-ui-library'
import { connect } from 'react-redux'
import React, { Component } from 'react'
import styled from 'styled-components'
import posed from 'react-pose'
import { navigateToPageAction } from '../../actions'

const defaultNavigationOptions = [
  {
    text: 'issues queue',
    page: 'issuesQueue',
    icon: 'assignment_returned'
  },
  {
    text: 'follow-up',
    page: 'followUp',
    icon: 'snooze'
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
  background: ${colors.white};
  display: flex;
  justify-content: center;
  align-items: stretch;
  position: fixed;
  left: -40px;
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 40px 12px 12px 56px;
  height: 100vh;
  width: 80vw;
  z-index: 600;
  overflow: hidden;
`

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  align-self: stretch;
  margin-bottom: 40px;
  padding: 0 12px;
`

const TitleText = styled(H2)`
  color: ${colors.black};
  line-height: normal;
  margin-bottom: 8px;
`

const SubtitleText = styled(P)`
  color: ${colors.light_grey};
  line-height: normal;
`

const navContainerProps = {
  enter: {
    x: '0%',
    opacity: 1,
    delay: 50
  },
  exit: {
    x: '30%',
    opacity: 0,
  }
}

const NavContainer = styled(posed.div(navContainerProps))`
  background: ${props => props.selected ? colors.primary__bg : 'none'};
  display: inline-flex;
  position: relative;
  justify-content: flex-start;
  align-items: center;
  align-self: stretch;
  border-radius: 4px;
  padding: 8px 12px;
  margin-bottom: 8px;
  transition: background .2s ease;
`

const NavIcon = styled(MaterialIcon)`
  color: ${props => props.selected ? colors.primary : colors.black};
  line-height: normal;
`

const NavText = styled(P)`
  color: ${props => props.selected ? colors.primary : colors.black};
  line-height: normal;
  margin-left: 24px;
`

class MenuBar extends Component {
  state = {
    navigationOptions: defaultNavigationOptions,
  }

  componentDidMount() {
    document.addEventListener('touchstart', this.handleClickOutside)
  }

  componentWillUnmount() {
    document.removeEventListener('touchstart', this.handleClickOutside)
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
    const { closeMenu, currentPage, currentUser } = this.props
    const { navigationOptions } = this.state
    return (
      <Wrapper>
        <Container
          key={'container'}
          innerRef={wrapperRef => this.wrapperRef = wrapperRef}
        >
            <HeaderContainer>
              <TitleText>TIER 2</TitleText>
              <SubtitleText>{currentUser.FullName}</SubtitleText>
            </HeaderContainer>
            {navigationOptions.map(({text, page, icon}) => {
              const selected = page === currentPage
              return (
                <NavContainer
                  selected={selected}
                  key={text}
                  onClick={selected ? () => {} : () => this.handleClickNav(page)}
                >
                  <NavIcon selected={selected}>{icon}</NavIcon>
                  <NavText selected={selected}>{text.toUpperCase()}</NavText>
                </NavContainer>
              )
          })}
        </Container>
      </Wrapper>
    )
  }
}

const mapStateToProps = state => {
  return {
    currentPage: state.currentPage,
    currentUser: state.currentUser,
  }
}

const mapDispatch = dispatch => {
  return {
    changePage: (page) => dispatch(navigateToPageAction(page))
  }
}

export default connect(mapStateToProps, mapDispatch)(MenuBar)