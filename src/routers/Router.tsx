/**
 * @author :  Braudin Laya
 * @since :  15/09/2021
 * @summary : Router principal de l'application
 */
import React from 'react'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import {HomeScreen} from '../screens/public/home/HomeScreen'
import {RegisterScreen} from '../screens/public/register/RegisterScreen'
import {RegisterTwoScreen} from '../screens/public/register/RegisterTwoScreen'

export type RootStackParamList = {
  HomeScreen: undefined
  RegisterScreen: undefined
  RegisterTwoScreen: undefined
}

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export const Router = () => {
  const Stack = createNativeStackNavigator()

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
      <Stack.Screen name="RegisterTwoScreen" component={RegisterTwoScreen} />
    </Stack.Navigator>
  )
}
