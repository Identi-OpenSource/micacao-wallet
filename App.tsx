import React from 'react'
import {NavigationContainer} from '@react-navigation/native'
import {Router} from './src/routers/Router'

import {
  faAngleLeft,
  faAngleRight,
  faArrowDown,
  faArrowLeft,
  faArrowLeftLong,
  faArrowRight,
  faArrowUp,
  faCircle,
  faCirclePause,
  faCirclePlay,
  faCircleQuestion,
  faCircleUser,
  faDeleteLeft,
  faExclamation,
  faFloppyDisk,
  faHand,
  faHandPointer,
  faHouse,
  faMinus,
  faPersonWalkingArrowLoopLeft,
  faPersonWalkingArrowRight,
  faPlus,
  faRotate,
  faTrash,
  faTree,
  faUser,
} from '@fortawesome/free-solid-svg-icons'
import {UserProvider} from './src/states/UserContext'
import {AuthProvider} from './src/states/AuthContext'
import {faWhatsapp, fab} from '@fortawesome/free-brands-svg-icons'
import {faExclamationTriangle} from '@fortawesome/free-solid-svg-icons/faExclamationTriangle'
import {library} from '@fortawesome/fontawesome-svg-core'
import useInternetConnection from './src/hooks/useInternetConnection'
import {ConnectionProvider} from './src/states/ConnectionContext'

function App(): React.JSX.Element {
  // biblioteca de iconos
  library.add(
    fab,
    faArrowLeftLong,
    faArrowRight,
    faArrowLeft,
    faArrowUp,
    faArrowDown,
    faTree,
    faAngleLeft,
    faAngleRight,
    faCircle,
    faRotate,
    faUser,
    faCircleUser,
    faHouse,
    faArrowRight,
    faCircleQuestion,
    faWhatsapp,
    faExclamation,
    faExclamationTriangle,
    faHandPointer,
    faTrash,
    faDeleteLeft,
    faCirclePlay,
    faCirclePause,
    faPersonWalkingArrowRight,
    faPersonWalkingArrowLoopLeft,
    faHand,
    faPlus,
    faMinus,
    faFloppyDisk,
  )

  const internetConnection = useInternetConnection()

  return (
    <ConnectionProvider value={internetConnection}>
      <AuthProvider>
        <UserProvider>
          <NavigationContainer>
            <Router />
          </NavigationContainer>
        </UserProvider>
      </AuthProvider>
    </ConnectionProvider>
  )
}

export default App
