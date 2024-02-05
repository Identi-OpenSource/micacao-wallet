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

export const PermissionsTwoScreen = () => {
  const navigation = useNavigation()

  return (
    <SafeArea bg={'neutral'}>
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Text style={[styles.textA]}>{TEXTS.textS}</Text>
          <Text style={[styles.textB]}>{TEXTS.textV}</Text>
        </View>
        <View style={styles.formBtn}>
          <Btn
            title={LABELS.next}
            theme="agrayu"
            onPress={() => navigation.navigate('PermissionsThreeScreen')}
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
  },
  textA: {
    fontFamily: FONT_FAMILIES.primary,
    fontSize: moderateScale(32),
    fontWeight: '700',
    textAlign: 'left',
    color: COLORS_DF.cacao,
    paddingVertical: verticalScale(MP_DF.medium),
  },
  textB: {
    fontFamily: FONT_FAMILIES.primary,
    fontSize: moderateScale(24),
    fontWeight: '500',
    lineHeight: 36,
    color: COLORS_DF.cacao,
    marginTop: MP_DF.large,
  },
  formBtn: {
    justifyContent: 'flex-end',
    paddingBottom: verticalScale(MP_DF.xlarge),
  },
})
