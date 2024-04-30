import Config from "react-native-config";
import { storage } from "../config/store/db";
import { API_INTERFACE, HTTP } from "../services/api";
import { useAuth } from "../states/AuthContext";

const useApi = (setLoadingSync: any, setErrorSync: any, addToSync: any) => {
  const { accessToken } = useAuth();

  const createProducer = async (key: string) => {
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
      if (error?.response?.data) {
        const errorText = JSON.stringify(error.response.data.errors);
        setErrorSync(errorText);
      } else {
        setErrorSync(error);
      }
    } finally {
      setLoadingSync(false);
      setErrorSync(null);
    }
  };

  const createFarm = async (key: string) => {
    const parcels_array = JSON.parse(storage.getString("parcels") || "[]");
    const parcels = parcels_array[0];
    const user = JSON.parse(storage.getString(key) || "{}");
    console.log("parcels", parcels);

    if (parcels.polygon) {
      try {
        const apiRequest: API_INTERFACE = {
          url: `${Config.BASE_URL}/create_farm`,
          method: "POST",
          payload: {
            farm_name: parcels.name,
            hectares: parcels.hectares,
            dni_cacao_producer: user.dni,
            countryid: user.country?.code === "CO" ? 1 : 2,
            polygon_coordinates: parcels.polygon,
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

  const createSale = async () => {
    const saleTemp = JSON.parse(storage.getString("saleTemp") || "{}");
    const user = JSON.parse(storage.getString(key) || "{}");
    try {
      const apiRequest: API_INTERFACE = {
        url: `${Config.BASE_URL}/create_activities`,
        method: "POST",
        payload: {
          cacao_type: saleTemp.type,
          dry_weight: saleTemp.kl,
          dni_cacao_producer: user.dni,
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
