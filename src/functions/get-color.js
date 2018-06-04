import { colors } from 'is-ui-library'

const getColor = (status = 99) => {
  switch (status){
    case 5:
      return colors.complete
		case 1:
		case 3:
		case 4:
		case 7:
		case 8:
		case 15:
		case 16:
		case 17:
		case 18:
		case 19:
		case 20:
		case 21:
		case 22:
      return colors.attention
    case 2:
		case 6:
      return colors.warning
    default:
      return colors.white
  }
}

export default getColor
