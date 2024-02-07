import React from 'react'
import {
  HeaderActions,
  SafeArea,
} from '../../../../components/safe-area/SafeArea'
import {StyleSheet, View} from 'react-native'
import {MP_DF} from '../../../../config/themes/default'
import {TEXTS} from '../../../../config/texts/texts'
import {ScreenProps} from '../../../../routers/Router'
import {LABELS} from '../../../../config/texts/labels'
import {InputText} from '../../../../components/input-text/InputText'
import {InputTextProps} from '../../../../components/input-text/interfaces'
import {number, object} from 'yup'
import {MSG_ERROR} from '../../../../config/texts/erros'
import {Field, Formik} from 'formik'
import {Btn} from '../../../../components/button/Button'
import {STYLES_GLOBALS} from '../../../../config/themes/stylesGlobals'
import {storage} from '../../../../config/store/db'

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

export const RegisterParcelTwoScreen = ({
  navigation,
}: ScreenProps<'RegisterParcelTwoScreen'>) => {
  const onSubmit = (values: Interface) => {
    const hectares = Number(values.hectares)
    const parcelTemp = JSON.parse(storage.getString('parcelTemp') || '{}')
    storage.set('parcelTemp', JSON.stringify({...parcelTemp, hectares}))
    navigation.navigate('RegisterParcelThirdScreen')
  }

  return (
    <SafeArea bg="neutral" isForm>
      <View style={styles.container}>
        <HeaderActions title={TEXTS.textD} navigation={navigation} />
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
