/**
 * @component IamScreen - Componente de selección de género
 * @description Componente de vista
 * Funciones:
 * En este componente se selecciona el género del usuario
 */

import React, {useContext} from 'react'
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import {SafeArea} from '../../../components/safe-area/SafeArea'
import {TEXTS} from '../../../config/texts/texts'
import {
  BORDER_RADIUS_DF,
  BTN_THEME,
  COLORS_DF,
  DWH,
  FONT_FAMILIES,
  FONT_SIZES,
  MP_DF,
} from '../../../config/themes/default'

import {useNavigation} from '@react-navigation/native'
import {imgMan, imgWoman} from '../../../assets/imgs'
import {GENDER, STORAGE_KEYS} from '../../../config/const'
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../../../config/themes/metrics'
// import {UserDispatchContext, UsersContext} from '../../../states/UserContext'
import {Header} from './RegisterScreen'
import {storage} from '../../../config/store/db'

export const IamScreen = () => {
  const navigation = useNavigation()

  const cards = [
    {
      img: imgWoman,
      title: TEXTS.textAC,
      value: GENDER.woman,
      id: GENDER.id_woman,
    },
    {
      img: imgMan,
      title: TEXTS.textAB,
      value: GENDER.man,
      id: GENDER.id_man,
    },
  ]
  return (
    <SafeArea bg="isabelline" isForm>
      <View style={styles.container}>
        <Header label={'Atrás'} />
        <Text style={styles.Iam}>Yo soy...</Text>
        {cards.map((c, i) => (
          <Card img={c.img} title={c.title} value={c.value} key={i} id={c.id} />
        ))}
      </View>
    </SafeArea>
  )
}
const Card = (props: {
  img: ImageSourcePropType
  title: string
  value: string
  id: string
}) => {
  const navigation = useNavigation()

  // const user = useContext(UsersContext)

  // const dispatch = useContext(UserDispatchContext)

  // const setGender = (newGender: string) => {
  //   dispatch({
  //     type: 'setUser',
  //     payload: {
  //       ...user,
  //       gender: newGender,
  //     },
  //   })
  // }

  const submit = () => {
    // setGender(props.id)
    storage.set(STORAGE_KEYS.user, JSON.stringify({gender: props.id}))
    navigation.navigate('StartScreen')
  }
  return (
    <View style={styles.bodyCardContainerFull}>
      <TouchableOpacity
        onPress={submit}
        style={styles.bodyCard}
        activeOpacity={BTN_THEME.primary?.const?.opacity}>
        <Image source={props.img} style={styles.img} />
        <Text style={styles.titleCard}>{props.title}</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  Iam: {
    fontFamily: FONT_FAMILIES.primary,
    fontSize: moderateScale(30),
    fontWeight: 'bold',
    color: COLORS_DF.citrine_brown,
    paddingLeft: 10,
  },
  container: {
    flex: 1,
    paddingHorizontal: horizontalScale(MP_DF.large),
    paddingTop: 15,
  },
  bodyContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: MP_DF.large,
  },
  bodyCardContainerFull: {
    width: '100%',
    padding: MP_DF.small,
    marginTop: MP_DF.large,
  },
  bodyCard: {
    maxHeight: DWH.height / 3,
    paddingHorizontal: MP_DF.small,
    paddingVertical: MP_DF.large,
    backgroundColor: COLORS_DF.white,
    borderRadius: BORDER_RADIUS_DF.medium,
    elevation: 5,
    alignItems: 'center',
    overflow: 'hidden',
    borderColor: COLORS_DF.citrine_brown,
    borderWidth: 1,
  },
  titleCard: {
    paddingHorizontal: MP_DF.medium,
    marginTop: MP_DF.medium,
    fontFamily: FONT_FAMILIES.primary,
    fontSize: FONT_SIZES.large,
    fontWeight: 'bold',
    color: COLORS_DF.citrine_brown,
    textAlign: 'center',
  },
  img: {
    width: horizontalScale(100),
    height: verticalScale(100),
    resizeMode: 'contain',
  },
  textContainer: {flex: 1},
  textA: {
    fontFamily: FONT_FAMILIES.primary,
    fontSize: moderateScale(32),
    fontWeight: '700',
    textAlign: 'center',
    color: COLORS_DF.cacao,
    paddingHorizontal: horizontalScale(MP_DF.large),
    paddingVertical: verticalScale(MP_DF.medium),
  },
  textB: {
    fontFamily: FONT_FAMILIES.primary,
    fontSize: moderateScale(24),
    fontWeight: '500',
    textAlign: 'center',
    color: COLORS_DF.cacao,
  },
  formBtn: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: verticalScale(MP_DF.xlarge),
  },
})
