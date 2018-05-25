import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { P, colors, shadows } from 'is-ui-library'

const Container = styled.div`
  background: ${colors.white};
  box-shadow: ${shadows.basic};
  position: fixed;
  bottom: 0;
  width: 90vw;
  z-index: 500;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px 8px 0 0;
  padding: 24px 8px 8px 8px;
`

const HeaderText = styled(P)`
  color: ${colors.grey};
`

export default class StatusCard extends Component {

  state = {

  }

  static propTypes = {

  }

  render() {
    return (
      <Container>
        <HeaderText>I'm currently...</HeaderText>
      </Container>
    )
  }
}
