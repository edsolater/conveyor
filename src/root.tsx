// @refresh reload
import { Suspense } from 'solid-js'
import { Body, ErrorBoundary, FileRoutes, Head, Html, Link, Meta, Routes, Scripts, Title } from 'solid-start'
import { createGlobalStyles } from 'solid-styled-components'
import { appConfig } from './configs/appConfig'
import { createGlobalConfigContext } from './packages/pivkit/hooks/createGlobalConfigContext'

const GlobalStyles = createGlobalStyles`
    body {
      font-family: Gordita, Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      background-color: #f6faff;
      margin: 0;
    }

    main {
      text-align: center;
      padding: 1em;
      margin: 0 auto;
    }

    h1 {
      color: #335d92;
      text-transform: uppercase;
      font-size: 4rem;
      font-weight: 100;
      line-height: 1.1;
      margin: 4rem auto;
      max-width: 14rem;
    }

    p {
      max-width: 14rem;
      margin: 2rem auto;
      line-height: 1.35;
    }

    [popover] {
      padding: inherit;
      margin: unset;
    }

    @media (min-width: 480px) {
      h1 {
        max-width: none;
      }

      p {
        max-width: none;
      }
    }
  `

export const { setStoredGlobalConfig, useGlobalConfigContext, storedGlobalConfig, GlobalConfigProvider } =
  createGlobalConfigContext(appConfig)

export default function Root() {
  return (
    <Html lang='en'>
      <Head>
        <Title>SolidStart - Bare</Title>
        <Meta charset='utf-8' />
        <Meta name='viewport' content='width=device-width, initial-scale=1' />
        <Link rel='icon' type='image/svg' href='favicon.svg' />
      </Head>
      <Body>
        <GlobalStyles />
        <Suspense>
          <ErrorBoundary>
            <GlobalConfigProvider>
              <Routes>
                <FileRoutes />
              </Routes>
            </GlobalConfigProvider>
          </ErrorBoundary>
        </Suspense>
        <Scripts />
      </Body>
    </Html>
  )
}
