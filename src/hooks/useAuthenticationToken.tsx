import { useEffect, useState } from "react";
import Config from "react-native-config";
import { storage } from "../config/store/db";
import { API_INTERFACE, HTTP } from "../services/api";

const useAuthenticationToken = () => {
  const [accessToken, setToken] = useState(null);

  const getToken = async () => {
    console.log("getToken", accessToken);

    if (accessToken === null) {
      try {
        const apiRequest: API_INTERFACE = {
          url: `${Config.BASE_URL}/token`,
          method: "POST",
          payload: { username: Config.USERNAME, password: Config.PASSWORD },
          headers: { "Content-Type": "multipart/form-data" },
        };
        const data = await HTTP(apiRequest);

        console.log("data", data.access_token);

        setToken(data.access_token);
        storage.set("accessToken", data.access_token);
      } catch (error) {
        console.log("error", error);
        //setError("Error fetching data");
      } finally {
      }
    }
  };

  useEffect(() => {
    console.log("AccessToken on Use", accessToken);
  }, [accessToken]);

  return { accessToken, setToken, getToken };
};

export default useAuthenticationToken;
