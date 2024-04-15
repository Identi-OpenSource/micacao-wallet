import React, { useCallback, useContext, useState, useEffect } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeArea } from "../../../components/safe-area/SafeArea";
import {
  BORDER_RADIUS_DF,
  COLORS_DF,
  FONT_FAMILIES,
  FONT_SIZES,
  MP_DF,
  getFontSize,
} from "../../../config/themes/default";
import { UserInterface, UsersContext } from "../../../states/UserContext";
import useInternetConnection from "../../../hooks/useInternetConnection";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { LABELS } from "../../../config/texts/labels";
import { BtnSmall } from "../../../components/button/Button";
import { TEXTS } from "../../../config/texts/texts";
import { imgFrame, imgLayer } from "../../../assets/imgs";
import { storage } from "../../../config/store/db";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { LoadingSave } from "../../../components/loading/LoadinSave";
import { Alert } from "../../../components/alert/Alert";
import ModalComponent from "../../../components/modalComponent";
import useSyncData from "../../../hooks/useSyncData";

import useAuthenticationToken from "../../../hooks/useAuthenticationToken";
/* import  fundingWallet,
fundingWalletOff,
newWallet,
writeTransaction,
writeTransaction,
verificarWallet,
'../../../OCC/occ'
import axios from 'axios'
import CryptoJS from 'crypto-js'
import DATA_KAFE from './kafe-sistemas.json'
const key = 'llavesecretakafesistemasidenti12'
const API_KAFE_SISTEMAS =
  'http://148.113.174.223/api/v1/pe/land-request/polygon'
const API_KEY =
   'fec9eecf43ac2f75f3f6f3edc70bcaf043729409fc2faeee8ce6821d5666c2e4'
 import {Users} from '../../../models/user'
import {useQuery} from '@realm/react'
import Geolocation from '@react-native-community/geolocation' */

export const HomeProvScreen = () => {
  const navigation = useNavigation();
  const user: UserInterface = useContext(UsersContext);
  const { isConnected } = useInternetConnection();
  const { accessToken, getToken } = useAuthenticationToken();
  const [syncUp, setSyncUp] = useState(false);
  const [loadinSync, setLoadingSync] = useState(false);
  // const [TGFW, setTokenGFW] = useState(null)
  // const [apiKeyGFW, setApiKeyGFW] = useState(null)
  // const users = useQuery(Users)
  // const [wa, setWa] = useState(null) as any

  useEffect(() => {
    console.log(
      accessToken !== null ? "Conectado a BackEnd" : "No Conectado a Back End "
    );
  }, [accessToken]);

  useEffect(() => {
    // Llamar a getToken
    getToken();
  });

  useFocusEffect(
    useCallback(() => {
      // verifySyncUp()
      // const usesr = JSON.parse(storage.getString('user') || '[]')
      const parcels = JSON.parse(storage.getString("parcels") || "[]");
      if (parcels.length === 0) {
        setTimeout(() => {
          navigation.navigate("RegisterParcelScreen");
        }, 1000);
      }
    }, [isConnected])
  );

  /* const dataSyncUp = () => {
    setLoadingSync(true)
    setTimeout(() => {
      const newSync = {isSyncUp: false, lastSyncUp: Date.now()}
      storage.set('syncUp', JSON.stringify(newSync))
      setSyncUp(false)
      setLoadingSync(false)
    }, 2500)
  } */

  // const verifySyncUp = () => {
  //   // asyncData if not syncUp in the last 4 hours
  //   const sync = JSON.parse(storage.getString('syncUp') || '{}')
  //   if (
  //     isConnected &&
  //     sync.isSyncUp &&
  //     sync.lastSyncUp + 14400000 < Date.now()
  //   ) {
  //     setSyncUp(sync.isSyncUp)
  //   }
  // }

  /*   const createWallet = () => {
    const wallet = newWallet()
    setWa(wallet)
    Alerts.alert('Wallet Creada', wallet.walletOFC)
    console.log('wallet', wallet)
  } */

  /* const getFundingWallet = async () => {
    await fundingWallet(wa.walletOFC)
      .then(() => {
        Alerts.alert(
          "Fondos Agregados",
          "Se han agregado fondos a su wallet." + wa.walletOFC
        );
      })
      .catch(() => {
        Alerts.alert(
          'Error',
          'No se han podido agregar fondos a su wallet. Parece que la red OCC no está disponible. Intente más tarde.',
        )
      })
  } */

  /* const write = async () => {
    // Wallet prueba:RXp5YtBnAFGCN1DZeChVATR3EEu5c2zjt5
    // WIF:L3nfEsDGad8f74a28f1jrHbZCj5CmmFPmYyDSekrqeFT9tTxpy5q
    // wif2:UvaVYYqF5r6ua7N7KChKcjGn8o8LrsX1Y4M31uYYJMUA3kQ2sjkQ
    await writeTransaction(wa.wif)
  } */

  /*  const fundingWalletOffline = async () => {
    await fundingWalletOff(wa.ec_pairs, wa.walletOFC, wa.wifi)
      .then(resp => {
        console.log('fundingWalletOff', resp)
        Alerts.alert(
          'Fondos Fuera de linea Agregados',
          'Se han agregado fondos a su wallet.' + wa,
        )
      })
      .catch(() => {
        Alerts.alert('Error', 'No se han podido agregar fondos a su wallet.')
      })
  } */

  /*  const newTransaction = async () => {
    await fundingWallet(wa)
    //console.log(f)
  } */

  /* const tokenGFW = async () => {
    await axios
      .post(
        "https://data-api.globalforestwatch.org/auth/token",
        {
          username: "soporte@braudin.com",
          password: "qCd&IbS4&jt8",
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      )
      .then((resp) => {
        // setTokenGFW(resp.data)
        setTokenGFW(resp.data.data.access_token);
        Alerts.alert("Token GFW obtenido", resp.data.data.access_token);
      })
      .catch(e => {
        Alerts.alert('Error al intentar obtener el token')
        console.log('error', e)
      })
  } */

  /* const createApiKeyGFW = async () => {
    const payload = {
      alias: "mi-cacao-appss" + Date.now(),
      organization: "GFWdata",
      email: "soporte@braudin.com",
      domains: [],
    };
    await axios
      .post("https://data-api.globalforestwatch.org/auth/apikey", payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${TGFW}`,
        },
      })
      .then((resp) => {
        setApiKeyGFW(resp.data.data.api_key);
        Alerts.alert(
          "Api Key GFW obtenido",
          "Se genero un api key para el alias: " + resp.data.data.alias
        );
      })
      .catch(e => {
        Alerts.alert('Error al intentar obtener el ApiKey')
        console.log('error', e)
      })
  } */

  /* const testApiKeyGFW = async () => {
    await axios
      .get("https://data-api.globalforestwatch.org/datasets", {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKeyGFW,
        },
      })
      .then((resp) => {
        console.log("resp", resp.data.data);
        Alerts.alert("Api Key GFW Test", "Api Key GFW valido");
      })
      .catch(e => {
        Alerts.alert('Test Api Key GFW', 'Api Key GFW no valido')
        console.log('error', e)
      })
  } */

  /*  const queryPForestal = async () => {
    const payload = {
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [103.19732666015625, 0.5537709801264608],
            [103.24882507324219, 0.5647567848663363],
            [103.21277618408203, 0.5932511181408705],
            [103.19732666015625, 0.5537709801264608],
          ],
        ],
      },
      sql:
        "SELECT SUM(area__ha) FROM results WHERE umd_tree_cover_loss__year=2022",
    };
    await axios
      .post(
        "https://data-api.globalforestwatch.org/dataset/umd_tree_cover_loss/latest/query",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKeyGFW,
          },
        }
      )
      .then((resp) => {
        console.log("resp", resp.data.data);
        Alerts.alert(
          "Perdida forestal",
          `Hubo una perdida de ${resp.data.data[0].area__ha} hectáreas en 2022 para el polígono test`
        );
      })
      .catch((e) => {
        Alerts.alert(
          'Error en la consulta',
          'No se pudo obtener la información.',
        )
        console.log('error', e)
      })
  } */

  /* const certificateND = async (dni: string) => {
    const paddedDNI = dni.padStart(16, '0')
    const utf8Key = CryptoJS.enc.Utf8.parse(key)
    const utf8DNI = CryptoJS.enc.Utf8.parse(paddedDNI)

    const encrypted = CryptoJS.AES.encrypt(utf8DNI, utf8Key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    })

    const hexResult = encrypted.ciphertext.toString(CryptoJS.enc.Hex)

    return hexResult.substr(0, 32)
  } */

  /* const kafeSistemas = async () => {
    const resp_kafe: any = []
    for (let i = 0; i < DATA_KAFE.length; i++) {
      const dniEncrypted = await certificateND(DATA_KAFE[i].dni)
      const data = {
        dni: dniEncrypted,
        polygon: DATA_KAFE[i].polygon,
        departamento: 'San Martin',
      }
      // axios.interceptors.request.use(request => {
      //   console.log('Starting Request', JSON.stringify(request, null, 2))
      //   return request
      // })
      await axios
        .post(API_KAFE_SISTEMAS, data, {
          headers: {
            api_key: API_KEY,
            // Authorization: `Bearer ${API_KEY}`,
          },
        })
        .then(resp => {
          console.log('resp', resp.data)
          resp_kafe.push({
            send: {...data, dni: DATA_KAFE[i].dni, dniEncrypted},
            resp: resp.data,
          })
        })
        .catch(e => {
          console.log('error', e)
        })
    }
    // ordenar por dni
    resp_kafe.sort((a, b) => {
      if (a.send.dni > b.send.dni) {
        return 1
      }
      if (a.send.dni < b.send.dni) {
        return -1
      }
      return 0
    })

    console.log('resp_kafe', resp_kafe)
  } */

  return (
    <SafeArea bg={"isabelline"}>
      <ScrollView>
        {!loadinSync ? (
          <View style={styles.container}>
            <ConnectionStatus
              syncUp={syncUp}
              isConnected={isConnected}
              dataSyncUp={() => {} /* dataSyncUp */}
            />
            <Header {...user} />
            <Body syncUp={syncUp} />
            {/*  <View>
              <View style={{marginTop: MP_DF.large}}>
                <Text style={styles.titleHeader}>Pruebas Polígono</Text>
                <Text style={[styles.textHeader, {marginVertical: 10}]}>
                  Muestra puntos en el mapa
                </Text>
                <Btn
                  title={'Prueba de puntos GPS'}
                  theme="agrayu"
                  onPress={() => navigation.navigate('TestMap')}
                />
                <Text style={[styles.textHeader, {marginVertical: 10}]}>
                  Capturar polígono primera opción
                </Text>
                <Btn
                  title={'Polígono A'}
                  theme="agrayu"
                  onPress={() => navigation.navigate('DrawPolyline')}
                />
                <Text style={[styles.textHeader, {marginVertical: 10}]}>
                  Capturar polígono segunda opción
                </Text>
                <Btn
                  title={'Polígono B'}
                  theme="agrayu"
                  onPress={() => navigation.navigate('GradientLine')}
                />
                <Text style={[styles.textHeader, {marginVertical: 10}]}>
                  Capturar polígono tercera opción
                </Text>
                <Btn
                  title={'Polígono C'}
                  theme="agrayu"
                  disabled={false}
                  onPress={() => navigation.navigate('GradientLineRecorrer')}
                />
                <Text style={[styles.textHeader, {marginVertical: 10}]}>
                  Capturar polígono cuarta opción
                </Text>
                <Btn
                  title={'Polígono D'}
                  theme="agrayu"
                  disabled={false}
                  onPress={() => navigation.navigate('GradientLineRecorrerAdd')}
                />
                <Text style={[styles.textHeader, {marginVertical: 10}]}>
                  Capturar polígono quinta opción
                </Text>
                <Btn
                  title={'Polígono E'}
                  theme="agrayu"
                  disabled={false}
                  onPress={() => navigation.navigate('PoligonJoystick')}
                />
                <Text style={[styles.textHeader, {marginVertical: 10}]}>
                  Capturar polígono sexta opción
                </Text>
                <Btn
                  title={'Polígono F'}
                  theme="agrayu"
                  disabled={false}
                  onPress={() => navigation.navigate('PoligonBTN')}
                />

                <Text style={[styles.titleHeader, {marginVertical: 10}]}>
                  Pruebas Wallet
                </Text>
                <Text style={[styles.textHeader, {marginVertical: 10}]}>
                  Crea una wallet compatible con OCC
                </Text>
                <Btn
                  title={'Nueva Wallet'}
                  theme="agrayu"
                  onPress={() => createWallet()}
                />
                <Text style={[styles.textHeader, {marginVertical: 10}]}>
                  Agrega fondos a la wallet
                </Text>
                <Btn
                  title={'Funding Wallet'}
                  theme="agrayu"
                  onPress={() => getFundingWallet()}
                />
                <Text style={[styles.textHeader, {marginVertical: 10}]}>
                  Verificar wallet
                </Text>
                <Btn
                  title={'Revisar Wallet Online OFC'}
                  theme="agrayu"
                  onPress={() => verificarWallet(wa.walletOFC)}
                />
                <Text style={[styles.textHeader, {marginVertical: 10}]}>
                  Post Transaction de prueba a la wallet
                </Text>
                <Btn
                  title={'Escribir en red OCC'}
                  theme="agrayu"
                  onPress={() => write()}
                />

                <Text style={[styles.textHeader, {marginVertical: 10}]}>
                  Agregar fondos fuera de linea a la wallet
                </Text>
                <Btn
                  title={'Funding Wallet Offline OFC'}
                  theme="agrayu"
                  onPress={() => fundingWalletOffline()}
                />
                <Text style={[styles.textHeader, {marginVertical: 10}]}>
                  Get Transaction de prueba a la wallet
                </Text>
                <Btn
                  title={'Leer de la red OCC'}
                  theme="agrayuDisabled"
                  disabled={true}
                  onPress={() => verificarWallet(wa)}
                />
                <Btn
                  title={'Transaction de prueba a la wallet'}
                  theme="agrayu"
                  onPress={() => newTransaction()}
                />
                <Text style={[styles.titleHeader, {marginVertical: 10}]}>
                  Pruebas Global Forest Watch
                </Text>
                <Text style={[styles.textHeader, {marginVertical: 10}]}>
                  Obtener token
                </Text>
                <Btn
                  title={'Token GFW'}
                  theme="agrayu"
                  onPress={() => tokenGFW()}
                />
                <Text style={[styles.textHeader, {marginVertical: 10}]}>
                  Obtener ApiKEY
                </Text>
                <Btn
                  title={'Api GFW'}
                  theme="agrayu"
                  onPress={() => createApiKeyGFW()}
                />
              </View>
              <Text style={[styles.textHeader, {marginVertical: 10}]}>
                Test Api Key
              </Text>
              <Btn
                title={'ApiKey Test'}
                theme="agrayu"
                onPress={() => testApiKeyGFW()}
              />
              <Text style={[styles.textHeader, {marginVertical: 10}]}>
                Pérdida de cobertura forestal
              </Text>
              <Btn
                title={'Query pérdida forestal'}
                theme="agrayu"
                onPress={() => queryPForestal()}
              />
              <Text style={[styles.titleHeader, {marginVertical: 10}]}>
                Pruebas Kafe Sistemas
              </Text>
              <Text style={[styles.textHeader, {marginVertical: 10}]}>
                Integración con Kafe Sistemas
              </Text>
              <Btn
                title={'Envió de datos test'}
                theme="agrayu"
                onPress={() => kafeSistemas()}
              />
            </View> */}
          </View>
        ) : (
          <LoadingSave msg={TEXTS.textAF} />
        )}
      </ScrollView>
    </SafeArea>
  );
};

const ConnectionStatus = (props: {
  syncUp: boolean;
  isConnected: boolean;
  dataSyncUp: Function;
}) => {
  const isConnected = props.isConnected;
  const syncUp = props.syncUp;
  const dataSyncUp = props.dataSyncUp;

  return (
    <View style={styles.containerConnection}>
      <View style={styles.containerConnectionTitle}>
        <FontAwesomeIcon
          icon={"circle"}
          size={14}
          color={!isConnected ? COLORS_DF.grayLight : COLORS_DF.robin_egg_blue}
        />
        <Text style={styles.connectionTitle}>
          {isConnected ? LABELS.online : LABELS.offline}
        </Text>
      </View>
      {!isConnected && (
        <Text style={styles.connectionSubTitle}>{LABELS.offlineMessage}</Text>
      )}
      {isConnected && syncUp && (
        <BtnSmall
          theme={"agrayu"}
          title={LABELS.asyncData}
          icon={"rotate"}
          onPress={() => dataSyncUp()}
        />
      )}
    </View>
  );
};

const Header = ({ name }: UserInterface) => {
  const firstName = name.split(" ")[0];
  return (
    <View style={styles.header}>
      <Text style={styles.titleHeader}>
        {TEXTS.textL} {firstName}
      </Text>
      <Text style={styles.textHeader}>{TEXTS.textK}</Text>
    </View>
  );
};

const Body = (props: { syncUp: boolean }) => {
  const navigation = useNavigation();
  const { isVisibleModal, setIsVisibleModal } = useInternetConnection();

  const { verifyExistSyncData, existSyncData } = useSyncData();

  const syncUp = props.syncUp;

  useEffect(() => {
    verifyExistSyncData();
  }, []);

  return (
    <View style={styles.bodyContainer}>
      <ModalComponent
        isVisible={isVisibleModal && existSyncData}
        label={"Tienes información pendiente por guardar"}
        buttonText={"Aceptar"}
        closeModal={() => {
          setIsVisibleModal(false);
        }}
      />
      {/* Primer card */}
      <View style={[styles.bodyCardContainerFull]}>
        <TouchableOpacity
          style={[styles.bodyCard]}
          activeOpacity={0.9}
          onPress={() => navigation.navigate("MyParcelsScreen")}
        >
          <Image source={imgLayer} style={syncUp && styles.filter} />
          <Text style={[styles.titleCard, syncUp && styles.filter]}>
            {LABELS.viewMyParcels}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={[styles.bodyCardContainerFull]}>
        <TouchableOpacity
          style={[styles.bodyCard]}
          activeOpacity={0.9}
          onPress={() => navigation.navigate("NewSaleOneScreen")}
        >
          <Image source={imgFrame} style={syncUp && styles.filter} />
          <Text style={[styles.titleCard, syncUp && styles.filter]}>
            {LABELS.registerVenta}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  filter: {
    opacity: 0.3,
  },
  container: {
    flex: 1,
    paddingHorizontal: MP_DF.large,
    paddingVertical: MP_DF.medium,
  },
  containerConnection: {
    height: 48,
    borderWidth: 1,
    borderColor: COLORS_DF.citrine_brown,
    borderRadius: BORDER_RADIUS_DF.small,
    backgroundColor: COLORS_DF.white,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: MP_DF.small,
  },
  containerConnectionTitle: {
    flexDirection: "row",
    alignItems: "center",
  },
  connectionTitle: {
    fontFamily: FONT_FAMILIES.primary,
    fontSize: getFontSize(18),
    fontWeight: "bold",
    color: COLORS_DF.citrine_brown,
    marginLeft: MP_DF.small,
  },
  connectionSubTitle: {
    fontFamily: FONT_FAMILIES.primary,
    fontSize: getFontSize(14),
    fontWeight: "normal",
    color: COLORS_DF.grayLight,
    marginLeft: MP_DF.small,
  },
  header: {
    marginTop: MP_DF.large,
  },
  titleHeader: {
    fontFamily: FONT_FAMILIES.primary,
    fontSize: FONT_SIZES.xslarge,
    fontWeight: "bold",
    color: COLORS_DF.citrine_brown,
    marginBottom: MP_DF.small,
  },
  textHeader: {
    fontFamily: FONT_FAMILIES.primary,
    fontSize: FONT_SIZES.small,
    color: COLORS_DF.citrine_brown,
  },
  bodyContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: MP_DF.large,
  },
  bodyCardContainer: {
    width: "50%",
    padding: MP_DF.small,
    marginTop: MP_DF.large,
  },
  bodyCardContainerFull: {
    width: "100%",
    padding: MP_DF.small,
    marginTop: MP_DF.medium,
  },
  bodyCard: {
    maxHeight: 200,
    paddingHorizontal: MP_DF.small,
    paddingVertical: MP_DF.large,
    backgroundColor: COLORS_DF.white,
    borderRadius: BORDER_RADIUS_DF.medium,
    elevation: 3,
    alignItems: "center",
  },
  titleCard: {
    paddingHorizontal: MP_DF.medium,
    marginTop: MP_DF.medium,
    fontFamily: FONT_FAMILIES.primary,
    fontSize: FONT_SIZES.large,
    fontWeight: "bold",
    color: COLORS_DF.citrine_brown,
    textAlign: "center",
  },
});
