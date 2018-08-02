import React, { Component } from 'react'
import styled from 'styled-components'
import { H4, MaterialIcon, colors } from 'is-ui-library'
import { getColor } from '../../functions'

const PillContainer = styled.div`
  background: ${props => getColor(props.statusId) || colors.white};
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
	overflow: hidden;
`

const IconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  width: 40px;
  border-radius: 40px;
`

const TechStatus = styled(H4) `
  margin-left: 8px;
  line-height: normal;
`

export default class TechPill extends Component {
    state = {
    }

    render() {
        const { avatarURL, userName, status, statusId, border, ...props } = this.props
        return (
            <PillContainer status={status} statusId={statusId} border={border} {...props} >
                <TechStatusContainer>
                    {avatarURL
                        ?
                        <Avatar src={avatarURL} alt={userName} />
                        :
                        <IconContainer>
                            <MaterialIcon large>close</MaterialIcon>
                        </IconContainer>
                    }
                    <TechStatus>{status.toUpperCase()}</TechStatus>
                </TechStatusContainer>
            </PillContainer>
        )
    }
}