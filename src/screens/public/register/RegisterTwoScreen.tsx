/**
 * @author : Braudin Laya
 * @since : 15/09/2021
 * @summary : Register screen of the application
 */

import React from 'react'
import {SafeArea} from '../../../components/safe-area/SafeArea'
import {Field, Formik} from 'formik'
import {
  INIT_VALUES,
  INPUTS,
  RegisterSchema,
  ValuesInterface,
} from './InterfacesTwo'
import {Text, View} from 'react-native'
import {Btn, BtnIcon} from '../../../components/button/Button'

import {LABELS} from '../../../config/texts/labels'
import {styles} from './styles'
import {TEXTS} from '../../../config/texts/texts'
import {useNavigation, useRoute} from '@react-navigation/native'
import {useSecureOffline} from '../../../hooks/useSecureOffline'
import {dbConfig} from '../../../config/db-encript'
import {UserInterface} from '../../../states/UserContext'

export const RegisterTwoScreen = () => {
  const navigation = useNavigation()
  const route = useRoute()
  const saveOffline = useSecureOffline(dbConfig.keyData)

  const onSubmit = async (values: ValuesInterface) => {
    const data: UserInterface = {
      ...(route.params as UserInterface),
      pin: values.pin,
    }
    await saveOffline.save(data)
    navigation.navigate('RegisterThreeScreen')
  }

  return (
    <SafeArea>
      <View style={styles.container}>
        <BtnIcon
          icon={'arrow-left-long'}
          theme="transparent"
          size={32}
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.title}>{TEXTS.textD}</Text>
        <Formik
          initialValues={INIT_VALUES}
          onSubmit={values => onSubmit(values)}
          validationSchema={RegisterSchema}>
          {({handleSubmit}) => (
            <>
              <View style={styles.containerForm}>
                {INPUTS.map(i => (
                  <Field key={i.name} {...i} />
                ))}
              </View>
              <View style={styles.containerBtn}>
                <Btn
                  title={LABELS.next}
                  theme="primary"
                  onPress={handleSubmit}
                />
              </View>
            </>
          )}
        </Formik>
      </View>
    </SafeArea>
  )
}
