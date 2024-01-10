import React from 'react'
import {SafeArea} from '../../../components/safe-area/SafeArea'
import {LogoLarge} from './Logo'
import {Linking, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import {
  COLORS_DF,
  FONT_SIZES,
  MARGIN_DF,
  THEME_DF,
} from '../../../config/themes/default'
import {BtnPrimary} from '../../../components/button/Button'
import {LABELS} from '../../../config/texts/texts'

const TEXTS = {
  welcome:
    'Bienvenido a micacao, la aplicación para los productores amantes del cacao. Nuestra misión es conectar productores con la tecnología para mejorar la calidad de vida y mantener una trazabilidad del productos.\n\nPara comenzar, por favor, cree una nueva',
}

export const HomeScreen = () => {
  // Harcoded link to identi.digital
  const linkIdenti = () => Linking.openURL('https://identi.digital')

  return (
    <SafeArea>
      <View style={styles.container}>
        <LogoLarge />
        <Text style={[THEME_DF.textNormal, styles.text]}>{TEXTS.welcome}</Text>
        <BtnPrimary
          style={stylesBtn}
          title={LABELS.createAccount}
          onPress={() => console.log('New account')}
        />
        <TouchableOpacity onPress={linkIdenti}>
          <Text style={styles.powerBy}>
            Power by <Text style={styles.textB}>IDENTI</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeArea>
  )
}

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  text: {
    lineHeight: FONT_SIZES.medium * 1.5,
    textAlign: 'center',
    marginTop: MARGIN_DF.large * 2,
  },
  textB: {
    fontWeight: 'bold',
    color: COLORS_DF.black,
  },
  powerBy: {
    bottom: MARGIN_DF.small,
    marginTop: MARGIN_DF.large * 4,
    opacity: 0.4,
  },
})

const stylesBtn = StyleSheet.create({
  container: {
    marginTop: MARGIN_DF.large * 2,
  },
})
