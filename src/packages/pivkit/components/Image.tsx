import { shakeNil, shakeUndefinedItem } from '@edsolater/fnkit'
import { Piv, UIKit, parsePivProps, useKitProps } from '../../piv'
import { Accessify } from '../utils/accessifyProps'
import { Box } from './Boxes'
import { createEffect, createSignal } from 'solid-js'
import { createRef } from '../hooks'
import { onEvent as addEventListener } from '../../domkit'

export interface ImageProps extends UIKit<{ controller: ImageController }> {
  /**
   *  also accept multi srcs
   */
  src?: Accessify<string | string[] | undefined, ImageController>
  fallbackSrc?: Accessify<string | undefined, ImageController>
  /**
   *  for readability
   */
  alt?: Accessify<string | undefined, ImageController>

  // TODO: imply it!!!
  resizeable?: boolean
  /** @default 'lazy' */
  loading?: 'lazy' | 'eager'

  'css:width'?: string
  'css:height'?: string
}

export interface ImageController {}

const defaultProps = {} as const satisfies Partial<ImageProps>

export type DefaultImageProps = typeof defaultProps
/**
 * if for layout , don't render important content in Box
 * @todo add fallbackSrc
 */
export function Image(rawProps: ImageProps) {
  // TODO is load
  const [isLoaded, setIsLoaded] = createSignal(false)
  const [dom, setDom] = createRef<HTMLImageElement>()
  const { props, shadowProps } = useKitProps(rawProps, { defaultProps })

  createEffect(() => {
    addEventListener(dom(), 'load', () => {
      setIsLoaded(true)
    })
  })
  /* ---------------------------------- props --------------------------------- */
  return (
    <Box class="Image container" style={shakeNil({ width: props['css:width'], height: props['css:height'] })}>
      <Piv<'img'>
        domRef={setDom}
        render:self={(selfProps) => <img {...parsePivProps(selfProps)} />}
        htmlProps={{ src: String(props.src), alt: props.alt, loading: props.loading ?? 'lazy' }}
        icss={{
          display: 'block',
          opacity: isLoaded() ? undefined : '0'
        }}
        shadowProps={shadowProps}
        class="Image"
      />
    </Box>
  )
}
