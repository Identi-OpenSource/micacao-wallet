import React, { createContext, useContext, useState } from "react";

export interface AuthInterface {
  accessToken?: any;
  setToken?: any;
}

export const authInicialState: AuthInterface = {
  accessToken: null,
};

export type AuthActions = "getAccessToken";

export interface ActionsInterface {
  type: AuthActions;
  payload: AuthInterface;
}

export const AuthContext = createContext(authInicialState);
export const UserDispatchContext = createContext((() => {}) as React.Dispatch<
  ActionsInterface
>);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [accessToken, setAccessToken] = useState(null);

  const setToken = (token: any) => {
    setAccessToken(token);
  };

  return (
    <AuthContext.Provider value={{ accessToken, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
