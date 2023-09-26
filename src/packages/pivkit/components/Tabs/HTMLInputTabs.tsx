import { renderHTMLDOM } from '../../piv/propHandlers/renderHTMLDOM'
import { Piv, UIKit, useKitProps } from '../../piv'

export interface HTMLInputTabsProps extends UIKit {
  label?: string
  defaultChecked?: boolean
}
export function HTMLInputTabs(rawProps: HTMLInputTabsProps) {
  const { props } = useKitProps(rawProps)
  return (
    <Piv
      class='HTMLCheckbox'
      render:self={(selfProps) => renderHTMLDOM('input', selfProps)}
      htmlProps={{
        type: 'tabs',
        checked: props.defaultChecked,
        'aria-label': props.label ?? 'tabs',
      }}
      shadowProps={props}
    />
  )
}
