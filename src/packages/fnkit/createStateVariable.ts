import { createEventCenter } from '@edsolater/fnkit'

type StateVariable<T> = {
  /** get current state */
  (): T

  /** used by consumer */
  onChange(cb: (newValue: T) => void): { unsubscribe(): void }

  clearAllSubscribed(): void

  /** used by provider */
  setValue(newValue: T | ((prev: T) => T)): void
}

/**
 * hold value, so can subscribe it's change
 */
export function createStateVariable<T>(): StateVariable<T | undefined>
export function createStateVariable<T>(defaultValue: T): StateVariable<T>
export function createStateVariable<T>(defaultValue?: T): StateVariable<any> {
  let innerValue: T | undefined = defaultValue
  const eventCenter = createEventCenter<{
    onValueSet(value: T): void
  }>()
  return {
    onChange(cb: (newValue: T) => void) {
      return eventCenter.on('onValueSet', cb)
    },
  }
}
