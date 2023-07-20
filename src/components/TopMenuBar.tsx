import { threeGridSlotBoxICSS } from '../icssBlocks/threeGridSlotBoxICSS'
import { Piv } from '../packages/piv'
import { Box, Icon, icss_row } from '../packages/pivkit'
import { Link, renderHTMLDOM } from './Link'

export interface TopMenuBarProps {
  title?: string
}

/**
 * have navbar(route bar) toggle button and wallet connect button
 */

export function TopMenuBar(props: TopMenuBarProps) {
  return (
    <Piv<'nav'>
      icss={[
        icss_row({ items: 'center' }),
        { userSelect: 'none', padding: '16px 32px', transition: '150ms' },
        threeGridSlotBoxICSS,
      ]}
      render:self={(selfProps) => renderHTMLDOM('nav', selfProps)}
    >
      <Box icss={icss_row({ gap: '32px' })}>
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
