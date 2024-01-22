/**
 * @author : Braudin Laya
 * @since : 15/09/2021
 * @summary : Register screen of the application
 */

import React from 'react'
import {SafeArea} from '../../../components/safe-area/SafeArea'
import {Keyboard, View} from 'react-native'
import {Btn} from '../../../components/button/Button'
import {TEXTS} from '../../../config/texts/texts'
import {Field, Formik} from 'formik'
import {
  INIT_VALUES_TWO,
  INPUTS_TWO,
  InterfaceTwo,
  SCHEMA_TWO,
} from './Interfaces'
import {LABELS} from '../../../config/texts/labels'
import {styles} from './styles'
import {ScreenProps} from '../../../routers/Router'
import {Header} from './RegisterScreen'

export const RegisterSecondScreen = ({
  route,
  navigation,
}: ScreenProps<'RegisterSecondScreen'>) => {
  const params = route.params

  const onSubmit = (values: InterfaceTwo) => {
    Keyboard.dismiss()
    setTimeout(() => {
      navigation.navigate('RegisterThirdScreen', {...params, ...values})
    }, 100)
  }

  return (
    <SafeArea bg="neutral" isForm>
      <View style={styles.container}>
        <Header navigation={navigation} title={TEXTS.textD} />
        <Formik
          initialValues={INIT_VALUES_TWO}
          onSubmit={values => onSubmit(values)}
          validationSchema={SCHEMA_TWO}>
          {({handleSubmit, isValid, dirty}) => (
            <>
              <View style={styles.formContainer}>
                <View style={styles.formInput}>
                  {INPUTS_TWO.map(i => (
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
