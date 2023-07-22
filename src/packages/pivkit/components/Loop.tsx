import { MayFn, flap, shrinkFn } from '@edsolater/fnkit'
import { For, JSXElement, createMemo } from 'solid-js'
import { KitProps, Piv, useKitProps } from '../../piv'
import { createRef } from '../hooks/createRef'

export interface LoopController {}

export type LoopProps<T> = KitProps<
  {
    of?: MayFn<Iterable<T>>
    children(item: T, index: () => number): JSXElement
  },
  { controller: LoopController }
>

/**
 * just a wrapper of <For>, very simple
 * if for layout , don't render important content in Box
 */
export function Loop<T>(rawProps: LoopProps<T>) {
  const { props } = useKitProps(rawProps, {
    noNeedDeAccessifyChildren: true,
  })

  // [configs]
  const allItems = createMemo(() => flap([...(shrinkFn(props.of) ?? [])]))

  // [loop ref]
  const [loopRef, setRef] = createRef<HTMLElement>()

  const renderLoopItems = (item: T, idx: () => number) => {
    return <>{() => props.children(item, idx)}</>
  }
  return (
    <Piv class='Loop' domRef={setRef} shadowProps={props} icss={{ overflow: 'auto', contain: 'paint' }}>
      <For each={allItems()}>{renderLoopItems}</For>
    </Piv>
  )
}
