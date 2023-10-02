import { KitProps, Piv, useKitProps } from '../../piv'

export type BoxProps = {}

/**
 * if for layout , don't render important content in Box
 */
export function Box(rawProps: KitProps<BoxProps>) {
  const { shadowProps } = useKitProps(rawProps, { name: 'Box' })
  /* ---------------------------------- props --------------------------------- */
  return <Piv shadowProps={shadowProps} />
}
