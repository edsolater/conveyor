import { isObject } from '@edsolater/fnkit'
import { KitProps, useKitProps } from '../../../piv'
import { ICSSGridOption, icss_grid } from '../../icssBlocks'
import { Box, BoxProps } from './Box'

export type GridBoxProps = KitProps<
  {
    /** options for icss_grid() */
    'icss:grid'?: boolean | ICSSGridOption
  },
  { extends: BoxProps }
>

/**
 * if for layout , don't render important content in GridBox
 */
export function GridBox(rawProps: GridBoxProps) {
  const { shadowProps, props } = useKitProps(rawProps, { name: 'GridBox' })
  /* ---------------------------------- props --------------------------------- */
  return (
    <Box
      class={'GridBox'}
      shadowProps={shadowProps}
      icss={[icss_grid(isObject(props['icss:grid']) ? props['icss:grid'] : {})]}
    />
  )
}
