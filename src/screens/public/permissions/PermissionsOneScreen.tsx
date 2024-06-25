import React from 'react'
import {StyleSheet, Text, View} from 'react-native'
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../../../config/themes/metrics'
import {COLORS_DF, FONT_FAMILIES, MP_DF} from '../../../config/themes/default'
import {SafeArea} from '../../../components/safe-area/SafeArea'
import {TEXTS} from '../../../config/texts/texts'
import {Btn} from '../../../components/button/Button'
import {LABELS} from '../../../config/texts/labels'
import {useNavigation} from '@react-navigation/native'

export const PermissionsOneScreen = () => {
  const navigation = useNavigation()

  return (
    <SafeArea bg={'isabelline'}>
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Text style={[styles.textA]}>{TEXTS.textR}</Text>
        </View>
        <View style={styles.formBtn}>
          <Btn
            title={LABELS.initial}
            theme="agrayu"
            onPress={() => navigation.navigate('PermissionsTwoScreen')}
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
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
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
    justifyContent: 'flex-end',
    paddingBottom: verticalScale(MP_DF.xlarge),
  },
})
