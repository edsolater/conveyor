import { threeGridSlotBoxICSS } from '../../icssBlocks/threeGridSlotBoxICSS'
import { Box, Icon, Piv, icssRow, renderHTMLDOM } from '../../packages/pivkit'
import { useGlobalConfigContext } from '../../root'
import { Link } from '../Link'

export interface TopMenuBarProps {
  menuItems?: { name: string; href: string }[]
  /** pass to DOM's <title> */
  documentTitle?: string
}

/**
 * have navbar(route bar) toggle button and wallet connect button
 */

export function TopMenuBar(props: TopMenuBarProps) {
  // TODO: all should be getters like props
  const config = useGlobalConfigContext()
  console.log('config.todo: ', config.todo)
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
        <Link href='/' innerRoute>
          Home
        </Link>
        <Link href='/playground' innerRoute>
          Playground
        </Link>
      </Box>
    </Piv>
  )
}
