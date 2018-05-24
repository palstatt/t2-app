import { NavBar, Accent, MaterialIcon, Badge, colors, shadows } from 'is-ui-library'
import { connect } from 'react-redux';
import React, { Component, Fragment } from 'react';
import moment from 'moment';
import styled, { keyframes } from 'styled-components';

import { Header, ClaimedCard, UnclaimedCard, ErrorMessage } from './components';
import {
  loadAllIssuesAction,
  loadIssuesAction,
  loadUsersAction,
  loginRequestAction
} from './actions';

const navigationOptions = (values = [0, 0]) => (
  [
    {
      name: 'unclaimed',
      id: 1,
      childComponent: <Badge theme="warning" value={values[0]} small/>
    },
    {
      name: 'claimed',
      id: 2,
      childComponent: <Badge theme="attention" value={values[1]} small/>
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
  & > * {
    margin-bottom: 16px;
  }
`

const CardCollection = ({ unclaimedIssues, claimedIssues, page, handleExpand }) => (
  <CardContainer>
    {page === 'unclaimed'
      ?
      unclaimedIssues.map(issue =>
        <UnclaimedCard
          key={issue.id}
          id={issue.id}
          issue={issue.title}
          author={issue.author}
          companyName={issue.company}
          timeCreated={issue.request_date}
          version={issue.version}
          onExpand={() => handleExpand(issue.id)}
        />
      )
      :
      claimedIssues.map(issue =>
        <ClaimedCard
          key={issue.id}
          id={issue.id}
          assignedTo={issue.assigned_to}
          issue={issue.title}
          author={issue.author}
          companyName={issue.company}
          timeCreated={issue.request_date}
          version={issue.version}
          onExpand={() => handleExpand(issue.id)}
        />
      )
    }
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
})`
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

class App extends Component {

  state = {
    focusedCard: null,
    page: 'unclaimed',
  }

  componentDidMount() {
    this.props.loginRequest(142)
    this.props.loadAllIssues()
    this.props.loadUsers('claimed=true')
  }

  handleExpand = (id) => {
    this.setState({
      focusedCard: id,
    })
  }

  handleLoadIssues = (pageName) => {
    const flag = pageName === 'claimed'
    this.setState({page: pageName})
    this.props.loadIssues(`claimed=${flag}`, `${pageName}Issues`)
  }

  render() {
    const { unclaimedIssues, claimedIssues, loading, lastLoaded, messages } = this.props
    const { page } = this.state
    const values = [ unclaimedIssues.length, claimedIssues.length ]
    return (
      <Fragment>
        <Header
          currentStatus={'available'}
          navigationComponent={<NavBar
                                  navItems={navigationOptions(values)}
                                  onPageChange={this.handleLoadIssues}
                                  fillWidth
                               />}
        />
        <CardCollection
          unclaimedIssues={unclaimedIssues}
          claimedIssues={claimedIssues}
          page={page}
          handleExpand={this.handleExpand}
        />
        <LoadedTimeContainer onClick={() => this.handleLoadIssues(page)}>
          <LoadingSpinner loading={loading}/>
            <Accent>
              Last load: {lastLoaded && moment(lastLoaded).format('h:mm:ss a')}
            </Accent>
        </LoadedTimeContainer>
        {messages.length > 0 &&
          <ErrorMessage />
        }
      </Fragment>
    )
  }
}

const mapStateToProps = state => {
  return {
    unclaimedIssues: state.unclaimedIssues,
    claimedIssues: state.claimedIssues,
    loading: state.loading,
    lastLoaded: state.lastLoaded,
    messages: state.messages
  }
}

const mapDispatch = dispatch => {
  return {
    loginRequest: (id) => dispatch(loginRequestAction(id)),
    loadAllIssues: () => dispatch(loadAllIssuesAction()),
    loadIssues: (filter, collectionName) => dispatch(loadIssuesAction(filter, collectionName)),
    loadUsers: (filter) => dispatch(loadUsersAction(filter))
  }
}

export default connect(mapStateToProps, mapDispatch)(App);
