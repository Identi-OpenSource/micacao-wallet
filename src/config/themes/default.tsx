import {Dimensions, PixelRatio, StyleSheet} from 'react-native'
import {ButtonTheme} from './interfaces'
import {BtnProps} from '../../components/button/interfaces'

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
  gray: '#C8C8C8',
  black: '#404040',
  white: '#ffffff',
  warning: '#d32e28',
} as const

export const FONT_FAMILIES = {
  primary: 'Inter-Medium',
  secondary: 'Roboto',
} as const

export const FONT_SIZES = {
  small: getFontSize(14),
  medium: getFontSize(16),
  large: getFontSize(18),
  xlarge: getFontSize(36),
  xxlarge: getFontSize(48),
} as const

export const BORDER_RADIUS_DF = {
  small: 5,
  medium: 10,
  large: 20,
} as const

export const MP_DF = {
  small: 5,
  medium: 10,
  large: 20,
} as const

export const THEME_DF = StyleSheet.create({
  // Text styles
  textNormal: {
    fontSize: FONT_SIZES.medium,
    fontWeight: '200',
    color: COLORS_DF.black,
  },
})

const STYLE_BTN = (theme: 'primary' | 'secondary' | 'white') => {
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
    default:
      CL = [COLORS_DF.primary, COLORS_DF.secondary]
      break
  }

  return {
    container: {
      width: '100%',
      height: 60,
      justifyContent: 'center',
      borderRadius: BORDER_RADIUS_DF.medium,
      paddingHorizontal: MP_DF.large * 1.5,
      paddingVertical: MP_DF.large * 0.75,
      marginVertical: MP_DF.medium,
      backgroundColor: CL[0],
    },
    label: {
      textAlign: 'center',
      fontSize: FONT_SIZES.large,
      lineHeight: FONT_SIZES.large,
      color: CL[1],
    },
  } as BtnProps
}

export const BTN_THEME = {
  primary: STYLE_BTN('primary'),
  secondary: STYLE_BTN('secondary'),
  white: STYLE_BTN('white'),
} as ButtonTheme
