import React from 'react'
import {StyleSheet, Text, View} from 'react-native'
import {SafeArea} from '../../../../components/safe-area/SafeArea'
import {
  COLORS_DF,
  FONT_FAMILIES,
  FONT_SIZES,
  MP_DF,
} from '../../../../config/themes/default'
import {Btn} from '../../../../components/button/Button'
import {useNavigation} from '@react-navigation/native'

export const PolygonScreen = ({route}: any) => {
  const navigation = useNavigation()
  const params = route.params

  return (
    <SafeArea>
      <View style={styles.container}>
        <Text style={styles.title}>
          ¡Recorre o dibuja tu parcela y gana más dinero por tu cosecha!
        </Text>
        <Btn
          title="Recorre tu parcela"
          onPress={() =>
            navigation.navigate('GradientLineRecorrer', {id: params?.id})
          }
          theme="agrayu"
        />
        <View style={styles.space} />
        <Btn
          title="Dibuja tu parcela"
          onPress={() =>
            navigation.navigate('PoligonJoystick', {id: params?.id})
          }
          theme="agrayu"
        />
      </View>
    </SafeArea>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: MP_DF.large,
    paddingTop: MP_DF.medium,
  },
  title: {
    fontSize: FONT_SIZES.xslarge,
    fontFamily: FONT_FAMILIES.primary,
    fontWeight: 'bold',
    color: COLORS_DF.cacao,
    textAlign: 'center',
    marginBottom: MP_DF.xlarge,
    marginTop: MP_DF.xlarge,
  },
  space: {
    height: MP_DF.large,
  },
})
