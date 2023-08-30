import { createEffect, createMemo } from 'solid-js'
import { useLocation } from 'solid-start'
import { threeGridSlotBoxICSS } from '../../icssBlocks/threeGridSlotBoxICSS'
import { Box, Icon, Loop, Piv, icssRow, renderHTMLDOM } from '../../packages/pivkit'
import { useGlobalConfigContext } from '../../root'
import { Link } from '../Link'

/** use appConfig */
export interface TopMenuBarProps {}

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
export function TopMenuBar(props: TopMenuBarProps) {
  // TODO: all should be getters like props
  const { appConfig, setAppConfig: setConfig } = useGlobalConfigContext()
  const { pathname } = useLocation()

  const currentNavButton = createMemo(() => appConfig.navigator.navButtons.find((i) => i.path === pathname))

  createEffect(() => {
    setMetaTitle(currentNavButton()?.name)
  })

  return (
    <Piv<'nav'>
      icss={[
        icssRow({ items: 'center' }),
        { userSelect: 'none', padding: '16px 32px', transition: '150ms' },
        threeGridSlotBoxICSS,
      ]}
      render:self={(selfProps) => renderHTMLDOM('nav', selfProps)}
    >
      <Box icss={icssRow({ gap: '32px' })}>
        <Link href='/' innerRoute>
          <Icon src='/logo-with-text.svg' icss={{ height: '32px' }} />
        </Link>
        {/* <Text icss={{ fontSize: '36px', fontWeight: '800px' }}>{props.title}</Text> */}
      </Box>

      {/* tabs */}
      <Box icss={{ display: 'flex', gap: '16px' }}>
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
