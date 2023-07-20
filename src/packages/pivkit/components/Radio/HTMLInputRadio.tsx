import { renderHTMLDOM } from '../../../../components/Link'
import { Piv, UIKit, useKitProps } from '../../../piv'

export interface HTMLInputRadioProps extends UIKit {
  label?: string
  defaultChecked?: boolean
}
export function HTMLInputRadio(rawProps: HTMLInputRadioProps) {
  const { props } = useKitProps(rawProps)
  return (
    <Piv
      class='HTMLCheckbox'
      render:self={(selfProps) => renderHTMLDOM('input', selfProps)}
      htmlProps={{
        type: 'radio',
        checked: props.defaultChecked,
        'aria-label': props.label ?? 'radio',
      }}
      shadowProps={props}
    />
  )
}
