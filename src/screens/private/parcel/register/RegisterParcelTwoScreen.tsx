import {Field, Formik} from 'formik'
import React, {useContext} from 'react'
import {StyleSheet, View} from 'react-native'
import {number, object} from 'yup'
import {Hectare_M, Hectare_W} from '../../../../assets/svg'
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
export interface Interface {
  hectares: string
}
export const VALUES: Interface = {
  hectares: '',
}

export const INPUTS = [
  {
    name: 'hectares',
    label: LABELS.hectaresParcel,
    component: InputText,
    keyboardType: 'numeric',
    preFormate: 'decimal',
    inputMode: 'numeric',
  },
] as InputTextProps[]

export let SCHEMA = object({
  hectares: number()
    .typeError(MSG_ERROR.noIsNumber)
    .min(0.1, MSG_ERROR.minNumber(0.1))
    .required(MSG_ERROR.required),
})

interface RegisterParcelTwoScreenProps {
  navigation: any
}
const RegisterParcelTwoScreen: React.FC<RegisterParcelTwoScreenProps> = ({
  navigation,
}) => {
  const onSubmit = (values: Interface) => {
    const hectares = Number(values.hectares)
    const parcelTemp = JSON.parse(storage.getString('parcelTemp') || '{}')
    storage.set('parcelTemp', JSON.stringify({...parcelTemp, hectares}))
    navigation.navigate('RegisterParcelThirdScreen')
  }
  const user = useContext(UsersContext)

  return (
    <SafeArea bg="isabelline" isForm>
      <View style={styles.container}>
        <HeaderActions title={''} navigation={navigation} />
        {user.gender == 'M' && <Hectare_M />}
        {user.gender == 'W' && <Hectare_W />}
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
                <View style={STYLES_GLOBALS.formBtn}>
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

export default RegisterParcelTwoScreen
