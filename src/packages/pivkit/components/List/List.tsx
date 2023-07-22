import { MayFn, flap, isArray, shrinkFn } from '@edsolater/fnkit'
import {
  Accessor,
  createContext,
  createEffect,
  createMemo,
  createSignal,
  For,
  JSXElement,
  on,
  onCleanup,
  Show,
} from 'solid-js'
import { KitProps, Piv, PivProps, useKitProps } from '../../../piv'
import { createRef } from '../../hooks/createRef'
import { ObserveFn, useIntersectionObserver } from '../../hooks/useIntersectionObserver'
import { useScrollDegreeDetector } from '../../hooks/useScrollDegreeDetector'
import { Accessify } from '../../utils/accessifyProps'
import { ListItem } from './ListItem'

export interface ListController {}

export type ListProps<T> = KitProps<
  {
    of?: MayFn<Iterable<T>>
    children(item: T, index: () => number): JSXElement

    turnOnScrollObserver?: boolean

    /**
     * only meaningfull when turnOnScrollObserver is true
     * @default 30
     */
    increaseRenderCount?: number
    /**
     * only meaningfull when turnOnScrollObserver is true
     * @default 30
     * can accept Infinity
     */
    initRenderCount?: number
    /**
     * only meaningfull when turnOnScrollObserver is true
     * @default 50(px)
     */
    reachBottomMargin?: number
  },
  {
    controller: ListController
  }
>

export interface InnerListContext {
  observeFunction?: ObserveFn<HTMLElement>
  renderItemLength?: Accessor<number>
}

export const ListContext = createContext<InnerListContext>({} as InnerListContext, { name: 'ListController' })

/**
 * if for layout , don't render important content in Box
 */
export function List<T>(rawProps: ListProps<T>) {
  const { props } = useKitProps(rawProps, {
    noNeedDeAccessifyChildren: true,
    defaultProps: {
      reachBottomMargin: 50,
    },
  })

  // [configs]
  const allItems = createMemo(() => flap([...(shrinkFn(props.of) ?? [])]))
  const increaseRenderCount = createMemo(
    () => props.increaseRenderCount ?? Math.min(Math.floor(allItems().length / 10), 30)
  )
  const initRenderCount = createMemo(() => props.initRenderCount ?? Math.min(allItems().length, 50))

  // [list ref]
  const [listRef, setRef] = createRef<HTMLElement>()

  // [add to context, this observer can make listItem can auto render or not]
  const { observe } = useIntersectionObserver({
    rootRef: listRef,
    options: { rootMargin: '100%' },
    disabled: !props.turnOnScrollObserver,
  })

  // [actually showed item count]
  const [renderItemLength, setRenderItemLength] = createSignal(
    props.turnOnScrollObserver ? initRenderCount() : Infinity
  )

  // [scroll handler]
  const { forceCalculate } = useScrollDegreeDetector(listRef, {
    onReachBottom: () => {
      setRenderItemLength((n) => n + increaseRenderCount())
    },
    reachBottomMargin: props.reachBottomMargin,
    disabled: !props.turnOnScrollObserver,
  })
  createEffect(() => {
    console.log(3, listRef())
    console.count('render list')
  })

  // reset when items.length changed
  createEffect(
    on(
      () => allItems().length,
      () => {
        setRenderItemLength(initRenderCount())
        console.log('1: ', allItems(), listRef())
        forceCalculate()
      }
    )
  )
  const renderListItems = (item: T, idx: () => number) => {
    // console.count('render item children in <For>')
    return (
      <Show when={checkNeedRenderByIndex(idx(), renderItemLength())}>
        <ListItem forceVisiable={!props.turnOnScrollObserver}>{() => props.children(item, idx)}</ListItem>
      </Show>
    )
  }
  return (
    <ListContext.Provider value={{ observeFunction: observe, renderItemLength }}>
      <Piv class='List' domRef={setRef} shadowProps={props} icss={{ overflow: 'auto', contain: 'paint' }}>
        <For each={allItems()}>{renderListItems}</For>
      </Piv>
    </ListContext.Provider>
  )
}

/**
 * render may be not visiable
 */
function checkNeedRenderByIndex(idx: number | undefined, renderItemLength: number | undefined) {
  if (idx == null) return false
  if (renderItemLength == null) return false
  return idx <= renderItemLength
}
