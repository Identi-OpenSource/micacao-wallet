import React, {createContext, useContext, useState} from 'react'

export interface ConnectionInterface {
  isConnected?: boolean
  isVisibleModal?: boolean
  setIsVisibleModal?: any
}

export const connectionInicialState: ConnectionInterface = {
  isConnected: false,
}

export type ConnectionActions = 'setConnection'

export interface ActionsInterface {
  type: ConnectionActions
  payload: ConnectionInterface
}

export const ConnectionContext = createContext(connectionInicialState)
export const ConnectionDispatchContext = createContext(
  (() => {}) as React.Dispatch<ActionsInterface>,
)

export const ConnectionProvider = ({
  children,
  value,
}: {
  children: React.ReactNode
  value: any
}) => {
  return (
    <ConnectionContext.Provider value={value}>
      {children}
    </ConnectionContext.Provider>
  )
}

export const useConnection = () => useContext(ConnectionContext)
