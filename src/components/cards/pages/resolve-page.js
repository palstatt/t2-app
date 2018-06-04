import React, { Component } from 'react'
import styled from 'styled-components'
import { InputTextArea } from 'is-ui-library'
import AnimateHeight from 'react-animate-height'

const AnimateHeightStyled = styled(AnimateHeight)`
  margin: 8px 0;
`

const FlexBox = styled.div`
  display: flex;
  flex-direction: ${props => props.vertical ? 'column' : 'row'};
  align-items: ${props => props.leftAlign ? 'flex-start': 'center'};
  justify-content: ${props => props.centerJustify ? 'center' : 'space-between'};
`

export default class ResolvePage extends Component {

  state = {
    rendered: true,
  }

	handleType = e => {
		const { onTypeNotes } = this.props
		onTypeNotes(e.target.value)
	}

  render() {
    const { rendered } = this.state
		const { notes } = this.props
    return (
      <AnimateHeightStyled
        height={rendered ? 'auto' : 0}
        animateOpacity
      >
          <FlexBox vertical leftAlign>
            <InputTextArea
              placeholder="Type notes here..."
              label="Notes"
              rows={3}
							value={notes}
							onChange={this.handleType}
            />
          </FlexBox>
      </AnimateHeightStyled>
    )
  }
}
