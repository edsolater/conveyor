import { isNumber } from '@edsolater/fnkit'
import { Accessor, createContext, createMemo, createSignal } from 'solid-js'
import { KitProps, useKitProps } from '../../createKit'
import { createSyncSignal } from '../../hooks/createSyncSignal'
import { Piv } from '../../piv/Piv'
import { ValidController } from '../../piv/typeTools'
import { TabList } from './TabList'
import { Tab } from './Tab'

export interface TabsController {
  /** tabs group name */
  groupName: Accessor<string | undefined>
  /** all tab items */
  tabValues: Accessor<string[]>

  tabIndex: Accessor<number>
  /** only works when target tab name can match */
  tabValue: Accessor<string | undefined>

  /**
   * method
   */
  setSelectedTabIndex(index: number): void

  /**
   * method
   * only works when target tab name can match
   */
  setSelectedTabValue(value: string): void

  /**
   * inner method
   * invoked by `Tab` component
   */
  _addTabValue(value: string): void

  /**
   * inner method
   * invoked by `Tab` component
   * register method
   */
  _onChange(cb: (controller: TabsController) => void): { unregister(): void }
}

export type TabsProps<Controller extends ValidController = TabsController> = KitProps<
  {
    /** recommand  */
    groupName?: string

    selectedIndex?: number
    defaultSelectedIndex?: number

    /** only works when target tab name can match */
    selectedValue?: string
    /** only works when target tab name can match */
    defaultSelectedValue?: string

    onChange?(controller: TabsController): void
  },
  { controller: Controller }
>

const TabsControllerContextDefaultValue: TabsController = {
  groupName: () => undefined,
  tabIndex: () => 0,
  tabValues: () => [],
  tabValue: () => undefined,
  setSelectedTabIndex: () => {},
  setSelectedTabValue: () => {},
  _addTabValue: () => {},
  _onChange: () => ({ unregister: () => {} }),
}
export const TabsControllerContext = createContext<TabsController>(TabsControllerContextDefaultValue)

/**
 * abilities:
 * - select tab2 will auto unselect tab1
 * 
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
  const { props, shadowProps, lazyLoadController } = useKitProps(rawProps)

  const getTabItemIndexByValues = (value: string) => tabItemValues().findIndex((v) => v === value)

  const [tabItemValues, setTabItemValues] = createSignal<string[]>([])

  function addTabValue(tabValue: string) {
    setTabItemValues((prev) => [...prev, tabValue])
  }

  const [selectedTabIndex, setActiveTabIndex] = createSyncSignal({
    defaultValue: () =>
      'defaultSelectedIndex' in props && props.defaultSelectedIndex != null
        ? props.defaultSelectedIndex
        : 0 /* defaultly focus on first one */,
    getValueFromOutside: () =>
      'selectedIndex' in props
        ? props.selectedIndex
        : 'selectedValue' in props && props.selectedValue
        ? getTabItemIndexByValues(props.selectedValue) ?? undefined
        : undefined /* defaultly focus on first one */,
    onInvokeSetter(value) {
      invokeOnChangeCallbacks()
    },
  })

  // an alertive of `activeTabIndex`
  const selectedTabValue = createMemo(() => tabItemValues().at(selectedTabIndex()))

  function invokeOnChangeCallbacks() {
    registedOnChangeCallbacks.forEach((cb) => cb(tabsController))
    props.onChange?.(tabsController)
  }

  // an alertive of `setActiveTabIndex`
  function setActiveTabValue(value: string) {
    const idx = getTabItemIndexByValues(value)
    if (isNumber(idx)) setActiveTabIndex(idx)
  }

  const registOnChangeCallbacks = (cb: (controller: TabsController) => void) => {
    registedOnChangeCallbacks.add(cb)
    return {
      unregister: () => {
        registedOnChangeCallbacks.delete(cb)
      },
    }
  }

  const tabsController: TabsController = {
    groupName: () => props.groupName,
    tabValues: tabItemValues,
    tabIndex: selectedTabIndex,
    tabValue: selectedTabValue,
    setSelectedTabIndex: setActiveTabIndex,
    setSelectedTabValue: setActiveTabValue,
    _addTabValue: addTabValue,
    _onChange: registOnChangeCallbacks,
  }

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
