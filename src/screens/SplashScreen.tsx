import React, { useEffect } from "react";
import { View, Image, StyleSheet } from "react-native";
import { Logo } from "../assets/svg/index";
interface SplashScreenProps {
  navigation: any;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ navigation }) => {
  useEffect(() => {
    setTimeout(() => {
      navigation.replace("HomeScreen");
    }, 2000);
  }, []);

  return (
    <View style={styles.container}>
      <Logo width={205} height={205}></Logo>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F6EEEB",
  },
});

export default SplashScreen;
