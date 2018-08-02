import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { IssuesQueue, FollowUp } from './pages'
import { MenuBar, Scrim } from './components'
import { PoseGroup } from 'react-pose'
import FeedbackButton from './feedback-button'

class App extends Component {
  state = {
    showMenu: false,
  }

  toggleMenu = () => {
    this.setState(({showMenu}) => ({
      showMenu: !showMenu
    }))
  }

  showPage = () => {
    const { currentPage } = this.props
    switch(currentPage) {
      case 'issuesQueue':
        return <IssuesQueue showMenu={this.toggleMenu}/>
      case 'followUp':
        return <FollowUp showMenu={this.toggleMenu}/>
      default:
        return <IssuesQueue showMenu={this.toggleMenu}/>
    }
  }

  render() {
    const { showMenu } = this.state
    return (
      <Fragment>
        <PoseGroup>
          {showMenu &&
            <Scrim key={'scrim'}>
              <MenuBar
                closeMenu={this.toggleMenu}
                key={'menu'}
              />
            </Scrim>
          }
        </PoseGroup>
				{this.showPage()}
				<FeedbackButton />
      </Fragment>
    )
  }
}

const mapStateToProps = state => {
  return {
    currentPage: state.currentPage
  }
}

export default connect(mapStateToProps)(App)