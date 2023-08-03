import { KitProps, useKitProps } from '../../piv'
import { ICSSGridOption } from '../../styles/icssBlocks'
import { Box } from './Box'

export type ColBoxProps = KitProps<{
  'icss:grid'?: boolean | ICSSGridOption
}>

/**
 * if for layout , don't render important content in ColBox
 */
export function ColBox(rawProps: ColBoxProps) {
  const { shadowProps } = useKitProps(rawProps, { name: 'ColBox' })
  /* ---------------------------------- props --------------------------------- */
  return <Box class={'ColBox'} shadowProps={shadowProps} />
}
