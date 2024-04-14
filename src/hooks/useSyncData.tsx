import { useEffect } from "react";
import Config from "react-native-config";
import { storage } from "../config/store/db";
import { API_INTERFACE, HTTP } from "../services/api";
import useAuthenticationToken from "./useAuthenticationToken";

const useSyncData = () => {
  const { accessToken } = useAuthenticationToken();
  const user = JSON.parse(storage.getString("user") || "{}");

  const setProducer = async () => {
    try {
      const apiRequest: API_INTERFACE = {
        url: `${Config.BASE_URL}/create_producer`,
        method: "POST",
        payload: {
          dni: user.dni,
          name: user.name,
          phone: user.phone,
          gender: user.gender == "M" ? "MALE" : "FEMALE",
          countryid: user.country.code === "CO" ? 1 : 2,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      };
      const data = await HTTP(apiRequest);
      console.log("data", data);
      storage.set("user", JSON.stringify({ ...user, syncUp: true }));
    } catch (error) {
      console.log("error", error);
    } finally {
    }
  };

  const syncData = async () => {
    if (!user.syncUp) {
      if (accessToken !== null) {
        await setProducer();
      }
    }
  };

  useEffect(() => {
    console.log(
      accessToken !== null ? "Conectado a BackEnd" : "No Conectado a Back End "
    );
    syncData();
  }, [accessToken]);

  return { syncData };
};

export default useSyncData;
