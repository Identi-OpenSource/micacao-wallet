import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { Router } from "./src/routers/Router";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
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
} from "@fortawesome/free-solid-svg-icons";
import { Error, Sad } from "./src/assets/svg/index";
import Toast, {
  BaseToast,
  ErrorToast,
  ToastConfig,
} from "react-native-toast-message";
import { UserProvider } from "./src/states/UserContext";
import { AuthProvider } from "./src/states/AuthContext";
import { faWhatsapp, fab } from "@fortawesome/free-brands-svg-icons";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons/faExclamationTriangle";
import { library } from "@fortawesome/fontawesome-svg-core";
import useInternetConnection from "./src/hooks/useInternetConnection";
import { ConnectionProvider } from "./src/states/ConnectionContext";
import useSyncData from "./src/hooks/useSyncData";

import { SyncDataProvider } from "./src/states/SyncDataContext";

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
    faFloppyDisk
  );

  /* const toastConfig: ToastConfig = {
    success: (props) => (
      <BaseToast
        {...props}
        style={{ borderLeftColor: "pink" }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        text1Style={{
          fontSize: 15,
          fontWeight: "400",
        }}
      />
    ),
    error: (props) => (
      <ErrorToast
        {...props}
        text1Style={{
          fontSize: 17,
        }}
        text2Style={{
          fontSize: 15,
        }}
      />
    ),

    TomatoToast: ({ text1, props }) => (
      <View style={{ height: 60, width: "100%", backgroundColor: "tomato" }}>
        <Sad />
        <Text>{text1}</Text>
        <Text>{props.uuid}</Text>
      </View>
    ),
  }; */
  const internetConnection = useInternetConnection();
  const syncData = useSyncData();

  return (
    <ConnectionProvider value={internetConnection}>
      <SyncDataProvider value={syncData}>
        <AuthProvider>
          <UserProvider>
            <NavigationContainer>
              <Router />
            </NavigationContainer>
          </UserProvider>
        </AuthProvider>
      </SyncDataProvider>
    </ConnectionProvider>
  );
}

export default App;
