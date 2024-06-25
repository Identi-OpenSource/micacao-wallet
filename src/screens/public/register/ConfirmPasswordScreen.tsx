import {Field, Formik} from 'formik'
import React from 'react'
import {View} from 'react-native'
import Spinner from 'react-native-loading-spinner-overlay'
import {sha256} from 'react-native-sha256'
import Toast from 'react-native-toast-message'
import {Confirm_Password_M, Confirm_Password_W} from '../../../assets/svg'
import {Btn} from '../../../components/button/Button'
import {SafeArea} from '../../../components/safe-area/SafeArea'
import {LABELS} from '../../../config/texts/labels'

import {
  INIT_VALUES_FOURTH,
  INPUTS_FOURTH,
  InterfaceFourth,
  SCHEMA_FOURTH,
} from './Interfaces'
import {styles} from './styles'
import {storage} from '../../../config/store/db'
import {STORAGE_KEYS} from '../../../config/const'
import {useNavigation} from '@react-navigation/native'

const ConfirmPasswordScreen = () => {
  const pin = JSON.parse(storage.getString(STORAGE_KEYS.security) || '{}')?.pin
  const user = JSON.parse(storage.getString('user') || '{}')
  const navigation = useNavigation()

  const submit = async (values: InterfaceFourth) => {
    const pinHash = await sha256(values.pin)
    if (pinHash === pin) {
      navigation.navigate('RegisterOkScreen')
    } else {
      Toast.show({
        type: 'msgToast',
        autoHide: false,
        text1: 'El PIN ingresado es incorrecto, por favor intente de nuevo',
      })
    }
  }
  return (
    <SafeArea bg="isabelline" isForm>
      <View style={styles.container}>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          {user.gender === 'M' ? (
            <Confirm_Password_M />
          ) : (
            <Confirm_Password_W />
          )}
        </View>
        <Formik
          initialValues={INIT_VALUES_FOURTH}
          onSubmit={values => submit(values)}
          validationSchema={SCHEMA_FOURTH}>
          {({handleSubmit, isValid, dirty}) => (
            <>
              <View style={styles.formContainer}>
                <View style={styles.formInput}>
                  {INPUTS_FOURTH.map(i => (
                    <Field key={i.name} {...i} />
                  ))}
                </View>
                <View style={styles.formBtn}>
                  <Btn
                    title={LABELS.confirm}
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

export default ConfirmPasswordScreen
