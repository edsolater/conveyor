import { Accessor, createMemo, createSignal } from 'solid-js'
import { Accessify } from '../utils'

export type ResultLoaderSignals<T> = {
  result: Accessor<T | undefined>
  isCalculating: Accessor<boolean>
  isResultEmpty: Accessor<boolean>
  /** if there is no error throwed */
  hasNormalResult: Accessor<boolean>
  /** there is error when calculating */
  isError: Accessor<boolean>
  error: Accessor<unknown>
  execute: () => Promise<T>
}
export function createResultLoaderSignals<T>(utils: {
  willCleanResultWhenCalculating?: boolean
  loadMethod: (prevResult?: T) => Promise<T> | T
  checkResultIsEmpty?: (result: T) => boolean
  checkResultIsValid?: (result: T) => boolean
}): ResultLoaderSignals<T> {
  const [resultError, setResultError] = createSignal<unknown>()
  const [isCalculating, setIsCalculating] = createSignal(false)
  const [result, setResult] = createSignal<T>()
  const [hasResultLoaded, setHasResultLoaded] = createSignal(false)
  const isResultEmpty = createMemo(() => {
    const v = resultError() ? undefined : result()
    // TO be continue
    return utils.checkResultIsEmpty ? utils.checkResultIsEmpty(v) : !v
  })

  return { isCalculating, hasNormalResult: hasResultLoaded, result }
}
