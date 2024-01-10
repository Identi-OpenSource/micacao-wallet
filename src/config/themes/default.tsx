import {Dimensions, PixelRatio, StyleSheet} from 'react-native'

const fontScale = PixelRatio.getFontScale()
const getFontSize = (size: number) => size / fontScale

export const DWH = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
}

export const COLORS_DF = {
  primary: '#5a6d50',
  secondary: '#a2ad84',
  light: '#f2f2db',
  lightGray: '#EAEAE1',
  lightGreen: '#e3d8b8',
  lightBrown: '#b38e6c',
  yellowBrown: '#be6426',
  darkBrown: '#733c18',
  black: '#333333',
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

export const MARGIN_DF = {
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
  // Button styles
  btnPri: {
    width: '100%',
    backgroundColor: COLORS_DF.primary,
    borderRadius: BORDER_RADIUS_DF.medium,
    paddingHorizontal: MARGIN_DF.medium,
    paddingVertical: MARGIN_DF.large * 0.75,
    margin: MARGIN_DF.medium,
  },
  btnPriLab: {
    color: COLORS_DF.light,
    textAlign: 'center',
    fontSize: FONT_SIZES.large,
    fontWeight: '600',
    lineHeight: FONT_SIZES.large,
  },
})
