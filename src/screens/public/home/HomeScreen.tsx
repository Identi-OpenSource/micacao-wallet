/**
 * @author : Braudin Laya
 * @since : 15/09/2021
 * @summary : View of entry point of the application
 */

import React from 'react'
import {SafeArea} from '../../../components/safe-area/SafeArea'
import {StyleSheet, Text, View} from 'react-native'
import {
  COLORS_DF,
  FONT_FAMILIES,
  MP_DF,
  getFontSize,
} from '../../../config/themes/default'
import {Btn} from '../../../components/button/Button'
import {TEXTS} from '../../../config/texts/texts'

import {useNavigation} from '@react-navigation/native'
import {LABELS} from '../../../config/texts/labels'

export const HomeScreen = () => {
  const navigation = useNavigation()
  return (
    <SafeArea bg={'primary'} barStyle="light-content">
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Text style={[styles.text]}>{TEXTS.textA}</Text>
          <Text style={[styles.text, styles.op]}>{TEXTS.textB}</Text>
        </View>
        <Btn
          title={LABELS.createAccount}
          theme="white"
          onPress={() => navigation.navigate('RegisterScreen')}
        />
      </View>
    </SafeArea>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: MP_DF.large,
  },
  textContainer: {
    alignItems: 'flex-start',
  },
  text: {
    fontFamily: FONT_FAMILIES.primary,
    fontSize: getFontSize(42),
    fontWeight: '600',
    color: COLORS_DF.white,
  },
  op: {opacity: 0.5},
})
