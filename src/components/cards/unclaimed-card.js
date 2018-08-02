import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import styled from 'styled-components'
import moment from 'moment'
import AnimateHeight from 'react-animate-height'
import posed, { PoseGroup } from 'react-pose'
import { FlexibleCard, InfoField, IconButton, Accent, H3, colors} from "is-ui-library"
import { AssignPage } from './pages'
import { assignIssueAction, claimIssueAction } from '../../actions'

const Item = posed.div({
  enter: { opacity: 1, delayChildren: 500 },
  exit: { opacity: 0, delayChildren: 500 }
})

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

const Title = styled(H3)`
  width: ${props => props.expanded ? '100%' : '65vw'};
  white-space: ${props => props.expanded ? 'normal' : 'nowrap'};
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 8px;
  transition: .2s ease;
`

//footer styles
const FooterContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
`

const SecondaryInfo = styled(Accent)`
  color: ${colors.light_grey};
`

const ButtonFlexBox = styled(FlexBox)`
  & > * {
    margin-left: 8px;
  }
`

const Header = ({expanded, issue, supportTechAvatar, author, companyName, id, claimIssue, onClick}) => (
  <HeaderContainer onClick={onClick}>
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
        <PoseGroup>
          <Item key={1}>
            {!expanded &&
              <IconButton
                noLabel
                mobile
                icon="check"
                onClick={(e) => {
                  claimIssue(id)
                  e.stopPropagation()
                }}
              />
            }
          </Item>
        </PoseGroup>
    </FlexBox>
  </HeaderContainer>
)

const InitPage = ({animating, onPageChange}) => (
  <AnimateHeight
    height={animating ? 0 : 'auto'}
    onAnimationEnd={() => onPageChange()}
    animateOpacity
  >
    <Fragment />
  </AnimateHeight>
)

const InitFooter = ({timeCreated, version, id, handleAction, onPageChange, claimIssue}) => (
  <FooterContainer>
    <FlexBox vertical centerJustify leftAlign>
      <SecondaryInfo>{timeCreated}</SecondaryInfo>
      <SecondaryInfo>{version}</SecondaryInfo>
    </FlexBox>
    <ButtonFlexBox>
      <IconButton
        label="assign"
        mobile
        icon="subdirectory_arrow_right"
        secondary
        onClick={() => onPageChange(1)}
      />
      <IconButton
        noLabel
        mobile
        icon="check"
        onClick={() => claimIssue(id)}
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

class UnclaimedCard extends Component {
  state = {
    expanded: false,
    currentPage: 0,
    animating: false,
    leaveRight: false,
    leaveLeft: false,
    actionLabel: '',
    actionColor: 'complete',
  }

  static propTypes = {
    id: PropTypes.number,
    issue: PropTypes.string,
    supportTechAvatar: PropTypes.string,
    author: PropTypes.string,
    companyName: PropTypes.string,
    timeCreated: PropTypes.number,
    version: PropTypes.string,
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
      users,
      supportTechAvatar,
      author,
      companyName,
      timeCreated,
      version,
      claimIssue,
      assignIssue,
      currentUserID,
      ...props
      } = this.props
    const {
      currentPage,
      expanded,
      leaveLeft,
      leaveRight,
      actionColor,
      actionLabel } = this.state
    const filteredUsers = users.filter(({techId}) => techId !== currentUserID)
    return (
      <FlexibleCard
        inline
        expanded={expanded}
        bodyPageID={currentPage}
        footerID={currentPage}
        onCollapse={this.handleCollapse}
        leaveRight={leaveRight}
        leaveLeft={leaveLeft}
        actionLabel={actionLabel}
        actionColor={actionColor}
        headers=
          {[
            <Header
              id={id}
              expanded={expanded}
              issue={issue}
              supportTechAvatar={supportTechAvatar}
              author={author}
              companyName={companyName}
              claimIssue={(id) => this.handleAction('right', 'claimed', 'complete', claimIssue, id)}
              onClick={expanded ? this.handleCollapse : this.handleExpand}
            />
          ]}
        bodyPages=
          {[
            <InitPage />
            ,
            <AssignPage
              label="assign to"
              id={id}
              userCollection={filteredUsers}
              handleAssign={(direction, label, color, ...params) => this.handleAction(direction, label, color, assignIssue, ...params)}
            />
          ]}
        footers=
          {[
            <InitFooter
              id={id}
              expanded={expanded}
              timeCreated={moment.unix(timeCreated).fromNow()}
              version={version}
              claimIssue={(id) => this.handleAction('right', 'claimed', 'complete', claimIssue, id)}
              onPageChange={(page) => this.handlePageChange(page)}
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
    issues: state.issues,
    users: state.users,
    currentUserID: state.currentUser.ID,
  }
}

const mapDispatch = dispatch => {
  return {
    claimIssue: (id) => dispatch(claimIssueAction(id)),
    assignIssue: (issueID, techID) => dispatch(assignIssueAction(issueID, techID)),
  }
}

export default connect(mapStateToProps, mapDispatch)(UnclaimedCard)