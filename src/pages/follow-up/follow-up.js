import { NavBar, Accent, MaterialIcon, Badge, colors, shadows } from 'is-ui-library'
import { connect } from 'react-redux';
import React, { Component, Fragment } from 'react';
import moment from 'moment';
import styled, { keyframes } from 'styled-components';
import { PoseGroup } from 'react-pose';
import {
    Header,
    FollowUpCard,
    ErrorMessage,
    StatusCard,
    Scrim
} from '../../components';
import { formatDate } from '../../functions'
import {
    loadFollowUpIssuesAction,
    loadUsersAction,
    loginRequestAction
} from '../../actions';

const BadgeContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 8px;
`

const navigationOptions = (values = [0, 0]) => (
    [
        {
            name: 'follow-up',
            id: 1,
            childComponent: <BadgeContainer>
                <Badge theme={'attention'} value={values[0]} small />
            </BadgeContainer>
        },
    ]
)

const CardContainer = styled.div`
  width: 100%;
  padding: 16px;
  position: absolute;
  top: 128px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  overflow-y: scroll;
  overflow-x: hidden;
	margin-bottom: 80px;

  & > * {
    margin-bottom: 16px;
  }
`

const CardCollection = ({ followUpIssues, page, handleExpand }) => (
    <CardContainer>
        {followUpIssues.map(issue =>
            <FollowUpCard
                key={issue.ID}
                id={issue.ID}
                previousNotes={issue.Tier2Notes}
                assignedTo={issue.Tier2Tech ? issue.Tier2Tech.id : 1}
                issue={issue.Issue}
                author={issue.Employee ? issue.Employee.name : 'N/A'}
                companyName={issue.Company ? issue.Company.name : 'N/A'}
                timeCreated={Math.floor(formatDate(issue.DateCreated) / 1000)}
                version={issue.FishbowlVersion}
                onExpand={() => handleExpand(issue.ID)}
            />
        )}
    </CardContainer>
)

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`

const LoadingSpinner = styled(MaterialIcon).attrs({
    children: 'refresh',
    color: colors.secondary
}) `
  animation: ${props => props.loading ? `${rotate} .5s ease-in-out` : ''};
  display: block;
  transform-origin: center center;
`

const LoadedTimeContainer = styled.div`
  background: ${colors.white};
  box-shadow: ${shadows.basic};
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  z-index: 100;
  padding: 8px;
  left: 16px;
  bottom: 16px;
  border-radius: 4px;
  transition: .2s ease;

  & > p {
    margin-left: 8px;
  }
`

class IssuesQueue extends Component {
    state = {
        focusedCard: null,
        showStatusCard: false,
    }

    componentDidMount() {
        this.props.loginRequest()
        this.props.loadAllIssues()
        this.props.loadUsers()
    }

    handleExpand = (id) => {
        this.setState({
            focusedCard: id,
        })
    }

    handleLoadIssues = (pageName) => {
        this.props.loadAllIssues()
    }

    handleCloseStatusCard = () => {
        this.setState({ showStatusCard: false })
    }

    render() {
        const { followUpIssues, loading, lastLoaded, messages, showMenu } = this.props
        const { showStatusCard } = this.state
        const values = [followUpIssues.length]
        return (
            <Fragment>
                <Header
                    handleButtonClick={() => this.setState(({ showStatusCard }) => ({ showStatusCard: !showStatusCard }))}
                    currentStatus={'available'}
                    showMenu={() => showMenu()}
                    navigationComponent={<NavBar
                        navItems={navigationOptions(values)}
                        onPageChange={this.handleLoadIssues}
                        fillWidth
                    />}
                />
                <CardCollection
                    followUpIssues={followUpIssues}
                    handleExpand={this.handleExpand}
                />

                {messages.length > 0
                    ?
                    <ErrorMessage />
                    :
                    <LoadedTimeContainer onClick={() => this.handleLoadIssues()}>
                        <LoadingSpinner loading={loading} />
                        {loading ?
                            <Accent><b>Loading...</b></Accent>
                            :
                            <Accent><b>Last load:</b> {lastLoaded && moment(lastLoaded).format('h:mm:ss a')}</Accent>
                        }
                    </LoadedTimeContainer>
                }
                <PoseGroup>
                    {showStatusCard &&
                        <Scrim key={2}>
                            <StatusCard onRemove={this.handleCloseStatusCard} key={1} />
                        </Scrim>
                    }
                </PoseGroup>
            </Fragment>
        )
    }
}

const mapStateToProps = state => {
    return {
        followUpIssues: state.followUpIssues,
        loading: state.loading,
        lastLoaded: state.lastLoaded,
        messages: state.messages
    }
}

const mapDispatch = dispatch => {
    return {
        loginRequest: (id) => dispatch(loginRequestAction(id)),
        loadAllIssues: () => dispatch(loadFollowUpIssuesAction()),
        loadUsers: () => dispatch(loadUsersAction()),
    }
}

export default connect(mapStateToProps, mapDispatch)(IssuesQueue);