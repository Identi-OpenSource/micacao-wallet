import React, {useContext, useEffect, useRef} from 'react'
import {BackHandler, StyleSheet, Text, View} from 'react-native'
import {
  COLORS_DF,
  FONT_FAMILIES,
  FONT_SIZES,
  MP_DF,
} from '../../config/themes/default'
import {Field, Formik} from 'formik'
import {
  INIT_VALUES_FOURTH,
  INPUTS_FOURTH,
  SCHEMA_FOURTH,
} from '../../screens/public/register/Interfaces'
import {Btn} from '../button/Button'
import {LABELS} from '../../config/texts/labels'
import {verticalScale} from '../../config/themes/metrics'
import {sha256} from 'react-native-sha256'
import {UsersContext} from '../../states/UserContext'
import Toast from 'react-native-toast-message'

export const PinRequest = ({setShowRequestPin, setPinApproved}) => {
  const user = useContext(UsersContext)
  const formiRef = useRef(null)
  useEffect(() => {
    const backAction = () => {
      setShowRequestPin(false)
      return true
    }

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    )

    return () => backHandler.remove()
  }, [])

  const submit = async values => {
    const pinHash = await sha256(values.pin)
    if (pinHash !== user.pin) {
      Toast.show({
        type: 'syncToast',
        text1: 'EL Pin ingresado es incorrecto, por favor intente de nuevo',
      })
      return
    }
    setPinApproved(true)
    setShowRequestPin(false)
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>PIN de seguridad</Text>
      <Text style={styles.text}>
        Para continuar con la transacción, por favor introduzca el PIN de
        seguridad
      </Text>
      <Formik
        innerRef={formiRef}
        initialValues={INIT_VALUES_FOURTH}
        onSubmit={values => submit(values)}
        validationSchema={SCHEMA_FOURTH}>
        {({handleSubmit, values, errors}) => (
          <FormContent
            values={values}
            handleSubmit={handleSubmit}
            errors={errors}
          />
        )}
      </Formik>
    </View>
  )
}

const FormContent = ({values, handleSubmit, errors}) => {
  useEffect(() => {
    if (values?.pin?.length === 6) {
      handleSubmit()
    }
  }, [errors])

  return (
    <View style={styles.formContainer}>
      <View style={styles.formInput}>
        {INPUTS_FOURTH.map(i => (
          <Field key={i.name} {...i} label={''} />
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS_DF.isabelline,
    paddingTop: MP_DF.xxxlarge * 2,
    paddingHorizontal: MP_DF.large,
  },
  title: {
    fontSize: FONT_SIZES.xslarge,
    fontWeight: 'bold',
    color: COLORS_DF.citrine_brown,
    fontFamily: FONT_FAMILIES.primary,
  },
  text: {
    marginTop: MP_DF.large,
    fontSize: FONT_SIZES.medium,
    color: COLORS_DF.citrine_brown,
    fontFamily: FONT_FAMILIES.primary,
    lineHeight: FONT_SIZES.large * 1.5,
  },
  formBtn: {
    paddingBottom: verticalScale(MP_DF.xlarge),
  },
  formInput: {
    flex: 1,
  },
  formContainer: {
    marginTop: verticalScale(MP_DF.xlarge),
    flex: 1,
  },
})
