import Config from "react-native-config";
import { storage } from "../config/store/db";
import { API_INTERFACE, HTTP } from "../services/api";

const useSyncData = () => {
  const setProducer = async () => {
    try {
      const user = JSON.parse(storage.getString("user") || "{}");

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
    } finally {
    }
  };

  const syncData = async (accessToken: any) => {
    const user = JSON.parse(storage.getString("user") || "{}");

    console.log("user Sync", user, "accessToken", accessToken);
    if (Object.values(user).length > 0 && !user.syncUp) {
      if (accessToken !== null) {
        await setProducer();
      } else {
        console.log("No se puede sincronizar ahora");
      }
    }
  };

  return { syncData };
};

export default useSyncData;
