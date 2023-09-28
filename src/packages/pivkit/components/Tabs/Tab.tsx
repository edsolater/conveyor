import { Accessor, createEffect, createMemo, createSignal, useContext } from 'solid-js'
import { KitProps, useKitProps } from '../../createKit'
import { createDomRef } from '../../hooks'
import { Piv } from '../../piv/Piv'
import { ValidController } from '../../piv/typeTools'
import { TabsControllerContext } from './Tabs'
import { isNumber } from '@edsolater/fnkit'

export interface TabController {
  selected: Accessor<boolean>
}

export type TabProps<Controller extends ValidController = TabController> = KitProps<
  {
    value?: string
  },
  { controller: Controller }
>

/**
 * contain `Tab` components
 */
export function Tab(rawProps: TabProps) {
  const [currentIndex, setCurrentIndex] = createSignal<number>()
  const { dom, setDom } = createDomRef()
  const { props, shadowProps, lazyLoadController } = useKitProps(rawProps)
  const tabsController = useContext(TabsControllerContext)
  const selected = createMemo(() => tabsController.selectedTabIndex() === currentIndex())

  const tabController: TabController = { selected }
  lazyLoadController(tabController)

  // add tab value to `Tabs` controller
  createEffect(() => {
    if (props.value) {
      tabsController._addTabValue(props.value)
    }
  })

  // get element index in parent node
  createEffect(() => {
    const el = dom()
    if (!el) return
    el.setAttribute('aria-selected', String(selected()))
    const siblings = el.parentElement?.children
    if (!siblings) return
    const currentIndexOfParentNode = Array.from(siblings).indexOf(el)
    if (currentIndexOfParentNode === -1) return
    setCurrentIndex(currentIndexOfParentNode)
  })

  return (
    <Piv
      class='Tabs-Tab'
      shadowProps={shadowProps}
      onClick={() => {
        const idx = currentIndex()
        if (isNumber(idx)) tabsController.setSelectedTabIndex(idx)
      }}
      icss={{ cursor: 'pointer' }}
      domRef={setDom}
    >
      {props.children}
    </Piv>
  )
}
