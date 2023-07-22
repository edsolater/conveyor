// @refresh reload
import { Suspense } from 'solid-js'
import { Body, ErrorBoundary, FileRoutes, Head, Html, Link, Meta, Routes, Scripts, Title } from 'solid-start'
import { createGlobalStyles } from 'solid-styled-components'

const GlobalStyles = createGlobalStyles`
    body {
      font-family: Gordita, Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
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

    @media (min-width: 480px) {
      h1 {
        max-width: none;
      }

      p {
        max-width: none;
      }
    }
  `

export default function Root() {
  return (
    <Html lang='en'>
      <Head>
        <Title>SolidStart - Bare</Title>
        <Meta charset='utf-8' />
        <Meta name='viewport' content='width=device-width, initial-scale=1' />
        <Link rel='shortcut icon' type='image/svg' href='favicon.svg' />
      </Head>
      <Body>
        <GlobalStyles />
        <Suspense>
          <ErrorBoundary>
            <Routes>
              <FileRoutes />
            </Routes>
          </ErrorBoundary>
        </Suspense>
        <Scripts />
      </Body>
    </Html>
  )
}
