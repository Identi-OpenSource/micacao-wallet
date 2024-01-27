import React from 'react'
import {Image, StyleSheet, Text, View} from 'react-native'
import {SafeArea} from '../../../../components/safe-area/SafeArea'
import {ScreenProps} from '../../../../routers/Router'
import {TEXTS} from '../../../../config/texts/texts'
import {
  COLORS_DF,
  DWH,
  FONT_FAMILIES,
  FONT_SIZES,
  MP_DF,
} from '../../../../config/themes/default'
import {imgCampo} from '../../../../assets/imgs'
import {Btn} from '../../../../components/button/Button'
import {LABELS} from '../../../../config/texts/labels'

export const RegisterParcelScreen = ({
  navigation,
}: ScreenProps<'RegisterParcelScreen'>) => {
  return (
    <SafeArea bg="neutral">
      <View style={styles.container}>
        <Text style={styles.title}>{TEXTS.welcome}</Text>
        <Image source={imgCampo} style={styles.containerImg} />
        <Text style={styles.subTitle}>{TEXTS.textM}</Text>
        <View style={styles.btn}>
          <Btn
            title={LABELS.addParcel}
            theme="agrayu"
            onPress={() => navigation.navigate('RegisterOneScreen')}
          />
        </View>
      </View>
    </SafeArea>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: MP_DF.large,
    alignItems: 'center',
  },
  title: {
    fontFamily: FONT_FAMILIES.primary,
    fontSize: FONT_SIZES.xlarge,
    fontWeight: '700',
    color: COLORS_DF.cacao,
    textAlign: 'center',
  },
  containerImg: {
    marginTop: MP_DF.xxlarge * 1.5,
    width: DWH.width * 0.8,
    height: DWH.height * 0.4,
    resizeMode: 'contain',
  },
  subTitle: {
    fontFamily: FONT_FAMILIES.primary,
    fontSize: FONT_SIZES.xslarge,
    fontWeight: '700',
    color: COLORS_DF.cacao,
    marginHorizontal: MP_DF.medium,
    marginTop: MP_DF.xxlarge * 1.5,
    textAlign: 'center',
  },
  btn: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
    marginTop: MP_DF.xxlarge,
  },
})
