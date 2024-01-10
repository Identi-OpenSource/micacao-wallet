import React from 'react'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import {HomeScreen} from '../screens/public/home/HomeScreen'

export const Router = () => {
  const Stack = createNativeStackNavigator()

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
    </Stack.Navigator>
  )
}
