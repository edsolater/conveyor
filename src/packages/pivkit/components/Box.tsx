import { Piv, PivProps } from '../../../packages/piv'
import { ICSSColOption, ICSSGridOption, ICSSRowOption } from '../icssBlocks'

export interface BoxProps extends PivProps {
  grid?: ICSSGridOption | true
  row?: ICSSRowOption | true
  col?: ICSSColOption | true
}

/**
 * if for layout , don't render important content in Box
 */
export function Box(props: BoxProps) {
  /* ---------------------------------- props --------------------------------- */
  return <Piv class={Box.name} {...props} />
}
