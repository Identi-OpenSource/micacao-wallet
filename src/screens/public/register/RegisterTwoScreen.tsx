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
import {Btn} from '../../../components/button/Button'

import {LABELS} from '../../../config/texts/labels'
import {TEXTS} from '../../../config/texts/texts'
import {styles} from './styles'

export const RegisterTwoScreen = () => {
  const onSubmit = (values: ValuesInterface) => {
    console.log(values)
  }

  return (
    <SafeArea>
      <View style={styles.container}>
        <Text style={styles.title}>{TEXTS.textD}</Text>
        {/* <Text style={styles.subtitle}>{TEXTS.textE}</Text> */}
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
