import {IconProp} from '@fortawesome/fontawesome-svg-core'
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome'
import {
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs'
import {
  NativeStackNavigationOptions,
  NativeStackScreenProps,
  createNativeStackNavigator,
} from '@react-navigation/native-stack'
import React, {useContext, useEffect} from 'react'
import {StyleSheet} from 'react-native'
import {storage} from '../config/store/db'
import {BORDER_RADIUS_DF, COLORS_DF, MP_DF} from '../config/themes/default'
import {HelpScreen} from '../screens/private/help/HelpScreen'
import {HomeProvScreen} from '../screens/private/home/HomeProvScreen'

import {DrawPolygonScreen} from '../screens/private/parcel/draw-polygon/DrawPolygonScreen'
import DrawPolyline from '../screens/private/parcel/draw-polygon/DrawPolyline'
// import GradientLine from '../screens/private/parcel/draw-polygon/GradientLine'
import GradientLineRecorrer from '../screens/private/parcel/draw-polygon/GradientLineRecorrer'
// import GradientLineRecorrerAdd from '../screens/private/parcel/draw-polygon/GradientLineRecorrerAdd'
// import PoligonBTN from '../screens/private/parcel/draw-polygon/PoligonBTN'
import PoligonJoystick from '../screens/private/parcel/draw-polygon/PoligonJoystick'
import {PolygonScreen} from '../screens/private/parcel/draw-polygon/PolygonScreen'
// import ThirdPartyVectorSource from '../screens/private/parcel/draw-polygon/ThirdPartyVectorSource'
import {MyParcelsScreen} from '../screens/private/parcel/my-parcels/MyParcelsScreen'
import RegisterOneScreen from '../screens/private/parcel/register/RegisterOneScreen'
import RegisterParcelFourthScreen from '../screens/private/parcel/register/RegisterParcelFourthScreen'
import RegisterParcelScreen from '../screens/private/parcel/register/RegisterParcelScreen'
import RegisterParcelThirdScreen from '../screens/private/parcel/register/RegisterParcelThirdScreen'
import RegisterParcelTwoScreen from '../screens/private/parcel/register/RegisterParcelTwoScreen'
import ProfileScreen from '../screens/private/profile'
import {NewSaleFourScreen} from '../screens/private/sale/NewSaleFourScreen'
import {NewSaleOneScreen} from '../screens/private/sale/NewSaleOneScreen'
import {NewSaleThreeScreen} from '../screens/private/sale/NewSaleThreeScreen'
import {NewSaleTwoScreen} from '../screens/private/sale/NewSaleTwoScreen'
import {SaleScreen} from '../screens/private/sale/saleScreen'
import {PermissionsFourScreen} from '../screens/public/permissions/PermissionsFourScreen'
import {PermissionsThreeScreen} from '../screens/public/permissions/PermissionsThreeScreen'
import ConfirmPasswordScreen from '../screens/public/register/ConfirmPasswordScreen'
import {HomeScreen} from '../screens/public/register/HomeScreen'
import {IamFromScreen} from '../screens/public/register/IamFromScreen'
import {IamScreen} from '../screens/public/register/IamScreen'
import RegisterFourthScreen from '../screens/public/register/RegisterFourthScreen'
import {RegisterOkScreen} from '../screens/public/register/RegisterOkScreen'
import {RegisterScreen} from '../screens/public/register/RegisterScreen'
import RegisterSecondScreen from '../screens/public/register/RegisterSecondScreen'
import RegisterThirdScreen from '../screens/public/register/RegisterThirdScreen'
import StartScreen from '../screens/public/register/StartScreen'

import {FiveSaleScreen} from '../screens/private/sale/fiveSaleScreen'
import {Test} from '../screens/public/testing'
import {UserDispatchContext, UsersContext} from '../states/UserContext'
import {CompositeScreenProps, useNavigation} from '@react-navigation/native'
import {DownloadMap} from '../screens/public/maps/DownloadMap'
import Maps from '../screens/public/maps'
import {offlineManager} from '@rnmapbox/maps'

export type RootStackParamList = {
  SplashScreen: undefined
  PermissionsOneScreen: undefined
  PermissionsTwoScreen: undefined
  PermissionsThreeScreen: undefined
  PermissionsFourScreen: undefined
  HomeScreen: undefined
  HomeProvScreen: undefined
  IamScreen: undefined
  IamFromScreen: undefined
  RegisterScreen: undefined
  RegisterSecondScreen: undefined
  RegisterThirdScreen: undefined
  RegisterFourthScreen: undefined
  RegisterOkScreen: undefined
  RegisterParcelScreen: undefined
  TabPrivate: undefined
  RegisterOneScreen: undefined
  RegisterParcelTwoScreen: undefined
  RegisterParcelThirdScreen: undefined
  RegisterParcelFourthScreen: undefined
  HelpScreen: undefined
  MyParcelsScreen: undefined
  PolygonScreen: {id: string}
  DrawPolygonScreen: {id: string}
  RegisterParcel: undefined
  GradientLineRecorrer: {id: string}
  NewSaleOneScreen: undefined
  NewSaleTwoScreen: undefined
  NewSaleThreeScreen: undefined
  StartScreen: undefined
  PermissionsStack: undefined
  Maps: undefined
  SaleScreen: undefined
  FiveSaleScreen: undefined
  NewSaleFourScreen: undefined
  DownloadMap: {toGo?: string}
  PoligonJoystick: {id?: string}
  GradientLineRecorrerAdd: undefined
  // Solo pruebas
  // TestMap: undefined
  // DrawPolyline: undefined
  // GradientLine: undefined
  // ThirdPartyVectorSource: undefined
  // PoligonBTN: undefined
}

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>

export type ScreenProps<T extends keyof RootStackParamList> =
  CompositeScreenProps<
    NativeStackScreenProps<RootStackParamList, T>,
    RootStackScreenProps<keyof RootStackParamList>
  >

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

const styles = StyleSheet.create({
  tabBarStyle: {
    backgroundColor: COLORS_DF?.white,
    paddingBottom: MP_DF?.small,
    height: 60,
    borderTopEndRadius: BORDER_RADIUS_DF?.medium,
    borderTopStartRadius: BORDER_RADIUS_DF?.medium,
  },
  tabBarLabelStyle: {
    fontWeight: 'bold',
  },
})

const slideFromRight = {
  headerShown: false,
  animation: 'slide_from_right',
  shouldShowHintSearchIcon: true,
  statusBarTranslucent: true,
  statusBarColor: 'transparent',
  statusBarStyle: 'dark',
  presentation: 'card',
} as NativeStackNavigationOptions

const tabConfig = {
  headerShown: false,
  animation: 'slide_from_right',
  shouldShowHintSearchIcon: true,
  statusBarTranslucent: true,
  statusBarColor: 'transparent',
  statusBarStyle: 'dark',
  presentation: 'card',
  initialRouteName: 'HomeProvScreen',
  tabBarActiveTintColor: COLORS_DF?.robin_egg_blue,
  tabBarInactiveTintColor: COLORS_DF?.gray,
  tabBarStyle: styles.tabBarStyle,
  tabBarLabelStyle: styles.tabBarLabelStyle,
} as BottomTabNavigationOptions

const optionsHeadersCacao = {
  statusBarStyle: 'light',
  headerShown: false,
  headerBackVisible: true,
  headerStyle: {
    backgroundColor: COLORS_DF?.citrine_brown,
  },
  headerTintColor: '#fff',
  headerTitleStyle: {
    fontWeight: 'bold',
  },
} as NativeStackNavigationOptions

export const Router = () => {
  const navigation = useNavigation()
  const user = useContext(UsersContext)
  const dispatch = useContext(UserDispatchContext)

  useEffect(() => {
    init()
  }, [])

  const init = async () => {
    const isMapDownload = await getMapOffline()
    const userLogin = JSON.parse(storage.getString('user') || '{}')
    if (userLogin?.isLogin && isMapDownload) {
      dispatch({type: 'login', payload: userLogin})
    } else if (userLogin?.isLogin && !isMapDownload) {
      navigation.navigate('DownloadMap')
    }
  }

  const getMapOffline = async () => {
    try {
      const resp = await offlineManager.getPack('MapTests')
      const status = await resp?.status()
      console.log('status', status?.percentage)
      if (status?.state === 'complete' || status?.percentage === 100) {
        return true
      }
    } catch (error) {
      console.error('Error checking offline map:', error)
    }
    return false
  }

  return user.isLogin ? TabPrivate() : PublicStack()
}

const PublicStack = () => {
  const StackPublic = createNativeStackNavigator()
  return (
    <StackPublic.Navigator
      screenOptions={{...slideFromRight}}
      initialRouteName={'HomeScreen'}>
      <StackPublic.Screen name="HomeScreen" component={HomeScreen} />
      <StackPublic.Screen name="StartScreen" component={StartScreen} />
      <StackPublic.Screen name="IamScreen" component={IamScreen} />
      <StackPublic.Screen name="IamFromScreen" component={IamFromScreen} />

      <StackPublic.Screen name="PoligonJoystick" component={PoligonJoystick} />
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
      <StackPublic.Screen name="DownloadMap" component={DownloadMap} />
      <StackPublic.Screen name="TabPrivate" component={TabPrivate} />
    </StackPublic.Navigator>
  )
}

const PermissionsStack = () => {
  const StackPermissions = createNativeStackNavigator()
  return (
    <StackPermissions.Navigator screenOptions={{...slideFromRight}}>
      <StackPermissions.Screen
        name="PermissionsThreeScreen"
        component={PermissionsThreeScreen}
      />
      <StackPermissions.Screen
        name="PermissionsFourScreen"
        component={PermissionsFourScreen}
      />
    </StackPermissions.Navigator>
  )
}

const RegisterParcelStackPrivate = () => {
  const RegisterParcelStack = createNativeStackNavigator()
  return (
    <RegisterParcelStack.Navigator screenOptions={{...slideFromRight}}>
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
  )
}

const HomeStackPrivate = () => {
  const HomeStack = createNativeStackNavigator()
  return (
    <HomeStack.Navigator screenOptions={{...slideFromRight}}>
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
        <HomeStack.Screen name="SaleScreen" component={SaleScreen} />
        <HomeStack.Screen name="FiveSaleScreen" component={FiveSaleScreen} />
        <HomeStack.Screen
          name="NewSaleFourScreen"
          component={NewSaleFourScreen}
        />
        <HomeStack.Screen
          name="MyParcelsScreen"
          component={MyParcelsScreen}
          options={{
            headerShown: true,
            title: 'Mis parcelas',
          }}
        />
        <HomeStack.Screen
          name="PolygonScreen"
          component={PolygonScreen}
          options={{
            headerShown: true,
            title: 'Dibujar Parcela',
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
            title: 'Test DrawPolyline',
          }}
        />
        {/* <HomeStack.Screen
          name="GradientLine"
          component={GradientLine}
          options={{
            title: 'Test GradientLine',
          }}
        /> */}
        <HomeStack.Screen
          name="GradientLineRecorrer"
          component={GradientLineRecorrer}
          options={{
            title: 'Poligono Recorrer',
          }}
        />
        {/* <HomeStack.Screen
          name="GradientLineRecorrerAdd"
          component={GradientLineRecorrerAdd}
          options={{
            title: 'Test Poligono Recorrer Add',
          }}
        /> */}
        {/* <HomeStack.Screen
          name="ThirdPartyVectorSource"
          component={ThirdPartyVectorSource}
          options={{
            title: 'Test ThirdPartyVectorSource',
          }}
        /> */}
        <HomeStack.Screen
          name="PoligonJoystick"
          component={PoligonJoystick}
          options={{
            title: 'Poligon Joystick',
            headerShown: false,
          }}
        />
        {/* <HomeStack.Screen
          name="PoligonBTN"
          component={PoligonBTN}
          options={{
            title: 'Poligon Joystick',
          }}
        /> */}

        <HomeStack.Screen
          name="RegisterParcel"
          component={RegisterParcelStackPrivate}
          options={{
            title: 'RegisterParcel',
          }}
        />
      </HomeStack.Group>
    </HomeStack.Navigator>
  )
}

const ProfileStackPrivate = () => {
  const HomeStack = createNativeStackNavigator()
  return (
    <HomeStack.Navigator screenOptions={{...slideFromRight}}>
      <HomeStack.Screen name="ProfileScreen" component={ProfileScreen} />
    </HomeStack.Navigator>
  )
}

const HelpStackPrivate = () => {
  const HelpStack = createNativeStackNavigator()

  const screenOptions = () => {
    return {
      ...slideFromRight,
      statusBarStyle: 'light',
      headerShown: false,
    } as NativeStackNavigationOptions
  }
  return (
    <HelpStack.Navigator screenOptions={screenOptions}>
      <HelpStack.Screen name="HelpScreen" component={HelpScreen} />
      <HelpStack.Screen name="DownloadMap" component={DownloadMap} />
    </HelpStack.Navigator>
  )
}

const TabPrivate = () => {
  const Tab = createBottomTabNavigator()
  return (
    <Tab.Navigator screenOptions={{...tabConfig}} initialRouteName="inicio">
      <Tab.Screen
        name="perfil"
        component={ProfileStackPrivate}
        options={{
          tabBarLabel: 'PERFIL',
          tabBarIcon: ({color}) =>
            tab_icon({icon: 'circle-user', size: 24, color}),
        }}
      />
      <Tab.Screen
        name="inicio"
        component={HomeStackPrivate}
        options={{
          tabBarLabel: 'INICIO',
          tabBarIcon: ({color}) => tab_icon({icon: 'house', size: 24, color}),
        }}
      />
      <Tab.Screen
        name="ayuda"
        component={HelpStackPrivate}
        options={{
          tabBarLabel: 'AYUDA',
          tabBarIcon: ({color}) =>
            tab_icon({icon: 'circle-question', size: 24, color}),
        }}
      />
    </Tab.Navigator>
  )
}

const tab_icon = (props: {icon: IconProp; size: number; color: string}) => {
  return (
    <FontAwesomeIcon icon={props.icon} size={props.size} color={props.color} />
  )
}
