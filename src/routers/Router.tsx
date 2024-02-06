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
import {CompositeScreenProps, useNavigation} from '@react-navigation/native'
import {RegisterFourthScreen} from '../screens/public/register/RegisterFourthScreen'
import {RegisterOkScreen} from '../screens/public/register/RegisterOkScreen'
import {HomeProvScreen} from '../screens/private/home/HomeProvScreen'
import {storage} from '../config/store/db'
import {
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs'
import {RegisterParcelScreen} from '../screens/private/parcel/register/RegisterParcelScreen'
import {RegisterOneScreen} from '../screens/private/parcel/register/RegisterOneScreen'
import {RegisterParcelTwoScreen} from '../screens/private/parcel/register/RegisterParcelTwoScreen'
import {RegisterParcelThirdScreen} from '../screens/private/parcel/register/RegisterParcelThirdScreen'
import {RegisterParcelFourthScreen} from '../screens/private/parcel/register/RegisterParcelFourthScreen'
import {RegisterParcelFifthScreen} from '../screens/private/parcel/register/RegisterParcelFifthScreen'
import {RegisterParcelSixthScreen} from '../screens/private/parcel/register/RegisterParcelSixthScreen'
import {PermissionsOneScreen} from '../screens/public/permissions/PermissionsOneScreen'
import {PermissionsTwoScreen} from '../screens/public/permissions/PermissionsTwoScreen'
import {PermissionsThreeScreen} from '../screens/public/permissions/PermissionsThreeScreen'
import {PermissionsFourScreen} from '../screens/public/permissions/PermissionsFourScreen'
import {PermissionsAndroid, Platform} from 'react-native'
import {TestMap} from '../screens/private/home/TestMap'
import {IamScreen} from '../screens/public/register/IamScreen'
import {IamFromScreen} from '../screens/public/register/IamFromScreen'

export type RootStackParamList = {
  SplashScreen: undefined
  StackPermissions: undefined
  PermissionsOneScreen: undefined
  PermissionsTwoScreen: undefined
  PermissionsThreeScreen: undefined
  PermissionsFourScreen: undefined
  HomeScreen: undefined
  HomeProvScreen: undefined
  IamScreen: undefined
  IamFromScreen: undefined
  RegisterScreen: undefined
  RegisterSecondScreen: undefined
  RegisterThirdScreen: undefined
  RegisterFourthScreen: undefined
  RegisterOkScreen: undefined
  RegisterParcelStack: undefined
  RegisterParcelScreen: undefined
  TabPrivate: undefined
  RegisterOneScreen: undefined
  RegisterParcelTwoScreen: {name: string}
  RegisterParcelThirdScreen: {name: string; hectares: number}
  RegisterParcelFourthScreen: {
    name: string
    hectares: number
    firstPoint: number[]
    imgP1: string
  }
  RegisterParcelFifthScreen: {
    name: string
    hectares: number
    firstPoint: number[]
  }
  RegisterParcelSixthScreen: {
    name: string
    hectares: number
    firstPoint: number[]
  }
  TestMap: undefined
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
  const navigation = useNavigation()
  const user = useContext(UsersContext)
  const dispatch = useContext(UserDispatchContext)

  useEffect(() => {
    getIsLogin()
    checkPermission()
  }, [])

  // check permission
  const checkPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const location = await PermissionsAndroid.check(
          'android.permission.ACCESS_FINE_LOCATION',
        )
        const camera = await PermissionsAndroid.check(
          'android.permission.CAMERA',
        )
        if (!location || !camera) {
          navigation.navigate('PermissionsOneScreen' as any)
        }
      }
    } catch (err) {
      console.warn(err)
    }
  }

  const getIsLogin = () => {
    const userLogin = storage.getString('user')
    const isLogin = JSON.parse(userLogin || '{}')
    if (user?.isLogin) {
      dispatch({type: 'login', payload: JSON.parse(isLogin)})
    }
  }

  const Stack = createNativeStackNavigator<RootStackParamList>()

  return (
    <Stack.Navigator screenOptions={{...slideFromRight}}>
      {!user.isLogin ? (
        /* Public */
        <>
          <Stack.Screen name="HomeScreen" component={HomeScreen} />
          <Stack.Screen name="IamScreen" component={IamScreen} />
          <Stack.Screen name="IamFromScreen" component={IamFromScreen} />
          <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
          <Stack.Screen
            name="RegisterSecondScreen"
            component={RegisterSecondScreen}
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
        </>
      ) : (
        /* Private */
        <>
          <Stack.Screen
            name="TabPrivate"
            component={TabPrivate} /* Private OK */
          />
          <Stack.Screen
            name="RegisterParcelScreen"
            component={RegisterParcelScreen}
          />
          <Stack.Screen
            name="RegisterOneScreen"
            component={RegisterOneScreen}
          />
          <Stack.Screen
            name="RegisterParcelTwoScreen"
            component={RegisterParcelTwoScreen}
          />
          <Stack.Screen
            name="RegisterParcelThirdScreen"
            component={RegisterParcelThirdScreen}
          />
          <Stack.Screen
            name="RegisterParcelFourthScreen"
            component={RegisterParcelFourthScreen}
          />
          <Stack.Screen
            name="RegisterParcelFifthScreen"
            component={RegisterParcelFifthScreen}
          />
          <Stack.Screen
            name="RegisterParcelSixthScreen"
            component={RegisterParcelSixthScreen}
          />
        </>
      )}
      {/* Permission */}
      <Stack.Group navigationKey={user.isLogin ? 'user' : 'guest'}>
        <Stack.Screen
          name="PermissionsOneScreen"
          component={PermissionsOneScreen}
        />
        <Stack.Screen
          name="PermissionsTwoScreen"
          component={PermissionsTwoScreen}
        />
        <Stack.Screen
          name="PermissionsThreeScreen"
          component={PermissionsThreeScreen}
        />
        <Stack.Screen
          name="PermissionsFourScreen"
          component={PermissionsFourScreen}
        />
      </Stack.Group>
    </Stack.Navigator>
  )
}

// create Stack private
const TabPrivate = () => {
  const Tab = createBottomTabNavigator()
  return (
    <Tab.Navigator screenOptions={{...tabConfig}}>
      <Tab.Screen name="Home" component={HomeStackPrivate} />
    </Tab.Navigator>
  )
}

// create Stack home
const HomeStackPrivate = () => {
  const HomeStack = createNativeStackNavigator<RootStackParamList>()
  return (
    <HomeStack.Navigator screenOptions={{...slideFromRight}}>
      <HomeStack.Screen name="HomeProvScreen" component={HomeProvScreen} />
      <HomeStack.Screen name="TestMap" component={TestMap} />
    </HomeStack.Navigator>
  )
}
