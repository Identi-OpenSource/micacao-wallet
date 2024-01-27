import React from 'react'
import {
  HeaderActions,
  SafeArea,
} from '../../../../components/safe-area/SafeArea'
import {ImageBackground, StyleSheet, Text, View} from 'react-native'
import {
  BORDER_RADIUS_DF,
  COLORS_DF,
  DWH,
  FONT_FAMILIES,
  FONT_SIZES,
  MP_DF,
} from '../../../../config/themes/default'
import {TEXTS} from '../../../../config/texts/texts'
import {ScreenProps} from '../../../../routers/Router'
import {LABELS} from '../../../../config/texts/labels'
import {Btn} from '../../../../components/button/Button'
import {STYLES_GLOBALS} from '../../../../config/themes/stylesGlobals'
import {imgProductorGif} from '../../../../assets/imgs'

export const RegisterParcelFifthScreen = ({
  navigation,
  route,
}: ScreenProps<'RegisterParcelFifthScreen'>) => {
  const onSubmit = () => {
    navigation.navigate('RegisterParcelSixthScreen', {
      ...route.params,
    })
  }

  return (
    <SafeArea bg="neutral" isForm>
      <View style={styles.container}>
        <HeaderActions title={TEXTS.textF} navigation={navigation} />

        <View style={styles.formContainer}>
          <View style={styles.formInput}>
            <ImageBackground
              source={imgProductorGif}
              style={styles.containerImg}
            />
            {/* Texto único */}
            <Text style={styles.textUnique}>
              Ahora, camina hacia el{' '}
              <Text style={styles.textUniqueUPPER}>CENTRO</Text> de tu parcela.
            </Text>
          </View>
          <View style={STYLES_GLOBALS.formBtn}>
            <Btn
              title={LABELS.imAlreadyCenter}
              theme={'agrayu'}
              onPress={() => onSubmit()}
            />
          </View>
        </View>
      </View>
    </SafeArea>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: MP_DF.large,
    paddingTop: MP_DF.medium,
  },
  formContainer: {
    flex: 1,
  },
  formInput: {
    flex: 1,
    alignItems: 'center',
    paddingTop: MP_DF.large,
  },
  containerImg: {
    width: DWH.width * 0.8,
    height: DWH.height * 0.4,
    borderRadius: BORDER_RADIUS_DF.large,
    overflow: 'hidden',
    transform: [{rotateY: '180deg'}],
  },
  textUnique: {
    fontFamily: FONT_FAMILIES.primary,
    fontSize: FONT_SIZES.xslarge,
    fontWeight: 'bold',
    lineHeight: FONT_SIZES.xslarge * 1.5,
    color: COLORS_DF.cacao,
    marginTop: MP_DF.xxlarge,
  },
  textUniqueUPPER: {
    textTransform: 'uppercase',
    textDecorationLine: 'underline',
    fontSize: FONT_SIZES.xslarge * 1.2,
  },
})
