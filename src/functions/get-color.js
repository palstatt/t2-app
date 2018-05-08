import { colors } from 'is-ui-library'

const getColor = status => {
  switch (status){
    case 'available':
      return colors.complete
    case 'busy':
      return colors.attention
    case 'at lunch':
      return colors.warning
    default:
      return ''
  }
}

export default getColor
