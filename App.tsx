/*
 * @Author: Braudin Laya
 * @Date: 2021-01-19 11:59:57
 * @Summary:componente de entrada a la aplicación y su navegación
 */
import React from 'react'
import {NavigationContainer} from '@react-navigation/native'
import {Router} from './src/routers/Router'

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Router />
    </NavigationContainer>
  )
}

export default App
