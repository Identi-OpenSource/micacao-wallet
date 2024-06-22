import {Field, Formik} from 'formik'
import React, {useContext} from 'react'
import {View} from 'react-native'
import {Name_M, Name_W} from '../../../assets/svg'
import {Btn} from '../../../components/button/Button'
import {SafeArea} from '../../../components/safe-area/SafeArea'
import {LABELS} from '../../../config/texts/labels'
import {ScreenProps} from '../../../routers/Router'
import {UserDispatchContext, UsersContext} from '../../../states/UserContext'
import {
  INIT_VALUES_THREE,
  INPUTS_THREE,
  InterfaceThree,
  SCHEMA_THREE,
} from './Interfaces'
import {Header} from './RegisterScreen'
import {styles} from './styles'

interface RegisterThirdScreenProps {
  navigation: any
}

const RegisterThirdScreen: React.FC<RegisterThirdScreenProps> = ({
  navigation,
}) => {
  const user = useContext(UsersContext)
  const dispatch = useContext(UserDispatchContext)

  const submit = (values: InterfaceThree) => {
    dispatch({
      type: 'setUser',
      payload: {
        ...user,
        ...values,
      },
    })
    navigation.navigate('RegisterFourthScreen')
  }

  return (
    <SafeArea bg="isabelline" isForm>
      <View style={styles.container}>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          {user.gender == 'M' && <Name_M />}
          {user.gender == 'W' && <Name_W />}
        </View>
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

export default RegisterThirdScreen
