import React from 'react'
import {Text, TouchableOpacity} from 'react-native'
import {BTN_THEME} from '../../config/themes/default'
import {ButtonProps} from './interfaces'

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
