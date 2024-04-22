import { useContext } from "react";
import Config from "react-native-config";
import { storage } from "../config/store/db";
import { API_INTERFACE, HTTP } from "../services/api";
import { AuthContext, useAuth } from "../states/AuthContext";
import { UsersContext, parcelContext } from "../states/UserContext";
import useInternetConnection from "./useInternetConnection";

const useApi = () => {
  const { setToken } = useAuth();
  const { isConnected } = useInternetConnection();
  const accessToken = useContext(AuthContext);
  const user = useContext(UsersContext);
  const parcel = useContext(parcelContext);
  const createProducer = async () => {
    if (isConnected) {
      try {
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
        storage.set("user", JSON.stringify({ ...user, syncUp: true }));
      } catch (error) {
        console.log("error", error);
      }
    }
  };

  const createFarm = async () => {
    const parcel = useContext(parcelContext);
    if (isConnected) {
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
        console.log("error", error);
      }
    }
  };
};

export default useApi;
