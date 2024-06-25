import React from 'react'
import {StyleSheet, View} from 'react-native'
import {Man, Welcome_M, Welcome_W, Woman} from '../../../assets/svg/index'
import {Btn} from '../../../components/button/Button'
import {SafeArea} from '../../../components/safe-area/SafeArea'
import {LABELS} from '../../../config/texts/labels'
import {MP_DF} from '../../../config/themes/default'
import {verticalScale} from '../../../config/themes/metrics'
import {storage} from '../../../config/store/db'
import {useNavigation} from '@react-navigation/native'

const StartScreen = () => {
  const navigation = useNavigation()
  const user = JSON.parse(storage.getString('user') || '{}')
  return (
    <SafeArea>
      <View style={styles.container}>
        {user.gender === 'W' && (
          <View style={styles.containerWelcome_W}>
            <Welcome_W width={490} height={240} />
          </View>
        )}
        {user.gender === 'W' && (
          <View style={styles.containerW_andM}>
            <Woman width={200} height={200} />
          </View>
        )}
        {user.gender === 'M' && (
          <View style={styles.containerWelcome_W}>
            <Welcome_M width={490} height={240} />
          </View>
        )}
        {user.gender === 'M' && (
          <View style={styles.containerW_andM}>
            <Man width={200} height={200} />
          </View>
        )}
        <View style={styles.formBtn}>
          <Btn
            title={LABELS.continue}
            theme="agrayu"
            onPress={() => navigation.navigate('IamFromScreen')}
          />
        </View>
      </View>
    </SafeArea>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',

    backgroundColor: '#F6EEEB',
  },
  formBtn: {
    flex: 1,
    marginLeft: 20,
    /*  borderWidth: 1,
    borderColor: "red", */
    width: '90%',
    justifyContent: 'flex-end',
    paddingBottom: verticalScale(MP_DF.xlarge),
    alignItems: 'center',
  },
  containerWelcome_W: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  containerW_andM: {
    alignItems: 'center',
    marginLeft: 120,
  },
})

export default StartScreen
