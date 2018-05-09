import React, { Component } from 'react'
import styled from 'styled-components'
import AnimateHeight from 'react-animate-height'
import { TechPill } from '../..'

const PillCollection = styled.div`
  & > :not(:last-child) {
    margin-bottom: 8px;
  }
`

class AssignPage extends Component {

  state = {

  }

  render() {
    const { animating, label, userCollection } = this.props
    return (
      <AnimateHeight
        height={animating ? 0 : 'auto'}
        animateOpacity
      >
        <H4 center>{label.toUpperCase()}</H4>
        <PillCollection>
          {userCollection.map(user =>
            <TechPill
              key={user.id}
              status={user.status}
              avatarURL={user.image_url}
              onClick={() => {
                assignIssue(id, user.id)
                loadIssues('claimed=true', 'claimedIssues')
              }}
            />
          )}
          <TechPill
            border
            status={'unassign'}
            avatarURL={closeImage}
            onClick={() => {
              assignIssue(id, 0)
              loadIssues('claimed=true', 'unclaimedIssues')
            }}
          />
        </PillCollection>
      </AnimateHeight>
    )
  }
}

const mapStateToProps = state => {
  return {
    users: state.users
  }
}

const mapDispatch = dispatch => {
  return {
    assignIssue: (issueID, userID) => assignIssueAction(issueID, userID)
  }
}

export default connect(mapStateToProps, mapDispatch)(AssignPage)
