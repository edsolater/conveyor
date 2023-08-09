import { AnyFn } from '@edsolater/fnkit'
import { Accessor, createMemo, createSignal } from 'solid-js'

export type ActionStateSignals<T> = {
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

  /** turn the action end (will invoke the registed onCleanUpInEnd)  */
  endAction(): void
  /** currently going action's canContinue will be false */
  abortAction(): void
  /** will also invoke the registed onCleanUp */
  runAction(): Promise<T>
  runCount: Accessor<number>
}

type ActionSettings<T> = {
  willCleanResultWhenCalculating?: boolean
  actionFn: (utils: {
    prevResult?: Awaited<T> | undefined
    // each time run will increase one
    runCount: number
    onAbortCleanUp(cb: AnyFn): void
    onEndCleanUp(cb: AnyFn): void
    /** when abort/run another task, canContinue will be false */
    canContinue(): boolean
  }) => Promise<T> | T
  checkResultIsEmpty?: (result: T) => boolean
  checkResultIsValid?: (result: T) => boolean
}

/**
 * every action should have 4 states: isCalculating, isResultEmpty, isResultValid, isError
 * @param settings settings
 * @returns
 */
export function createAction<T>(settings: ActionSettings<T>): ActionStateSignals<T> {
  const [isCalculating, setIsCalculating] = createSignal(false)
  const [result, setResult] = createSignal<Awaited<T>>()
  const [error, setError] = createSignal<unknown>()
  const isResultValid = createMemo(() => {
    const v = result()
    if (v === undefined) return false
    return settings.checkResultIsValid ? settings.checkResultIsValid(v) : true
  })
  const isResultEmpty = createMemo(() => {
    const v = result()
    if (v === undefined) return true
    return settings.checkResultIsEmpty ? settings.checkResultIsEmpty(v) : isEmpty(v)
  })
  const isError = createMemo(() => !isCalculating() && !!error())

  const [runCount, setRunCount] = createSignal(0)
  const genRunCount = () => {
    const newCount = runCount() + 1
    setRunCount(newCount)
    return newCount
  }

  // abort clean ups
  const abortCleanUps = [] as AnyFn[]
  const registAbortCleanUp = (cb: AnyFn) => {
    abortCleanUps.push(cb)
  }
  const clearRegistedAbortCleanUps = () => {
    abortCleanUps.splice(0, abortCleanUps.length)
  }
  const invokeAbortCleanUps = (...args: any[]) => {
    return abortCleanUps.map((cb) => cb(...args))
  }

  // end clean ups
  const endCleanUps = [] as AnyFn[]
  const registEndCleanUp = (cb: AnyFn) => {
    endCleanUps.push(cb)
  }
  const clearRegistedEndCleanUps = () => {
    endCleanUps.splice(0, endCleanUps.length)
  }
  const invokeEndCleanUps = (...args: any[]) => {
    return endCleanUps.map((cb) => cb(...args))
  }

  const abortAction = () => {
    setIsCalculating(false)
  }

  const runAction = async () => {
    const canContinue = () => true // TODO
    try {
      if (settings.willCleanResultWhenCalculating) {
        setResult(undefined)
      }
      // run cleanUp
      invokeAbortCleanUps()
      clearRegistedAbortCleanUps()
      setIsCalculating(true)
      const newResult = await settings.actionFn({
        get prevResult() {
          return result()
        },
        canContinue,
        onAbortCleanUp: registAbortCleanUp,
        onEndCleanUp: registEndCleanUp,
        runCount: genRunCount(),
      })
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
  const endAction = () => {
    invokeEndCleanUps()
    clearRegistedEndCleanUps()
  }
  return {
    isCalculating,
    isResultValid,
    result,
    isResultEmpty,
    isError,
    error,
    runAction,
    endAction,
    runCount,
    abortAction,
  }
}

function isEmpty(v: unknown) {
  return (
    v === undefined ||
    v === null ||
    v === '' ||
    (Array.isArray(v) && v.length === 0) ||
    (typeof v === 'object' && Object.keys(v).length === 0)
  )
}
