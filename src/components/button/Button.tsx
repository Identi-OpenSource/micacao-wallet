import React from 'react'
import {Text, TouchableOpacity, View} from 'react-native'
import {
  BTN_THEME,
  BTN_THEME_ICON,
  BTN_THEME_SMALL,
} from '../../config/themes/default'
import {ButtonIconProps, ButtonProps} from './interfaces'
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome'
import {IconProp} from '@fortawesome/fontawesome-svg-core'

export const Btn = (props: ButtonProps) => {
  const theme = props.theme || 'primary'
  return (
    <TouchableOpacity
      {...props}
      onPress={props.onPress}
      activeOpacity={BTN_THEME[theme]?.const?.opacity}
      style={[BTN_THEME[theme]?.container, props.style?.container]}>
      {props.icon && (
        <View style={BTN_THEME[theme]?.icon}>
          <FontAwesomeIcon
            icon={props.icon as IconProp}
            size={24}
            color={BTN_THEME[theme]?.iconColor}
          />
        </View>
      )}
      {props.title && (
        <Text style={[BTN_THEME[theme]?.label, props.style?.label]}>
          {props.title}
        </Text>
      )}
    </TouchableOpacity>
  )
}

export const BtnIcon = (props: ButtonIconProps) => {
  const theme = props.theme || 'primary'
  return (
    <TouchableOpacity
      onPress={props.onPress}
      activeOpacity={BTN_THEME_ICON[theme]?.const?.opacity}
      style={[BTN_THEME_ICON[theme]?.container, props.style?.container]}>
      <FontAwesomeIcon
        icon={props.icon as IconProp}
        size={props.size || 16}
        color={BTN_THEME_ICON[theme].const?.color || 'black'}
      />
    </TouchableOpacity>
  )
}

export const BtnSmall = (props: ButtonProps) => {
  const theme = props.theme || 'primary'
  return (
    <View style={BTN_THEME_SMALL[theme]?.containerPrincipal}>
      <TouchableOpacity
        {...props}
        onPress={props.onPress}
        activeOpacity={BTN_THEME_SMALL[theme]?.const?.opacity}
        style={[BTN_THEME_SMALL[theme]?.container, props.style?.container]}>
        {props.icon && (
          <Text style={BTN_THEME_SMALL[theme]?.icon}>
            <FontAwesomeIcon
              icon={props.icon as IconProp}
              color={BTN_THEME_SMALL[theme]?.iconColor}
            />
          </Text>
        )}
        {props.title && (
          <Text style={[BTN_THEME_SMALL[theme]?.label, props.style?.label]}>
            {props.title}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  )
}
