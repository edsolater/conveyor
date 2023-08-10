// util: A more elegant compose function
// TODO: imply it !!!

import { AnyFn } from '@edsolater/fnkit'
import { Accessor, createMemo, createSignal } from 'solid-js'
import { mergeObjects } from '../piv'

// export function composeAPromisifyAction<T>({
//   action
// }: {
//   action: () => T | Promise<T> | void | Promise<T>
//   /** an additional helper to judge action is ongoing */
//   asyncActionIsEnd?(): boolean
// }): ActionSettings<T> {
//   return async () => {
//     const result = await action()
//     return result
//   }
// }

/**
 * @deprecated fnkit already has
 * @example
 * createObjectByGetters({ aa: () => 'hello' }) //=> { aa: 'hello' }
 */
export function createObjectByGetters<K extends keyof any, V>(getterDescroptions: Record<K, () => V>): Record<K, V> {
  return new Proxy(getterDescroptions, {
    get(target, p, receiver) {
      const rawGetter = Reflect.get(target, p, receiver)
      return rawGetter()
    },
  }) as Record<K, V>
}

type ActionHookStates<T> = {
  /** store fulfilled */
  result: Accessor<T | undefined>
  /** store rejected */
  error: Accessor<unknown>
  /** store run action time */
  runCount: Accessor<number>

  /** if is calculating, may no result yet */
  isCalculating: Accessor<boolean>
  /** if is result empty, has result */
  isResultEmpty: Accessor<boolean>
  /** if there is no error throwed. Even result is empty, result still can be valid */
  isResultValid: Accessor<boolean>
  /** there is error when calculating */
  isError: Accessor<boolean>
}

type ActionHookMethods<T> = {
  clearResult: () => void
  clearError: () => void
  /** turn the action end (will invoke the registed onCleanUpInEnd)  */
  endAction(): void
  /** currently going action's canContinue will be false */
  abortAction(): void
  /** will also invoke the registed onCleanUp */
  runAction(): Promise<T | void>
  loadSubscribeFn(subscriber: (picker: (result: T) => void) => void): void
}

export type ActionSignals<T> = ActionHookStates<T> & ActionHookMethods<T>

type ActionFunctionProvideParamsUtils<T> = {
  /** action result, maybe undefined */
  prevResult?: T
  /** everytime invoke the action run will increase one */
  runCount: number
  /** pause/resume cleanUp callback register */
  onAbortCleanUp(cb: AnyFn): void
  /** init/end cleanUp callback register */
  onEndCleanUp(cb: AnyFn): void

  loadSubscribeFn(subscriber: (picker: (result: T) => void) => void): void

  /**
   * when pause or end the task, canContinue will be false in all action task
   * when run another task, canContinue will be false in ongoing action
   */
  canContinue(): boolean
}

type ActionParamSettings<T> = {
  /** core */
  action: (utils: ActionFunctionProvideParamsUtils<T>) => Promise<T> | T | void | Promise<void>

  /** [Optional] lifecycle hook: run when init */
  onActionInit?(utils: ActionHookStates<T>): void
  /** [Optional] lifecycle hook: run on resume */
  onActionResume?(utils: ActionHookStates<T>): void
  /** [Optional] lifecycle hook: run on pause */
  onActionPause?(utils: ActionHookStates<T>): void
  /** [Optional] lifecycle hook: run in the end */
  onActionEnd?(utils: ActionHookStates<T>): void

  /** [Optional] helper for checking result state */
  checkResultIsEmpty?(result: T): boolean
  /** [Optional] helper for checking result state */
  checkResultIsValid?(result: T): boolean
}

/**
 * every action should have 4 states: isCalculating, isResultEmpty, isResultValid, isError
 * @param settings settings
 * @returns
 */
export function useAction<T>(settings: ActionParamSettings<T>): ActionSignals<T> {
  const [isCalculating, setIsCalculating] = createSignal(false)
  const [result, setResult] = createSignal<Awaited<T>>()
  const clearResult = () => setResult(undefined)
  const [error, setError] = createSignal<unknown>()
  const clearError = () => setError(undefined)
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

  type SubscribeFn = (picker: (result: T) => void) => void
  const loadSubscribeFn: (subscribeFn: SubscribeFn) => void = (subscribeFn: SubscribeFn) =>
    subscribeFn(async (result: T) => {
      const v = await result
      setResult(() => v)
    })

  // run count
  const [runCount, setRunCount] = createSignal(0)
  const genRunCount = () => {
    const newCount = runCount() + 1
    setRunCount(newCount)
    return newCount
  }

  const innerStatus = {
    result,
    error,
    runCount,
    isCalculating,
    isResultValid,
    isResultEmpty,
    isError,
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
  const invokeEndCleanUps = (...args: any[]) => endCleanUps.map((cb) => cb(...args))

  const abortAction = () => {
    setIsCalculating(false)
  }

  const runAction = async () => {
    const canContinue = () => true // TODO: action should can abort
    try {
      // run cleanUp
      invokeAbortCleanUps()
      clearRegistedAbortCleanUps()
      setIsCalculating(true)
      const count = genRunCount()

      const newResult = await (settings.onActionInit && count === 1
        ? settings.onActionInit?.(createObjectByGetters(innerStatus) as ActionHookStates<T>)
        : settings.action({
            get prevResult() {
              return result()
            },
            get runCount() {
              return count
            },
            canContinue,
            onAbortCleanUp: registAbortCleanUp,
            onEndCleanUp: registEndCleanUp,
            loadSubscribeFn,
          }))
      setError(undefined)
      if (newResult) setResult(() => newResult)
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
  const innerMethods = {
    clearError,
    clearResult,
    runAction,
    endAction,
    abortAction,
    loadSubscribeFn,
  }
  const all = mergeObjects(innerStatus, innerMethods)
  return all
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
