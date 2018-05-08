import {
  FlexibleCard,
  InfoField,
  InputTextArea,
  IconButton,
  Accent,
  H4,
  H3,
  colors
} from 'is-ui-library';
import { connect } from 'react-redux'
import React, { Component } from 'react'
import styled from 'styled-components'

import AnimateHeight from 'react-animate-height'
import PropTypes from 'prop-types'
import moment from 'moment'

import { TechPill } from '../'
import {
  assignIssueAction,
  loadIssuesAction,
  resolveIssueAction
} from '../../actions';
import { getColor } from '../../functions'
import closeImage from '../../content/close.png'

//reusable styles
const FlexBox = styled.div`
  display: flex;
  flex-direction: ${props => props.vertical ? 'column' : 'row'};
  align-items: ${props => props.leftAlign ? 'flex-start': 'center'};
  justify-content: ${props => props.centerJustify ? 'center' : 'space-between'};
`

// header styles
const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const Avatar = styled.img`
  border: 2px solid ${({status}) => getColor(status)};
  width: 56px;
  height: 56px;
  border-radius: 50%;
  object-fit: cover;
`

const AvatarContainer = styled.div`
  width: 56px;
  height: 56px;
  align-self: flex-start;
`

const Title = styled(H3)`
  max-width: 65vw;
  white-space: ${props => props.expanded ? 'normal' : 'nowrap'};
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 8px;
`

// body styles
const BodyContainer = styled.div`
  padding: 8px 0;
`

//footer styles
const FooterContainer = styled.div`
  display: flex;
  justify-content: space-between;
`

const SecondaryInfo = styled(Accent)`
  color: ${colors.light_grey};
`

const ButtonFlexBox = styled(FlexBox)`
  & > * {
    margin-left: 8px;
  }
`

const Header = ({expanded, issue, supportTechAvatar, author, companyName, userStatus, onPageChange}) => (
  <HeaderContainer>
    <FlexBox>
      <FlexBox vertical leftAlign>
        <Title expanded={expanded}>
          {issue}
        </Title>
        <InfoField
          icon="person"
          name={author}
          iconColor={colors.tertiary}
          nameColor={colors.light_grey}
        />
        <AnimateHeight
          height={expanded ? 'auto' : 0}
          animateOpacity
        >
          <InfoField
            icon="business"
            name={companyName}
            iconColor={colors.secondary}
            nameColor={colors.light_grey}
          />
        </AnimateHeight>
      </FlexBox>
      <AvatarContainer>
        <Avatar
          src={supportTechAvatar}
          status={userStatus}
          onClick={(e) => {
            onPageChange('reassign')
            expanded && e.stopPropagation()
          }}
        />
      </AvatarContainer>
    </FlexBox>
  </HeaderContainer>
)

const InitBody = () => (
    <BodyContainer>
      <FlexBox vertical leftAlign>
        <InputTextArea
          placeholder="Type notes here..."
          label="Notes"
          rows={3}
        />
      </FlexBox>
    </BodyContainer>
)

const PillCollection = styled.div`
  & > :not(:last-child) {
    margin-bottom: 8px;
  }
`

const ReassignBody = ({users, assignIssue, id, loadIssues, currentPage}) => (
  <BodyContainer>
    <H4 center>REASSIGN TO</H4>
    <PillCollection>
      {users.map(user =>
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
  </BodyContainer>
)

const Body = ({animating, onPageChange, currentPage, users, assignIssue, id, loadIssues}) => (
  <AnimateHeight
    height={animating ? 0 : 'auto'}
    onAnimationEnd={() => onPageChange()}
    animateOpacity
  >
      {currentPage === 'init'
      ? <InitBody />
      : <ReassignBody
          users={users}
          assignIssue={assignIssue}
          id={id}
          loadIssues={loadIssues}
          currentPage={currentPage}
        />}
  </AnimateHeight>
)


const Footer = ({timeCreated, version, id, resolveIssue}) => (
  <FooterContainer>
    <FlexBox vertical centerJustify leftAlign>
      <SecondaryInfo>{timeCreated}</SecondaryInfo>
      <SecondaryInfo>{version}</SecondaryInfo>
    </FlexBox>
    <ButtonFlexBox>
      <IconButton
        noLabel
        mobile
        icon="snooze"
        secondary
        onClick={(id) => console.log(id)}
      />
      <IconButton
        noLabel
        mobile
        icon="check"
        onClick={() => resolveIssue(id)}
      />
    </ButtonFlexBox>
  </FooterContainer>
)


class ClaimedCard extends Component {

  state = {
    currentPage: 'init',
    targetPage: '',
    animating: false
  }

  static propTypes = {
    id: PropTypes.number,
    issue: PropTypes.string,
    supportTechAvatar: PropTypes.string,
    author: PropTypes.string,
    companyName: PropTypes.string,
    timeCreated: PropTypes.number,
    version: PropTypes.number,
  }

  static defaultProps = {
    issue: 'error',
    supportTechAvatar: '',
    author: 'error',
    companyName: 'error',
    version: 12.3,
  }

  handlePageChange = (pageName) => {
    this.setState({
      targetPage: pageName,
      animating: true,
   })
  }

  handlePageFinishChange = () => {
    this.setState((prevState) => ({
      currentPage: prevState.targetPage,
      targetPage: '',
      animating: false,
    }))
  }

  handleCollapse = () => {
    this.setState({
      currentPage: 'init',
      targetPage: '',
      animating: false
    })
  }

  render() {
    const {
      id,
      issue,
      supportTechAvatar,
      author,
      companyName,
      timeCreated,
      version,
      users,
      assignedTo,
      assignIssue,
      loadIssues,
      ...props
      } = this.props
    const { currentPage, targetPage, animating } = this.state
    const assignedTech = users.find( user => user.id === Number(assignedTo))
    return (
      <FlexibleCard
        inline
        onCollapse={this.handleCollapse}
        initHeader={expanded => <Header
                                  expanded={expanded}
                                  issue={issue}
                                  supportTechAvatar={assignedTech.image_url}
                                  userStatus={assignedTech.status}
                                  author={author}
                                  companyName={companyName}
                                  onPageChange={(page) => this.handlePageChange(page)}
                                />}
        initBodyPage={expanded => <Body
                                    currentPage={currentPage}
                                    animating={animating}
                                    expanded={expanded}
                                    onPageChange={this.handlePageFinishChange}
                                    users={users}
                                    assignIssue={assignIssue}
                                    id={id}
                                    loadIssues={loadIssues}
                                  />}
        initFooter={expanded => <Footer
                                  id={id}
                                  expanded={expanded}
                                  timeCreated={moment.unix(timeCreated).fromNow()}
                                  version={version}
                                  resolveIssue={props.resolveIssue}
                                />}
        {...props}
      />
    )
  }
}

const mapStateToProps = state => {
  return {
    users: state.users,
  }
}

const mapDispatch = dispatch => {
  return {
    resolveIssue: (id) => dispatch(resolveIssueAction(id)),
    assignIssue: (issueID, techID) => dispatch(assignIssueAction(issueID, techID)),
    loadIssues: (filter, collectionName) => dispatch(loadIssuesAction(filter, collectionName)),
  }
}

export default connect(mapStateToProps, mapDispatch)(ClaimedCard)
