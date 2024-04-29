import React, { createContext, useEffect, useState } from "react";
import useAuthenticationToken from "../hooks/useAuthenticationToken";

export interface AuthInterface {
  accessToken?: any;
  setAccessToken?: any;
  getToken?: any;
  loading?: boolean;
  error?: any;
  setLoading?: any;
  setError?: any;
}

export const authInicialState: AuthInterface = {
  accessToken: null,
  loading: false,
  error: null,
};

export type AuthActions = "getAccessToken";

export interface ActionsInterface {
  type: AuthActions;
  payload: AuthInterface;
}

export const AuthContext = createContext(authInicialState);
export const AuthDispatchContext = createContext((() => {}) as React.Dispatch<
  ActionsInterface
>);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [accessToken, setAccessToken] = useState(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);

  const { getToken } = useAuthenticationToken(
    setAccessToken,
    setLoading,
    setError
  );

  useEffect(() => {
    console.log("AccessToken on Context", accessToken);
  }, [accessToken]);

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        loading,
        error,
        setAccessToken,
        getToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);
