import { switchCase } from '@edsolater/fnkit'
import { Box, KitProps, PivChild, useKitProps } from '../packages/pivkit'

export type NavLayoutBoxProps = {
  layoutType?: 'top-content' | 'aside-content' | 'top-aside-content'
  renderContent?: PivChild
  renderTopBar?: PivChild
  renderAsideBar?: PivChild
}
export type NavLayoutBoxKitProps = KitProps<NavLayoutBoxProps, { needAccessifyProps: ['layoutType'] }>

export function NavLayoutBox(props: NavLayoutBoxProps) {
  const gridTemplate = () =>
    switchCase(props.layoutType ?? 'aside-content', {
      'top-content': `
        "top" auto
        "content" 1fr / 1fr`,
      'aside-content': `
        "aside content" 1fr / 100px 1fr`,
      'top-aside-content': `
        "top top" auto
        "aside content" 1fr / 100px 1fr`,
    })
  const isTopVisiable = () => props.layoutType === 'top-content' || props.layoutType === 'top-aside-content'
  const isAsideVisiable = () => props.layoutType === 'aside-content' || props.layoutType === 'top-aside-content'

  return (
    <Box
      icss={{
        overflowX: 'hidden',
        minHeight: '100dvh',
        maxWidth: '100dvw',
        display: 'grid',
        gridTemplate: gridTemplate(),
      }}
      // shadowProps={shadowProps}
    >
      {props.renderTopBar && isTopVisiable() && <Box icss={{ gridArea: 'top' }}>{props.renderTopBar}</Box>}
      {props.renderAsideBar && isAsideVisiable() && <Box icss={{ gridArea: 'aside' }}>{props.renderAsideBar}</Box>}
      {props.renderContent && <Box icss={{ gridArea: 'content' }}>{props.renderContent}</Box>}
    </Box>
  )
}
