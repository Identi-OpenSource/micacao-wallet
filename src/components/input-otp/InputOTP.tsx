import React, {useRef} from 'react'
import {StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native'
import {
  BORDER_RADIUS_DF,
  COLORS_DF,
  FONT_FAMILIES,
  MP_DF,
} from '../../config/themes/default'
import {InputTextProps} from './interfaces'
import {moderateScale} from '../../config/themes/metrics'

export const InputOTP = (props: InputTextProps) => {
  const {
    label,
    field: {name, value},
    form: {handleChange, handleBlur, touched, errors},
  } = props
  const ref = useRef() as any
  const optLength: number[] = []
  optLength.length = 6

  const onChangeText = (text: string) => {
    let textFormate = text
    if (text.length > 6) {
      textFormate = text.substring(0, 6)
    }
    handleChange(name)(textFormate)
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        activeOpacity={1}
        style={styles.containerOPT}
        onPress={() => ref?.current?.focus()}>
        {[...Array(6)].map((e, i) => (
          <Text key={i} style={styles.labelOPT}>
            {value[i] || ''}
          </Text>
        ))}
      </TouchableOpacity>
      <TextInput
        ref={ref}
        onChangeText={onChangeText}
        onBlur={handleBlur(name)}
        value={value}
        style={styles.oculto}
        keyboardType={'numeric'}
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
  containerOPT: {
    justifyContent: 'space-between',
    alignItems: 'center',
    alignContent: 'center',
    flexDirection: 'row',
    marginVertical: MP_DF.medium,
  },
  labelOPT: {
    fontFamily: FONT_FAMILIES.primary,
    fontSize: moderateScale(32),
    fontWeight: '600',
    lineHeight: moderateScale(35),
    color: COLORS_DF.black,
    textAlign: 'center',
    marginHorizontal: MP_DF.medium,
    borderBottomWidth: 1,
    borderBottomColor: COLORS_DF.cacao,
    width: 40,
    height: 40,
  },
  oculto: {
    height: 0,
    width: 0,
    opacity: 0,
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
