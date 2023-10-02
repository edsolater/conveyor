import { KitProps, Piv, useKitProps } from '../piv'
import { renderHTMLDOM } from '../piv/propHandlers/renderHTMLDOM'

export type LabelBoxProps = KitProps<{}>
/**
 * created for form widget component
 *
 * !`<label>` can transpond click/focus event for inner `<Input>`-like Node
 */
export function LabelBox(rawProps: LabelBoxProps) {
  const { props, shadowProps } = useKitProps(rawProps, { name: 'LabelBox' })
  return (
    <Piv
      render:self={(selfProps) => renderHTMLDOM('label', selfProps)} // why set as will render twice
      shadowProps={shadowProps}
    />
  )
}
