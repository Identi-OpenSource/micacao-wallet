/**
 * @author : Braudin Laya
 * @since : 15/09/2021
 * @summary : Main component of the application
 **/
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
