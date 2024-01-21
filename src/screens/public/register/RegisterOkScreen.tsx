/**
 * @author : Braudin Laya
 * @since : 15/09/2021
 * @summary : View of entry point of the application
 */

import React from 'react'
import {SafeArea} from '../../../components/safe-area/SafeArea'
import {Image, StyleSheet, Text, View} from 'react-native'
import {COLORS_DF, FONT_FAMILIES, MP_DF} from '../../../config/themes/default'
import {Btn} from '../../../components/button/Button'
import {TEXTS} from '../../../config/texts/texts'

import {LABELS} from '../../../config/texts/labels'
import {imgProd} from '../../../assets/imgs'
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../../../config/themes/metrics'
import {ScreenProps} from '../../../routers/Router'

export const RegisterOkScreen = ({
  route,
  navigation,
}: ScreenProps<'RegisterOkScreen'>) => {
  const params = route.params

  console.log(params)

  return (
    <SafeArea bg={'neutral'}>
      <Image source={imgProd} style={styles.img} />
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Text style={[styles.textA]}>{'RegisterOkScreen'}</Text>
          <Text style={[styles.textB]}>{TEXTS.textB}</Text>
        </View>
        <View style={styles.formBtn}>
          <Btn
            title={LABELS.createAccount}
            theme="agrayu"
            onPress={() => navigation.navigate('RegisterScreen')}
          />
        </View>
      </View>
    </SafeArea>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: horizontalScale(MP_DF.large),
  },
  img: {
    width: horizontalScale(306),
    height: verticalScale(306),
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
