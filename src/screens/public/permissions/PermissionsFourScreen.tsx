import {useNavigation} from '@react-navigation/native'
import React from 'react'
import {PermissionsAndroid, Platform, StyleSheet, View} from 'react-native'
import {CameraPermision, Camera_M, Camera_W} from '../../../assets/svg'
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
import {RootStackParamList} from '../../../routers/Router'
import {storage} from '../../../config/store/db'
export const PermissionsFourScreen = () => {
  const user = JSON.parse(storage.getString('user') || '{}')
  const navigation = useNavigation()
  // request permission to use location

  const requestPermission = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: TEXTS.textU,
        message: TEXTS.textX,
        buttonNeutral: LABELS.AskMeLater,
        buttonNegative: LABELS.cancel,
        buttonPositive: LABELS.permission,
      },
    )

    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      let initialRouteName: keyof RootStackParamList = 'TabPrivate'
      if (!user.isLogin) {
        initialRouteName = 'Maps'
      }
      if (user.isLogin && user?.parcel?.length === 0) {
        initialRouteName = 'RegisterParcelScreen'
      }
      navigation.navigate(initialRouteName)
    }
  }

  return (
    <SafeArea bg={'isabelline'}>
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: 20,
            }}>
            {user.gender === 'M' && <Camera_M />}
            {user.gender === 'W' && <Camera_W />}
          </View>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <CameraPermision style={styles.img} width={440} height={420} />
          </View>
        </View>
        <View style={styles.formBtn}>
          <Btn
            title={LABELS.continue}
            theme="agrayu"
            onPress={() => requestPermission()}
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
    paddingTop: 25,
  },
  img: {
    alignSelf: 'center',
    marginLeft: 35,
    marginTop: 45,
  },
  textContainer: {
    flex: 1,
  },
  textA: {
    fontFamily: FONT_FAMILIES.primary,
    fontSize: moderateScale(32),
    fontWeight: '700',
    textAlign: 'left',
    color: COLORS_DF.cacao,
    paddingVertical: verticalScale(MP_DF.medium),
  },
  textB: {
    fontFamily: FONT_FAMILIES.primary,
    fontSize: moderateScale(24),
    fontWeight: '500',
    lineHeight: 36,
    color: COLORS_DF.cacao,
    marginTop: MP_DF.large,
  },
  formBtn: {
    justifyContent: 'flex-end',
    paddingBottom: verticalScale(MP_DF.xlarge),
  },
})
