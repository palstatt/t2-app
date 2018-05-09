import { connect } from 'react-redux';
import AnimateHeight from 'react-animate-height'
import React, { Component } from 'react'
import moment from 'moment'
import posed, { PoseGroup } from 'react-pose'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import {
  FlexibleCard,
  InfoField,
  InputTextArea,
  IconButton,
  Accent,
  H3,
  gradients,
  colors
} from 'is-ui-library'
import { claimIssueAction } from '../../actions';
import { AssignPage } from './pages'

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

const Avatar = styled.img.attrs({
  href: props => props.avatarUrl,
})`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background-image: ${gradients.l_to_r};
`

const AvatarContainer = styled.div`
  width: 56px;
  height: 56px;
  align-self: flex-start;
`

const Title = styled(H3)`
  width: ${props => props.expanded ? '100%' : '65vw'};
  white-space: ${props => props.expanded ? 'normal' : 'nowrap'};
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 8px;
  transition: .2s ease;
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

const TitleContainer = styled.div`
  width: 100%;
`

const Header = ({expanded, issue, supportTechAvatar, author, companyName, id, claimIssue}) => (
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
  />
)

const Body = ({animating, onPageChange, page, id}) => (
    <BodyContainer>
      {page === 'init' &&
        <InitPage
          animating={animating}
          onPageChange={onPageChange}
        />
      }
      {page === 'assign' &&
        <AssignPage
          label="assign to"
          id={id}
          animating={animating}
          onPageChange={onPageChange}
        />
      }
    </BodyContainer>
)

const Footer = ({timeCreated, version, id, claimIssue, onPageChange}) => (
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
        onClick={() => onPageChange('assign')}
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


class UnclaimedCard extends Component {

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
    this.setState(({targetPage, currentPage}) => ({
      currentPage: targetPage !== '' ? targetPage : currentPage,
      targetPage: '',
      animating: false,
    }))
  }

  handleCollapse = () => {
    this.setState({
      targetPage: 'init',
      animating: true,
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
      ...props
      } = this.props
    const { currentPage, animating } = this.state
    return (
      <FlexibleCard
        inline
        onCollapse={this.handleCollapse}
        initHeader=
          {expanded =>
            <Header
              id={id}
              expanded={expanded}
              issue={issue}
              supportTechAvatar={supportTechAvatar}
              author={author}
              companyName={companyName}
              claimIssue={props.claimIssue}
            />}
        initBodyPage=
          {expanded =>
            <Body
              page={currentPage}
              id={id}
              animating={animating}
              onPageChange={this.handlePageFinishChange}
            />}
        initFooter=
          {expanded =>
            <Footer
              id={id}
              expanded={expanded}
              timeCreated={moment.unix(timeCreated).fromNow()}
              version={version}
              claimIssue={props.claimIssue}
              onPageChange={(page) => this.handlePageChange(page)}
            />}
        {...props}
      />
    )
  }
}

const mapStateToProps = state => {
  return {
    issues: state.issues
  }
}

const mapDispatch = dispatch => {
  return {
    claimIssue: (id) => dispatch(claimIssueAction(id))
  }
}

export default connect(mapStateToProps, mapDispatch)(UnclaimedCard)
