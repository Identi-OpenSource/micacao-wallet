/**
 * @author :  Braudin Laya
 * @since :  15/09/2021
 * @summary : Router principal de l'application
 */
import React, {useContext, useEffect} from 'react'
import {
  NativeStackNavigationOptions,
  NativeStackScreenProps,
  createNativeStackNavigator,
} from '@react-navigation/native-stack'
import {HomeScreen} from '../screens/public/register/HomeScreen'
import {RegisterScreen} from '../screens/public/register/RegisterScreen'
import {HomeProvScreen} from '../screens/public/home/HomeProvScreen'
import {UserDispatchContext, UsersContext} from '../states/UserContext'
import {useSecureOffline} from '../hooks/useSecureOffline'
import {dbConfig} from '../config/db-encript'
import {RegisterSecondScreen} from '../screens/public/register/RegisterSecondScreen'
import {RegisterThirdScreen} from '../screens/public/register/RegisterThirdScreen'
import {CompositeScreenProps} from '@react-navigation/native'
import {RegisterFourthScreen} from '../screens/public/register/RegisterFourthScreen'
import {RegisterOkScreen} from '../screens/public/register/RegisterOkScreen'

type RootStackParamList = {
  HomeScreen: undefined
  HomeProvScreen: undefined
  RegisterScreen: undefined
  RegisterSecondScreen: {dni: string}
  RegisterThirdScreen: {dni: string; phone: string}
  RegisterFourthScreen: {dni: string; phone: string; name: string}
  RegisterOkScreen: {dni: string; phone: string; name: string; pin: string}
}

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>

export type ScreenProps<T extends keyof RootStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<RootStackParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >

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
  const Stack = createNativeStackNavigator<RootStackParamList>()
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
      <Stack.Screen
        name="RegisterSecondScreen"
        component={RegisterSecondScreen}
        initialParams={{dni: ''}}
      />
      <Stack.Screen
        name="RegisterThirdScreen"
        component={RegisterThirdScreen}
      />
      <Stack.Screen
        name="RegisterFourthScreen"
        component={RegisterFourthScreen}
      />
      <Stack.Screen name="RegisterOkScreen" component={RegisterOkScreen} />
    </Stack.Navigator>
  )

  const StackPrivate = (
    <Stack.Navigator screenOptions={{...slideFromRight}}>
      <Stack.Screen name="HomeProvScreen" component={HomeProvScreen} />
    </Stack.Navigator>
  )

  return !users.isLogin ? StackPublic : StackPrivate
}
