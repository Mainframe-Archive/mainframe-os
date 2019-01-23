import COLORS from './colors'

export default {
  Button: {
    default: {
      backgroundColor: 'transparent',
      backgroundHoverColor: 'transparent',
      backgroundDisabledColor: 'transparent',
      iconBackgroundColor: 'transparent',
      iconHoverBackgroundColor: 'transparent',
      iconHoverColor: COLORS.PRIMARY_RED,
    },
    onboarding: {
      padding: 0,
      titleColor: COLORS.PRIMARY_RED,
      titleHoverColor: COLORS.PRIMARY_DARK_RED,
      iconColor: COLORS.PRIMARY_RED,
      iconHoverColor: COLORS.PRIMARY_DARK_RED,
      borderWidth: 0,
      iconPadding: 0,
    },
    leftNav: {
      iconPosition: 'top',
      titleColor: COLORS.GREY_DARK_80,
      iconColor: COLORS.GREY_DARK_80,
      titleHoverColor: COLORS.PRIMARY_BLUE,
      iconHoverColor: COLORS.PRIMARY_BLUE,
      borderWidth: 0,
      padding: 0,
      fontWeight: 'normal',
      fontSize: 13,
      iconPadding: '5px',
      iconMargin: 0,
      titlePadding: 0,
    },
    leftNavActive: {
      fontWeight: 'bold',
      titleColor: COLORS.PRIMARY_BLUE,
      iconColor: COLORS.PRIMARY_BLUE,
      titleHoverColor: COLORS.PRIMARY_BLUE,
      iconHoverColor: COLORS.PRIMARY_BLUE,
    },
    completeOnboarding: {
      fontWeight: 'normal',
      borderHoverColor: 'transparent',
      hoverShadow: true,
    },
    small: {
      titlePadding: '5px 10px',
      fontSize: 9,
    },
    xSmall: {
      iconWidth: 14,
      iconHeight: 14,
      padding: 5,
      fontSize: 9,
      borderRadius: 3,
    },
    xSmallIconOnly: {
      iconWidth: 14,
      iconHeight: 14,
      iconPadding: '5px',
      fontSize: 9,
      borderRadius: 3,
    },
    red: {
      borderWidth: 0,
      backgroundColor: COLORS.PRIMARY_RED,
      backgroundHoverColor: COLORS.PRIMARY_DARK_RED,
      titleColor: COLORS.WHITE,
      titleHoverColor: COLORS.WHITE,
    },
    modalButton: {
      titlePadding: '10px 30px',
      fontSize: 12,
    },
    grey: {
      titleColor: COLORS.GREY_A9,
    },
    noTitle: {
      titlePadding: '0',
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
    smallTitle: {
      textTransform: 'uppercase',
      color: COLORS.GREY_A9,
      fontSize: 10,
      letterSpacing: '1.5px',
      padding: '20px 0',
    },
    appButtonName: {
      fontSize: '12px',
      color: '#303030',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    appButtonId: {
      fontSize: '10px',
      color: '#808080',
      textAlign: 'center',
      width: '72px',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'elipsis',
    },
    grey: {
      color: COLORS.GREY_A9,
    },
    greyMed: {
      color: COLORS.GREY_MED_58,
    },
    greyDark: {
      color: COLORS.GREY_DARK_30,
    },
    greyDark23: {
      color: COLORS.GREY_DARK_23,
    },
    blue: {
      color: COLORS.DARK_BLUE,
    },
    red: {
      color: COLORS.PRIMARY_RED,
    },
    noPadding: {
      padding: 0,
    },
    small: {
      fontSize: 11,
    },
    elipsis: {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    addressLarge: {
      backgroundColor: '#F9F9F9',
      padding: '30px 20px',
      textAlign: 'center',
      color: '#303030',
      fontSize: 13,
    },
  },
  TextField: {
    search: {
      padding: '5px',
      fontSize: 13,
      iconWidth: 14,
      iconHeight: 14,
    },
  },
  styled: {
    colors: COLORS,
    spacing: 10,
  },
}
