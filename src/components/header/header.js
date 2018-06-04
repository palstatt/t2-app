import React, { Component } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { ComplexButton, Badge, MaterialIcon, colors } from 'is-ui-library'
import { connect } from 'react-redux'
import { getColor, getStatusName } from '../../functions'

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
		allowMenu: true,
  }

  static propTypes = {
    navigationComponent: PropTypes.element,
  }

  createTheme = () => {
    const { currentUser } = this.props
		if (currentUser.EmployeeStatus) {
				return themeCreator(getColor(currentUser.EmployeeStatus.id))
		}
		return themeCreator(getColor())
  }

  render() {
    const { users, navigationComponent, currentUser, handleButtonClick, showMenu } = this.props
    const theme = this.createTheme()
    return (
      <HeaderContainer>
        <TopContainer>
					{this.state.allowMenu && <MaterialIcon large onClick={() => showMenu()}>menu</MaterialIcon>}
          <ComplexButton
            onClick={() => handleButtonClick()}
            customTheme={theme}
            label={currentUser.EmployeeStatus ? getStatusName(currentUser.EmployeeStatus.id) : 'loading'}
            childComponent={<AvailableTechsBadge
                              availableCount={users.length > 0 ? users.filter(user => user.statusId === 5).length : 0}
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
