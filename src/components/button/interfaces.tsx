import {StyleProp, TextStyle, ViewStyle} from 'react-native'

export interface ButtonProps {
  title: string
  theme?: 'primary' | 'secondary' | 'white'
  onPress: () => void
  disabled?: boolean
  style?: BtnProps
}

export interface BtnProps {
  container: StyleProp<ViewStyle>
  label: StyleProp<TextStyle>
}
