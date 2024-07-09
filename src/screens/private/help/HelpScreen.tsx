import React from 'react'
import {Linking, ScrollView, StyleSheet, Text, View} from 'react-native'
import HeaderComponent from '../../../components/Header'
import {Btn} from '../../../components/button/Button'
import {COLORS_DF, MP_DF} from '../../../config/themes/default'
import {useNavigation} from '@react-navigation/native'
export const HelpScreen = () => {
  const navigation = useNavigation()
  const onPress = () => {
    Linking.openURL('whatsapp://send?phone=+5117064556').catch(() => {
      Linking.openURL(
        'https://play.google.com/store/apps/details?id=com.whatsapp',
      )
    })
  }

  return (
    <View style={styles.container}>
      <HeaderComponent
        label="Ayuda"
        goBack={true}
        goBackNavigation={() => navigation.navigate('HomeProvScreen')}
        backgroundColor="#8F3B06"
        textColor="white"
      />
      <View style={{paddingHorizontal: 24, paddingVertical: 25}}>
        <Btn
          title={'Conversa con un asesor'}
          theme="agrayu"
          icon={'fa-brands fa-whatsapp'}
          onPress={onPress}
          style={{container: {marginVertical: MP_DF.large}}}
        />
        <ScrollView
          horizontal={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}>
          <View style={styles.separator} />
          <Text style={styles.title}>¿Debo activar el GPS?</Text>
          <Text style={styles.subTitle}>Si bla bla bla bla</Text>
          <View style={styles.separator} />
          <Text style={styles.title}>¿Debo activar el GPS?</Text>
          <Text style={styles.subTitle}>Si bla bla bla bla</Text>
          <View style={styles.separator} />
          <Text style={styles.title}>¿Debo activar el GPS?</Text>
          <Text style={styles.subTitle}>Si bla bla bla bla</Text>
          <View style={styles.separator} />
          <Text style={styles.title}>¿Debo activar el GPS?</Text>
          <Text style={styles.subTitle}>Si bla bla bla bla</Text>
          <View style={styles.separator} />
          <Text style={styles.title}>¿Debo activar el GPS?</Text>
          <Text style={styles.subTitle}>Si bla bla bla bla</Text>
          <View style={styles.separator} />
          <Text style={styles.title}>¿Debo activar el GPS?</Text>
          <Text style={styles.subTitle}>Si bla bla bla bla</Text>
          <View style={styles.separator} />
          <Text style={styles.title}>¿Debo activar el GPS?</Text>
          <Text style={styles.subTitle}>Si bla bla bla bla</Text>
          <View style={styles.separator} />
          <Text style={styles.title}>¿Debo activar el GPS?</Text>
          <Text style={styles.subTitle}>Si bla bla bla bla</Text>
          <View style={styles.separator} />
          <Text style={styles.title}>¿Debo activar el GPS?</Text>
          <Text style={styles.subTitle}>Si bla bla bla bla</Text>
          <View style={styles.separator} />
          <Text style={styles.title}>¿Debo activar el GPS?</Text>
          <Text style={styles.subTitle}>Si bla bla bla bla</Text>
          <View style={styles.separator} />
          <Text style={styles.title}>¿Debo activar el GPS?</Text>
          <Text style={styles.subTitle}>Si bla bla bla bla</Text>
          <View style={styles.separator} />
          <Text style={styles.title}>¿Debo activar el GPS?</Text>
          <Text style={styles.subTitle}>Si bla bla bla bla</Text>
          <View style={styles.separator} />
          <Text style={styles.title}>¿Debo activar el GPS?</Text>
          <Text style={styles.subTitle}>Si bla bla bla bla</Text>
          <View style={styles.separator} />
          <Text style={styles.title}>¿Debo activar el GPS?</Text>
          <Text style={styles.subTitle}>Si bla bla bla bla</Text>
          <View style={styles.separator} />
          <Text style={styles.title}>¿Debo activar el GPS?</Text>
          <Text style={styles.subTitle}>Si bla bla bla bla</Text>
          <View style={styles.separatorEnd} />
        </ScrollView>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  separator: {
    height: 20,
  },
  separatorEnd: {
    height: 300,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS_DF.isabelline,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS_DF.gray,
    marginTop: MP_DF.medium,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS_DF.citrine_brown,
  },
  cardContainer: {
    marginTop: MP_DF.large,
  },
  cardContenedor: {
    height: 100,
    backgroundColor: COLORS_DF.white,
    padding: MP_DF.medium,
    borderRadius: 10,
    elevation: 3,
    marginBottom: MP_DF.medium,
  },
  titleCard: {
    flex: 1,
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS_DF.citrine_brown,
  },
  actionsCard: {
    paddingVertical: MP_DF.medium,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  img: {
    width: 30,
    height: 30,
  },
})
