import {useFocusEffect, useNavigation} from '@react-navigation/native'
import {Card} from '@rneui/base'
import React, {useCallback, useContext, useEffect, useState} from 'react'
import {
  BackHandler,
  Dimensions,
  Image,
  Linking,
  PermissionsAndroid,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import * as ImagePicker from 'react-native-image-picker'
import {Arrow_Right, Happy, IconProfile, Person} from '../../../assets/svg'
import HeaderComponent from '../../../components/Header'
import {storage} from '../../../config/store/db'
import {COLORS_DF, FONT_FAMILIES, MP_DF} from '../../../config/themes/default'
import {useKafeContext} from '../../../states/KafeContext'
import {UserInterface, UsersContext} from '../../../states/UserContext'
import {Btn} from '../../../components/button/Button'
import {PinRequest} from '../../../components/pin-request/PinRequest'
const {width} = Dimensions.get('window')
import Share from 'react-native-share'
import {Buffer} from 'buffer'
import uuid from 'react-native-uuid'
import RNFS from 'react-native-fs'
import Toast from 'react-native-toast-message'
import {dniText} from '../../../OCC/occ'
import DocumentPicker, {types} from 'react-native-document-picker'
import {STORAGE_KEYS, SYNC_UP_TYPES} from '../../../config/const'

const ProfileScreen = () => {
  const user: UserInterface = useContext(UsersContext)
  const [pinAproved, setPinApproved] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [showRequestPin, setShowRequestPin] = useState<any>([false, null])
  const [showInfo, setShowInfo] = useState(false)
  const navigation = useNavigation()

  useEffect(() => {
    requestStoragePermission()
  }, [])

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        // Evita que se ejecute el comportamiento predeterminado de Android
        return true // true para indicar que el evento de retroceso ha sido manejado
      }

      // Agrega un listener para el evento de retroceso de Android
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      )

      // Limpia el listener cuando la pantalla pierde el enfoque
      return () => backHandler.remove()
    }, []),
  )

  useEffect(() => {
    const fetchImageUri = async () => {
      try {
        const imageUri = storage.getString('selectedImageUri') || ''
        if (imageUri) {
          setSelectedImage(imageUri)
        }
      } catch (error) {
        console.error('Error al recuperar la imagen desde MMKV:', error)
      }
    }

    fetchImageUri()
  }, [])
  // 18326988
  useEffect(() => {
    if (pinAproved && showRequestPin[1] === 'export') {
      saveJSONDownload()
      setPinApproved(false)
    }
    if (pinAproved && showRequestPin[1] === 'import') {
      console.log('pinAproved')
      pickDocument()
      setPinApproved(false)
    }
  }, [pinAproved])

  const pickDocument = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [types.json], // Esto permitirá archivos de texto plano incluyendo .json
      })
      const fileUri = res[0]?.uri
      const fileName = res[0]?.name
      if (fileName?.endsWith('.json')) {
        readJsonFile(fileUri)
      } else {
        Toast.show({
          type: 'msgToast',
          text1: 'Error al leer el archivo',
          autoHide: false,
        })
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled the picker')
      } else {
        console.log('Unknown error: ', err)
      }
    }
  }

  const readJsonFile = async (fileUri: string) => {
    try {
      const fileContent = await RNFS.readFile(fileUri, 'utf8')
      const json = JSON.parse(fileContent)
      const userLogin = JSON.parse(storage.getString(STORAGE_KEYS.user) || '{}')
      const parcels = json.parcels
      const sales = json.sales
      storage.set(
        STORAGE_KEYS.user,
        JSON.stringify({...user, ...json.user, dni: userLogin?.dni}),
      )
      storage.delete(STORAGE_KEYS.parcels)
      for (let index = 0; index < parcels.length; index++) {
        const element = parcels[index]
        const parcelsList = JSON.parse(
          storage.getString(STORAGE_KEYS.parcels) || '[]',
        )
        parcelsList.push(element)
        storage.set(STORAGE_KEYS.parcels, JSON.stringify(parcelsList))
        if (element?.polygon) {
          const syncUp = JSON.parse(
            storage.getString(STORAGE_KEYS.syncUp) || '{}',
          )
          const syncUpNew = {
            ...syncUp,
            parcels: false,
          }
          storage.set(STORAGE_KEYS.syncUp, JSON.stringify(syncUpNew))
        }
      }
      storage.delete(STORAGE_KEYS.sales)
      for (let index = 0; index < sales.length; index++) {
        const element = sales[index]
        if (element.idSale === undefined) {
          element.idSale = uuid.v4()
        }
        const salesList = JSON.parse(
          storage.getString(STORAGE_KEYS.sales) || '[]',
        )
        salesList.push(element)
        storage.set(STORAGE_KEYS.sales, JSON.stringify(salesList))
        if (element?.syncUp === undefined || element?.syncUp === false) {
          const syncUp = JSON.parse(
            storage.getString(STORAGE_KEYS.syncUp) || '[]',
          )
          const syncUpNew = {
            ...syncUp,
          }
          storage.set(STORAGE_KEYS.syncUp, JSON.stringify(syncUpNew))
        }
      }
      Toast.show({
        type: 'msgToast',
        text1: 'Datos importados correctamente',
        autoHide: false,
        props: {
          icon: <Happy height={70} width={70} />,
        },
      })
    } catch (err) {
      Toast.show({
        type: 'msgToast',
        text1: 'Error al leer el archivo',
        autoHide: false,
      })
    }
  }

  const requestStoragePermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Permiso para almacenamiento externo',
            message:
              'MiCacao necesita acceso al almacenamiento externo para exportar e importar el archivo de respaldo.',
            buttonNeutral: 'Preguntar luego',
            buttonNegative: 'Cancelar',
            buttonPositive: 'OK',
          },
        )
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Permiso concedido')
        } else {
          console.log('Permiso denegado')
        }
      } else {
        console.log('No es necesario pedir permiso para Android 10 y superior')
      }
    } catch (err) {
      console.warn(err)
    }
  }

  async function requestGalleryPermission() {
    try {
      if (Platform.OS === 'android') {
        if (Platform.Version > 30) {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
            {
              title: 'Permiso de Acceso a la Galería',
              message:
                'Esta aplicación necesita acceso a tu galería de imágenes.',
              buttonPositive: 'Aceptar',
            },
          )
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('Permiso concedido')
            handleChooseImage()
          } else {
            console.log('Permiso denegado')
          }
        } else {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            {
              title: 'Permiso de Acceso a la Galería',
              message:
                'Esta aplicación necesita acceso a tu galería de imágenes.',
              buttonPositive: 'Aceptar',
            },
          )
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('Permiso concedido')
            handleChooseImage()
          } else {
            console.log('Permiso denegado')
            Linking.openSettings()
          }
        }
      }
    } catch (err) {
      console.warn('Error al solicitar permiso:', err)
    }
  }

  const handleChooseImage = () => {
    const options = {
      title: 'Seleccionar imagen',
      mediaType: 'photo',
      maxWidth: 300,
      maxHeight: 300,
      quality: 1,
    }

    ImagePicker.launchImageLibrary(options, async response => {
      if (!response.didCancel) {
        console.log('Respuesta de ImagePicker:', response)
        setSelectedImage(response?.assets[0]?.uri)

        try {
          // Guardar la ruta de la imagen seleccionada en MMKV
          storage.set('selectedImageUri', response?.assets[0]?.uri)
          console.log('Imagen guardada en MMKV')
        } catch (error) {
          console.error('Error al guardar la imagen en MMKV:', error)
        }
      }
    })
  }

  const saveJSONDownload = async () => {
    const userData = JSON.parse(storage.getString('user') || '{}')
    const parcels_array = JSON.parse(storage.getString('parcels') || '[]')
    const sales = JSON.parse(storage.getString('sales') || '[]')
    userData.dni = await dniText(userData.dni)
    delete userData.dniAll
    delete userData.pin
    delete userData.parcel
    delete userData.isLogin
    delete userData.syncUp
    // recorrer sales y eliminar la key syncUpOCC de cada elemento con un map
    // sales.map((sale: any) => {
    //   delete sale.syncUpOCC
    //   delete sale.syncUp
    //   return sale
    // })
    // lo mismo para parcels
    parcels_array.map((parcel: any) => {
      delete parcel.syncUp
      return parcel
    })
    const data = {
      user: userData,
      parcels: parcels_array,
      sales: sales,
    }
    // console.log('data', JSON.stringify(data))
    const jsonString = JSON.stringify(data)
    const name =
      'data_miCacao_' +
      new Date().toISOString().split('T')[0] +
      new Date().getTime() +
      '.json'
    const path = RNFS.DownloadDirectoryPath + '/' + name
    try {
      await RNFS.writeFile(path, jsonString, 'utf8')
      Toast.show({
        type: 'actionToast',
        text1:
          'El archivo se ha guardado en la carpeta de descargas. ¿Quieres compartirlo?',
        autoHide: false,
        props: {
          onPress: () => shareJSON(path, name),
          btnText: 'Compartir',
        },
      })
    } catch (error) {
      console.error('Error al compartir el archivo JSON:', error)
    }
  }

  const shareJSON = async (path: string, name: string) => {
    const options = {
      title: 'Compartir o descargar mi datos',
      url: 'file://' + path,
      type: 'application/json',
      message: 'Compartir o descargar mi datos',
      filename: name,
    }
    await Share.open(options)
  }

  return (
    <>
      <ScrollView style={styles.container}>
        <HeaderComponent label={'Perfil'} goBackNavigation={false} />

        <TouchableOpacity
          onPress={requestGalleryPermission}
          style={{alignSelf: 'center'}}>
          {selectedImage ? (
            <Image source={{uri: selectedImage}} style={styles.image} />
          ) : (
            <Person width={150} height={150} />
          )}
        </TouchableOpacity>
        <View style={styles.textContainer}>
          <Text style={styles.textName}>{user.name}</Text>
          <Text style={styles.textFarmer}>Agricultor</Text>
          {!showInfo && (
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '80%',
                alignItems: 'center',
                marginTop: 30,
              }}
              onPress={() => {
                setShowInfo(true)
              }}>
              <IconProfile height={50} width={50} />
              <Text style={styles.textInformation}>Información Personal</Text>
              <Arrow_Right height={30} width={30} />
            </TouchableOpacity>
          )}
          {showInfo && (
            <>
              <View style={{marginRight: 250, marginTop: 25}}>
                <Text style={styles.textUpCard}>Telefóno</Text>
              </View>
              <Card containerStyle={styles.card}>
                <Text style={styles.textCard}>{user.phone}</Text>
              </Card>
              <View style={{marginRight: 270, marginTop: 25}}>
                <Text style={styles.textUpCard}>País</Text>
              </View>
              <Card containerStyle={styles.card}>
                <Text style={styles.textCard}>{user.country.name}</Text>
              </Card>
              <Btn
                title="Exportar Data"
                theme="agrayu"
                onPress={() =>
                  setShowRequestPin([
                    true,
                    'export',
                    'Para continuar con el respaldo de datos, por favor introduzca el PIN de seguridad',
                  ])
                }
                style={{container: {width: '80%', marginTop: MP_DF.xxlarge}}}
              />
              <Btn
                title="Importar Data"
                theme="agrayu"
                onPress={() =>
                  setShowRequestPin([
                    true,
                    'import',
                    'Para continuar con la importación de datos de respaldo, por favor introduzca el PIN de seguridad\n\nRecuerde que esta acción va a sobrescribir los datos actuales',
                  ])
                }
                style={{container: {width: '80%', marginTop: MP_DF.xxlarge}}}
              />
            </>
          )}
        </View>
      </ScrollView>
      {showRequestPin[0] && (
        <PinRequest
          text={showRequestPin[2]}
          setShowRequestPin={setShowRequestPin}
          setPinApproved={setPinApproved}
        />
      )}
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS_DF.isabelline,
    paddingVertical: 15,
  },
  card: {
    width: '80%',
    height: 50,
    justifyContent: 'center',
  },
  textContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 35,
  },
  textName: {
    fontFamily: FONT_FAMILIES.primary,
    color: COLORS_DF.citrine_brown,
    fontSize: 25,
  },
  textFarmer: {
    fontFamily: FONT_FAMILIES.primary,
    color: COLORS_DF.citrine_brown,
    fontSize: 15,
  },
  textUpCard: {
    fontFamily: FONT_FAMILIES.primary,
    color: COLORS_DF.citrine_brown,
    fontSize: width * 0.04,
  },
  textInformation: {
    fontFamily: FONT_FAMILIES.bold,
    color: COLORS_DF.citrine_brown,
    fontSize: 20,
  },
  textCard: {
    fontFamily: FONT_FAMILIES.bold,
    color: COLORS_DF.black,
    fontSize: width * 0.038,
  },
  image: {
    width: 150,
    height: 150,
  },
})

export default ProfileScreen
