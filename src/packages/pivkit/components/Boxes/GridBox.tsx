import { isObject } from '@edsolater/fnkit'
import { KitProps, useKitProps } from '../../../piv'
import { ICSSGridItemOption, ICSSGridOption, icssGrid } from '../../icssBlocks'
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
      icss={[icssGrid(isObject(props['icss:grid']) ? props['icss:grid'] : {})]}
    />
  )
}

export type GridItemBoxProps = KitProps<
  {
    'icss:area'?: ICSSGridItemOption['area']
  },
  { extends: BoxProps }
>

/**
 * for direct sub component of `<GridBox>`
 */
export function GridItem(rawProps: GridItemBoxProps) {
  const { shadowProps, props } = useKitProps(rawProps, { name: 'GridItemBox' })
  return <Box shadowProps={shadowProps} icss={{ gridArea: props['icss:area'] }} />
}
