import { JSX } from 'solid-js'
import { TopMenuBar } from './TopMenuBar'
import { Box } from '../../packages/pivkit'
import { AsideMenuBar } from './AsideMenuBar'

export function NavBox({ content }: { content: JSX.Element }) {
  return (
    <Box
      icss={{
        overflowX: 'hidden',
        minHeight: '100dvh',
        maxWidth: '100dvw',
        display: 'grid',
        gridTemplate: `
          "nav   nav" auto
          "aside content" 1fr / 100px 1fr`,
      }}
    >
      <Box icss={{ gridArea: 'nav' }}>
        <TopMenuBar />
      </Box>
      <Box icss={{ gridArea: 'aside' }}>
        <AsideMenuBar />
      </Box>
      <Box icss={{ gridArea: 'content' }}>{content}</Box>
    </Box>
  )
}
