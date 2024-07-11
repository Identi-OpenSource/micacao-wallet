import React, {useContext, useEffect, useState} from 'react'
import {StyleSheet, View} from 'react-native'
import {Dropdown} from 'react-native-element-dropdown'
import {District_M, District_W, Munic_M, Munic_W} from '../../../assets/svg'
import {Btn} from '../../../components/button/Button'
import {COLORS_DF, FONT_FAMILIES} from '../../../config/themes/default'
import {useMapContext} from '../../../states/MapContext'
import {UsersContext} from '../../../states/UserContext'
import {ConnectionContext} from '../../../states/_ConnectionContext'
import Toast from 'react-native-toast-message'
import Spinner from 'react-native-loading-spinner-overlay'
import {storage} from '../../../config/store/db'
import {useNavigation} from '@react-navigation/native'
import Config from 'react-native-config'
import useFetchData, {HEADERS} from '../../../hooks/useFetchData'
import {STORAGE_KEYS} from '../../../config/const'

interface District {
  dist_id: number
  dist_name: string
  countryid: number
  _index: number
}

const Maps = () => {
  const user = JSON.parse(storage.getString('user') || '{}')
  const [isFocus, setIsFocus] = useState(false)
  const [districts, setDistricts] = useState<District[]>([])
  const [district, setDistrict] = useState<District | null>(null)
  const {loading, fetchData} = useFetchData()
  const navigation = useNavigation()

  useEffect(() => {
    getDistricts()
  }, [])

  const getDistricts = async () => {
    const url = `${Config?.BASE_URL}/districts/${user.country?.country_id}`
    const resp = await fetchData(url, {
      method: 'GET',
      headers: HEADERS(),
    })
    if (!resp?.length) {
      navigation.goBack()
      return
    }
    setDistricts(resp)
  }

  // const {districts, getDistricts, district, saveDistrict, getMap, loadingMap} =
  //   useMapContext()
  // const internetConnection = useContext(ConnectionContext)
  // const {isConnected} = internetConnection
  // useEffect(() => {
  //   if (isConnected) {
  //     const country_id = user.country?.code === 'CO' ? 1 : 2
  //     getDistricts(country_id)
  //   } else {
  //     Toast.show({
  //       type: 'syncToast',
  //       text1: '¡Recuerda que necesitas estar conectado a internet !',
  //     })
  //   }
  // }, [user.country?.code])

  // useEffect(() => {
  //   saveDistrict(null)
  //   storage.set('district', JSON.stringify(district))
  // }, [districts])

  const submit = async () => {
    const url = `${Config?.BASE_URL}/coordinates/${district?.dist_id}`
    const resp = await fetchData(url, {
      method: 'GET',
      headers: HEADERS(),
    })
    if (!resp?.center_point) {
      navigation.goBack()
      return
    }
    storage.set(
      STORAGE_KEYS.user,
      JSON.stringify({...user, district: {...district, ...resp}}),
    )
    navigation.navigate('RegisterScreen')
  }

  const getPlaceholder = () => {
    if (user.country?.code === 'CO') {
      return 'Selecciona tu municipio'
    }
    if (user.country?.code === 'PE') {
      return 'Selecciona tu distrito'
    }
  }

  const renderImgRegion = () => {
    if (user.country?.code === 'CO') {
      return user.gender === 'W' ? <Munic_W /> : <Munic_M />
    }
    if (user.country?.code === 'PE') {
      return user.gender === 'W' ? <District_W /> : <District_M />
    }
  }

  return (
    <View style={styles.container}>
      <Spinner color="#178B83" visible={loading} size={100} />
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 25,
          marginBottom: 45,
        }}>
        {renderImgRegion()}
      </View>
      <View>
        <Dropdown
          style={[
            styles.dropdown,
            isFocus && {borderColor: COLORS_DF.citrine_brown},
          ]}
          containerStyle={styles.dropdownContainer}
          showsVerticalScrollIndicator={false}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          itemTextStyle={styles.itemSelect}
          iconStyle={styles.iconStyle}
          data={districts?.sort((a, b) =>
            a?.dist_name.localeCompare(b?.dist_name),
          )}
          autoScroll
          itemContainerStyle={styles.itemContainer}
          labelField="dist_name"
          valueField="dist_id"
          placeholder={getPlaceholder()}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={(item: any) => {
            setDistrict(item)
            setIsFocus(false)
          }}
        />
      </View>
      <View style={styles.formBtn}>
        <Btn
          title={'Continuar'}
          theme={district !== null ? 'agrayu' : 'agrayuDisabled'}
          onPress={submit}
          disabled={district === null}
        />
      </View>
    </View>
  )
}
const styles = StyleSheet.create({
  dropdownContainer: {
    backgroundColor: 'transparent',
    borderBlockColor: 'transparent',
    borderWidth: 0,
    elevation: 0,
  },
  container: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 16,
    backgroundColor: COLORS_DF.isabelline,
  },
  dropdown: {
    height: 75,
    backgroundColor: '#fff',
    borderColor: COLORS_DF.citrine_brown,
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
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
  itemContainer: {
    backgroundColor: COLORS_DF.white,
    borderColor: COLORS_DF.citrine_brown,
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 8,
    borderTopColor: COLORS_DF.citrine_brown,
  },
})
export default Maps
