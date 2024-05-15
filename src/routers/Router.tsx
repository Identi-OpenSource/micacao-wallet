import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";
import { useRoute } from "@react-navigation/native";
import {
  NativeStackNavigationOptions,
  createNativeStackNavigator,
} from "@react-navigation/native-stack";
import React, { useContext, useEffect } from "react";
import { StyleSheet } from "react-native";
import Toast from "react-native-toast-message";
import { storage } from "../config/store/db";
import { BORDER_RADIUS_DF, COLORS_DF, MP_DF } from "../config/themes/default";
import { SplashScreen } from "../screens/SplashScreen";
import { HelpScreen } from "../screens/private/help/HelpScreen";
import { HomeProvScreen } from "../screens/private/home/HomeProvScreen";
import { TestMap } from "../screens/private/home/TestMap";
import { DrawPolygonScreen } from "../screens/private/parcel/draw-polygon/DrawPolygonScreen";
import DrawPolyline from "../screens/private/parcel/draw-polygon/DrawPolyline";
import GradientLine from "../screens/private/parcel/draw-polygon/GradientLine";
import GradientLineRecorrer from "../screens/private/parcel/draw-polygon/GradientLineRecorrer";
import GradientLineRecorrerAdd from "../screens/private/parcel/draw-polygon/GradientLineRecorrerAdd";
import PoligonBTN from "../screens/private/parcel/draw-polygon/PoligonBTN";
import PoligonJoystick from "../screens/private/parcel/draw-polygon/PoligonJoystick";
import { PolygonScreen } from "../screens/private/parcel/draw-polygon/PolygonScreen";
import ThirdPartyVectorSource from "../screens/private/parcel/draw-polygon/ThirdPartyVectorSource";
import { MyParcelsScreen } from "../screens/private/parcel/my-parcels/MyParcelsScreen";
import RegisterOneScreen from "../screens/private/parcel/register/RegisterOneScreen";
import RegisterParcelFourthScreen from "../screens/private/parcel/register/RegisterParcelFourthScreen";
import RegisterParcelScreen from "../screens/private/parcel/register/RegisterParcelScreen";
import RegisterParcelThirdScreen from "../screens/private/parcel/register/RegisterParcelThirdScreen";
import RegisterParcelTwoScreen from "../screens/private/parcel/register/RegisterParcelTwoScreen";
import ProfileScreen from "../screens/private/profile";
import { NewSaleFourScreen } from "../screens/private/sale/NewSaleFourScreen";
import { NewSaleOneScreen } from "../screens/private/sale/NewSaleOneScreen";
import { NewSaleThreeScreen } from "../screens/private/sale/NewSaleThreeScreen";
import { NewSaleTwoScreen } from "../screens/private/sale/NewSaleTwoScreen";
import { PermissionsFourScreen } from "../screens/public/permissions/PermissionsFourScreen";
import { PermissionsThreeScreen } from "../screens/public/permissions/PermissionsThreeScreen";
import ConfirmPasswordScreen from "../screens/public/register/ConfirmPasswordScreen";
import { HomeScreen } from "../screens/public/register/HomeScreen";
import { IamFromScreen } from "../screens/public/register/IamFromScreen";
import { IamScreen } from "../screens/public/register/IamScreen";
import RegisterFourthScreen from "../screens/public/register/RegisterFourthScreen";
import { RegisterOkScreen } from "../screens/public/register/RegisterOkScreen";
import { RegisterScreen } from "../screens/public/register/RegisterScreen";
import RegisterSecondScreen from "../screens/public/register/RegisterSecondScreen";
import RegisterThirdScreen from "../screens/public/register/RegisterThirdScreen";
import StartScreen from "../screens/public/register/StartScreen";
import Maps from "../screens/public/maps/index";
import { useAuth } from "../states/AuthContext";

import { useSyncData } from "../states/SyncDataContext";
import { UserDispatchContext, UsersContext } from "../states/UserContext";
import { useMapContext } from "../states/MapContext";
import { useGfwContext } from "../states/GfwContext";
import { Test } from "../screens/public/testing";

const styles = StyleSheet.create({
  tabBarStyle: {
    backgroundColor: COLORS_DF?.white,
    paddingBottom: MP_DF?.small,
    height: 60,
    borderTopEndRadius: BORDER_RADIUS_DF?.medium,
    borderTopStartRadius: BORDER_RADIUS_DF?.medium,
  },
  tabBarLabelStyle: {
    fontWeight: "bold",
  },
});

const slideFromRight = {
  headerShown: false,
  animation: "slide_from_right",
  shouldShowHintSearchIcon: true,
  statusBarTranslucent: true,
  statusBarColor: "transparent",
  statusBarStyle: "dark",
  presentation: "card",
} as NativeStackNavigationOptions;

const tabConfig = {
  headerShown: false,
  animation: "slide_from_right",
  shouldShowHintSearchIcon: true,
  statusBarTranslucent: true,
  statusBarColor: "transparent",
  statusBarStyle: "dark",
  presentation: "card",
  initialRouteName: "HomeProvScreen",
  tabBarActiveTintColor: COLORS_DF?.robin_egg_blue,
  tabBarInactiveTintColor: COLORS_DF?.gray,
  tabBarStyle: styles.tabBarStyle,
  tabBarLabelStyle: styles.tabBarLabelStyle,
} as BottomTabNavigationOptions;

const optionsHeadersCacao = {
  statusBarStyle: "light",
  headerShown: false,
  headerBackVisible: true,
  headerStyle: {
    backgroundColor: COLORS_DF?.citrine_brown,
  },
  headerTintColor: "#fff",
  headerTitleStyle: {
    fontWeight: "bold",
  },
} as NativeStackNavigationOptions;

export const Router = () => {
  const user = useContext(UsersContext);
  const { setAccessToken, error } = useAuth();
  const { errorSync } = useSyncData();
  const { errorMap } = useMapContext();
  const { setPostGFW, setGetGFW, errorGfw } = useGfwContext();
  const dispatch = useContext(UserDispatchContext);
  const parcels = JSON.parse(storage.getString("parcels") || "[]");
  const userLogin = JSON.parse(storage.getString("user") || "{}");
  const accessToken = storage.getString("accessToken") || null;
  const postGFW = JSON.parse(storage.getString("postGFW") || "{}");
  const getData = JSON.parse(storage.getString("getGFW") || "{}");
  useEffect(() => {
    //storage.delete('parcels')
    //storage.delete('sales')
    getIsLogin();
  }, []);

  useEffect(() => {
    if (error != null)
      Toast.show({
        type: "syncToast",
        text1: error.toString(),
      });
  }, [error]);

  //useEfffect para que el salga el toast de errorSync
  useEffect(() => {
    if (errorSync != null)
      Toast.show({
        type: "syncToast",
        text1: errorSync.toString(),
      });
  }, [errorSync]);

  // useEfffect para que el salga el toast de errorMap
  useEffect(() => {
    if (errorMap != null)
      Toast.show({
        type: "syncToast",
        text1: errorMap.toString(),
      });
  }, [errorMap]);

  const getIsLogin = () => {
    //accessToken
    console.log("accessToken en Router", accessToken);
    setAccessToken(accessToken);

    if (userLogin?.isLogin) {
      //login
      dispatch({ type: "login", payload: userLogin });

      //POST GFW
      setPostGFW(postGFW);
      //GET GFW
      setGetGFW(getData);
      //TODO: Revisar el guardado
      // dispatch({type: 'login', payload: parcels})
      // console.log('PARCELAS', parcels)

      // dispatch({type: 'login', payload: sales})
      // console.log('ventas', sales)
    }
  };

  const PublicStack = () => {
    const StackPublic = createNativeStackNavigator();
    return (
      <StackPublic.Navigator screenOptions={{ ...slideFromRight }}>
        <StackPublic.Screen name="SplashScreen" component={SplashScreen} />
        <StackPublic.Screen name="StartScreen" component={StartScreen} />
        <StackPublic.Screen name="HomeScreen" component={HomeScreen} />
        <StackPublic.Screen name="IamScreen" component={IamScreen} />
        <StackPublic.Screen name="IamFromScreen" component={IamFromScreen} />
        <StackPublic.Screen name="TestMap" component={TestMap} />
        <StackPublic.Screen
          name="PoligonJoystick"
          component={PoligonJoystick}
        />
        <StackPublic.Screen name="Test" component={Test} />
        <StackPublic.Screen name="Maps" component={Maps} />
        <StackPublic.Screen
          name="PermissionsStack"
          component={PermissionsStack}
        />

        <StackPublic.Screen name="RegisterScreen" component={RegisterScreen} />

        <StackPublic.Screen
          name="RegisterSecondScreen"
          component={RegisterSecondScreen}
        />

        <StackPublic.Screen
          name="RegisterThirdScreen"
          component={RegisterThirdScreen}
        />
        <StackPublic.Screen
          name="RegisterFourthScreen"
          component={RegisterFourthScreen}
        />
        <StackPublic.Screen
          name="ConfirmPasswordScreen"
          component={ConfirmPasswordScreen}
        />
        <StackPublic.Screen
          name="RegisterOkScreen"
          component={RegisterOkScreen}
        />
        <StackPublic.Screen name="TabPrivate" component={TabPrivate} />
      </StackPublic.Navigator>
    );
  };

  const PermissionsStack = () => {
    const StackPermissions = createNativeStackNavigator();
    return (
      <StackPermissions.Navigator screenOptions={{ ...slideFromRight }}>
        <StackPermissions.Screen
          name="PermissionsThreeScreen"
          component={PermissionsThreeScreen}
        />
        <StackPermissions.Screen
          name="PermissionsFourScreen"
          component={PermissionsFourScreen}
        />
      </StackPermissions.Navigator>
    );
  };

  const HomeStackPrivate = () => {
    const HomeStack = createNativeStackNavigator();
    return (
      <HomeStack.Navigator screenOptions={{ ...slideFromRight }}>
        <HomeStack.Screen name="HomeProvScreen" component={HomeProvScreen} />
        <HomeStack.Group screenOptions={optionsHeadersCacao}>
          <HomeStack.Screen
            name="NewSaleOneScreen"
            component={NewSaleOneScreen}
          />
          <HomeStack.Screen
            name="NewSaleTwoScreen"
            component={NewSaleTwoScreen}
          />
          <HomeStack.Screen
            name="NewSaleThreeScreen"
            component={NewSaleThreeScreen}
          />
          <HomeStack.Screen
            name="NewSaleFourScreen"
            component={NewSaleFourScreen}
          />
          <HomeStack.Screen
            name="MyParcelsScreen"
            component={MyParcelsScreen}
            options={{
              headerShown: true,
              title: "Mis parcelas",
            }}
          />
          <HomeStack.Screen
            name="PolygonScreen"
            component={PolygonScreen}
            options={{
              headerShown: true,
              title: "Dibujar Parcela",
            }}
          />
          <HomeStack.Screen
            name="DrawPolygonScreen"
            component={DrawPolygonScreen}
          />
          <HomeStack.Screen
            name="DrawPolyline"
            component={DrawPolyline}
            options={{
              title: "Test DrawPolyline",
            }}
          />
          <HomeStack.Screen
            name="GradientLine"
            component={GradientLine}
            options={{
              title: "Test GradientLine",
            }}
          />
          <HomeStack.Screen
            name="GradientLineRecorrer"
            component={GradientLineRecorrer}
            options={{
              title: "Poligono Recorrer",
            }}
          />
          <HomeStack.Screen
            name="GradientLineRecorrerAdd"
            component={GradientLineRecorrerAdd}
            options={{
              title: "Test Poligono Recorrer Add",
            }}
          />
          <HomeStack.Screen
            name="ThirdPartyVectorSource"
            component={ThirdPartyVectorSource}
            options={{
              title: "Test ThirdPartyVectorSource",
            }}
          />
          <HomeStack.Screen
            name="PoligonJoystick"
            component={PoligonJoystick}
            options={{
              title: "Poligon Joystick",
              headerShown: false,
            }}
          />
          <HomeStack.Screen
            name="PoligonBTN"
            component={PoligonBTN}
            options={{
              title: "Poligon Joystick",
            }}
          />
        </HomeStack.Group>
        <HomeStack.Screen name="TestMap" component={TestMap} />
      </HomeStack.Navigator>
    );
  };

  const RegisterParcelStackPrivate = () => {
    const RegisterParcelStack = createNativeStackNavigator();
    return (
      <RegisterParcelStack.Navigator screenOptions={{ ...slideFromRight }}>
        <RegisterParcelStack.Screen
          name="RegisterParcelScreen"
          component={RegisterParcelScreen}
        />
        <RegisterParcelStack.Screen
          name="RegisterOneScreen"
          component={RegisterOneScreen}
        />
        <RegisterParcelStack.Screen
          name="RegisterParcelTwoScreen"
          component={RegisterParcelTwoScreen}
        />
        <RegisterParcelStack.Screen
          name="RegisterParcelThirdScreen"
          component={RegisterParcelThirdScreen}
        />
        <RegisterParcelStack.Screen
          name="RegisterParcelFourthScreen"
          component={RegisterParcelFourthScreen}
        />

        <RegisterParcelStack.Screen name="TabPrivate" component={TabPrivate} />
      </RegisterParcelStack.Navigator>
    );
  };

  const ProfileStackPrivate = () => {
    const HomeStack = createNativeStackNavigator();
    return (
      <HomeStack.Navigator screenOptions={{ ...slideFromRight }}>
        <HomeStack.Screen name="ProfileScreen" component={ProfileScreen} />

        <HomeStack.Screen name="TestMap" component={TestMap} />
      </HomeStack.Navigator>
    );
  };

  const HelpStackPrivate = () => {
    const HelpStack = createNativeStackNavigator();
    const route = useRoute();

    const screenOptions = () => {
      return {
        ...slideFromRight,
        statusBarStyle: "light",
        headerShown: false,
      } as NativeStackNavigationOptions;
    };
    return (
      <HelpStack.Navigator screenOptions={screenOptions}>
        <HelpStack.Screen name="HelpScreen" component={HelpScreen} />
      </HelpStack.Navigator>
    );
  };

  const TabPrivate = () => {
    const Tab = createBottomTabNavigator();
    return (
      <Tab.Navigator screenOptions={{ ...tabConfig }} initialRouteName="inicio">
        <Tab.Screen
          name="perfil"
          component={ProfileStackPrivate}
          options={{
            tabBarLabel: "PERFIL",
            tabBarIcon: ({ color }) =>
              tab_icon({ icon: "circle-user", size: 24, color }),
          }}
        />
        <Tab.Screen
          name="inicio"
          component={HomeStackPrivate}
          options={{
            tabBarLabel: "INICIO",
            tabBarIcon: ({ color }) =>
              tab_icon({ icon: "house", size: 24, color }),
          }}
        />
        <Tab.Screen
          name="ayuda"
          component={HelpStackPrivate}
          options={{
            tabBarLabel: "AYUDA",
            tabBarIcon: ({ color }) =>
              tab_icon({ icon: "circle-question", size: 24, color }),
          }}
        />
      </Tab.Navigator>
    );
  };

  const tab_icon = (props: { icon: IconProp; size: number; color: string }) => {
    return (
      <FontAwesomeIcon
        icon={props.icon}
        size={props.size}
        color={props.color}
      />
    );
  };

  const getStack = () => {
    //Change for Context
    if (user.isLogin) {
      return parcels.length > 0 ? TabPrivate() : RegisterParcelStackPrivate();
    } else {
      //Change for Storage
      if (Object.values(userLogin).length > 0) {
        if (userLogin.isLogin) {
          return parcels.length > 0
            ? TabPrivate()
            : RegisterParcelStackPrivate();
        }
      } else {
        return PublicStack();
      }
    }
  };

  return getStack();
};
