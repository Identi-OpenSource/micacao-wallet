import {Dimensions, PixelRatio, StyleSheet} from 'react-native'
import {
  BTN_THEME_DF,
  BTN_THEME_ICON_DF,
  BtnProps,
} from '../../components/button/interfaces'
import {moderateScale, verticalScale} from './metrics'

const fontScale = PixelRatio.getFontScale()
export const getFontSize = (size: number) => size / fontScale

export type Colors = keyof typeof COLORS_DF

export const DWH = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
}

export const COLORS_DF = {
  primary: '#1E4A47',
  secondary: '#a2ad84',
  light: '#f2f2db',
  lightGray: '#F1F1F1',
  lightGreen: '#e3d8b8',
  lightBrown: '#b38e6c',
  yellowBrown: '#be6426',
  darkBrown: '#733c18',
  gray: '#929292',
  grayLight: '#ADADAD',
  black: '#404040',
  white: '#ffffff',
  warning: '#EF4444',
  transparent: 'transparent',
  // Nuevos colores
  neutral: '#DCD4D0',
  cacao: '#4A0000',
  greenAgrayu: '#BDEF12',
  greenAgrayuDisabled: '#F8FDE7',
} as const

export const FONT_FAMILIES = {
  primary: 'Inter-Medium',
  secondary: 'Inter-Regular',
} as const

export const FONT_SIZES = {
  small: moderateScale(14),
  medium: moderateScale(16),
  large: moderateScale(18),
  xslarge: moderateScale(24),
  xlarge: moderateScale(36),
  xxlarge: moderateScale(48),
} as const

export const BORDER_RADIUS_DF = {
  small: 5,
  medium: 10,
  large: 20,
} as const

export const MP_DF = {
  small: 6,
  medium: 10,
  large: 24,
  xlarge: 32,
  xxlarge: 38,
} as const

export const THEME_DF = StyleSheet.create({
  // Text styles
  textNormal: {
    fontSize: FONT_SIZES.medium,
    fontWeight: '200',
    color: COLORS_DF.black,
  },
})

// Button

const STYLE_BTN = (theme: BTN_THEME_DF) => {
  let CL: [string, string]

  switch (theme) {
    case 'primary':
      CL = [COLORS_DF.primary, COLORS_DF.white]
      break
    case 'secondary':
      CL = [COLORS_DF.secondary, COLORS_DF.primary]
      break
    case 'white':
      CL = [COLORS_DF.white, COLORS_DF.primary]
      break
    case 'agrayu':
      CL = [COLORS_DF.greenAgrayu, COLORS_DF.cacao]
      break
    case 'agrayuDisabled':
      CL = [COLORS_DF.greenAgrayuDisabled, COLORS_DF.gray]
      break
    default:
      CL = [COLORS_DF.primary, COLORS_DF.secondary]
      break
  }

  return {
    container: {
      width: '100%',
      height: 62,
      justifyContent: 'center',
      backgroundColor: CL[0],
      borderColor: CL[1],
      borderWidth: 2,
      borderRadius: BORDER_RADIUS_DF.medium,
    },
    label: {
      color: CL[1],
      fontFamily: FONT_FAMILIES.primary,
      textAlign: 'center',
      fontSize: moderateScale(20),
      fontWeight: '700',
      lineHeight: verticalScale(28),
    },
    const: {
      opacity: 0.7,
    },
  } as BtnProps
}

export const BTN_THEME = {
  primary: STYLE_BTN('primary'),
  secondary: STYLE_BTN('secondary'),
  white: STYLE_BTN('white'),
  warning: STYLE_BTN('white'),
  transparent: STYLE_BTN('transparent'),
  agrayu: STYLE_BTN('agrayu'),
  agrayuDisabled: STYLE_BTN('agrayuDisabled'),
} as const

// Icon button

export const STYLE_BTN_ICON = (theme: BTN_THEME_ICON_DF) => {
  let CL: [string, string]

  switch (theme) {
    case 'transparent':
      CL = [COLORS_DF.transparent, COLORS_DF.cacao]
      break
    default:
      CL = [COLORS_DF.primary, COLORS_DF.secondary]
      break
  }

  return {
    container: {
      backgroundColor: CL[0],
      alignItems: 'flex-start',
    },
    const: {
      opacity: 0.7,
      color: CL[1],
    },
  } as BtnProps
}

export const BTN_THEME_ICON = {
  primary: STYLE_BTN_ICON('primary'),
  secondary: STYLE_BTN_ICON('primary'),
  white: STYLE_BTN_ICON('primary'),
  warning: STYLE_BTN_ICON('primary'),
  transparent: STYLE_BTN_ICON('transparent'),
  agrayu: STYLE_BTN_ICON('agrayu'),
  agrayuDisabled: STYLE_BTN_ICON('agrayuDisabled'),
} as const

// Button

const STYLE_BTN_SMALL = (theme: BTN_THEME_DF) => {
  let CL: [string, string]

  switch (theme) {
    case 'primary':
      CL = [COLORS_DF.primary, COLORS_DF.white]
      break
    case 'secondary':
      CL = [COLORS_DF.secondary, COLORS_DF.primary]
      break
    case 'white':
      CL = [COLORS_DF.white, COLORS_DF.primary]
      break
    case 'agrayu':
      CL = [COLORS_DF.greenAgrayu, COLORS_DF.cacao]
      break
    case 'agrayuDisabled':
      CL = [COLORS_DF.greenAgrayuDisabled, COLORS_DF.gray]
      break
    default:
      CL = [COLORS_DF.primary, COLORS_DF.secondary]
      break
  }

  return {
    containerPrincipal: {
      flex: 1,
      alignItems: 'flex-end',
    },
    container: {
      height: 34,
      justifyContent: 'center',
      paddingHorizontal: MP_DF.small,
      backgroundColor: CL[0],
      borderColor: CL[1],
      borderWidth: 2,
      borderRadius: BORDER_RADIUS_DF.medium,
      flexDirection: 'row',
      alignItems: 'center',
    },
    icon: {
      marginRight: MP_DF.small,
    },
    iconColor: CL[1],
    label: {
      color: CL[1],
      fontFamily: FONT_FAMILIES.primary,
      textAlign: 'center',
      fontSize: moderateScale(14),
      fontWeight: '500',
      lineHeight: verticalScale(14),
    },
    const: {
      opacity: 0.7,
    },
  } as BtnProps
}

export const BTN_THEME_SMALL = {
  primary: STYLE_BTN_SMALL('primary'),
  secondary: STYLE_BTN_SMALL('secondary'),
  white: STYLE_BTN_SMALL('white'),
  warning: STYLE_BTN_SMALL('white'),
  transparent: STYLE_BTN_SMALL('transparent'),
  agrayu: STYLE_BTN_SMALL('agrayu'),
  agrayuDisabled: STYLE_BTN_SMALL('agrayuDisabled'),
} as const
