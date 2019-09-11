import COLORS from './colors'

const MARGINS = {
  margin0: { margin: 0 },
  marginLeft5: {
    margin: '0 0 0 5px',
  },
  marginLeft10: {
    margin: '0 0 0 10px',
  },
  marginLeft15: {
    margin: '0 0 0 15px',
  },
  marginLeft20: {
    margin: '0 0 0 20px',
  },
  marginRight10: {
    margin: '0 10px 0 0',
  },
  marginRight15: {
    margin: '0 15px 0 0',
  },
  marginRight5: {
    margin: '0 5px 0 0',
  },
  marginRight20: {
    margin: '0 20px 0 0',
  },
  marginTop5: {
    margin: '5px 0 0 0',
  },
  marginTop10: {
    margin: '10px 0 0 0',
  },
  marginTop15: {
    margin: '15px 0 0 0',
  },
  marginTop20: {
    margin: '20px 0 0 0',
  },
  marginBottom5: {
    margin: '0 0 5px 0',
  },
  marginBottom10: {
    margin: '0 0 10px 0',
  },
  marginBottom15: {
    margin: '0 0 15px 0',
  },
  marginBottom20: {
    margin: '0 0 20px 0',
  },
  marginVertical5: {
    margin: '5px 0',
  },
  marginVertical10: {
    margin: '10px 0',
  },
  marginVertical15: {
    margin: '15px 0',
  },
  marginVertical20: {
    margin: '20px 0',
  },
  marginHorizontal5: {
    margin: '0 5px',
  },
  marginHorizontal10: {
    margin: '0 10px',
  },
  marginHorizontal15: {
    margin: '0 15px',
  },
  marginHorizontal20: {
    margin: '0 20px',
  },
}

const PADDING = {
  padding0: {
    padding: 0,
  },
  paddingLeft5: {
    padding: '0 0 0 5px',
  },
  paddingLeft10: {
    padding: '0 0 0 10px',
  },
  paddingLeft15: {
    padding: '0 0 0 15px',
  },
  paddingLeft20: {
    padding: '0 0 0 20px',
  },
  paddingRight10: {
    padding: '0 10px 0 0',
  },
  paddingRight15: {
    padding: '0 15px 0 0',
  },
  paddingRight5: {
    padding: '0 5px 0 0',
  },
  paddingRight20: {
    padding: '0 20px 0 0',
  },
  paddingTop5: {
    padding: '5px 0 0 0',
  },
  paddingTop10: {
    padding: '10px 0 0 0',
  },
  paddingTop15: {
    padding: '15px 0 0 0',
  },
  paddingTop20: {
    padding: '20px 0 0 0',
  },
  paddingBottom5: {
    padding: '0 0 5px 0',
  },
  paddingBottom10: {
    padding: '0 0 10px 0',
  },
  paddingBottom15: {
    padding: '0 0 15px 0',
  },
  paddingBottom20: {
    padding: '0 0 20px 0',
  },
  paddingVertical5: {
    padding: '5px 0',
  },
  paddingVertical10: {
    padding: '10px 0',
  },
  paddingVertical15: {
    padding: '15px 0',
  },
  paddingVertical20: {
    padding: '20px 0',
  },
  paddingHorizontal5: {
    padding: '0 5px',
  },
  paddingHorizontal10: {
    padding: '0 10px',
  },
  paddingHorizontal15: {
    padding: '0 15px',
  },
  paddingHorizontal20: {
    padding: '0 20px',
  },
}

export default {
  Button: {
    default: {
      backgroundColor: 'transparent',
      backgroundHoverColor: 'transparent',
      iconBackgroundColor: 'transparent',
      iconHoverBackgroundColor: 'transparent',
      iconHoverColor: COLORS.PRIMARY_RED,
      titleDisabledColor: '#FFF',
      iconDisabledColor: '#F8CFDD',
      backgroundDisabledColor: '#F8CFDD',
    },
    TuiWalletsButton: {
      fontSize: '11px',
      backgroundColor: '#010101',
      backgroundHoverColor: '#303030',
      titleColor: '#5C5C5C',
      fontWeight: 'bold',
      titleHoverColor: '#A9A9A9',
      borderWidth: 0,
      iconWidth: 20,
      iconHeight: 20,
      titlePadding: '8px 13px 8px 9px',
      iconPadding: '0 7px 0 0',
      iconColor: '#5C5C5C',
      iconHoverColor: '#A9A9A9',
    },
    TuiUrl: {
      borderColor: 'transparent',
      borderHoverColor: 'transparent',
      backgroundHoverColor: '#000',
      iconHoverColor: '#D3D3D3',
      titlePadding: '0',
      iconWidth: '10px',
      iconHeight: '10px',
      iconPadding: '4px',
      margin: '0 6px 0 0',
    },
    onboarding: {
      padding: 0,
      titleColor: COLORS.PRIMARY_RED,
      titleHoverColor: COLORS.PRIMARY_DARK_RED,
      iconColor: COLORS.PRIMARY_RED,
      iconHoverColor: COLORS.PRIMARY_DARK_RED,
      borderWidth: 0,
      iconPadding: '3px',
      letterSpacing: '1.1px',
      backgroundDisabledColor: 'transparent',
      titleDisabledColor: '#F8CFDD',
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
      fontSize: 11,
      iconPadding: '5px',
      iconMargin: 0,
      titlePadding: 0,
    },
    leftNavActive: {
      fontWeight: 'normal',
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
    walletOnboarding: {
      iconHoverBackgroundColor: COLORS.PRIMARY_RED,
      iconHoverColor: COLORS.WHITE,
      iconWidth: 18,
      iconHeight: 18,
      iconPadding: '8px',
      titlePadding: '8px',
    },
    small: {
      titlePadding: '5px 10px',
      fontSize: 9,
    },
    medium: {
      iconWidth: 14,
      iconHeight: 14,
      fontSize: 11,
      borderRadius: 3,
      iconPadding: '7px 5px',
      titlePadding: '3px 5px',
    },
    mediumUppercase: {
      textTransform: 'uppercase',
      iconWidth: 14,
      iconHeight: 14,
      fontSize: 10,
      iconPadding: '7px 5px',
      titlePadding: '6px 12px',
    },
    xSmall: {
      iconWidth: 10,
      iconHeight: 10,
      fontSize: 9,
      borderRadius: 3,
      iconPadding: '3px 5px',
      titlePadding: '3px 5px',
    },
    xSmallIconOnly: {
      iconWidth: 14,
      iconHeight: 14,
      iconPadding: '5px',
      fontSize: 9,
      borderRadius: 3,
    },
    suggestedInstall: {
      backgroundHoverColor: COLORS.PRIMARY_RED,
      titleHoverColor: 'white',
      titlePadding: '3px 10px',
      margin: '10px 0 0 0',
    },
    red: {
      borderWidth: 0,
      backgroundColor: COLORS.PRIMARY_RED,
      backgroundHoverColor: COLORS.PRIMARY_DARK_RED,
      titleColor: COLORS.WHITE,
      titleHoverColor: COLORS.WHITE,
    },
    redOutline: {
      titleColor: COLORS.PRIMARY_RED,
      borderWidth: 1,
      borderColor: COLORS.PRIMARY_RED,
      borderHoverColor: 'transparent',
      hoverShadow: true,
      iconPadding: '6px 10px 6px 0',
      iconWidth: 10,
      iconHeight: 10,
      iconColor: COLORS.PRIMARY_RED,
      iconHoverColor: COLORS.PRIMARY_RED,
    },
    hoverShadow: {
      hoverShadow: true,
      borderHoverColor: 'transparent',
    },
    modalButton: {
      titlePadding: '10px 30px',
      fontSize: 12,
    },
    TuiButton: {
      minWidth: '105px',
      titlePadding: '10px 15px',
      fontSize: 10,
      titleColor: '#3C3C3C',
      titleHoverColor: '#3C3C3C',
      backgroundColor: '#FFF',
      backgroundHoverColor: '#A9A9A9',
      borderColor: 'transparent',
      borderHoverColor: 'transparent',
      backgroundDisabledColor: '#6f6f6f',
      borderDisabledColor: 'transparent',
    },
    TuiButtonDismiss: {
      titleColor: '#C0C0C0',
      titleHoverColor: '#A9A9A9',
      backgroundColor: 'transparent',
      backgroundHoverColor: 'transparent',
      borderColor: 'transparent',
      borderHoverColor: 'transparent',
    },
    grey: {
      titleColor: COLORS.GREY_A9,
    },
    noTitle: {
      titlePadding: '0',
    },
    seedWord: {
      titlePadding: '5px 8px',
    },
    selectedSeedWord: {
      titlePadding: '5px 8px',
      borderColor: '#A9A9A9',
      borderHoverColor: '#A9A9A9',
      backgroundColor: '#A9A9A9',
      backgroundHoverColor: '#A9A9A9',
      titleHoverColor: COLORS.WHITE,
      titleColor: COLORS.WHITE,
    },
    full: {
      minWidth: '100%',
    },
    updateButton: {
      minWidth: '84px',
      titlePadding: '2px 0',
      backgroundColor: COLORS.PRIMARY_RED,
      backgroundHoverColor: COLORS.PRIMARY_DARK_RED,
      titleHoverColor: COLORS.WHITE,
      titleColor: COLORS.WHITE,
      borderColor: 'transparent',
      borderHoverColor: 'transparent',
      fontSize: 9,
      fontWeight: 'bold',
      margin: '5px 0 0 0',
    },
    editRedButton: {
      iconColor: COLORS.PRIMARY_RED,
      borderColor: COLORS.PRIMARY_RED,
    },
    ...MARGINS,
  },
  Text: {
    default: {
      fontWeight: '300',
    },
    mono: {
      fontFamily: 'IBM Plex Mono',
    },
    regular: {
      fontWeight: '400',
    },
    tooltipTitle: {
      display: 'block',
      color: COLORS.PRIMARY_RED,
      fontWeight: 'bold',
      fontSize: 11,
      marginBottom: '10px',
    },
    tooltipText: {
      display: 'block',
      fontSize: 11,
      marginBottom: '10px',
    },

    error: {
      paddingBottom: 10,
      color: COLORS.PRIMARY_RED,
    },
    opacity50: {
      opacity: '0.5',
    },
    requiredLabel: {
      margin: '0 0 6px 20px',
    },
    appsTitle: {
      textTransform: 'uppercase',
      color: COLORS.GREY_A9,
      fontSize: 10,
      letterSpacing: '1.5px',
      padding: '20px 0 10px 5px',
    },
    smallTitle: {
      textTransform: 'uppercase',
      color: COLORS.GREY_A9,
      fontSize: 10,
      letterSpacing: '1.5px',
      padding: '20px 0',
    },
    mediumTitle: {
      textTransform: 'uppercase',
      fontSize: 12,
      fontWeight: 'bold',
      letterSpacing: '1.5px',
    },
    smallLabel: {
      textTransform: 'uppercase',
      fontWeight: 'bold',
      color: COLORS.LIGHT_GREY_C0,
      fontSize: 10,
      letterSpacing: '1.5px',
      marginTop: '20px',
    },
    suggestedAppButtonName: {
      fontSize: '12px',
      color: '#303030',
      fontWeight: 'bold',
    },
    suggestedAppDescription: {
      fontSize: '10px',
      color: '#808080',
    },
    appButtonName: {
      fontSize: '12px',
      color: '#303030',
      fontWeight: 'bold',
      textAlign: 'center',
      width: '100%',
    },
    appButtonId: {
      fontSize: '10px',
      color: '#808080',
      textAlign: 'center',
      width: '72px',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
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
    italic: {
      fontStyle: 'italic',
    },
    noPadding: {
      padding: 0,
    },
    small: {
      fontSize: 11,
    },
    size13: {
      fontSize: 13,
    },
    ellipsis: {
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    copyableBlock: {
      fontFamily: 'IBM Plex Mono',
      padding: '20px 20px',
      textAlign: 'center',
      color: '#303030',
      fontSize: 13,
    },
    center: {
      textAlign: 'center',
    },
    modalText: {
      fontSize: 13,
      color: '#585858',
    },
    padding10: {
      padding: '10px',
    },
    redButton: {
      borderRadius: '3px',
      padding: '5px',
      backgroundColor: COLORS.PRIMARY_RED,
      fontWeight: 'bold',
    },
    smallButton: {
      fontSize: '9px',
      borderRadius: '3px',
      padding: '5px 10px',
      borderColor: '#808080',
      borderWidth: '1px',
      borderStyle: 'solid',
      fontWeight: 'bold',
      color: '#808080',
    },
    flex1: {
      flex: 1,
    },
    TuiHeader: {
      fontWeight: 'bold',
      color: '#808080',
      fontSize: '14px',
    },
    TuiPermissionDeniedLabel: {
      fontSize: '11px',
      backgroundColor: COLORS.TRANSPARENT_BLACK_80,
      color: COLORS.LIGHT_GREY_E5,
      padding: '4px 6px',
    },
    TuiAppTitle: {
      padding: '6px 0',
      fontSize: '10px',
      color: 'white',
      fontWeight: 'bold',
      letterSpacing: '1px',
      textTransform: 'uppercase',
    },
    ...MARGINS,
    ...PADDING,
  },
  TextField: {
    default: {
      iconPadding: '5px',
    },
    search: {
      padding: '5px',
      fontSize: 13,
      iconWidth: 14,
      iconHeight: 14,
    },
    trustedUI: {
      padding: '2px',
      borderColor: 'transparent',
      backgroundColor: 'transparent',
      textColor: '#A9A9A9',
      textActiveColor: '#A9A9A9',
      labelColor: '#808080',
      labelActiveColor: 'transparent',
      labelWithContentColor: 'transparent',
    },
  },
  Checkbox: {
    mono: {
      fontFamily: 'IBM Plex Mono',
    },
    TrustedUI: {
      checkSymbolSize: 13,
      backgroundColor: 'transparent',
      containerBorderColor: '#929292',
      backgroundCheckedColor: '#fff',
      containerCheckedBorderColor: '#fff',
      fontSize: 11,
      labelColor: '#FFF',
      labelCheckedColor: '#FFF',
      margin: '10px 0 0 0',
    },
  },
  DropDown: {
    default: {
      padding: '5px 10px',
      menuItemPadding: '5px 10px',
    },
    maxWidth440: {
      maxWidth: 440,
    },
    error: {
      borderColor: COLORS.ERROR_RED,
    },
  },
  Tooltip: {
    default: {
      margin: '5px',
    },
  },
  styled: {
    colors: COLORS,
    spacing: 10,
  },
}
