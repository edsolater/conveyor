import { createEventCenter } from '@edsolater/fnkit'

type State<T> = {
  /**
   * get current state
   * can also just access property:value. `state.value`
   */
  (): T
  /**
   * get current state
   * can also just invoke this state. `state()`
   */
  value: T

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
export function createState<T>(): State<T | undefined>
export function createState<T>(defaultValue: T): State<T>
export function createState<T>(defaultValue?: T): State<any> {
  let innerValue = defaultValue
  const eventCenter = createEventCenter<{
    value(v: T): void
  }>()
  const state = Object.assign(() => innerValue, {
    onChange(cb: (newValue: T) => void) {
      return eventCenter.on('value', cb)
    },
    clear() {
      eventCenter.clear('value')
    },
    emitValue(newValue: T | ((prev: T) => T)) {
      if (typeof newValue === 'function') {
        innerValue = (newValue as (prev: T) => T)(innerValue as T)
      } else {
        innerValue = newValue
      }
      eventCenter.emit('value', [innerValue])
    },
    get value() {
      return innerValue
    },

    [Symbol.toPrimitive]() {
      return innerValue
    },
  })
  return state
}
