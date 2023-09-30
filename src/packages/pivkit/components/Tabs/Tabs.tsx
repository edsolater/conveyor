import { Accessor, createContext } from 'solid-js'
import { KitProps, useKitProps } from '../../createKit'
import { createSyncSignal } from '../../hooks/createSyncSignal'
import { Piv } from '../../piv/Piv'
import { ValidController } from '../../piv/typeTools'
import { Tab } from './Tab'
import { TabList } from './TabList'
import {
  TabsControllerWithTabValue,
  TabsPropsWithTabValue,
  useAbilityFeature_TabValue,
} from './features/TabsControllerWithTabValue'
import { mergeObjects } from '@edsolater/fnkit'

export type TabsController = {
  /** tabs group name */
  groupName: Accessor<string | undefined>
  selectedIndex: Accessor<number>
  /**
   * method
   */
  selectTabByIndex(index: number): void

  /**
   * inner method
   * invoked by `Tab` component
   * register method
   */
  _onChange(cb: (controller: TabsController) => void): { unregister(): void }
} & TabsControllerWithTabValue

export type CoreTabProps = {
  /** recommand to set, so can flat ui state to pure js object  */
  groupName?: string
  selectedIndex?: number
  defaultSelectedIndex?: number
  onChange?(controller: TabsController): void
} & TabsPropsWithTabValue

export type TabsProps<Controller extends ValidController = TabsController> = KitProps<
  CoreTabProps,
  { controller: Controller }
>

const TabsControllerContextDefaultValue: TabsController = {
  groupName: () => undefined,
  selectedIndex: () => 0,
  tabValues: () => [],
  selectedValue: () => undefined,
  selectTabByIndex: () => {},
  selectTabByValue: () => {},
  _addTabValue: () => {},
  _onChange: () => ({ unregister: () => {} }),
}
export const TabsControllerContext = createContext<TabsController>(TabsControllerContextDefaultValue)

/**
 * abilities:
 * - select tab 2️⃣ will auto unselect tab 1️⃣
 *
 * @example
 * <Tabs>
 *   <Tab.List>
 *     <Tab>Tab 1</Tab>
 *     <Tab>Tab 2</Tab>
 *     <Tab>Tab 3</Tab>
 *   </Tab.List>
 *   <Tab.Panels>
 *     <Tab.Panel>Content 1</Tab.Panel>
 *     <Tab.Panel>Content 2</Tab.Panel>
 *     <Tab.Panel>Content 3</Tab.Panel>
 *   </Tab.Panels>
 * </Tabs>
 */
export function Tabs(rawProps: TabsProps) {
  const registedOnChangeCallbacks: Set<(controller: TabsController) => void> = new Set()

  const { props, shadowProps, lazyLoadController } = useKitProps(rawProps, { name: 'Tabs' })

  const {
    calculateVariables: { defaultIndex: getDefaultIndexByValue, index: getIndexByValue },
    additionalController,
  } = useAbilityFeature_TabValue({
    props,
    currentIndex: () => selectedIndex(),
    setIndex: (...args) => selectTabByIndex(...args),
  })

  const getDefaultIndex = () =>
    'defaultSelectedIndex' in props && props.defaultSelectedIndex != null ? props.defaultSelectedIndex : undefined
  const getIndex = () => ('selectedIndex' in props ? props.selectedIndex : undefined)

  const [selectedIndex, selectTabByIndex] = createSyncSignal({
    defaultValue: () => getDefaultIndex() ?? getDefaultIndexByValue() ?? 0 /* defaultly focus on first one */,
    getValueFromOutside: () => getIndex() ?? getIndexByValue() ?? undefined /* defaultly focus on first one */,
    onInvokeSetter(value) {
      // Invokes all registered onChange callbacks with the current tabs controller.
      registedOnChangeCallbacks.forEach((cb) => cb(tabsController))
      props.onChange?.(tabsController)
    },
  })

  const registOnChangeCallbacks = (cb: (controller: TabsController) => void) => {
    registedOnChangeCallbacks.add(cb)
    return {
      unregister: () => {
        registedOnChangeCallbacks.delete(cb)
      },
    }
  }

  const tabsController: TabsController = mergeObjects(additionalController, {
    groupName: () => props.groupName,
    selectedIndex,
    selectTabByIndex,
    _onChange: registOnChangeCallbacks,
  })

  lazyLoadController(tabsController)
  return (
    <TabsControllerContext.Provider value={tabsController}>
      <Piv class='Tabs' shadowProps={shadowProps}>
        {props.children}
      </Piv>
    </TabsControllerContext.Provider>
  )
}

Tabs.List = TabList
Tabs.Tab = Tab
