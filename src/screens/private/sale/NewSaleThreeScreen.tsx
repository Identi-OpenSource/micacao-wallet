import React, {useState} from 'react'
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ActivityIndicator,
} from 'react-native'
import {styles as ST} from './NewSaleOneScreen'
import {
  COLORS_DF,
  FONT_FAMILIES,
  FONT_SIZES,
  MP_DF,
} from '../../../config/themes/default'
import {HeaderActions, SafeArea} from '../../../components/safe-area/SafeArea'
import {useNavigation} from '@react-navigation/native'
import {storage} from '../../../config/store/db'
import {imgCheque} from '../../../assets/imgs'
import {Btn} from '../../../components/button/Button'

export const NewSaleThreeScreen = () => {
  const [p, setP] = useState(0)
  const navigation = useNavigation()
  const MESES: string[] = [
    'ENERO',
    'FEBRERO',
    'MARZO',
    'ABRIL',
    'MAYO',
    'JUNIO',
    'JULIO',
    'AGOSTO',
    'SEPTIEMBRE',
    'OCTUBRE',
    'NOVIEMBRE',
    'DICIEMBRE',
  ]
  console.log(p)
  const onSubmit = (mes: string) => {
    setP(1)
    const saleTemp = JSON.parse(storage.getString('saleTemp') || '{}')
    const sales = JSON.parse(storage.getString('sales') || '[]')
    const sale = {...saleTemp, mes}
    storage.set('saleTemp', JSON.stringify({}))
    storage.set('sales', JSON.stringify([...sales, sale]))
    setTimeout(() => {
      setP(2)
    }, 2000)
  }
  return (
    <SafeArea bg="neutral" isForm>
      <View style={styles.container}>
        {p === 0 && (
          <>
            <HeaderActions title={'Paso 3 de 3'} navigation={navigation} />
            <Text style={styles.title}>¿CUÁNDO LO COSECHASTE?</Text>
            <View style={styles.containerBTN}>
              <FlatList
                data={MESES}
                numColumns={2}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item}) => (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.select}
                    onPress={() => onSubmit(item)}>
                    <Text style={styles.textSelect}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </>
        )}
        {p === 1 && (
          <View style={styles.containerSpiner}>
            <ActivityIndicator
              size={86}
              color={styles.colorSpiner.color}
              style={styles.spiner}
            />
            <Text style={styles.title2}>Guardando venta</Text>
          </View>
        )}
        {p === 2 && (
          <View style={styles.containerSpiner}>
            <Image source={imgCheque} style={styles.img} />
            <Text style={[styles.title2, {marginBottom: 30}]}>
              Venta guardada
            </Text>
            <Btn
              theme="agrayu"
              title="VOLVER AL INICIO"
              onPress={() => navigation.navigate('TabPrivate')}
            />
          </View>
        )}
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
  select: {
    backgroundColor: COLORS_DF.cacao,
    borderRadius: MP_DF.small,
    padding: MP_DF.small,
    margin: MP_DF.small,
    flex: 1,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textSelect: {
    color: COLORS_DF.white,
    fontFamily: FONT_FAMILIES.primary,
    fontWeight: 'bold',
  },
  containerSpiner: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: MP_DF.xxxlarge * 2,
  },
  colorSpiner: {
    color: COLORS_DF.cacao,
  },
  spiner: {},
  title2: {
    textAlign: 'center',
    fontSize: FONT_SIZES.xslarge,
    fontWeight: 'bold',
    fontFamily: FONT_FAMILIES.primary,
    color: COLORS_DF.cacao,
    marginTop: MP_DF.large,
  },
  img: {
    width: 250,
    height: 140,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: MP_DF.large,
  },
})
