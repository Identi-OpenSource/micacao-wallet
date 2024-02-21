import React from 'react'
import {SafeArea} from '../../../components/safe-area/SafeArea'
import {View} from 'react-native'
import {Btn} from '../../../components/button/Button'
import {TEXTS} from '../../../config/texts/texts'
import {Field, Formik} from 'formik'
import {
  INIT_VALUES_THREE,
  INPUTS_THREE,
  InterfaceThree,
  SCHEMA_THREE,
} from './Interfaces'
import {LABELS} from '../../../config/texts/labels'
import {styles} from './styles'
import {ScreenProps} from '../../../routers/Router'
import {Header} from './RegisterScreen'
import {storage} from '../../../config/store/db'

export const RegisterThirdScreen = ({
  navigation,
}: ScreenProps<'RegisterThirdScreen'>) => {
  const submit = (values: InterfaceThree) => {
    const user = JSON.parse(storage.getString('user') || '{}')
    storage.set('user', JSON.stringify({...user, ...values}))
    navigation.navigate('RegisterFourthScreen')
  }

  return (
    <SafeArea bg="neutral" isForm>
      <View style={styles.container}>
        <Header navigation={navigation} title={TEXTS.textE} />
        <Formik
          initialValues={INIT_VALUES_THREE}
          onSubmit={values => submit(values)}
          validationSchema={SCHEMA_THREE}>
          {({handleSubmit, isValid, dirty}) => (
            <>
              <View style={styles.formContainer}>
                <View style={styles.formInput}>
                  {INPUTS_THREE.map(i => (
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
