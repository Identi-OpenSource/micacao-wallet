import React, {useEffect, useRef} from 'react'
import {ActivityIndicator, Animated, StyleSheet, Text, View} from 'react-native'
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../../config/themes/metrics'
import {COLORS_DF, FONT_FAMILIES, MP_DF} from '../../config/themes/default'
import {TEXTS} from '../../config/texts/texts'

interface loading {
  msg: string
}

export const LoadingSave = (props: loading) => {
  const fadeAnim = useRef(new Animated.Value(0)).current
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start()
  }, [fadeAnim])

  return (
    <View style={styles.container}>
      <ActivityIndicator
        size={moderateScale(86)}
        color={COLORS_DF.cacao}
        style={styles.indicador}
      />
      <Animated.View style={[styles.container, {opacity: fadeAnim}]}>
        <View style={styles.textContainer}>
          <Text style={[styles.textA]}>{TEXTS.textG}</Text>
          <Text style={[styles.textB]}>{props.msg}</Text>
        </View>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: horizontalScale(MP_DF.large),
  },
  indicador: {
    marginTop: verticalScale(MP_DF.xxlarge * 2),
    marginBottom: verticalScale(MP_DF.large),
  },
  img: {
    width: 120,
    height: 120,
    alignSelf: 'center',
  },
  textContainer: {flex: 1},
  textA: {
    fontFamily: FONT_FAMILIES.primary,
    fontSize: moderateScale(32),
    fontWeight: '700',
    textAlign: 'center',
    color: COLORS_DF.cacao,
    paddingHorizontal: horizontalScale(MP_DF.large),
    paddingVertical: verticalScale(MP_DF.medium),
  },
  textB: {
    fontFamily: FONT_FAMILIES.primary,
    fontSize: moderateScale(24),
    fontWeight: '500',
    textAlign: 'center',
    color: COLORS_DF.cacao,
  },
  formBtn: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: verticalScale(MP_DF.xlarge),
  },
})
