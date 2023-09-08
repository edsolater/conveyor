import { isFunction, isObject, map } from '@edsolater/fnkit'
import { JSX, createEffect, createMemo, mapArray } from 'solid-js'
import { Box } from './Boxes'
import { unwrap } from 'solid-js/store'

/** a special component for creating element tree by pure js data
 *
 * @todo: how to turn pure object tree to component tree ?
 */
export function ComponentFatory(props: {
  data: object
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
  const store = props.data
  const unwrapedStore = unwrap(store)
  function parseData(
    mapFn: (value: any, key: string | number | symbol | undefined) => JSX.Element | any /* value */ | undefined | void,
    currentPath: (string | number | symbol)[] = []
  ) {
    console.log('t: ', Reflect.get(['hello'], '0'))
    const currentTarget = getByPath(unwrapedStore, currentPath)
    const currentKey = currentPath.at(-1)
    const mayComponent = mapFn(currentTarget, currentKey)
    if (isFunction(mayComponent)) {
      const value = () => getByPath(store, currentPath)
      return mayComponent(value)
    } else if (isObject(mayComponent)) {
      return <Box>{Object.entries(currentTarget).map(([key, value]) => parseData(mapFn, currentPath.concat(key)))}</Box>
    } else {
      return mayComponent
    }
  }

  function generateComponentByValue(
    value: any,
    key: string | number | symbol | undefined,
    mapFn: (value: any, key: string | number | symbol | undefined) => JSX.Element | any /* value */ | undefined | void
  ) {
    return mapFn?.(value, key)
  }

  const tree = createMemo(() => parseData(props.widgetCreateRule))
  createEffect(() => {
    console.log('props.data: ', props.data)
  })
  createEffect(() => {
    console.log('props.widgetCreateRule: ', props.widgetCreateRule)
  })
  return <>{parseData(props.widgetCreateRule)}</>
}

function getByPath(obj: object, path: (string | number | symbol)[]) {
  let currentObj = obj
  for (const key of path) {
    if (!isObject(currentObj)) break
    currentObj = currentObj[key]
  }
  return currentObj
}

function isJSXElement(v: any): v is JSX.Element {
  return isObject(v) && v.type !== undefined
}
