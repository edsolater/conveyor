import { KitProps, useKitProps } from '../../createKit'
import { Piv } from '../../piv/Piv'
import { ValidController } from '../../piv/typeTools'

export interface TabListController {}

export type TabListProps<Controller extends ValidController = TabListController> = KitProps<
  {},
  { controller: Controller }
>

/**
 * contain `Tab` components
 */
export function TabList(rawProps: TabListProps) {
  const { props, shadowProps, lazyLoadController } = useKitProps(rawProps)
  const tabListController: TabListController = {}
  lazyLoadController(tabListController)
  return (
    <Piv class='Tabs-List' shadowProps={shadowProps}>
      {props.children}
    </Piv>
  )
}
