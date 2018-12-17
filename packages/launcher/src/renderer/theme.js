import COLORS from './colors'

export default {
  Button: {
    onboarding: {
      padding: 0,
      titleColor: COLORS.PRIMARY_RED,
      titleHoverColor: COLORS.PRIMARY_DARK_RED,
      iconColor: COLORS.PRIMARY_RED,
      iconHoverColor: COLORS.PRIMARY_DARK_RED,
      borderWidth: 0,
    },
  },
  Text: {
    default: {
      fontWeight: '300',
    },
    regular: {
      fontWeight: '400',
    },
    error: {
      paddingBottom: 10,
      color: COLORS.PRIMARY_RED,
    },
  },
  styled: {
    colors: COLORS,
    spacing: 10,
  },
}
