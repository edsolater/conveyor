import { createContext, useContext } from 'solid-js'
import { createStore } from 'solid-js/store'

interface GlobalConfig {
  todo?: string
}
const defaultGlobalConfig: GlobalConfig = { todo: 'imply global config store' }

export function createGlobalConfigContext() {
  const [storedGlobalConfig, setStoredGlobalConfig] = createStore<GlobalConfig>(defaultGlobalConfig)
  // let set: ((config: GlobalConfig) => void) | undefined = undefined
  const context = createContext(defaultGlobalConfig)

  function useGlobalConfigContext() {
    const config = useContext(context)
    return config
  }

  function GlobalConfigProvider(props: { children?: any }) {
    // set = setStoredGlobalConfig
    return <context.Provider value={storedGlobalConfig}>{props.children}</context.Provider>
  }

  return { GlobalConfigProvider, useGlobalConfigContext, setStoredGlobalConfig, storedGlobalConfig }
}
