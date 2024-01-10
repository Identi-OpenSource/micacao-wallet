import {Dimensions, PixelRatio, StyleSheet} from 'react-native'
import {ButtonTheme} from './interfaces'

const fontScale = PixelRatio.getFontScale()
export const getFontSize = (size: number) => size / fontScale

export const DWH = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
}

export const COLORS_DF = {
  primary: '#1E4A47',
  secondary: '#a2ad84',
  light: '#f2f2db',
  lightGray: '#EAEAE1',
  lightGreen: '#e3d8b8',
  lightBrown: '#b38e6c',
  yellowBrown: '#be6426',
  darkBrown: '#733c18',
  black: '#333333',
  white: '#ffffff',
}

export const FONT_FAMILIES = {
  primary: 'Inter-Medium',
  secondary: 'Roboto',
}

export const FONT_SIZES = {
  small: getFontSize(14),
  medium: getFontSize(16),
  large: getFontSize(18),
  xlarge: getFontSize(32),
  xxlarge: getFontSize(48),
}

export const BORDER_RADIUS_DF = {
  small: 5,
  medium: 10,
  large: 20,
}

export const MP_DF = {
  small: 5,
  medium: 10,
  large: 20,
}

export const THEME_DF = StyleSheet.create({
  // Text styles
  textNormal: {
    fontSize: FONT_SIZES.medium,
    fontWeight: '200',
    color: COLORS_DF.black,
  },
})

const STYLE_BTN = {
  container: {
    width: '100%',
    height: 60,
    justifyContent: 'center',
    borderRadius: BORDER_RADIUS_DF.medium,
    paddingHorizontal: MP_DF.large * 1.5,
    paddingVertical: MP_DF.large * 0.75,
    marginVertical: MP_DF.medium,
  },
  label: {
    color: COLORS_DF.light,
    textAlign: 'center',
    fontSize: FONT_SIZES.large,
    fontWeight: '600',
    lineHeight: FONT_SIZES.large,
  },
}

export const BTN_THEME = {
  primary: {
    container: {
      ...STYLE_BTN.container,
      backgroundColor: COLORS_DF.primary,
    },
    label: {
      ...STYLE_BTN.label,
      color: COLORS_DF.light,
    },
  },
  secondary: {
    container: {
      ...STYLE_BTN.container,
      backgroundColor: COLORS_DF.secondary,
    },
    label: {
      ...STYLE_BTN.label,
      color: COLORS_DF.light,
    },
  },
  white: {
    container: {
      ...STYLE_BTN.container,
      backgroundColor: COLORS_DF.white,
    },
    label: {
      ...STYLE_BTN.label,
      color: COLORS_DF.primary,
    },
  },
} as ButtonTheme
