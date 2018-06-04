import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled, { ThemeProvider } from 'styled-components'
import { getColor } from '../../functions'
import { MaterialIcon, H2, colors } from 'is-ui-library'

const themes = bg => ({
  active: {
    bg,
    check: colors.black,
    fg: colors.black,
  },
  default: {
    bg: 'transparent',
    check: 'transparent',
    fg: colors.black
  }
})

const Container = styled.div`
  background: ${props => props.theme.bg};
  position: relative;
  display: inline-flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 4px 8px;
  border-radius: 4px;
  transition: .2s ease;

  & > * {
    transition: .2s ease;
  }
`

const StatusText = styled(H2)`
  color: ${props => props.theme.fg};
  line-height: normal;
`

const CheckIcon = styled(MaterialIcon).attrs({
  children: 'check',
  large: true,
})`
  color: ${props => props.theme.check};
`

export default class StatusPill extends Component {

  static propTypes = {
    active: PropTypes.bool,
  }

  static defaultProps = {
    status: 'available',
    active: false
  }

  getTheme = status => {
    const { active } = this.props
    const themeList = themes(getColor(status))
    switch(active) {
      case true:
        return themeList.active
      case false:
        return themeList.default
      default:
        return themeList.default
    }
  }

  render() {
    const { status, statusId, changeStatus } = this.props
    const theme = this.getTheme(statusId)
    return (
      <ThemeProvider theme={theme}>
        <Container onClick={() => changeStatus(statusId)}>
          <StatusText>{status.toUpperCase()}</StatusText>
          <CheckIcon />
        </Container>
      </ThemeProvider>
    )
  }
}
