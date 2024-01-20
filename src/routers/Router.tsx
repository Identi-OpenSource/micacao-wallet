/**
 * @author :  Braudin Laya
 * @since :  15/09/2021
 * @summary : Router principal de l'application
 */
import React, {useContext, useEffect} from 'react'
import {
  NativeStackNavigationOptions,
  createNativeStackNavigator,
} from '@react-navigation/native-stack'
import {HomeScreen} from '../screens/public/register/HomeScreen'
import {RegisterScreen} from '../screens/public/register/RegisterScreen'
import {HomeProvScreen} from '../screens/public/home/HomeProvScreen'
import {UserDispatchContext, UsersContext} from '../states/UserContext'
import {useSecureOffline} from '../hooks/useSecureOffline'
import {dbConfig} from '../config/db-encript'

export type RootStackParamList = {
  HomeScreen: undefined
  RegisterScreen: undefined
  HomeProvScreen: undefined
}

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

const slideFromRight = {
  headerShown: false,
  animation: 'slide_from_right',
  shouldShowHintSearchIcon: true,
  statusBarTranslucent: true,
  statusBarColor: 'transparent',
  statusBarStyle: 'dark',
  presentation: 'card',
} as NativeStackNavigationOptions

export const Router = () => {
  const getOffline = useSecureOffline(dbConfig.keyData)
  const Stack = createNativeStackNavigator()
  const users = useContext(UsersContext)
  const dispatch = useContext(UserDispatchContext)
  // const [loading, setLoading] = useState(true)

  useEffect(() => {
    getIsLogin()
  }, [])

  const getIsLogin = async () => {
    getOffline.get().then(data => {
      data && dispatch({type: 'login', payload: data})
    }) /*
      .finally(() => {
        setLoading(false)
      }) */
  }

  // create Stack
  const StackPublic = (
    <Stack.Navigator screenOptions={{...slideFromRight}}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
      {/* <Stack.Screen name="RegisterTwoScreen" component={RegisterTwoScreen} />
      <Stack.Screen
        name="RegisterThreeScreen"
        component={RegisterThreeScreen}
      /> */}
    </Stack.Navigator>
  )

  const StackPrivate = (
    <Stack.Navigator screenOptions={{...slideFromRight}}>
      <Stack.Screen name="HomeProvScreen" component={HomeProvScreen} />
    </Stack.Navigator>
  )

  return !users.isLogin ? StackPublic : StackPrivate
}
