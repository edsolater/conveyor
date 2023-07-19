import { KitProps, Piv, useKitProps } from '../../../piv'

export type BoxProps = KitProps<{}>

/**
 * if for layout , don't render important content in Box
 */
export function Box(rawProps: BoxProps) {
  const { shadowProps } = useKitProps(rawProps, { name: 'Box' })
  /* ---------------------------------- props --------------------------------- */
  return <Piv shadowProps={shadowProps} />
}
