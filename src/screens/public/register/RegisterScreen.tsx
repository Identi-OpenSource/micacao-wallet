/**
 * @author : Braudin Laya
 * @since : 15/09/2021
 * @summary : Register screen of the application
 */

import React from 'react'
import {SafeArea} from '../../../components/safe-area/SafeArea'
import {useNavigation} from '@react-navigation/native'
import {Text, View} from 'react-native'
import {Btn, BtnIcon} from '../../../components/button/Button'
import {moderateScale} from '../../../config/themes/metrics'
import {TEXTS} from '../../../config/texts/texts'
import {Field, Formik} from 'formik'
import {
  INIT_VALUES_ONE,
  INPUTS_ONE,
  InterfaceHeader,
  InterfaceOne,
  SCHEMA_ONE,
} from './Interfaces'
import {LABELS} from '../../../config/texts/labels'
import {styles} from './styles'
import {storage} from '../../../config/store/db'

export const RegisterScreen = () => {
  const navigation = useNavigation()

  const submit = (values: InterfaceOne) => {
    const user = JSON.parse(storage.getString('user') || '{}')
    storage.set('user', JSON.stringify({...user, ...values}))
    navigation.navigate('RegisterSecondScreen')
  }

  return (
    <SafeArea bg="neutral" isForm>
      <View style={styles.container}>
        <Header navigation={navigation} title={TEXTS.textC} />
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
  const {navigation, title} = props
  return (
    <View style={styles.header}>
      <BtnIcon
        theme="transparent"
        icon="angle-left"
        size={moderateScale(30)}
        style={{container: styles.btnIcon}}
        onPress={() => navigation.goBack()}
      />
      <Text style={styles.title}>{title}</Text>
    </View>
  )
}
