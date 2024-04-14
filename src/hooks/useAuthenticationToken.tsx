import { useEffect, useState } from "react";
import { HTTP, API_INTERFACE } from "../services/api";
import Config from "react-native-config";
import useInternetConnection from "./useInternetConnection";

const useAuthenticationToken = () => {
  const [accessToken, setAccessToken] = useState(null);
  const { isConnected } = useInternetConnection();

  const getToken = async () => {
    if (isConnected && accessToken === null) {
      try {
        const apiRequest: API_INTERFACE = {
          url: `${Config.BASE_URL}/token`,
          method: "POST",
          payload: { username: "test", password: "test" },
          headers: { "Content-Type": "multipart/form-data" },
        };
        const data = await HTTP(apiRequest);
        setAccessToken(data);
      } catch (error) {
        console.log("error", error);
        setAccessToken(null);
        //setError("Error fetching data");
      } finally {
      }
    }
  };

  useEffect(() => {
    getToken();
  }, [isConnected]);

  return { accessToken };
};

export default useAuthenticationToken;
