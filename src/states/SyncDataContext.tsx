import React, {createContext, useContext} from 'react'

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

export const SyncDataProvider = ({
  children,
  value,
}: {
  children: React.ReactNode
  value: any
}) => {
  return (
    <SyncDataContext.Provider value={value}>
      {children}
    </SyncDataContext.Provider>
  )
}

export const useSyncData = () => useContext(SyncDataContext)
