import { connect } from 'react-redux';
import AnimateHeight from 'react-animate-height'
import React, { Component } from 'react'
import moment from 'moment'
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
import { resolveIssueAction } from '../../actions';

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

const getBorderColor = status => {
  switch (status){
    case 'available':
      return colors.complete
    case 'busy':
      return colors.attention
    case 'at lunch':
      return colors.warning
    default:
      return colors.black
  }
}

const Avatar = styled.img`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: 2px solid ${({status}) => getBorderColor(status)}
  ${'' /* background: ${gradients.l_to_r}; */}
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

const Header = ({expanded, issue, supportTechAvatar, author, companyName, userStatus}) => (
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
        <Avatar src={supportTechAvatar} status={userStatus}/>
      </AvatarContainer>
    </FlexBox>
  </HeaderContainer>
)

const Body = () => (
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
      ...props
      } = this.props
    return (
      <FlexibleCard
        inline
        initHeader={expanded => <Header
                                  expanded={expanded}
                                  issue={issue}
                                  supportTechAvatar={users[2].image_url}
                                  userStatus={users[2].status}
                                  author={author}
                                  companyName={companyName}
                                />}
        initBodyPage={expanded => <Body expanded={expanded}/>}
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
    resolveIssue: (id) => dispatch(resolveIssueAction(id))
  }
}

export default connect(mapStateToProps, mapDispatch)(ClaimedCard)
