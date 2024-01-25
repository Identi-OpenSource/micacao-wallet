import React from 'react'
import {StyleSheet, Text, TextInput, View} from 'react-native'
import {
  BORDER_RADIUS_DF,
  COLORS_DF,
  FONT_FAMILIES,
  MP_DF,
} from '../../config/themes/default'
import {InputTextProps} from './interfaces'
import {formatPhone} from '../../utils/formatPhone'
import {formatPin} from '../../utils/formatPin'
import {moderateScale} from '../../config/themes/metrics'

export const InputText = (props: InputTextProps) => {
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
    if (preFormate === 'decimal') {
      textFormate = textFormate.replace(/,/g, '.')
      textFormate = textFormate.replace(/(\d*\.\d\d).*/, '$1')
    }

    handleChange(name)(textFormate)
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        ref={ref}
        onChangeText={onChangeText}
        onBlur={handleBlur(name)}
        value={value}
        style={styles.input}
        keyboardType={keyboardType || 'default'}
        placeholder={placeholder}
        placeholderTextColor={COLORS_DF.gray}
        cursorColor={COLORS_DF.gray}
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
    height: 120,
  },
  label: {
    fontFamily: FONT_FAMILIES.primary,
    fontSize: moderateScale(16),
    fontWeight: '600',
    marginBottom: MP_DF.medium,
    color: COLORS_DF.cacao,
  },
  error: {
    fontFamily: FONT_FAMILIES.primary,
    fontSize: moderateScale(12),
    fontWeight: '600',
    lineHeight: moderateScale(20),
    color: COLORS_DF.warning,
    textAlign: 'right',
  },
  input: {
    height: 48,
    padding: MP_DF.medium,
    borderWidth: 1,
    borderColor: COLORS_DF.gray,
    borderRadius: BORDER_RADIUS_DF.small,
    fontFamily: FONT_FAMILIES.primary,
    fontSize: moderateScale(18),
    fontWeight: '600',
    backgroundColor: COLORS_DF.white,
  },
})
