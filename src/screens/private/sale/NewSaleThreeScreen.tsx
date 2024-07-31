import React, {useEffect, useState} from 'react'
import {useNavigation} from '@react-navigation/native'
import uuid from 'react-native-uuid'
import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import {HeaderActions, SafeArea} from '../../../components/safe-area/SafeArea'
import {storage} from '../../../config/store/db'
import {
  COLORS_DF,
  FONT_FAMILIES,
  FONT_SIZES,
  MP_DF,
} from '../../../config/themes/default'
import {styles as ST} from './NewSaleOneScreen'
import {STORAGE_KEYS, SYNC_UP_TYPES} from '../../../config/const'
import {Dropdown} from 'react-native-element-dropdown'
import {Btn} from '../../../components/button/Button'
import Toast from 'react-native-toast-message'
const {width, height} = Dimensions.get('window')

export const NewSaleThreeScreen = () => {
  const [p, setP] = useState(0)
  const navigation = useNavigation()
  const [mes, setMes] = useState('')
  const [dia, setDia] = useState('')
  const [fecha, setFecha] = useState('')
  const [isFocus, setIsFocus] = useState(false)
  const MESES: {name: string; id: string}[] = [
    {name: 'ENERO', id: '0'},
    {name: 'FEBRERO', id: '1'},
    {name: 'MARZO', id: '2'},
    {name: 'ABRIL', id: '3'},
    {name: 'MAYO', id: '4'},
    {name: 'JUNIO', id: '5'},
    {name: 'JULIO', id: '6'},
    {name: 'AGOSTO', id: '7'},
    {name: 'SEPTIEMBRE', id: '8'},
    {name: 'OCTUBRE', id: '9'},
    {name: 'NOVIEMBRE', id: '10'},
    {name: 'DICIEMBRE', id: '11'},
  ]

  useEffect(() => {
    const mesIndex = MESES.findIndex(m => m.id === mes)
    const mesActual = new Date().getMonth()
    let year = new Date().getFullYear()
    if (mesIndex > mesActual) {
      year = year - 1
    }
    if (dia !== '' && mes !== '') {
      setFecha(year + '-' + mes + '-' + dia)
    }
  }, [dia, mes])

  const onSubmit = async () => {
    const regex = /^\d{4}-\d{1,2}-\d{1,2}$/
    if (!fecha.match(regex)) {
      Toast.show({
        type: 'msgToast',
        text1: 'La fecha no es válida',
        autoHide: false,
      })
      return false
    }
    const parts = fecha.split('-')
    const year = parseInt(parts[0], 10)
    const month = parseInt(parts[1], 10)
    const day = parseInt(parts[2], 10)
    const date = new Date(year, month, day)

    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month ||
      date.getDate() !== day
    ) {
      Toast.show({
        type: 'msgToast',
        text1: 'La fecha no es válida',
        autoHide: false,
      })
      return false
    }
    setP(1)
    const saleTemp = JSON.parse(
      storage.getString(STORAGE_KEYS.saleTemp) || '{}',
    )
    const sales = JSON.parse(storage.getString(STORAGE_KEYS.sales) || '[]')
    const sale = {...saleTemp, mes: date, idSale: uuid.v4()}
    storage.set(STORAGE_KEYS.sales, JSON.stringify([...sales, sale]))
    storage.delete(STORAGE_KEYS.saleTemp)

    const syncUp = JSON.parse(storage.getString(STORAGE_KEYS.syncUp) || '{}')
    const syncUpNew = {...syncUp, sales: false}
    storage.set(STORAGE_KEYS.syncUp, JSON.stringify(syncUpNew))
    setTimeout(() => {
      navigation.navigate('NewSaleFourScreen')
    }, 2000)
  }

  return (
    <SafeArea bg="isabelline" isForm>
      <View style={[styles.container]}>
        {p === 0 && (
          <>
            <HeaderActions title={'Paso 5 de 5'} navigation={navigation} />
            <View style={styles.containerHere}>
              <Text style={styles.title}>¿CUÁNDO LO VENDISTE?</Text>
              <TextInput
                style={[styles.input, dia === '' ? styles.textNoSelect : null]}
                placeholder="Dia del mes"
                caretHidden={true}
                value={dia}
                onChangeText={text => {
                  setDia(text)
                }}
                keyboardType="numeric"
                autoFocus
              />
              <View style={[styles.containerBTN]}>
                <Dropdown
                  style={[
                    styles.dropdown,
                    isFocus && {borderColor: COLORS_DF.citrine_brown},
                  ]}
                  containerStyle={styles.containerStyle}
                  itemContainerStyle={styles.itemContainer}
                  placeholderStyle={styles.placeholderStyle}
                  selectedTextStyle={styles.selectedTextStyle}
                  itemTextStyle={styles.itemSelect}
                  iconStyle={styles.iconStyle}
                  data={MESES}
                  autoScroll
                  showsVerticalScrollIndicator={false}
                  labelField="name"
                  valueField="id"
                  placeholder={!isFocus ? 'Selecciona el mes' : '...'}
                  value={mes} // Añadir el valor seleccionado
                  onFocus={() => setIsFocus(true)}
                  onBlur={() => setIsFocus(false)}
                  onChange={(item: any) => {
                    setMes(item.id) // Guardar el id de la parcela seleccionada
                    setIsFocus(true)
                  }}
                />

                {/* <FlatList
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
              /> */}
              </View>
              <View style={{width: '100%', paddingBottom: 70}}>
                <Btn
                  theme={fecha === '' ? 'agrayuDisabled' : 'agrayu'}
                  title="CONFIRMAR"
                  onPress={() => onSubmit()}
                />
              </View>
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
      </View>
    </SafeArea>
  )
}

const styles = StyleSheet.create({
  ...ST,
  containerHere: {
    flex: 1,
    alignItems: 'center',
  },
  containerBTN: {
    marginTop: MP_DF.xxlarge,
    justifyContent: 'space-between',
    flex: 1,
    paddingBottom: MP_DF.large,
  },
  select: {
    backgroundColor: COLORS_DF.citrine_brown,
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
  textNoSelect: {
    fontWeight: '400',
  },
  containerSpiner: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: MP_DF.xxxlarge * 2,
  },
  colorSpiner: {
    color: COLORS_DF.robin_egg_blue,
  },
  spiner: {},
  title2: {
    textAlign: 'center',
    fontSize: FONT_SIZES.xslarge,
    fontWeight: 'bold',
    fontFamily: FONT_FAMILIES.primary,
    color: COLORS_DF.citrine_brown,
    marginTop: MP_DF.large,
  },
  img: {
    width: 250,
    height: 140,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: MP_DF.large,
  },
  dropdown: {
    height: 60,
    width: width - 50,
    backgroundColor: '#fff',
    borderColor: COLORS_DF.light,
    borderWidth: 0.7,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  containerStyle: {
    backgroundColor: 'transparent',
    borderBlockColor: 'transparent',
    borderWidth: 0,
    elevation: 0,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 34,
  },
  placeholderStyle: {
    fontSize: 20,
    color: COLORS_DF.citrine_brown,
  },
  selectedTextStyle: {
    fontSize: 20,
    color: COLORS_DF.citrine_brown,
    fontFamily: FONT_FAMILIES.bold,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 4023,
    fontSize: 16,
  },
  formBtn: {
    flex: 1,
    marginLeft: 20,
    /*  borderWidth: 1,
    borderColor: "red", */
    width: '90%',
    justifyContent: 'flex-end',
    paddingBottom: 20,
    alignItems: 'center',
  },
  itemSelect: {
    fontWeight: 'bold',
    fontSize: 17,
    color: COLORS_DF.citrine_brown,
  },
  itemContainerStyle: {borderColor: COLORS_DF.citrine_brown},
  itemContainer: {
    backgroundColor: COLORS_DF.white,
    borderColor: COLORS_DF.citrine_brown,
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 8,
    borderTopColor: COLORS_DF.citrine_brown,
  },
  input: {
    marginTop: MP_DF.large,
    height: 60,
    width: 250,
    borderBottomWidth: 1,
    color: COLORS_DF.citrine_brown,
    fontSize: 30,
    fontWeight: 'bold',
    borderBottomColor: COLORS_DF.citrine_brown,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  containerKL: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: MP_DF.xlarge,
    borderWidth: 1,
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
