import React from 'react'
import {StyleSheet, Text, View} from 'react-native'
import {COLORS_DF, FONT_SIZES, MARGIN_DF} from '../../../config/themes/default'

export const LogoLarge = () => (
  <View style={styles.container}>
    <Text style={styles.logoLarge}>micacao</Text>
  </View>
)

const styles = StyleSheet.create({
  container: {
    width: 250,
    padding: 10,
    justifyContent: 'center',
    backgroundColor: COLORS_DF.darkBrown,
    margin: MARGIN_DF.medium,
  },
  logoLarge: {
    fontSize: FONT_SIZES.xxlarge,
    fontWeight: '100',
    textAlign: 'center',
    color: COLORS_DF.light,
    letterSpacing: 5,
    lineHeight: FONT_SIZES.xxlarge,
  },
})
