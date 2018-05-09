import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { InputTextArea } from 'is-ui-library'
import AnimateHeight from 'react-animate-height'

const FlexBox = styled.div`
  display: flex;
  flex-direction: ${props => props.vertical ? 'column' : 'row'};
  align-items: ${props => props.leftAlign ? 'flex-start': 'center'};
  justify-content: ${props => props.centerJustify ? 'center' : 'space-between'};
`

export default class InitPage extends Component {

  state = {
    
  }

  static propTypes = {

  }

  render() {
    const { animating, onPageChange } = this.props
    return (
      <AnimateHeight
        height={animating ? 0 : 'auto'}
        onAnimationEnd={() => onPageChange()}
        animateOpacity
      >
          <FlexBox vertical leftAlign>
            <InputTextArea
              placeholder="Type notes here..."
              label="Notes"
              rows={3}
            />
          </FlexBox>
      </AnimateHeight>
    )
  }
}
