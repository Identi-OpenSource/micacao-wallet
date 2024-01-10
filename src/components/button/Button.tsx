import React from 'react'
import {
  StyleProp,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native'
import {THEME_DF} from '../../config/themes/default'

interface ButtonProps {
  title: string
  onPress: () => void
  disabled?: boolean
  style?: {
    container?: StyleProp<ViewStyle>
    label?: StyleProp<TextStyle>
  }
}

export const BtnPrimary = (props: ButtonProps) => {
  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={[THEME_DF.btnPri, props.style?.container]}>
      <Text style={[THEME_DF.btnPriLab, props.style?.label]}>
        {props.title}
      </Text>
    </TouchableOpacity>
  )
}
