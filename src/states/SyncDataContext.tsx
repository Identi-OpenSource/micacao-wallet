import React, {createContext, useContext, useState} from 'react'
import useSync from '../OCC/hooks/useSyncData'
import {useAuth} from './AuthContext'

export interface SyncDataInterface {
  hasDataToSync?: boolean
  addToSync?: any
  toSyncData?: any
  dataToSync?: any
  loadingSync?: boolean
  errorSync?: any
  setLoadingSync?: any
  setErrorSync?: any
  setErrorWhattsap?: any
  errorWhattsap?: any
}

export const syncDataInicialState: SyncDataInterface = {
  hasDataToSync: false,
  loadingSync: false,
  errorSync: null,
  setErrorWhattsap: null,
  errorWhattsap: null,
  setLoadingSync: null,
  setErrorSync: null,
  dataToSync: null,
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
  const [loadingSync, setLoadingSync] = useState(false)
  const [errorSync, setErrorSync] = useState(null)
  const [errorWhattsap, setErrorWhattsap] = useState(null)
  const {accessToken} = useAuth()

  // revisar loading y error de AuthContext
  // loadingSync ErrorSync
  const {hasDataToSync, addToSync, toSyncData, dataToSync} = useSync(
    accessToken,
    setLoadingSync,
    setErrorSync,
    setErrorWhattsap,
  )

  return (
    <SyncDataContext.Provider
      value={{
        hasDataToSync,
        addToSync,
        toSyncData,
        loadingSync,
        errorSync,
        dataToSync,
        errorWhattsap,
      }}>
      {children}
    </SyncDataContext.Provider>
  )
}

export const useSyncData = () => useContext(SyncDataContext)
