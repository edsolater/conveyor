import { createEventCenter } from '@edsolater/fnkit'

type StateVariable<T> = {
  /** get current state */
  currentValue: T

  /** used by consumer */
  onChange(cb: (newValue: T) => void): { unsubscribe(): void }

  clear(): void

  /** used by provider */
  emitValue(newValue: T | ((prev: T) => T)): void

  [Symbol.toPrimitive](hint: 'number' | 'string' | 'default'): T | null
}

/**
 * hold value, so can subscribe it's change
 */
export function createStateVariable<T>(): StateVariable<T | undefined>
export function createStateVariable<T>(defaultValue: T): StateVariable<T>
export function createStateVariable<T>(defaultValue?: T): StateVariable<any> {
  let innerValue: T | undefined = defaultValue
  const eventCenter = createEventCenter<{
    valueSet(value: T): void
  }>()
  return {
    onChange(cb: (newValue: T) => void) {
      return eventCenter.on('valueSet', cb)
    },
    clear() {
      eventCenter.clear('valueSet')
    },
    emitValue(newValue: T | ((prev: T) => T)) {
      if (typeof newValue === 'function') {
        innerValue = (newValue as (prev: T) => T)(innerValue as T)
      } else {
        innerValue = newValue
      }
      eventCenter.emit('valueSet', [innerValue])
    },
    get currentValue() {
      return innerValue
    },

    [Symbol.toPrimitive](hint) {
      return innerValue
    },
  }
}
