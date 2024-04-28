import React, {createContext, useContext} from 'react'
import {useAuth} from './AuthContext'
import useSync from '../hooks/useSyncData'

export interface SyncDataInterface {
  hasDataToSync?: boolean
  addToSync?: any
  toSyncData?: any
}

export const syncDataInicialState: SyncDataInterface = {
  hasDataToSync: false,
}

export type SyncDataActions = 'setSyncData'

export interface ActionsInterface {
  type: SyncDataActions
  payload: SyncDataInterface
}

export const SyncDataContext = createContext(syncDataInicialState)
export const SyncDataDispatchContext = createContext(
  (() => {}) as React.Dispatch<ActionsInterface>,
)

export const SyncDataProvider = ({children}: {children: React.ReactNode}) => {
  const {accessToken} = useAuth()

  // revisar loading y error de AuthContext
  // loadingSync ErrorSync
  const {hasDataToSync, addToSync, toSyncData} = useSync(accessToken)

  return (
    <SyncDataContext.Provider value={{hasDataToSync, addToSync, toSyncData}}>
      {children}
    </SyncDataContext.Provider>
  )
}

export const useSyncData = () => useContext(SyncDataContext)
