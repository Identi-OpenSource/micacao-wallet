import React, {useEffect} from 'react'
import {StyleSheet, Text, View} from 'react-native'
import {Logo} from '../assets/svg/index'
import {COLORS_DF, FONT_FAMILIES} from '../config/themes/default'
import {useNavigation} from '@react-navigation/native'

export const SplashScreen = () => {
  const navigation = useNavigation()

  useEffect(() => {
    setTimeout(() => {
      navigation.navigate('HomeScreen')
    }, 2000)
  }, [])

  return (
    <View style={styles.container}>
      <Logo width={100} height={92.06} />
      <Text style={styles.textSplash}>MiCacao</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F6EEEB',
  },
  textSplash: {
    fontFamily: FONT_FAMILIES.bold,
    color: COLORS_DF.citrine_brown,
    fontSize: 32,
  },
})
