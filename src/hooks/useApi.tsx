import { storage } from "../config/store/db";
import { API_INTERFACE, HTTP } from "../services/api";
import { useAuth } from "../states/AuthContext";
import Toast from "react-native-toast-message";
const useApi = (
  setLoadingSync: any,
  setErrorSync: any,
  addToSync: any,
  setErrorWhattsap: any
) => {
  const { accessToken } = useAuth();
  const BASE_URL = "https://api-micacao.dev.identi.digital";

  const createProducer = async (key: string) => {
    setLoadingSync(true);
    try {
      const user = JSON.parse(storage.getString(key) || "{}");
      const apiRequest: API_INTERFACE = {
        url: `${BASE_URL}/create_producer`,
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
        const text_error = error.response.data.errors.error;
        const errorText =
          text_error !== undefined
            ? error.response.data.errors.error
            : JSON.stringify(error.response.data.errors);
        if (error.response.data.code === 190) {
          setErrorWhattsap(errorText);
        } else {
          setErrorSync(errorText);
        }
      } else {
        Toast.show({
          type: "syncToast",
          text1: "INTENTE MAS TARDE",
        });
      }
    } finally {
      setLoadingSync(false);
      setErrorSync(null);
      setErrorWhattsap(null);
    }
  };

  const createFarm = async () => {
    const parcels_array = JSON.parse(storage.getString("parcels") || "[]");
    const parcels = parcels_array[0];
    const user = JSON.parse(storage.getString("user") || "{}");

    if (parcels.polygon && !parcels.syncUp) {
      try {
        setLoadingSync(true);
        const apiRequest: API_INTERFACE = {
          url: `${BASE_URL}/create_farm`,
          method: "POST",
          payload: {
            farm_name: parcels.name,
            hectares: parcels.hectares,
            dni_cacao_producer: user.dni,
            countryid: user.country?.code === "CO" ? 1 : 2,
            polygon_coordinates: parcels.polygon.toString(),
          },
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        };
        const data = await HTTP(apiRequest);
        console.log("data", data);
        addToSync(
          JSON.stringify([{ ...parcels, syncUp: true, id: data[0].id }]),
          "parcels"
        );
      } catch (error) {
        if (error?.response?.data) {
          const text_error = error.response.data.errors.error;
          const errorText =
            text_error !== undefined
              ? error.response.data.errors.error
              : JSON.stringify(error.response.data.errors);
          setErrorSync(errorText);
        } else {
          Toast.show({
            type: "syncToast",
            text1: "INTENTE MAS TARDE",
          });
        }
      } finally {
        setLoadingSync(false);
        setErrorSync(null);
      }
    }
  };

  const createSale = async () => {
    let sales = JSON.parse(storage.getString("sales") || "[]");
    const user = JSON.parse(storage.getString("user") || "{}");
    const parcels_array = JSON.parse(storage.getString("parcels") || "[]");
    const parcels = parcels_array[0];

    if (parcels.id) {
      for (let index = 0; index < sales.length; index++) {
        const element = sales[index];
        if (element.syncUp === false) {
          const key = element.type === "SECO" ? "dry_weight" : "baba_weight";
          try {
            const apiRequest: API_INTERFACE = {
              url: `${BASE_URL}/create_activities`,
              method: "POST",
              payload: {
                dni_cacao_producer: user.dni,
                id_farm: parcels.id,
                id_activity_type: 4,
                cacao_type: element.type,
                [key]: element.kl,
              },
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
              },
            };
            const data = await HTTP(apiRequest);
            console.log("data", data);
            sales[index] = { ...element, syncUp: true };
          } catch (error) {
            if (error?.response?.data) {
              const text_error = error.response.data.errors.error;
              const errorText =
                text_error !== undefined
                  ? error.response.data.errors.error
                  : JSON.stringify(error.response.data.errors);
              setErrorSync(errorText);
            } else {
              Toast.show({
                type: "syncToast",
                text1: "INTENTE MAS TARDE",
              });
            }
          } finally {
            setLoadingSync(false);
            setErrorSync(null);
          }
        }
      }

      addToSync(JSON.stringify(sales), "sales");
    }
  };

  return { createProducer, createFarm, createSale };
};

export default useApi;
