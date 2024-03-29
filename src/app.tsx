// @refresh reload
import { Link, MetaProvider, Title } from '@solidjs/meta'
import { Router } from '@solidjs/router'
import { FileRoutes } from '@solidjs/start'
import { Suspense } from 'solid-js'
import './app.css'
import { NavBox } from './components/NavBox'
import { appConfig } from './configs/appConfig'
import { createGlobalConfigContext } from './packages/pivkit/hooks/createGlobalConfigContext'

export const { setStoredGlobalConfig, useGlobalConfigContext, storedGlobalConfig, GlobalConfigProvider } =
  createGlobalConfigContext(appConfig)

export default function App() {
  return (
    <Router
      root={(props) => (
        <GlobalConfigProvider>
          <NavBox
            content={
              <MetaProvider>
                <Title>Conveyor</Title>
                <Link rel='icon' type='image/svg' href='favicon.svg' />
                <Suspense>{props.children}</Suspense>
              </MetaProvider>
            }
          />
        </GlobalConfigProvider>
      )}
    >
      <FileRoutes />
    </Router>
  )
}
