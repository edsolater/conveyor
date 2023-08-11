import { Accessor, untrack } from 'solid-js'

/**
 * get accessor's current value
 * @param accessor original solidjs signal
 * @returns current value
 */
export function getAccessorValue<T>(accessor: Accessor<T>): T {
  return untrack(() => accessor())
}
