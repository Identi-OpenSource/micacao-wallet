/**
 * @author : Braudin Laya
 * @since : 15/09/2021
 * @summary : Register screen of the application
 */

import React from 'react'
import {SafeArea} from '../../../components/safe-area/SafeArea'
import {useNavigation} from '@react-navigation/native'
import {StyleSheet, Text, View} from 'react-native'
import {Btn, BtnIcon} from '../../../components/button/Button'
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../../../config/themes/metrics'
import {COLORS_DF, FONT_FAMILIES, MP_DF} from '../../../config/themes/default'
import {TEXTS} from '../../../config/texts/texts'
import {Field, Formik} from 'formik'
import {INIT_VALUES_ONE, INPUTS_ONE, SCHEMA_ONE} from './Interfaces'
import {LABELS} from '../../../config/texts/labels'

export const RegisterScreen = () => {
  const navigation = useNavigation()

  const onSubmit = (values: any) => {
    console.log(values)
    navigation.navigate('RegisterScreen')
  }

  return (
    <SafeArea bg="neutral" isForm>
      <View style={styles.container}>
        <View style={styles.header}>
          <BtnIcon
            theme="transparent"
            icon="angle-left"
            size={moderateScale(30)}
            style={{container: styles.btnIcon}}
            onPress={() => navigation.goBack()}
          />
          <Text style={styles.title}>{TEXTS.textC}</Text>
        </View>
        <Formik
          initialValues={INIT_VALUES_ONE}
          onSubmit={values => onSubmit(values)}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: horizontalScale(MP_DF.large),
    paddingTop: verticalScale(MP_DF.medium),
  },
  header: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  btnIcon: {
    alignSelf: 'flex-start',
    marginLeft: -6,
  },
  title: {
    fontFamily: FONT_FAMILIES.primary,
    fontSize: moderateScale(28),
    fontWeight: '700',
    color: COLORS_DF.cacao,
    marginTop: verticalScale(MP_DF.medium),
  },
  formContainer: {
    marginTop: verticalScale(MP_DF.xlarge),
    flex: 1,
  },
  formLabel: {},
  formInput: {
    flex: 1,
  },
  formBtn: {
    paddingBottom: verticalScale(MP_DF.xlarge),
  },
})
