import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import styled from 'styled-components'
import posed, { PoseGroup } from 'react-pose'
import { P, colors, shadows } from 'is-ui-library'
import { changeStatusAction } from '../../actions'
import { StatusPill } from '../../components'

const statusOptions = [
  {
    text: 'available',
  },
  {
    text: 'busy',
  },
  {
    text: 'out of office',
  },
  {
    text: 'at lunch',
  }
]

const containerProps = {
  enter: { y: '0%', staggerChildren: 50 },
  exit: { y: '100%' }
}

const Container = styled(posed.div(containerProps))`
  background: ${colors.white};
  box-shadow: ${shadows.basic};
  align-self: stretch;
  position: fixed;
  width: calc(100% - 16px);
  bottom: -48px;
  left: 8px;
  border-radius: 8px 8px 0 0;
  z-index: 500;
`

const ClickContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 24px 8px 56px 8px;
`

const HeaderText = styled(P)`
  color: ${colors.grey};
  margin-bottom: 16px;
`

const optionPoseProps = {
  enter: { y: '0%', opacity: 1 },
  exit: { y: '100%', opacity: 0 }
}

const OptionPoseContainer = styled(posed.div(optionPoseProps))`
  align-self: stretch;
`

class StatusCard extends Component {

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside)
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside)
  }

  handleClickOutside = (e) => {
    if (!this.wrapperRef.contains(e.target)) {
      this.props.onRemove()
    }
  }

  render() {
    const { changeStatus, currentUser, onRemove } = this.props
    return (
      <Container>
        <ClickContainer innerRef={wrapperRef => this.wrapperRef = wrapperRef}>
          <HeaderText>I'm currently...</HeaderText>
          <PoseGroup>
            {statusOptions.map(({text, active}) =>
              <OptionPoseContainer key={text}>
                <StatusPill
                  active={text === currentUser.status}
                  status={text}
                  changeStatus={(text) => {
                    changeStatus(text)
                    // onRemove()
                  }}
                />
              </OptionPoseContainer>
            )}
          </PoseGroup>
        </ClickContainer>
      </Container>
    )
  }
}

const mapStateToProps = state => {
  return {
    currentUser: state.currentUser
  }
}

const mapDispatch = dispatch => {
  return {
    changeStatus: (status) => dispatch(changeStatusAction(status))
  }
}

export default connect(mapStateToProps, mapDispatch)(StatusCard)
