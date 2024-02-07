import React, {useEffect, useRef, useState} from 'react'
import {
  ActivityIndicator,
  Animated,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native'
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../../config/themes/metrics'
import {COLORS_DF, FONT_FAMILIES, MP_DF} from '../../config/themes/default'
import {TEXTS} from '../../config/texts/texts'
import {LABELS} from '../../config/texts/labels'
import {Btn} from '../button/Button'
import {imgCheque} from '../../assets/imgs'
import {storage} from '../../config/store/db'

interface loading {
  msg: string
  onPress?: () => void
}

export const Loading = (props: loading) => {
  const [step, setStep] = useState(0)
  const fadeAnim = useRef(new Animated.Value(0)).current
  const user = JSON.parse(storage.getString('user') || '{}')
  const welcome = user.gender === 'M' ? TEXTS.welcomeM : TEXTS.welcomeF
  // Animation
  useEffect(() => {
    if (step === 0) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }).start(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 500,
          delay: 1500,
          useNativeDriver: true,
        }).start(() => {
          setStep(1)
        })
      })
    } else if (step === 1) {
      fadeAnim.setValue(0)
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start()
    }
  }, [fadeAnim, step])

  return (
    <View style={styles.container}>
      {step === 0 && (
        <>
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
        </>
      )}
      {step === 1 && (
        <>
          <Image source={imgCheque} style={[styles.img, styles.indicador]} />
          <Animated.View style={[styles.container, {opacity: fadeAnim}]}>
            <View style={styles.textContainer}>
              <Text style={[styles.textA]}>{welcome}</Text>
              <Text style={[styles.textB]}>{TEXTS.textJ}</Text>
            </View>
            <View style={styles.formBtn}>
              <Btn
                title={LABELS.continue}
                theme="agrayu"
                onPress={() => props.onPress && props.onPress()}
              />
            </View>
          </Animated.View>
        </>
      )}
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
