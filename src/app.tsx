// @refresh reload
import { Link, MetaProvider, Title } from '@solidjs/meta'
import { Router } from '@solidjs/router'
import { FileRoutes } from '@solidjs/start'
import { Suspense } from 'solid-js'
import './app.css'
import { NavLayoutBox } from './components/NavLayoutBox'
import { RouterMenu } from './components/RouterMenu'
import { appConfig } from './configs/appConfig'
import { createGlobalConfigContext } from '@edsolater/pivkit'

export const { setStoredGlobalConfig, useGlobalConfigContext, storedGlobalConfig, GlobalConfigProvider } =
  createGlobalConfigContext(appConfig)

export default function App() {
  return (
    <Router
      root={(props) => (
        <GlobalConfigProvider>
          <NavLayoutBox
            layoutType='aside-content'
            renderTopBar={<RouterMenu variant={'top'} />}
            renderAsideBar={<RouterMenu variant={'aside'} />}
            renderContent={
              <MetaProvider>
                <Title>{appConfig.appName}</Title>
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
