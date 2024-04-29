import { useContext } from "react";
import Config from "react-native-config";
import Toast from "react-native-toast-message";
import { storage } from "../config/store/db";
import { API_INTERFACE, HTTP } from "../services/api";
import { useAuth } from "../states/AuthContext";
import useSync from "./useSyncData";
import { CacaoContext, parcelContext } from "../states/UserContext";

const useApi = (setLoadingSync: any, setErrorSync: any, addToSync: any) => {
  const { accessToken } = useAuth();

  const createProducer = async (key: string) => {
    console.log("createProducer", accessToken);
    setLoadingSync(true);
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
      if (error.response.data) {
        const errorText = JSON.stringify(error.response.data.errors);

        setErrorSync(errorText);
      }
    } finally {
      setLoadingSync(false);
      setErrorSync(null);
    }
  };

  const createFarm = async () => {
    /*     const parcel = useContext(parcelContext); */

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
    /*  const sale = useContext(CacaoContext); */
    const sale = storage;
    storage.set("saleTemp", JSON.stringify({}));
    storage.set("sales", JSON.stringify([sale]));
    console.log("caca");
    try {
      const apiRequest: API_INTERFACE = {
        url: `${Config.BASE_URL}/create_activities`,
        method: "POST",
        payload: {
          cacao_type: sale,
          dry_weight: sale,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      };
      const data = await HTTP(apiRequest);
      console.log("data", data);
    } catch (error) {
      console.log("error", error);
      /* if (error.response.data) {
        const errorText = JSON.stringify(error.response.data.errors);

        // setErrorSync(errorText);
      }
      console.log("error", error); */
    } finally {
      //setLoadingSync(false);
      //setErrorSync(null);
    }
  };

  return { createProducer, createFarm, createSale };
};

export default useApi;
