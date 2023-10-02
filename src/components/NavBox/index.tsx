import { JSX } from 'solid-js'
import { TopMenuBar } from './TopMenuBar'
import { Box } from '../../packages/pivkit'

export function NavBox({ content }: { content: JSX.Element }) {
  return (
    <Box
      icss={{
        overflowX: 'hidden',
        minHeight: '100dvh',
        maxWidth: '100dvw',
        display: 'grid',
        gridTemplate: `
          "nav" auto
          "content" 1fr / 100dvw`,
      }}
    >
      <Box icss={{ gridArea: 'nav' }}>
        <TopMenuBar />
      </Box>
      <Box icss={{ gridArea: 'content' }}>{content}</Box>
    </Box>
  )
}
