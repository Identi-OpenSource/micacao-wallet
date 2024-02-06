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
  INIT_VALUES_TWO,
  INPUTS_TWO,
  InterfaceTwo,
  SCHEMA_TWO,
} from './Interfaces'
import {LABELS} from '../../../config/texts/labels'
import {styles} from './styles'
import {ScreenProps} from '../../../routers/Router'
import {Header} from './RegisterScreen'
import {storage} from '../../../config/store/db'
import {InputText} from '../../../components/input-text/InputText'

export const RegisterSecondScreen = ({
  navigation,
}: ScreenProps<'RegisterSecondScreen'>) => {
  const user = JSON.parse(storage.getString('user') || '{}')
  console.log('user', user)

  const submit = (values: InterfaceTwo) => {
    storage.set('user', JSON.stringify({...user, ...values}))
    navigation.navigate('RegisterSecondScreen')
  }

  return (
    <SafeArea bg="neutral" isForm>
      <View style={styles.container}>
        <Header navigation={navigation} title={TEXTS.textD} />
        <Formik
          initialValues={INIT_VALUES_TWO}
          onSubmit={values => submit(values)}
          validationSchema={SCHEMA_TWO}>
          {({handleSubmit, isValid, dirty}) => (
            <>
              <View style={styles.formContainer}>
                <View style={styles.formInput}>
                  {INPUTS_TWO(user?.country?.phoneCode).map(i => (
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
