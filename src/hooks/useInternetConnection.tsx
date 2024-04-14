import { useEffect, useState } from "react";
import NetInfo from "@react-native-community/netinfo";

const useInternetConnection = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isVisibleModal, setIsVisibleModal] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (!isConnected && state.isConnected) {
        setIsVisibleModal(true);
      }
      setIsConnected(state.isConnected ?? false);
    });

    // Limpiar en el desmontaje
    return () => {
      unsubscribe();
    };
  }, []);

  return { isConnected, isVisibleModal, setIsVisibleModal };
};

export default useInternetConnection;
