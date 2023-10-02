import { KitProps, useKitProps } from '../piv'
import { PivChild } from '../piv/typeTools'
import { Text } from './Text'

export type LabelProps = KitProps<{
  value?: string
  render?: (value: string) => PivChild
}>
/**
 * created for form widget component
 *
 * !`<label>` can transpond click/focus event for inner `<Input>`-like Node
 */
export function Label(rawProps: LabelProps) {
  const { shadowProps, props } = useKitProps(rawProps, { name: 'Label' })
  return <Text class='Label' shadowProps={shadowProps} />
}
