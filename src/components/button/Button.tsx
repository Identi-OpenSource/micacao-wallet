import React from 'react'
import {Text, TouchableOpacity} from 'react-native'
import {BTN_THEME} from '../../config/themes/default'
import {BtnProps} from '../../config/themes/interfaces'

interface ButtonProps {
  title: string
  theme?: 'primary' | 'secondary' | 'white'
  onPress: () => void
  disabled?: boolean
  style?: BtnProps
}

export const Btn = (props: ButtonProps) => {
  const theme = props.theme || 'primary'
  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={[BTN_THEME[theme]?.container, props.style?.container]}>
      <Text style={[BTN_THEME[theme]?.label, props.style?.label]}>
        {props.title}
      </Text>
    </TouchableOpacity>
  )
}
