import {Field, Formik} from 'formik'
import React, {useContext} from 'react'
import {StyleSheet, View} from 'react-native'
import {object, string} from 'yup'
import {Parcel_Name_M, Parcel_Name_W} from '../../../../assets/svg'
import {Btn} from '../../../../components/button/Button'
import {InputText} from '../../../../components/input-text/InputText'
import {InputTextProps} from '../../../../components/input-text/interfaces'
import {
  HeaderActions,
  SafeArea,
} from '../../../../components/safe-area/SafeArea'
import {storage} from '../../../../config/store/db'
import {MSG_ERROR} from '../../../../config/texts/erros'
import {LABELS} from '../../../../config/texts/labels'
import {MP_DF} from '../../../../config/themes/default'
import {STYLES_GLOBALS} from '../../../../config/themes/stylesGlobals'
import {UsersContext} from '../../../../states/UserContext'
import {STORAGE_KEYS} from '../../../../config/const'
export interface Interface {
  name: string
}
export const VALUES: Interface = {
  name: '',
}

export const INPUTS = [
  {
    name: 'name',
    label: LABELS.nameParcel,
    component: InputText,
  },
] as InputTextProps[]

export let SCHEMA = object({
  name: string().min(3, MSG_ERROR.minString(3)).required(MSG_ERROR.required),
})

interface RegisterOneScreenProps {
  navigation: any
}
const RegisterOneScreen: React.FC<RegisterOneScreenProps> = ({navigation}) => {
  const user = JSON.parse(storage.getString(STORAGE_KEYS.user) || '{}')

  const onSubmit = (values: Interface) => {
    storage.set(STORAGE_KEYS.parcelTemp, JSON.stringify({...values}))
    navigation.navigate('RegisterParcelTwoScreen')
  }

  return (
    <SafeArea bg="isabelline" isForm>
      <View style={styles.container}>
        <HeaderActions title={''} navigation={navigation} />
        {user.gender === 'M' && <Parcel_Name_M />}
        {user.gender === 'W' && <Parcel_Name_W />}

        <Formik
          initialValues={VALUES}
          onSubmit={values => onSubmit(values)}
          validationSchema={SCHEMA}>
          {({handleSubmit, isValid, dirty}) => (
            <>
              <View style={STYLES_GLOBALS.formContainer}>
                <View style={STYLES_GLOBALS.formInput}>
                  {INPUTS.map(i => (
                    <Field key={i.name} {...i} />
                  ))}
                </View>
                <View style={{paddingBottom: 64}}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: MP_DF.large,
    paddingTop: MP_DF.medium,
  },
})

export default RegisterOneScreen
