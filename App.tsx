import { library } from "@fortawesome/fontawesome-svg-core";
import { faWhatsapp, fab } from "@fortawesome/free-brands-svg-icons";
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
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons/faExclamationTriangle";
import { NavigationContainer } from "@react-navigation/native";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Linking,
} from "react-native";
import Toast, {
  BaseToast,
  ErrorToast,
  ToastConfig,
} from "react-native-toast-message";
import { Error, Sad, SadYellow, Happy, Whattsap } from "./src/assets/svg/index";
import useInternetConnection from "./src/hooks/useInternetConnection";
import { Router } from "./src/routers/Router";
import { AuthProvider } from "./src/states/AuthContext";
import { ConnectionProvider } from "./src/states/ConnectionContext";
import { UserProvider } from "./src/states/UserContext";
import { MapProvider } from "./src/states/MapContext";

import { COLORS_DF, FONT_FAMILIES } from "./src/config/themes/default";
import { SyncDataProvider } from "./src/states/SyncDataContext";
import { GwfProvider } from "./src/states/GfwContext";

function App(): React.JSX.Element {
  // biblioteca de iconos
  const [visible, setVisible] = useState(false);
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

  const toastConfig: ToastConfig = {
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

    dniToast: ({ text1 }) => (
      <View style={styles.toastContainer}>
        <View>
          <Error height={70} width={70} />
        </View>
        <Text style={styles.toastText}>{text1}</Text>
        <TouchableOpacity
          onPress={linkWhattsap}
          style={{
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: COLORS_DF.robin_egg_blue,
            width: "90%",
            height: 30,
            borderRadius: 5,
            marginTop: 20,
            flexDirection: "row",
          }}
        >
          <Text style={{ color: "#fff", fontSize: 15 }}>
            Solicitar ayuda {""}
            {""} {""}
          </Text>
          <Whattsap />
        </TouchableOpacity>
      </View>
    ),
    sadToast: ({ text1 }) => (
      <View style={styles.toastContainer}>
        <View>
          <Sad height={70} width={70} />
        </View>
        <Text style={styles.toastText}>{text1}</Text>
        <TouchableOpacity onPress={hideToast} style={styles.buttonToast}>
          <Text style={{ color: "#fff", fontSize: 15 }}>Ok</Text>
        </TouchableOpacity>
      </View>
    ),
    syncToast: ({ text1 }) => (
      <View style={styles.toastContainer}>
        <View>
          <Error height={70} width={70} />
        </View>
        <Text style={styles.toastText}>{text1}</Text>
        <TouchableOpacity onPress={hideToast} style={styles.buttonToast}>
          <Text style={{ color: "#fff", fontSize: 20 }}>Ok</Text>
        </TouchableOpacity>
      </View>
    ),
    yellowToast: ({ text1, text2 }) => (
      <View
        style={{
          height: 180,
          width: "80%",
          backgroundColor: "#FFF",
          padding: 20,
          alignItems: "center",
          borderRadius: 10,
          elevation: 5,
        }}
      >
        <View>
          <SadYellow height={70} width={70} />
        </View>
        <Text style={styles.toastTextGFW}>{text1}</Text>
        <Text style={styles.toastTextGFW}>{text2}</Text>
      </View>
    ),
    happyToast: ({ text1, text2 }) => (
      <View
        style={{
          height: 200,
          width: "80%",
          backgroundColor: "#FFF",
          padding: 20,
          alignItems: "center",
          borderRadius: 10,
          elevation: 5,
        }}
      >
        <View>
          <Happy height={70} width={70} />
        </View>
        <Text style={styles.toastTextGFW}>{text1}</Text>
        <Text style={styles.toastTextGFW}>{text2}</Text>
      </View>
    ),
    redSadToast: ({ text1, text2 }) => (
      <View style={styles.toastContainer}>
        <View>
          <Sad height={70} width={70} />
        </View>
        <Text style={styles.toastTextGFW}>{text1}</Text>
        <Text style={styles.toastTextGFW}>{text2}</Text>
      </View>
    ),
  };
  const hideToast = () => {
    setVisible(false);
    Toast.hide();
  };
  const linkWhattsap = () => {
    Linking.openURL("whatsapp://send?phone=+5117064556").catch(() => {
      Linking.openURL(
        "https://play.google.com/store/apps/details?id=com.whatsapp"
      );
    });
  };
  const internetConnection = useInternetConnection();

  return (
    <ConnectionProvider value={internetConnection}>
      <AuthProvider>
        <SyncDataProvider>
          <UserProvider>
            <MapProvider>
              <GwfProvider>
                <NavigationContainer>
                  <Router />
                  <>
                    <Toast config={toastConfig} />
                  </>
                </NavigationContainer>
              </GwfProvider>
            </MapProvider>
          </UserProvider>
        </SyncDataProvider>
      </AuthProvider>
    </ConnectionProvider>
  );
}
const styles = StyleSheet.create({
  toastContainer: {
    height: 220,
    width: "80%",
    backgroundColor: "#FFF",
    padding: 20,
    alignItems: "center",
    borderRadius: 10,
    elevation: 5,
  },
  toastText: {
    fontSize: 18,
    fontFamily: FONT_FAMILIES.primary,
    color: COLORS_DF.citrine_brown,
    textAlign: "center",
  },
  toastTextGFW: {
    fontSize: 18,
    fontFamily: FONT_FAMILIES.bold,
    color: COLORS_DF.citrine_brown,
    textAlign: "center",
    lineHeight: 28,
  },
  buttonToast: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS_DF.robin_egg_blue,
    width: "90%",
    height: 30,
    borderRadius: 5,
    marginTop: 5,
  },
});
export default App;
