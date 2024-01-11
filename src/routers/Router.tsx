import React from 'react'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import {HomeScreen} from '../screens/public/home/HomeScreen'
import {RegisterScreen} from '../screens/public/register/RegisterScreen'

export type RootStackParamList = {
  HomeScreen: undefined
  RegisterScreen: undefined
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
    </Stack.Navigator>
  )
}
