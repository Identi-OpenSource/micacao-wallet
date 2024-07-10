import {useNavigation} from '@react-navigation/native'
import React, {useRef, useState} from 'react'
import {
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import Toast from 'react-native-toast-message'
import {Btn} from '../../../components/button/Button'
import {HeaderActions, SafeArea} from '../../../components/safe-area/SafeArea'
import {storage} from '../../../config/store/db'
import {COLORS_DF, FONT_FAMILIES, MP_DF} from '../../../config/themes/default'
import {styles as ST} from './NewSaleOneScreen'
import {STORAGE_KEYS} from '../../../config/const'

const {width, height} = Dimensions.get('window')

export const SaleScreen = () => {
  const navigation = useNavigation()
  const [precio, setPrecio] = useState('')
  const ref = useRef<TextInput>(null)

  const decimals = (numero: string) => {
    // Reemplazar comas decimales por puntos decimales
    const sanitizedNumber = numero.replace(',', '.').trim()

    // Validar que el número tiene hasta 8 cifras en total y máximo 2 decimales
    const regex = /^\d{1,8}(\.\d{1,2})?$/
    return regex.test(sanitizedNumber)
  }

  const onSubmit = () => {
    ref.current?.blur()

    if (isNaN(Number(precio)) || Number(precio) <= 0 || !decimals(precio)) {
      Toast.show({
        type: 'msgToast',
        text1: 'Cantidad inválida',
        props: {
          textSub: 'Menos de 100,000,000 y solo 2 decimales',
        },
      })
      return
    }

    const saleTemp = JSON.parse(
      storage.getString(STORAGE_KEYS.saleTemp) || '{}',
    )
    const sale = {...saleTemp, precio}
    storage.set(STORAGE_KEYS.saleTemp, JSON.stringify(sale))

    navigation.navigate('FiveSaleScreen')
  }

  return (
    <SafeArea bg="isabelline" isForm>
      <View style={styles.container}>
        <HeaderActions title={'Paso 3 de 5'} navigation={navigation} />
        <View style={{width: width * 0.8, marginLeft: 16}}>
          <Text style={styles.title}>¿CUÁNTO TE ESTAN PAGANDO POR KILO?</Text>
        </View>
        <View style={styles.containerBTN}>
          <TouchableOpacity
            style={styles.containerKL}
            activeOpacity={1}
            onPress={() => (ref.current as any)?.focus()}>
            <Text style={styles.KLV}>{precio}</Text>
          </TouchableOpacity>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
            }}>
            <TextInput
              ref={ref}
              style={styles.input}
              value={precio}
              onChangeText={text => {
                text = text.replace(/,/g, '.')
                text = text.replace(/(\..*)\./g, '$1')
                setPrecio(text)
              }}
              keyboardType="numeric"
              autoFocus
            />
          </View>
          <View style={{marginBottom: height * 0.09}}>
            <Btn
              theme={precio === '' ? 'agrayuDisabled' : 'agrayu'}
              title="CONFIRMAR"
              onPress={() => onSubmit()}
            />
          </View>
        </View>
      </View>
    </SafeArea>
  )
}

const styles = StyleSheet.create({
  ...ST,
  containerBTN: {
    marginTop: MP_DF.large,
    justifyContent: 'space-between',
    flex: 1,
    paddingBottom: MP_DF.large,
  },
  input: {
    height: 0,
  },
  containerKL: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: MP_DF.xlarge,
  },
  KLV: {
    fontSize: 30,
    textAlign: 'center',
    borderBottomWidth: 1,
    width: 250,
    color: COLORS_DF.citrine_brown,
    fontFamily: FONT_FAMILIES.primary,
    fontWeight: 'bold',
  },
  KL: {
    fontSize: 30,
    textAlign: 'center',
    marginLeft: 10,
    color: COLORS_DF.citrine_brown,
    fontFamily: FONT_FAMILIES.primary,
    fontWeight: 'bold',
  },
})
