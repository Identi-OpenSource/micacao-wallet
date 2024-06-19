import {useNavigation} from '@react-navigation/native'
import React, {useContext, useEffect} from 'react'
import {StyleSheet, Text, View} from 'react-native'
import Spinner from 'react-native-loading-spinner-overlay'
import Toast from 'react-native-toast-message'
import Logo from '../../../assets/svg/initMan.svg'
import {Btn} from '../../../components/button/Button'
import {SafeArea} from '../../../components/safe-area/SafeArea'
import {LABELS} from '../../../config/texts/labels'
import {TEXTS} from '../../../config/texts/texts'
import {COLORS_DF, FONT_FAMILIES, MP_DF} from '../../../config/themes/default'
import {
  horizontalScale,
  moderateScale,
  verticalScale,
} from '../../../config/themes/metrics'
import {useAuth} from '../../../states/AuthContext'
import {ConnectionContext} from '../../../states/ConnectionContext'

export const HomeScreen = () => {
  const {accessToken, getToken, loading} = useAuth()
  const internetConnection = useContext(ConnectionContext)
  const {isConnected} = internetConnection
  const navigation = useNavigation()

  useEffect(() => {
    if (accessToken !== null) {
      navigation.navigate('IamScreen')
    }
  }, [accessToken])

  return (
    <SafeArea bg={'isabelline'}>
      <Spinner color="#178B83" visible={loading} size={100} />
      <Logo width={390} height={390} style={styles.svg} />
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Text style={[styles.textA]}>{TEXTS.textA}</Text>
          <Text style={[styles.textB]}>{TEXTS.textB}</Text>
        </View>
        <View style={styles.formBtn}>
          <Btn
            title={LABELS.createAccount}
            theme="agrayu"
            onPress={() => {
              if (isConnected) {
                getToken()
              } else {
                Toast.show({
                  type: 'syncToast',
                  text1:
                    '¡Recuerda que necesitas estar conectado a internet para crear tu cuenta!',
                })
              }
            }}
          />
        </View>
      </View>
    </SafeArea>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: horizontalScale(MP_DF.large),
  },
  img: {
    width: horizontalScale(306),
    height: verticalScale(306),
    alignSelf: 'center',
  },
  textContainer: {flex: 1},
  textA: {
    fontFamily: FONT_FAMILIES.bold,
    fontSize: moderateScale(32),
    fontWeight: '700',
    textAlign: 'center',
    color: COLORS_DF.citrine_brown,
    paddingHorizontal: horizontalScale(MP_DF.large),
    paddingVertical: verticalScale(MP_DF.medium),
  },
  textB: {
    fontFamily: FONT_FAMILIES.primary,
    fontSize: moderateScale(24),
    fontWeight: '500',
    textAlign: 'center',
    color: COLORS_DF.citrine_brown,
  },
  formBtn: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: verticalScale(MP_DF.xlarge),
  },
  svg: {
    alignSelf: 'center',
  },
})
