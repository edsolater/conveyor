import { AnyFn, isFunction, isSymbol, mergeFunction } from '@edsolater/fnkit'
import { PivProps } from '../Piv'

/**
 * invoke only once, return the cached result when invoke again
 */
//TODO: imply feature: same input have same output
// TEMP fnkit already have this function
function createCachedFunction<F extends AnyFn>(fn: F): F {
  let cachedResult: ReturnType<F> | undefined = undefined
  return function (...args: Parameters<F>) {
    if (cachedResult == null) {
      cachedResult = fn(...args)
    }
    return cachedResult
  } as F
}

/** as will only calculate props when access, so, return verbose big object is ok */
export function handleMergifyOnCallbackProps<P extends Partial<PivProps<any>>>(
  props: P
): P /* no need type too accurately */ {
  if (props.children === 'PropContext can pass to deep nested components') {
    console.log('props raw: ', {...props},props.onClick, props['merge:onClick'], props.shadowProps?.onClick, props.shadowProps?.['merge:onClick'])
  }
  const getProps = (key: keyof any) => {
    if (isSymbol(key)) return props[key]
    const propsValue = props[key]
    const toBeMergePropValue = props[`merge:${key}`]
    if (isFunction(toBeMergePropValue) && isFunction(propsValue)) {
      const mergedValue = mergeFunction(toBeMergePropValue, propsValue)
      return mergedValue
    } else {
      return propsValue ?? toBeMergePropValue
    }
  }
  const getOwnKeys = createCachedFunction(() => {
    const keysArray = Object.getOwnPropertyNames(props).map((key) => (key.startsWith('merge:') ? key.slice(6) : key))
    console.log('keysArray: ', keysArray)
    const keys = new Set(keysArray)
    const uniqueKeys = Array.from(keys)
    return { set: keys, arr: uniqueKeys }
  })
  const hasAnyMergeProp = createCachedFunction(() =>
    Object.getOwnPropertyNames(props).some((key) => key.startsWith('merge:'))
  )
  return hasAnyMergeProp()
    ? (console.log('props: ', { ...props }),
      new Proxy({} as P, {
        get: (_target, key) => getProps(key),
        has: (_target, key) => getOwnKeys().set.has(key as string),
        set: (_target, key, value) => Reflect.set(_target, key, value),
        ownKeys: () => getOwnKeys().arr,
        // for Object.keys to filter
        getOwnPropertyDescriptor: (_target, key) => ({
          enumerable: true,
          configurable: true,
          get: () => getProps(key),
        }),
      }))
    : props
}

/**
 * @example
 * MergifyProps<{ a: string; b: number; onA: () => void; onB: () => void }> //=> { a: string; b: number; onA: () => void; onB: () => void; "merge:onA"?: () => void; "merge:onB"?: () => void }
 */
export type MergifyProps<P> = P & {
  [K in Extract<keyof P, `on${string}`> as `merge:${K}`]?: P[K]
}
