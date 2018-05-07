import { ComplexButton, Badge, MaterialIcon, colors } from 'is-ui-library'
import { connect } from 'react-redux';
import React, { Component } from 'react'
import styled from 'styled-components'

import PropTypes from 'prop-types'

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

  render() {
    const { currentStatus, users, navigationComponent } = this.props
    return (
      <HeaderContainer>
        <TopContainer>
          <MaterialIcon large>menu</MaterialIcon>
          <ComplexButton
            label={currentStatus}
            childComponent={<AvailableTechsBadge
                              availableCount={
                                users.filter(user => user.status === 'available').length
                              }
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
    users: state.users
  }
}

// const mapDispatch = dispatch => {
//   return {
//
//   }
// }

export default connect(mapStateToProps)(Header);
