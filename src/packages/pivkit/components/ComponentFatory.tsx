import { isFunction, isObject, map } from '@edsolater/fnkit'
import { JSX, createMemo } from 'solid-js'
import { Box } from './Boxes'

/** a special component for creating element tree by pure js data
 *
 * @todo: how to turn pure object tree to component tree ?
 */
export function ComponentFatory(props: {
  data: any
  /**
   * JSXElement ----> render a JSXElement \
   * object or array ----> pass through the factory function again \
   * primitive value ----> render in original jsx rule
   */
  widgetCreateRule: (
    value: any,
    key: string | number | symbol | undefined
  ) => JSX.Element | any /* value */ | undefined | void
}) {
  function parseData(
    obj: any,
    key: string | number | symbol | undefined,
    mapFn: (value: any, key: string | number | symbol | undefined) => JSX.Element | any /* value */ | undefined | void
  ) {
    const mayComponent = mapFn(obj, key)
    return isFunction(mayComponent) ? (
      mayComponent(obj)
    ) : isObject(mayComponent) ? (
      <Box>{Object.entries(obj).map(([key, value]) => parseData(value, key, mapFn))}</Box>
    ) : (
      mayComponent
    )
  }

  function generateComponentByValue(
    value: any,
    key: string | number | symbol | undefined,
    mapFn: (value: any, key: string | number | symbol | undefined) => JSX.Element | any /* value */ | undefined | void
  ) {
    return mapFn?.(value, key)
  }

  const tree = createMemo(() => parseData(props.data, undefined, props.widgetCreateRule))
  return <>{tree()}</>
}

function isJSXElement(v: any): v is JSX.Element {
  return isObject(v) && v.type !== undefined
}
