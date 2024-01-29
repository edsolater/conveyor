// @refresh reload
import { Link, MetaProvider, Title } from '@solidjs/meta'
import { Router } from '@solidjs/router'
import { FileRoutes } from '@solidjs/start'
import { Suspense } from 'solid-js'
import './app.css'
import { NavLayoutBox } from './components/NavLayoutBox'
import { appConfig } from './configs/appConfig'
import { createGlobalConfigContext } from './packages/pivkit/hooks/createGlobalConfigContext'
import { TopMenuBar } from './components/TopMenuBar'
import { AsideMenuBar } from './components/AsideMenuBar'

export const { setStoredGlobalConfig, useGlobalConfigContext, storedGlobalConfig, GlobalConfigProvider } =
  createGlobalConfigContext(appConfig)

export default function App() {
  return (
    <Router
      root={(props) => (
        <GlobalConfigProvider>
          <NavLayoutBox
            layoutType='aside-content'
            renderTopBar={<TopMenuBar />}
            renderAsideBar={<AsideMenuBar />}
            renderContent={
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
