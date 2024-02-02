import { useLocation } from '@solidjs/router'
import { createEffect, createMemo } from 'solid-js'
import { useGlobalConfigContext } from '../app'
import { threeGridSlotBoxICSS } from '../icssBlocks/threeGridSlotBoxICSS'
import { Box, Icon, KitProps, Loop, Piv, Text, icssRow, renderHTMLDOM, useKitProps } from '../packages/pivkit'
import { Link } from './Link'
import { useContainerSize } from '../packages/pivkit/hooks/useContainerSize'

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

type RouterMenuProps = {
  variant: 'aside' | 'top'
}

type RouterMenuKitProps = KitProps<RouterMenuProps>

/**
 * {@link appConfig.navigator}
 */
export function RouterMenu(rawProps: RouterMenuKitProps) {
  const { shadowProps, props } = useKitProps(rawProps, { name: RouterMenu.name })
  const { appConfig, setAppConfig } = useGlobalConfigContext()
  const { pathname } = useLocation()
  const currentNavButton = createMemo(() => appConfig.navigator.navButtons.find((i) => i.path === pathname))

  createEffect(() => {
    setMetaTitle(currentNavButton()?.isHome ? appConfig.appName : `${appConfig.appName} | ${currentNavButton()?.name}`)
  })
  const { sizeDetectRef, containerWidth, containerHeight } = useContainerSize()

  const verticalShown = () => (containerHeight() ?? 0) > (containerWidth() ?? 0)
  return (
    <Box
      domRef={sizeDetectRef}
      icss={[
        icssRow({ items: 'center' }),
        { userSelect: 'none', padding: '16px 32px', transition: '150ms' },
        threeGridSlotBoxICSS,
      ]}
      shadowProps={shadowProps}
      render:self={(selfProps) => renderHTMLDOM('nav', selfProps)}
    >
      {/* <Box icss={icssRow({ gap: '32px' })}>
        <Link href='/' innerRoute>
          <Icon src='/logo-with-text.svg' icss={{ height: '32px' }} />
        </Link>
        <Text icss={{ fontSize: '36px', fontWeight: '800px' }}>{props.title}</Text>
      </Box> */}

      {/* tabs */}
      <Loop
        of={appConfig.navigator.navButtons}
        icss={{ display: 'flex', flexDirection: verticalShown() ? 'column' : 'row', gap: '8px' }}
      >
        {({ name, path }) => (
          <Link href={path} innerRoute>
            {name}
          </Link>
        )}
      </Loop>
    </Box>
  )
}
