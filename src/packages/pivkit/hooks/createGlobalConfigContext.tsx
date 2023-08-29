import { AnyObj } from '@edsolater/fnkit'
import { createContext, useContext } from 'solid-js'
import { createStore } from 'solid-js/store'

export function createGlobalConfigContext<Config extends AnyObj>(defaultGlobalConfig: Config) {
  const [storedGlobalConfig, setStoredGlobalConfig] = createStore<Config>(defaultGlobalConfig as any)
  // let set: ((config: GlobalConfig) => void) | undefined = undefined
  const context = createContext(defaultGlobalConfig)

  function useGlobalConfigContext() {
    const appConfig = useContext(context)
    return { appConfig, setAppConfig: setStoredGlobalConfig }
  }

  function GlobalConfigProvider(props: { children?: any }) {
    // set = setStoredGlobalConfig
    return <context.Provider value={storedGlobalConfig}>{props.children}</context.Provider>
  }

  return { GlobalConfigProvider, useGlobalConfigContext, setStoredGlobalConfig, storedGlobalConfig }
}
