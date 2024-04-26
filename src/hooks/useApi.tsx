import { useContext } from "react";
import Config from "react-native-config";
import Toast from "react-native-toast-message";
import { storage } from "../config/store/db";
import { API_INTERFACE, HTTP } from "../services/api";
import { useAuth } from "../states/AuthContext";
import { SyncDataContext } from "../states/SyncDataContext";
import { CacaoContext, parcelContext } from "../states/UserContext";

const useApi = () => {
  const { accessToken } = useAuth();

  const parcel = useContext(parcelContext);
  const syncData = useContext(SyncDataContext);
  const sale = useContext(CacaoContext);
  const { addToSync } = syncData;
  const createProducer = async (key: string) => {
    console.log("createProducer", accessToken);

    try {
      const user = JSON.parse(storage.getString(key) || "{}");
      const apiRequest: API_INTERFACE = {
        url: `${Config.BASE_URL}/create_producer`,
        method: "POST",
        payload: {
          dni: user.dni,
          name: user.name,
          phone: user.phone,
          gender: user.gender == "M" ? "MALE" : "FEMALE",
          countryid: user.country?.code === "CO" ? 1 : 2,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      };
      const data = await HTTP(apiRequest);
      console.log("data", data);
      addToSync(JSON.stringify({ ...user, syncUp: true }), key);
    } catch (error) {
      Toast.show({
        type: "sadToast",
        text1: "No se pudieron sincronizar los datos",
        visibilityTime: 8000,
      });
      console.log("error", error);
    }
  };

  const createFarm = async () => {
    console.log("log de crear parcela");

    const parcel = useContext(parcelContext);

    try {
      const apiRequest: API_INTERFACE = {
        url: `${Config.BASE_URL}/create_farm`,
        method: "POST",
        payload: {
          parcel: parcel.nameParcel,
          hectares: parcel.hectares,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      };
      const data = await HTTP(apiRequest);
      console.log("data", data);
    } catch (error) {
      Toast.show({
        type: "sadToast",
        text1: "No se pudieron sincronizar los datos",
        visibilityTime: 8000,
      });
      console.log("error", error);
    }
  };
  const createSale = async () => {
    const sale = useContext(CacaoContext);

    try {
      const apiRequest: API_INTERFACE = {
        url: `${Config.BASE_URL}/create_activities`,
        method: "POST",
        payload: {
          typeCacao: sale.typeCacao,
          kg: sale.kgCacao,
          month: sale.month,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      };
      const data = await HTTP(apiRequest);
      console.log("data", data);
    } catch (error) {
      Toast.show({
        type: "sadToast",
        text1: "No se pudieron sincronizar los datos",
        visibilityTime: 8000,
      });
      console.log("error", error);
    }
  };

  return { createProducer, createFarm, createSale };
};

export default useApi;
