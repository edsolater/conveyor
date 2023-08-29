import { createEffect } from 'solid-js'
import { threeGridSlotBoxICSS } from '../../icssBlocks/threeGridSlotBoxICSS'
import { Box, Icon, Loop, Piv, icssRow, renderHTMLDOM } from '../../packages/pivkit'
import { useGlobalConfigContext } from '../../root'
import { Link } from '../Link'
import { produce } from 'solid-js/store'

export interface TopMenuBarProps {
  menuItems?: { name: string; href: string }[]
  /** pass to DOM's <title> */
  documentTitle?: string
}

function setMetaTitle(title?: string) {
  if (title) {
    window.document.title = title
  }
}

/**
 * have navbar(route bar) toggle button and wallet connect button
 */

export function TopMenuBar(props: TopMenuBarProps) {
  // TODO: all should be getters like props
  const { appConfig, setAppConfig: setConfig } = useGlobalConfigContext()
  createEffect(() => {
    setConfig(produce((s) => (s.navigator.documentTitle = props.documentTitle)))
    setMetaTitle(props.documentTitle)
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
        <Loop of={appConfig.navigator.navButtons}>
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
