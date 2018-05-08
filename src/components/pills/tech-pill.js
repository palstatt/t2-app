import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { H4, colors } from 'is-ui-library'
import { getColor } from '../../functions'
import closeImage from '../../content/close.png'

const PillContainer = styled.div`
  background: ${props => getColor(props.status) || colors.white};
  border: ${props => props.border ? `2px solid ${colors.black}` : ''};
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 20px;
`

const TechStatusContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const Avatar = styled.img`
  height: 40px;
  width: 40px;
  border-radius: 40px;
  object-fit: cover;
`

const TechStatus = styled(H4)`
  margin-left: 8px;
  line-height: normal;
`

export default class TechPill extends Component {

  state = {

  }

  render() {
    const { avatarURL, status, border, ...props } = this.props
    return (
      <PillContainer status={status} border={border} {...props} >
        <TechStatusContainer>
          <Avatar src={avatarURL} onError={(e) => {e.target.src=closeImage}} />
          <TechStatus>{status.toUpperCase()}</TechStatus>
        </TechStatusContainer>
      </PillContainer>
    )
  }
}
