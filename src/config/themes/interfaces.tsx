import {StyleProp, TextStyle, ViewStyle} from 'react-native'

export interface BtnProps {
  container: StyleProp<ViewStyle>
  label: StyleProp<TextStyle>
}

export interface ButtonTheme {
  primary?: BtnProps
  secondary?: BtnProps
  white?: BtnProps
}
