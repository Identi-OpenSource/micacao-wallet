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
import {object, string} from 'yup'
import {MSG_ERROR} from '../../../../config/texts/erros'
import {Field, Formik} from 'formik'
import {Btn} from '../../../../components/button/Button'
import {STYLES_GLOBALS} from '../../../../config/themes/stylesGlobals'
import {storage} from '../../../../config/store/db'

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

export const RegisterOneScreen = ({
  navigation,
}: ScreenProps<'RegisterOneScreen'>) => {
  const onSubmit = (values: Interface) => {
    storage.set('parcelTemp', JSON.stringify({...values}))
    navigation.navigate('RegisterParcelTwoScreen')
  }

  return (
    <SafeArea bg="neutral" isForm>
      <View style={styles.container}>
        <HeaderActions title={TEXTS.textC} navigation={navigation} />
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
