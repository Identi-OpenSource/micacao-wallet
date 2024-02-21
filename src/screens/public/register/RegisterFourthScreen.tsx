/**
 * @author : Braudin Laya
 * @since : 15/09/2021
 * @summary : Register screen of the application
 */

import React from 'react'
import {SafeArea} from '../../../components/safe-area/SafeArea'
import {View} from 'react-native'
import {Btn} from '../../../components/button/Button'
import {TEXTS} from '../../../config/texts/texts'
import {Field, Formik} from 'formik'
import {
  INIT_VALUES_FOURTH,
  INPUTS_FOURTH,
  InterfaceFourth,
  SCHEMA_FOURTH,
} from './Interfaces'
import {LABELS} from '../../../config/texts/labels'
import {styles} from './styles'
import {ScreenProps} from '../../../routers/Router'
import {Header} from './RegisterScreen'
import {storage} from '../../../config/store/db'
import {sha256} from 'react-native-sha256'

export const RegisterFourthScreen = ({
  navigation,
}: ScreenProps<'RegisterFourthScreen'>) => {
  const submit = (values: InterfaceFourth) => {
    sha256(values.pin)
      .then(pinHash => {
        storage.set('security', JSON.stringify({pin: pinHash}))
        navigation.navigate('RegisterOkScreen')
      })
      .catch(error => {
        console.log(error)
      })
  }

  return (
    <SafeArea bg="neutral" isForm>
      <View style={styles.container}>
        <Header navigation={navigation} title={TEXTS.textF} />
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
