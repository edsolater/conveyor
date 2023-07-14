import { KitProps, Piv, PivProps, useKitProps } from '../../../piv'
import { ICSSColOption, ICSSGridOption, ICSSRowOption } from '../../icssBlocks'

export type BoxProps = KitProps<{

}>

/**
 * if for layout , don't render important content in Box
 */
export function Box(rawProps: BoxProps) {
  const { shadowProps } = useKitProps(rawProps, { name: 'Box' })
  /* ---------------------------------- props --------------------------------- */
  return <Piv class={'Box'} shadowProps={shadowProps} />
}
