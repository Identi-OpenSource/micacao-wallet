import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { Router } from "./src/routers/Router";

import {
  faAngleLeft,
  faAngleRight,
  faArrowLeftLong,
  faArrowRight,
  faCircle,
  faCircleQuestion,
  faCircleUser,
  faExclamation,
  faHandPointer,
  faHouse,
  faRotate,
  faTree,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { UserProvider } from "./src/states/UserContext";
import { faWhatsapp, fab } from "@fortawesome/free-brands-svg-icons";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons/faExclamationTriangle";
import { library } from "@fortawesome/fontawesome-svg-core";
// import {GestureHandlerRootView} from 'react-native-gesture-handler'

// realm
/* const key = new Int8Array('')
const config: Realm.Configuration = {
  // Add encryption key to realm configuration
  encryptionKey: key,
  path: Date.now().toString() + '.realm', // :remove
} */

function App(): React.JSX.Element {
  // biblioteca de iconos
  library.add(
    fab,
    faArrowLeftLong,
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
    faHandPointer
  );

  // useEffect(() => {
  //   getPermission()
  // }, [])

  // const getPermission = async () => {
  //   try {
  //     if (Platform.OS === 'android') {
  //       await PermissionsAndroid.requestMultiple([
  //         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  //         PermissionsAndroid.PERMISSIONS.CAMERA,
  //       ])
  //     }
  //   } catch (err) {
  //     console.warn(err)
  //   }
  // }

  return (
    // <RealmProvider schema={[Users]} {...config}>
    // <GestureHandlerRootView style={{flex: 1}}>
    <UserProvider>
      <NavigationContainer>
        <Router />
      </NavigationContainer>
    </UserProvider>
    //</GestureHandlerRootView>
    // </RealmProvider>
  );
}

export default App;
