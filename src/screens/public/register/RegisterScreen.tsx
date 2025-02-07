import {useNavigation} from '@react-navigation/native'
import {Field, Formik} from 'formik'
import React from 'react'
import {Text, View, TouchableOpacity} from 'react-native'
import {Dni_M, Dni_W} from '../../../assets/svg'
import {Btn, BtnIcon} from '../../../components/button/Button'
import {SafeArea} from '../../../components/safe-area/SafeArea'
import {LABELS} from '../../../config/texts/labels'
import {moderateScale} from '../../../config/themes/metrics'
import {
  INIT_VALUES_ONE,
  INPUTS_ONE,
  InterfaceHeader,
  InterfaceOne,
  SCHEMA_ONE,
} from './Interfaces'
import {styles} from './styles'
import {dniEncrypt} from '../../../OCC/occ'
import {storage} from '../../../config/store/db'
import Toast from 'react-native-toast-message'

export const RegisterScreen = () => {
  const navigation = useNavigation()
  const user = JSON.parse(storage.getString('user') || '{}')
  //encripta el dni
  const certificateND = async (dni: string) => {
    const encrypted = await dniEncrypt(dni)
    return encrypted
  }

  const submit = async (values: InterfaceOne) => {
    const encryptedDNI = await certificateND(values.dni)
    if (encryptedDNI.dniAll !== 32) {
      Toast.show({
        type: 'msgToast',
        autoHide: false,
        text1: '¡Error al encriptar los datos! Por favor, intente de nuevo.',
      })
      navigation.goBack()
      return
    }
    storage.set('user', JSON.stringify({...user, ...encryptedDNI}))
    navigation.navigate('RegisterSecondScreen')
  }

  return (
    <SafeArea bg="isabelline" isForm>
      <View style={styles.container}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {user.gender == 'M' && <Dni_M />}
          {user.gender == 'W' && <Dni_W />}
        </View>
        <Formik
          initialValues={INIT_VALUES_ONE}
          onSubmit={values => submit(values)}
          validationSchema={SCHEMA_ONE}>
          {({handleSubmit, isValid, dirty}) => (
            <>
              <View style={styles.formContainer}>
                <View style={styles.formInput}>
                  {INPUTS_ONE.map(i => (
                    <Field key={i.name} {...i} />
                  ))}
                </View>
                <View style={styles.formBtn}>
                  <Btn
                    title={LABELS.next}
                    theme={isValid && dirty ? 'agrayu' : 'agrayuDisabled'}
                    onPress={handleSubmit}
                    disabled={!isValid || !dirty}
                  />
                </View>
              </View>
            </>
          )}
        </Formik>
      </View>
    </SafeArea>
  )
}

// Componente Header

export const Header = (props: InterfaceHeader) => {
  const navigation = useNavigation()
  const {label} = props
  return (
    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.header}>
      <BtnIcon
        theme="transparent"
        icon="angle-left"
        size={moderateScale(30)}
        onPress={() => navigation.goBack()}
      />
      <Text style={styles.title}>{label}</Text>
    </TouchableOpacity>
  )
}
