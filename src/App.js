import React, { Component, Fragment } from 'react'
import { IssuesQueue } from './pages'
import { MenuBar, Scrim } from './components'
import { PoseGroup } from 'react-pose'

export default class App extends Component {

  state = {
    showMenu: false,
  }

  toggleMenu = () => {
    this.setState(({showMenu}) => ({
      showMenu: !showMenu
    }))
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
        <IssuesQueue showMenu={this.toggleMenu}/>
      </Fragment>
    )
  }
}
