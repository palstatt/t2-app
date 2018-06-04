import styled from 'styled-components'
import posed from 'react-pose'

const scrimProps = {
  enter: { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  exit: { backgroundColor: 'rgba(0, 0, 0, 0) '}
}

const Scrim = styled(posed.div(scrimProps))`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100vh;
  width: 100vw;
  z-index: 400;
`

export default Scrim
