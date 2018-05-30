import React, { Component } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { ComplexButton, Badge, MaterialIcon, colors } from 'is-ui-library'
import { connect } from 'react-redux'
import { getColor } from '../../functions'

const themeCreator = fg => (
  {
    fg,
    check: colors.black,
    bg: colors.black,
  }
)

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 100;
`

const TopContainer = styled.div`
  background: ${colors.white};
  display: flex;
  width: 100%;
  height: 72px;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
`

const AvailableTechsBadge = ({availableCount}) => (
  <Badge theme={'complete'} value={availableCount} small/>
)

class Header extends Component {

  state = {

  }

  static propTypes = {
    currentStatus: PropTypes.string,
    availableCount: PropTypes.number,
    navigationComponent: PropTypes.element,
  }

  static defaultProps = {
    currentStatus: 'available',
  }

  createTheme = () => {
    const { currentUser } = this.props
    return themeCreator(getColor(currentUser.status))
  }

  render() {
    const { users, navigationComponent, currentUser, handleButtonClick, showMenu } = this.props
    const theme = this.createTheme()
    return (
      <HeaderContainer>
        <TopContainer>
          <MaterialIcon large onClick={() => showMenu()}>menu</MaterialIcon>
          <ComplexButton
            onClick={() => handleButtonClick()}
            customTheme={theme}
            label={currentUser.status || 'loading'}
            childComponent={<AvailableTechsBadge
                              availableCount={users.filter(user => user.status === 'available').length}
                            />}
          />
        </TopContainer>
        {navigationComponent}
      </HeaderContainer>
    )
  }
}

const mapStateToProps = state => {
  return {
    users: state.users,
    currentUser: state.currentUser
  }
}

export default connect(mapStateToProps)(Header);
