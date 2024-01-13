import React, {useContext} from 'react'
import {StyleSheet, Text, View} from 'react-native'
import {dbConfig} from '../../../config/db-encript'
import {useSecureOffline} from '../../../hooks/useSecureOffline'
import {Btn} from '../../../components/button/Button'
import {SafeArea} from '../../../components/safe-area/SafeArea'
import {TEXTS} from '../../../config/texts/texts'
import {LABELS} from '../../../config/texts/labels'
import {
  COLORS_DF,
  DWH,
  FONT_FAMILIES,
  MP_DF,
  getFontSize,
} from '../../../config/themes/default'
import {UserDispatchContext} from '../../../states/UserContext'

export const RegisterThreeScreen = () => {
  const getOffline = useSecureOffline(dbConfig.keyData)
  const dispatch = useContext(UserDispatchContext)

  const changeLogin = async () => {
    const data = await getOffline.get()
    dispatch({type: 'login', payload: data})
  }

  return (
    <SafeArea bg={'primary'} barStyle="light-content">
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Text style={[styles.text]}>{TEXTS.textF}</Text>
          <Text style={[styles.textG]}>{TEXTS.textG}</Text>
        </View>
        <Btn title={LABELS.createAccount} theme="white" onPress={changeLogin} />
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
    height: DWH.height * 0.6 + 36,
  },
  text: {
    fontFamily: FONT_FAMILIES.primary,
    fontSize: getFontSize(42),
    fontWeight: '600',
    color: COLORS_DF.white,
  },
  textG: {
    fontFamily: FONT_FAMILIES.primary,
    fontSize: getFontSize(20),
    lineHeight: getFontSize(24),
    fontWeight: '600',
    color: COLORS_DF.white,
    marginTop: MP_DF.large,
  },
  op: {opacity: 0.5},
})
