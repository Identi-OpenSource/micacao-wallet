/**
 * @author : Braudin Laya
 * @since : 15/09/2021
 * @summary : Main component of the application
 **/
import React from 'react'
import {NavigationContainer} from '@react-navigation/native'
import {Router} from './src/routers/Router'
import {library} from '@fortawesome/fontawesome-svg-core'

import {
  faAngleLeft,
  faArrowLeftLong,
  faTree,
} from '@fortawesome/free-solid-svg-icons'
import {UserProvider} from './src/states/UserContext'

function App(): React.JSX.Element {
  // biblioteca de iconos
  library.add(faArrowLeftLong, faTree, faAngleLeft)
  return (
    <UserProvider>
      <NavigationContainer>
        <Router />
      </NavigationContainer>
    </UserProvider>
  )
}

export default App
