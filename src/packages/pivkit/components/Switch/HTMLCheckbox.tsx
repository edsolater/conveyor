import { renderHTMLDOM } from '../../../../components/Link'
import { Piv, UIKit, useKitProps } from '../../../piv'

export interface HTMLCheckboxProps extends UIKit {
  label?: string
  defaultChecked?: boolean
}
export function HTMLCheckbox(rawProps: HTMLCheckboxProps) {
  const { props } = useKitProps(rawProps)
  return (
    <Piv
      class='HTMLCheckbox'
      render:self={(selfProps) => renderHTMLDOM('input', selfProps)}
      htmlProps={{
        type: 'checkbox',
        checked: props.defaultChecked,
        'aria-label': props.label ?? 'checkbox',
      }}
      shadowProps={props}
    />
  )
}
