import React, { Component } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { ComplexButton, Badge, MaterialIcon, colors } from 'is-ui-library'
import { connect } from 'react-redux'

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
    switch(currentUser.status){
      case 'available':
        return {
          bg: colors.black,
          fg: colors.complete,
        }
      case 'busy':
        return {
          bg: colors.black,
          fg: colors.attention,
        }
      case 'at lunch':
        return {
          bg: colors.black,
          fg: colors.warning,
        }
      default:
        return {
          bg: colors.black,
          fg: colors.white
        }
    }
  }

  render() {
    const { users, navigationComponent, currentUser } = this.props
    const theme = this.createTheme()
    return (
      <HeaderContainer>
        <TopContainer>
          <MaterialIcon large>menu</MaterialIcon>
          <ComplexButton
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
