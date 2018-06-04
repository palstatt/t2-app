import React, { Component, Fragment } from 'react'
import styled from 'styled-components'
import AnimateHeight from 'react-animate-height'
import PropTypes from 'prop-types'
import { H3, H2 } from 'is-ui-library'
import { TechPill } from '../..'

const PillCollection = styled.div`
  & > :not(:last-child) {
    margin-bottom: 8px;
  }
`

const AnimateHeightStyled = styled(AnimateHeight)`
  margin: 8px 0 16px 0;
`

const ReassignedContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 32px 0 24px 0;
`

export default class AssignPage extends Component {

  state = {
    rendered: false,
  }

  static propTypes = {
    id: PropTypes.number.isRequired,
    label: PropTypes.string.isRequired,
    unassignButton: PropTypes.bool,
    userCollection: PropTypes.array.isRequired,
  }

  static defaultProps = {
    userCollection: []
  }

  componentDidMount() {
    setTimeout(this.setState({
      rendered: true,
    }), 100)
  }

  render() {
    const { id, label, userCollection, handleAssign, handleUnassign, unassignButton, reassigned, handleReassign, reassignTo } = this.props
    const { rendered } = this.state
    return (
      <AnimateHeightStyled
        height={rendered ? 'auto' : 0}
        animateOpacity
      >
        {!reassigned
          ?
          <Fragment>
            <H3 center>{label.toUpperCase()}</H3>
            <PillCollection>
							{userCollection.map(user =>
								<TechPill
									key={user.techId}
									status={user.status}
									statusId={user.statusId}
									avatarURL={user.imageUrl}
									userName={user.name}
                  onClick={handleReassign
                            ?
                              () => handleReassign(user.name, id, user.techId)
                            :
                              () => handleAssign('right', 'assigned', 'attention', id, user.techId)}
                />
              )}
              {unassignButton &&
                <TechPill
                  border
                  status={'unassign'}
                  onClick={() => handleUnassign('left', 'unassigned', 'warning', id)}
                />}
              </PillCollection>
          </Fragment>
          :
          <ReassignedContainer>
            <H2 center>REASSIGNED TO:</H2>
            <H3 center>{reassignTo.toUpperCase()}</H3>
          </ReassignedContainer>
        }
      </AnimateHeightStyled>
    )
  }
}
