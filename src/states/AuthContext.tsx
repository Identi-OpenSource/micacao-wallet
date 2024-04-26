import React, { createContext, useContext, useState } from "react";

export interface AuthInterface {
  accessToken?: any;
  setToken?: any;
  getToken?: any;
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
export const AuthDispatchContext = createContext((() => {}) as React.Dispatch<
  ActionsInterface
>);

export const AuthProvider = ({
  children,
  value,
}: {
  children: React.ReactNode;
  value: any;
}) => {
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
