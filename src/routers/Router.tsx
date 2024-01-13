/**
 * @author :  Braudin Laya
 * @since :  15/09/2021
 * @summary : Router principal de l'application
 */
import React, {useContext, useEffect, useState} from 'react'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import {HomeScreen} from '../screens/public/register/HomeScreen'
import {RegisterScreen} from '../screens/public/register/RegisterScreen'
import {RegisterTwoScreen} from '../screens/public/register/RegisterTwoScreen'
import {ValuesInterface} from '../screens/public/register/Interfaces'
import {RegisterThreeScreen} from '../screens/public/register/RegisterThreeScreen'
import {HomeProvScreen} from '../screens/public/home/HomeProvScreen'
import {UserDispatchContext, UsersContext} from '../states/UserContext'
import {useSecureOffline} from '../hooks/useSecureOffline'
import {dbConfig} from '../config/db-encript'
export type RootStackParamList = {
  HomeScreen: undefined
  RegisterScreen: undefined
  RegisterTwoScreen: ValuesInterface
  RegisterThreeScreen: undefined
  HomeProvScreen: undefined
}

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export const Router = () => {
  const getOffline = useSecureOffline(dbConfig.keyData)
  const Stack = createNativeStackNavigator()
  const users = useContext(UsersContext)
  const dispatch = useContext(UserDispatchContext)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getIsLogin()
  }, [])

  const getIsLogin = async () => {
    getOffline
      .get()
      .then(data => {
        data && dispatch({type: 'login', payload: data})
      })
      .finally(() => {
        setLoading(false)
      })
  }

  // create Stack
  const StackPublic = (
    <>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
      <Stack.Screen name="RegisterTwoScreen" component={RegisterTwoScreen} />
      <Stack.Screen
        name="RegisterThreeScreen"
        component={RegisterThreeScreen}
      />
    </>
  )

  const StackPrivate = (
    <>
      <Stack.Screen name="HomeProvScreen" component={HomeProvScreen} />
    </>
  )

  return !loading ? (
    <Stack.Navigator
      screenOptions={{headerShown: false}}
      initialRouteName={users.isLogin ? 'HomeProvScreen' : 'HomeScreen'}>
      {!users.isLogin ? StackPublic : StackPrivate}
    </Stack.Navigator>
  ) : (
    <></>
  )
}
