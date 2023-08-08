import { isArray } from '@edsolater/fnkit'
import { Accessor, createMemo, createSignal } from 'solid-js'

export type ResultLoaderSignals<T> = {
  result: Accessor<T | undefined>
  error: Accessor<unknown>

  /** if is calculating, may no result yet */
  isCalculating: Accessor<boolean>
  /** if is result empty, has result */
  isResultEmpty: Accessor<boolean>
  /** if there is no error throwed. Even result is empty, result still can be valid */
  isResultValid: Accessor<boolean>
  /** there is error when calculating */
  isError: Accessor<boolean>

  run: () => Promise<T>
}

/**
 * every action should have 4 states: isCalculating, isResultEmpty, isResultValid, isError
 * @param settings settings
 * @returns
 */
export function createResultActionStateSignals<T>(settings: {
  willCleanResultWhenCalculating?: boolean
  actionFn: (prevResult?: T) => Promise<T> | T
  checkResultIsEmpty?: (result: T) => boolean
  checkResultIsValid?: (result: T) => boolean
}): ResultLoaderSignals<T> {
  const [isCalculating, setIsCalculating] = createSignal(false)
  const [result, setResult] = createSignal<Awaited<T>>()
  const [error, setError] = createSignal<unknown>()
  const isResultValid = createMemo(() => {
    const v = result()
    if (v === undefined) return false
    return settings.checkResultIsValid ? settings.checkResultIsValid(v) : !isEmpty(v)
  })
  const isResultEmpty = createMemo(() => {
    const v = result()
    if (v === undefined) return true
    return settings.checkResultIsEmpty ? settings.checkResultIsEmpty(v) : isEmpty(v)
  })
  const isError = createMemo(() => !isCalculating() && !!error())
  const run = async () => {
    try {
      if (settings.willCleanResultWhenCalculating) {
        setResult(undefined)
      }
      setIsCalculating(true)
      const newResult = await settings.actionFn(result())
      setError(undefined)
      setResult(() => newResult)
      return newResult
    } catch (err) {
      setError(err)
      throw err
    } finally {
      setIsCalculating(false)
    }
  }
  return { isCalculating, isResultValid, result, isResultEmpty, isError, error, run }
}

function isEmpty(v: unknown) {
  return (
    v === undefined ||
    v === null ||
    v === '' ||
    (isArray(v) && v.length === 0) ||
    (typeof v === 'object' && Object.keys(v).length === 0)
  )
}
