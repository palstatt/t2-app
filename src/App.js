import { connect } from 'react-redux';
import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import moment from 'moment';
import { Header, ClaimedCard, UnclaimedCard } from './components';
import { NavBar, Accent, MaterialIcon, colors, shadows } from 'is-ui-library'
import { loadUsersAction, loadIssuesAction } from './actions';

const navigationOptions = [
  {
    name: 'unclaimed',
    id: 1,
  },
  {
    name: 'claimed',
    id: 2,
  },
]

const CardContainer = styled.div`
  width: 100%;
  padding: 16px;
  position: absolute;
  top: 128px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  overflow: scroll;
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


const LoadedTimeContainer = styled.div`
  background: ${colors.white};
  box-shadow: ${shadows.basic};
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
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

  componentWillMount() {
    this.props.loadIssues('claimed=false', 'unclaimedIssues')
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
    const { unclaimedIssues, claimedIssues, loading, lastLoaded } = this.props
    const { page } = this.state
    return (
      <Fragment>
        <Header
          currentStatus={'available'}
          availableCount={2}
          navigationComponent={<NavBar
                                  navItems={navigationOptions}
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
          <MaterialIcon color={colors.secondary}>refresh</MaterialIcon>
          {!loading &&
            <Accent>
              Last load: {lastLoaded && moment(lastLoaded).format('h:mm:ss a')}
            </Accent>
          }
        </LoadedTimeContainer>
      </Fragment>
    )
  }
}

const mapStateToProps = state => {
  return {
    unclaimedIssues: state.unclaimedIssues,
    claimedIssues: state.claimedIssues,
    loading: state.loading,
    lastLoaded: state.lastLoaded
  }
}

const mapDispatch = dispatch => {
  return {
    loadIssues: (filter, collectionName) => dispatch(loadIssuesAction(filter, collectionName)),
    loadUsers: (filter) => dispatch(loadUsersAction(filter))
  }
}

export default connect(mapStateToProps, mapDispatch)(App);
