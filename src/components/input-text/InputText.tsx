import React from 'react'
import {StyleSheet, Text, TextInput, View} from 'react-native'
import {
  BORDER_RADIUS_DF,
  COLORS_DF,
  FONT_FAMILIES,
  FONT_SIZES,
  MP_DF,
} from '../../config/themes/default'
import {InputTextProps} from './interfaces'
import {formatPhone} from '../../utils/formatPhone'
import {formatPin} from '../../utils/formatPin'

export const InputText = (props: InputTextProps) => {
  console.log('InputText', props)
  const {
    label,
    keyboardType,
    placeholder,
    preFormate,
    secureTextEntry,
    ref,
    field: {name, value},
    form: {handleChange, handleBlur, touched, errors},
  } = props

  const onChangeText = (text: string) => {
    let textFormate = text
    if (preFormate === 'phone') {
      textFormate = formatPhone(text)
    }
    if (preFormate === 'pin') {
      textFormate = formatPin(text)
    }

    handleChange(name)(textFormate)
  }

  console.log('InputText', ref)

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        onChangeText={onChangeText}
        onBlur={handleBlur(name)}
        value={value}
        style={styles.input}
        keyboardType={keyboardType || 'default'}
        placeholder={placeholder}
        placeholderTextColor={COLORS_DF.gray}
        secureTextEntry={secureTextEntry || false}
        {...props}
      />
      {touched[name] && errors[name] && (
        <Text style={styles.error}>{errors[name]?.toString()}</Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 100,
  },
  label: {
    fontFamily: FONT_FAMILIES.primary,
    fontSize: FONT_SIZES.medium,
    marginBottom: MP_DF.small,
    color: COLORS_DF.primary,
  },
  error: {
    fontFamily: FONT_FAMILIES.primary,
    fontSize: FONT_SIZES.small * 0.85,
    color: COLORS_DF.warning,
    opacity: 0.5,
  },
  input: {
    height: 40,
    padding: MP_DF.medium,
    borderWidth: 1,
    borderColor: COLORS_DF.gray,
    borderRadius: BORDER_RADIUS_DF.small,
    fontFamily: FONT_FAMILIES.primary,
    fontSize: FONT_SIZES.medium,
    backgroundColor: COLORS_DF.white,
  },
})
