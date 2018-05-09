import { H4 } from 'is-ui-library'
import { connect } from 'react-redux'
import React, { Component } from 'react'
import styled from 'styled-components'

import AnimateHeight from 'react-animate-height'
import PropTypes from 'prop-types'

import { TechPill } from '../..'
import { assignIssueAction } from '../../../actions'
import closeImage from '../../../content/close.png'

const PillCollection = styled.div`
  & > :not(:last-child) {
    margin-bottom: 8px;
  }
`

class AssignPage extends Component {

  state = {

  }

  static propTypes = {
    id: PropTypes.number.isRequired,
    animating: PropTypes.bool.isRequired,
    label: PropTypes.string.isRequired,
    unassignButton: PropTypes.bool,
    userCollection: PropTypes.array,
  }

  render() {
    const { id, animating, label, userCollection, assignIssue, onPageChange, unassignButton } = this.props
    return (
      <AnimateHeight
        height={animating ? 0 : 'auto'}
        onAnimationEnd={() => onPageChange()}
        animateOpacity
      >
        <H4 center>{label.toUpperCase()}</H4>
        <PillCollection>
          {userCollection.map(user =>
            <TechPill
              key={user.id}
              status={user.status}
              avatarURL={user.image_url}
              onClick={() => assignIssue(id, user.id)}
            />
          )}
          {unassignButton &&
            <TechPill
              border
              status={'unassign'}
              avatarURL={closeImage}
              onClick={() => {
                assignIssue(id, 0)
            }}
          />}
        </PillCollection>
      </AnimateHeight>
    )
  }
}

const mapStateToProps = state => {
  return {
    userCollection: state.users
  }
}

const mapDispatch = dispatch => {
  return {
    assignIssue: (issueID, userID) => dispatch(assignIssueAction(issueID, userID)),
  }
}

export default connect(mapStateToProps, mapDispatch)(AssignPage)
