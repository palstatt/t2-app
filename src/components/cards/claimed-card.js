import {
  FlexibleCard,
  InfoField,
  IconButton,
  Accent,
  H3,
  colors
} from 'is-ui-library';
import { connect } from 'react-redux'
import React, { Component } from 'react'
import moment from 'moment'
import styled from 'styled-components'

import AnimateHeight from 'react-animate-height'
import PropTypes from 'prop-types'

import { AssignPage, ResolvePage } from './pages'
import { assignIssueAction, resolveIssueAction } from '../../actions';
import { getColor } from '../../functions'

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

const Header = ({
  expanded,
  issue,
  supportTechAvatar,
  author,
  companyName,
  userStatus,
  onPageChange,
  onCollapse
}) => (
  <HeaderContainer onClick={onCollapse}>
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
            onPageChange(1)
            expanded && e.stopPropagation()
          }}
        />
      </AvatarContainer>
    </FlexBox>
  </HeaderContainer>
)


const InitFooter = ({timeCreated, version, id, resolveIssue}) => (
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

const ResolveFooter = ({ timeCreated, version, onPageChange }) => (
  <FooterContainer>
    <FlexBox vertical centerJustify leftAlign>
      <SecondaryInfo>{timeCreated}</SecondaryInfo>
      <SecondaryInfo>{version}</SecondaryInfo>
    </FlexBox>
    <ButtonFlexBox>
      <IconButton
        noLabel
        mobile
        icon="close"
        primaryColorName="warning"
        onClick={() => onPageChange(0)}
      />
    </ButtonFlexBox>
  </FooterContainer>
)

class ClaimedCard extends Component {

  state = {
    expanded: false,
    currentPage: 0,
    animating: false,
    leaveRight: false,
    leaveLeft: false,
    actionLabel: '',
    actionColor: 'primary',
    reassignTo: '',
    reassigned: false,
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

  handlePageChange = (pageID) => {
    this.setState({
      currentPage: pageID,
      animating: true,
   })
  }

  handleCollapse = () => {
    this.setState({
      currentPage: 0,
      expanded: false,
    })
  }

  handleExpand = () => {
    this.setState({
      currentPage: 0,
      expanded: true,
    })
  }

  handleReassign = (userName, ...params) => {
    this.setState({
      reassignTo: userName,
      reassigned: true
    },
      () => {
        setTimeout(() => {
          this.handleCollapse()
          this.setState({
            reassignTo: '',
            reassigned: false
          }, () => this.props.assignIssue(...params))
        }, 1500)
      }
    )
  }

  // callback hell (replace with observable???)
  handleAction = (direction = 'right', label, color, action, ...params) => {
    const { expanded } = this.state
    const exitAnimation = direction === 'left' ? 'leaveLeft' : 'leaveRight'
    this.setState({
      expanded: false,
      actionLabel: label,
      actionColor: color,
    },
      () => {
        setTimeout(() => {
          this.setState({ [exitAnimation]: true },
            () => {
            setTimeout(() =>
            {
              action(...params)
          }, 1000)
          }
      ,)}, expanded ? 500 : 0)
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
      ...props
      } = this.props
    const {
      expanded,
      currentPage,
      leaveRight,
      leaveLeft,
      actionLabel,
      actionColor,
      reassignTo,
      reassigned
      } = this.state
    const assignedTech = users.find(user => user.id === Number(assignedTo))
    const filteredUsers = users.filter(user => user.id !== assignedTech.id)
    return (
      <FlexibleCard
        inline
        bodyPageID={currentPage}
        footerID={currentPage}
        leaveRight={leaveRight}
        leaveLeft={leaveLeft}
        actionLabel={actionLabel}
        actionColor={actionColor}
        expanded={expanded}
        headers=
          {[
            <Header
              expanded={expanded}
              issue={issue}
              supportTechAvatar={assignedTech.image_url}
              userStatus={assignedTech.status}
              author={author}
              companyName={companyName}
              onPageChange={(page) => this.handlePageChange(page)}
              onCollapse={expanded ? this.handleCollapse : this.handleExpand}
            />
          ]}
        bodyPages=
        {[
          <ResolvePage expanded={expanded}/>
          ,
          <AssignPage
            label="reassign to"
            id={id}
            userCollection={filteredUsers}
            unassignButton
            reassigned={reassigned}
            reassignTo={reassignTo}
            handleReassign={(userName, ...params) => this.handleReassign(userName, ...params)}
            handleAction={(direction, label, color, ...params) => this.handleAction(direction, label, color, assignIssue, ...params)}
          />
        ]}
        footers=
        {[
          <InitFooter
            id={id}
            expanded={expanded}
            timeCreated={moment.unix(timeCreated).fromNow()}
            version={version}
            resolveIssue={props.resolveIssue}
          />
          ,
          <ResolveFooter
            timeCreated={moment.unix(timeCreated).fromNow()}
            version={version}
            onPageChange={(page) => this.handlePageChange(page)}
          />
        ]}
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
  }
}

export default connect(mapStateToProps, mapDispatch)(ClaimedCard)
