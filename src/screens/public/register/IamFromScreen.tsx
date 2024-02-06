/**
 * @author : Braudin Laya
 * @since : 15/09/2021
 * @summary : View of entry point of the application
 */

import React from 'react'
import {SafeArea} from '../../../components/safe-area/SafeArea'
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import {
  BORDER_RADIUS_DF,
  BTN_THEME,
  COLORS_DF,
  FONT_FAMILIES,
  FONT_SIZES,
  MP_DF,
} from '../../../config/themes/default'
import {TEXTS} from '../../../config/texts/texts'
import {useNavigation} from '@react-navigation/native'
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../../../config/themes/metrics'
import {Header} from './RegisterScreen'
import {imgCO, imgPE} from '../../../assets/imgs'
import {COUNTRY} from '../../../config/const'
import {storage} from '../../../config/store/db'
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome'

export const IamFromScreen = () => {
  const navigation = useNavigation()
  const cards = [
    {
      img: imgCO,
      title: COUNTRY.colombia.name,
      value: COUNTRY.colombia,
    },
    {
      img: imgPE,
      title: COUNTRY.peru.name,
      value: COUNTRY.peru,
    },
  ]
  return (
    <SafeArea bg="neutral" isForm>
      <View style={styles.container}>
        <Header navigation={navigation} title={TEXTS.textAD} />
        <View style={styles.bodyContainer}>
          {cards.map((c, i) => (
            <Card img={c.img} title={c.title} value={c.value} key={i} />
          ))}
        </View>
      </View>
    </SafeArea>
  )
}
const Card = (props: {
  img: ImageSourcePropType
  title: string
  value: object
}) => {
  const navigation = useNavigation()
  const submit = () => {
    const user = JSON.parse(storage.getString('user') || '{}')
    storage.set('user', JSON.stringify({...user, country: props.value}))
    navigation.navigate('RegisterScreen')
  }
  return (
    <View style={styles.bodyCardContainerFull}>
      <TouchableOpacity
        onPress={submit}
        style={styles.bodyCard}
        activeOpacity={BTN_THEME.primary?.const?.opacity}>
        <Image source={props.img} style={styles.img} />
        <Text style={styles.titleCard}>{props.title}</Text>
        <View style={styles.icon}>
          <FontAwesomeIcon icon="angle-right" size={32} />
        </View>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: horizontalScale(MP_DF.large),
  },
  bodyContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: MP_DF.xlarge,
  },
  bodyCardContainerFull: {
    width: '100%',
    padding: MP_DF.small,
    marginTop: MP_DF.small,
  },
  bodyCard: {
    paddingHorizontal: MP_DF.large,
    paddingVertical: MP_DF.medium,
    backgroundColor: COLORS_DF.white,
    borderRadius: BORDER_RADIUS_DF.medium,
    elevation: 5,
    borderColor: COLORS_DF.cacao,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleCard: {
    fontFamily: FONT_FAMILIES.primary,
    fontSize: FONT_SIZES.large,
    fontWeight: 'bold',
    color: COLORS_DF.cacao,
  },
  img: {
    width: horizontalScale(32),
    height: verticalScale(32),
    resizeMode: 'contain',
    marginRight: MP_DF.large,
  },
  icon: {
    flex: 1,
    alignItems: 'flex-end',
  },
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
