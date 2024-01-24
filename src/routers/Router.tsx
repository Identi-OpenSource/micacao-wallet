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
import {UserDispatchContext, UsersContext} from '../states/UserContext'
import {RegisterSecondScreen} from '../screens/public/register/RegisterSecondScreen'
import {RegisterThirdScreen} from '../screens/public/register/RegisterThirdScreen'
import {CompositeScreenProps} from '@react-navigation/native'
import {RegisterFourthScreen} from '../screens/public/register/RegisterFourthScreen'
import {RegisterOkScreen} from '../screens/public/register/RegisterOkScreen'
import {HomeProvScreen} from '../screens/private/home/HomeProvScreen'
import {storage} from '../config/store/db'
import {
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs'

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

const tabConfig = {
  headerShown: false,
  animation: 'slide_from_right',
  shouldShowHintSearchIcon: true,
  statusBarTranslucent: true,
  statusBarColor: 'transparent',
  statusBarStyle: 'dark',
  presentation: 'card',
} as BottomTabNavigationOptions

export const Router = () => {
  const users = useContext(UsersContext)
  const dispatch = useContext(UserDispatchContext)

  useEffect(() => {
    getIsLogin()
  }, [])

  const getIsLogin = async () => {
    const user = storage.getString('user')
    if (user) {
      dispatch({type: 'login', payload: JSON.parse(user)})
    }
  }

  const Tab = createBottomTabNavigator()
  const TabPrivate = (
    <Tab.Navigator screenOptions={{...tabConfig}}>
      <Tab.Screen name="Home1" component={HomeStackPrivate} />
      <Tab.Screen name="Home2" component={HomeStackPrivate} />
      <Tab.Screen name="Home3" component={HomeStackPrivate} />
    </Tab.Navigator>
  )

  return !users.isLogin ? StackPublic : TabPrivate
}

// create Stack home
const HomeStackPrivate = () => {
  const Stack = createNativeStackNavigator<RootStackParamList>()
  return (
    <Stack.Navigator screenOptions={{...slideFromRight}}>
      <Stack.Screen name="HomeProvScreen" component={HomeProvScreen} />
    </Stack.Navigator>
  )
}

// create Stack
const StackPublic = () => {
  const Stack = createNativeStackNavigator<RootStackParamList>()
  return (
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
}
