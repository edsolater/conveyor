import { AnyFn, isFunction, map } from '@edsolater/fnkit'
import { Accessor, untrack } from 'solid-js'

/**
 * get accessor's current value
 * @param accessor original solidjs signal
 * @returns current value
 */
export function getAccessorValue<T>(accessor: Accessor<T>): T {
  return untrack(accessor)
}

export type DeAccessorObject<O extends Record<string, unknown>> = {
  [K in keyof O]: O[K] extends undefined ? undefined : O[K] extends AnyFn ? ReturnType<NonNullable<O[K]>> : O[K]
}

export function deAccessorObject<O extends Record<string, unknown>>(
  accessorObject: O
): DeAccessorObject<O> {
  return map(accessorObject, (v) => (isFunction(v) ? untrack(v) : v)) as DeAccessorObject<O>
}
