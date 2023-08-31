import { createEffect, createMemo } from 'solid-js'
import { useLocation } from 'solid-start'
import { threeGridSlotBoxICSS } from '../../icssBlocks/threeGridSlotBoxICSS'
import { Box, Icon, KitProps, Loop, Piv, icssRow, renderHTMLDOM, useKitProps } from '../../packages/pivkit'
import { useGlobalConfigContext } from '../../root'
import { Link } from '../Link'
import { produce } from 'solid-js/store'

/**
 * set document title
 * @param title set document title
 * @returns void
 */
function setMetaTitle(title?: string) {
  if (title) {
    window.document.title = title
  }
}

/**
 * have navbar(route bar) toggle button and wallet connect button
 *
 * parse `appConfig.navigator` to render nav buttons
 */
export function TopMenuBar(rawProps: KitProps) {
  const { shadowProps } = useKitProps(rawProps)
  const { appConfig, setAppConfig } = useGlobalConfigContext()

  const { pathname } = useLocation()

  const currentNavButton = createMemo(() => appConfig.navigator.navButtons.find((i) => i.path === pathname))

  createEffect(() => {
    setMetaTitle(currentNavButton()?.isHome ? appConfig.appName : `${appConfig.appName} | ${currentNavButton()?.name}`)
  })

  return (
    <Piv<'nav'>
      icss={[
        icssRow({ items: 'center' }),
        { userSelect: 'none', padding: '16px 32px', transition: '150ms' },
        threeGridSlotBoxICSS,
      ]}
      shadowProps={shadowProps}
      render:self={(selfProps) => renderHTMLDOM('nav', selfProps)}
    >
      <Box icss={icssRow({ gap: '32px' })}>
        <Link href='/' innerRoute>
          <Icon src='/logo-with-text.svg' icss={{ height: '32px' }} />
        </Link>
        {/* <Text icss={{ fontSize: '36px', fontWeight: '800px' }}>{props.title}</Text> */}
      </Box>

      {/* tabs */}
      <Box
        icss={{ display: 'flex', gap: '16px' }}
      >
        <Loop of={appConfig.navigator.navButtons} icss={{ display: 'flex', gap: '8px' }}>
          {({ name, path }) => (
            <Link href={path} innerRoute>
              {name}
            </Link>
          )}
        </Loop>
      </Box>
    </Piv>
  )
}
