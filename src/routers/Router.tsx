import React, {useContext, useEffect} from 'react'
import {
  NativeStackNavigationOptions,
  NativeStackScreenProps,
  createNativeStackNavigator,
} from '@react-navigation/native-stack'
import {HomeScreen} from '../screens/public/register/HomeScreen'
import {RegisterScreen} from '../screens/public/register/RegisterScreen'
import {UserDispatchContext, UsersContext} from '../states/UserContext'
import {RegisterSecondScreen} from '../screens/public/register/RegisterSecondScreen'
import {RegisterThirdScreen} from '../screens/public/register/RegisterThirdScreen'
import {
  CompositeScreenProps,
  getFocusedRouteNameFromRoute,
  useNavigation,
  useRoute,
} from '@react-navigation/native'
import {RegisterFourthScreen} from '../screens/public/register/RegisterFourthScreen'
import {RegisterOkScreen} from '../screens/public/register/RegisterOkScreen'
import {HomeProvScreen} from '../screens/private/home/HomeProvScreen'
import {storage} from '../config/store/db'
import {
  BottomTabNavigationOptions,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs'
import {RegisterParcelScreen} from '../screens/private/parcel/register/RegisterParcelScreen'
import {RegisterOneScreen} from '../screens/private/parcel/register/RegisterOneScreen'
import {RegisterParcelTwoScreen} from '../screens/private/parcel/register/RegisterParcelTwoScreen'
import {RegisterParcelThirdScreen} from '../screens/private/parcel/register/RegisterParcelThirdScreen'
import {RegisterParcelFourthScreen} from '../screens/private/parcel/register/RegisterParcelFourthScreen'
import {PermissionsOneScreen} from '../screens/public/permissions/PermissionsOneScreen'
import {PermissionsTwoScreen} from '../screens/public/permissions/PermissionsTwoScreen'
import {PermissionsThreeScreen} from '../screens/public/permissions/PermissionsThreeScreen'
import {PermissionsFourScreen} from '../screens/public/permissions/PermissionsFourScreen'
import {PermissionsAndroid, Platform, StyleSheet} from 'react-native'
import {TestMap} from '../screens/private/home/TestMap'
import {IamScreen} from '../screens/public/register/IamScreen'
import {IamFromScreen} from '../screens/public/register/IamFromScreen'
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome'
import {IconProp} from '@fortawesome/fontawesome-svg-core'
import {BORDER_RADIUS_DF, COLORS_DF, MP_DF} from '../config/themes/default'
import {HelpScreen} from '../screens/private/help/HelpScreen'
import {MyParcelsScreen} from '../screens/private/parcel/my-parcels/MyParcelsScreen'
import {LABELS} from '../config/texts/labels'
import {PolygonScreen} from '../screens/private/parcel/draw-polygon/PolygonScreen'
import {DrawPolygonScreen} from '../screens/private/parcel/draw-polygon/DrawPolygonScreen'

const styles = StyleSheet.create({
  tabBarStyle: {
    backgroundColor: COLORS_DF.white,
    paddingBottom: MP_DF.small,
    height: 60,
    borderTopEndRadius: BORDER_RADIUS_DF.medium,
    borderTopStartRadius: BORDER_RADIUS_DF.medium,
  },
  tabBarLabelStyle: {
    fontWeight: 'bold',
  },
})

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
  PolygonScreen: undefined
  DrawPolygonScreen: undefined
  // Solo pruebas
  TestMap: undefined
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
  tabBarActiveTintColor: COLORS_DF.cacao,
  tabBarInactiveTintColor: COLORS_DF.gray,
  tabBarStyle: styles.tabBarStyle,
  tabBarLabelStyle: styles.tabBarLabelStyle,
} as BottomTabNavigationOptions

const optionsHeadersCacao = {
  statusBarStyle: 'light',
  headerShown: true,
  headerBackVisible: true,
  headerStyle: {
    backgroundColor: COLORS_DF.cacao,
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
    getIsLogin()
    checkPermission()
  }, [])

  // check permission
  const checkPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const location = await PermissionsAndroid.check(
          'android.permission.ACCESS_FINE_LOCATION',
        )
        const camera = await PermissionsAndroid.check(
          'android.permission.CAMERA',
        )
        if (!location || !camera) {
          navigation.navigate('PermissionsOneScreen' as any)
        }
      }
    } catch (err) {
      console.warn(err)
    }
  }

  const getIsLogin = () => {
    const userLogin = JSON.parse(storage.getString('user') || '{}')

    if (userLogin?.isLogin) {
      dispatch({type: 'login', payload: userLogin})
    }
  }

  const Stack = createNativeStackNavigator<RootStackParamList>()

  return (
    <Stack.Navigator screenOptions={{...slideFromRight}}>
      {!user.isLogin ? (
        /* Public */
        <>
          <Stack.Screen name="HomeScreen" component={HomeScreen} />
          <Stack.Screen name="IamScreen" component={IamScreen} />
          <Stack.Screen name="IamFromScreen" component={IamFromScreen} />
          <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
          <Stack.Screen
            name="RegisterSecondScreen"
            component={RegisterSecondScreen}
          />
          <Stack.Screen
            name="RegisterThirdScreen"
            component={RegisterThirdScreen}
          />
          <Stack.Screen
            name="RegisterFourthScreen"
            component={RegisterFourthScreen}
          />
          <Stack.Screen name="RegisterOkScreen" component={RegisterOkScreen} />
        </>
      ) : (
        /* Private */
        <>
          <Stack.Screen
            name="TabPrivate"
            component={TabPrivate} /* Private OK */
          />
          <Stack.Screen
            name="RegisterParcelScreen"
            component={RegisterParcelScreen}
          />
          <Stack.Screen
            name="RegisterOneScreen"
            component={RegisterOneScreen}
          />
          <Stack.Screen
            name="RegisterParcelTwoScreen"
            component={RegisterParcelTwoScreen}
          />
          <Stack.Screen
            name="RegisterParcelThirdScreen"
            component={RegisterParcelThirdScreen}
          />
          <Stack.Screen
            name="RegisterParcelFourthScreen"
            component={RegisterParcelFourthScreen}
          />
        </>
      )}
      {/* Permission */}
      <Stack.Group navigationKey={user.isLogin ? 'user' : 'guest'}>
        <Stack.Screen
          name="PermissionsOneScreen"
          component={PermissionsOneScreen}
        />
        <Stack.Screen
          name="PermissionsTwoScreen"
          component={PermissionsTwoScreen}
        />
        <Stack.Screen
          name="PermissionsThreeScreen"
          component={PermissionsThreeScreen}
        />
        <Stack.Screen
          name="PermissionsFourScreen"
          component={PermissionsFourScreen}
        />
      </Stack.Group>
    </Stack.Navigator>
  )
}

// create Stack private
const TabPrivate = () => {
  const Tab = createBottomTabNavigator()
  return (
    <Tab.Navigator screenOptions={{...tabConfig}} initialRouteName="inicio">
      <Tab.Screen
        name="perfil"
        component={HomeStackPrivate}
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

// create Stack home
const HomeStackPrivate = () => {
  const HomeStack = createNativeStackNavigator<RootStackParamList>()
  return (
    <HomeStack.Navigator screenOptions={{...slideFromRight}}>
      <HomeStack.Screen name="HomeProvScreen" component={HomeProvScreen} />
      {/* parcels */}
      <HomeStack.Group screenOptions={optionsHeadersCacao}>
        <HomeStack.Screen
          name="MyParcelsScreen"
          component={MyParcelsScreen}
          options={{
            title: LABELS.myParcels,
          }}
        />
        <HomeStack.Screen
          name="PolygonScreen"
          component={PolygonScreen}
          options={{
            title: 'Dibujar Parcela',
          }}
        />
        <HomeStack.Screen
          name="DrawPolygonScreen"
          component={DrawPolygonScreen}
          options={{
            title: 'Dibujar Parcela',
          }}
        />
      </HomeStack.Group>
      <HomeStack.Screen name="TestMap" component={TestMap} />
    </HomeStack.Navigator>
  )
}

// create Stack Help
const HelpStackPrivate = () => {
  const HelpStack = createNativeStackNavigator<RootStackParamList>()
  const route = useRoute()

  function getHeaderTitle() {
    const routeName = getFocusedRouteNameFromRoute(route) ?? 'HelpScreen'

    switch (routeName) {
      case 'HelpScreen':
        return 'Ayuda'
      case 'Profile':
        return 'My profile'
      case 'Account':
        return 'My account'
    }
  }

  const screenOptions = () => {
    return {
      ...slideFromRight,
      statusBarStyle: 'light',
      headerShown: true,
      headerBackVisible: true,
      headerTitle: getHeaderTitle(),
      headerStyle: {
        backgroundColor: COLORS_DF.cacao,
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    } as NativeStackNavigationOptions
  }
  return (
    <HelpStack.Navigator screenOptions={screenOptions}>
      <HelpStack.Screen name="HelpScreen" component={HelpScreen} />
    </HelpStack.Navigator>
  )
}
