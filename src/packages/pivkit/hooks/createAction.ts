// util: A more elegant compose function
// TODO: imply it !!!

import { AnyFn, mergeObjects } from '@edsolater/fnkit'
import { Accessor, createMemo, createSignal } from 'solid-js'

/**
 * @todo: just merge to useAction
 * a wrapper of hook: createAction
 * @param richSettings options
 * @returns can directly pass to useAction
 */
export function useActionFromUnreturnedFunctions<T>(richSettings: ActionParamSettings<T>): ActionSignals<T> & {
  finishActionDetector(result: T): void
} {
  let loadResult: (result: T) => void
  let throwError: (reason?: unknown) => void

  const wrappedAction = (...args: Parameters<ActionParamSettings<T>['action']>) => {
    richSettings.action(...args)
    return new Promise<T>((resolve, reject) => {
      loadResult = resolve
      throwError = reject
    })
  }
  const controllers = createAction({ ...richSettings, action: wrappedAction })

  return mergeObjects(controllers, {
    finishActionDetector(result: T) {
      loadResult(result)
    },
  })
}

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
  end(): void
  /** currently going action's canContinue will be false */
  pause(): void
  /** will also invoke the registed onCleanUp */
  run(): Promise<T | undefined | void>

  /** load result from outside; will also end pending action */
  loadResult(result: T): void
}

export type ActionSignals<T> = ActionHookStates<T> & ActionHookMethods<T>

type ActionFunctionProvideParamsUtils<T> = {
  /** action result, maybe undefined */
  prevResult?: T
  /**
   * when pause or end the task, canContinue will be false in all action task
   * when run another task, canContinue will be false in ongoing action
   */
  canContinue(): boolean
  /** everytime invoke the action run will increase one */
  runCount: number

  /** pause/resume cleanUp callback register */
  onAbortCleanUp(cb: AnyFn): void
  /** init/end cleanUp callback register */
  onEndCleanUp(cb: AnyFn): void
}

type ActionParamSettings<T> = {
  /** core */
  action: (utils: ActionFunctionProvideParamsUtils<T>) => Promise<T> | T | void | Promise<void>

  /** lifecycle hook: run when init */
  onActionBegin?(utils: ActionSignals<T>): void
  /** lifecycle hook: run on resume */
  onActionResume?(utils: ActionSignals<T>): void // TODO: imply it
  /** lifecycle hook: run on pause */
  onActionPause?(utils: ActionSignals<T>): void // TODO: imply it
  /** lifecycle hook: run in the end */
  onActionEnd?(utils: ActionSignals<T>): void // TODO: imply it

  /** helper for checking result state */
  checkResultIsEmpty?(result: T): boolean
  /** helper for checking result state */
  checkResultIsValid?(result: T): boolean
}

/**
 * every action should have 4 states: isCalculating, isResultEmpty, isResultValid, isError
 * @param settings settings
 * @returns
 */
export function createAction<T>(settings: ActionParamSettings<T>): ActionSignals<T> {
  const [result, setResult] = createSignal<T>()
  const [error, setError] = createSignal<unknown>()
  const clearResult = () => setResult(undefined)
  const clearError = () => setError(undefined)

  const [isCalculating, setIsCalculating] = createSignal(false)
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

  const pause = () => {
    setIsCalculating(false)
  }

  const loadResult = (result: T) => setResult(() => result)

  const run = async () => {
    const canContinue = () => true // TODO: action should can abort
    try {
      // run cleanUp
      invokeAbortCleanUps()
      clearRegistedAbortCleanUps()
      setIsCalculating(true)
      const count = genRunCount()

      // invoke lifecycle hook
      if (count === 1) {
        //@ts-expect-error  type for solidjs  is not good enough currently
        settings.onActionBegin?.(mergeObjects(createObjectByGetters(innerStatus), innerMethods))
      }

      const returnedResult = await settings.action({
        get prevResult() {
          return result()
        },
        get runCount() {
          return count
        },
        canContinue,
        onAbortCleanUp: registAbortCleanUp,
        onEndCleanUp: registEndCleanUp,
      })
      setError(undefined)
      //@ts-expect-error void should can be treated as undefined
      setResult(() => returnedResult)
      return returnedResult
    } catch (err) {
      setError(err)
      throw err
    } finally {
      setIsCalculating(false)
    }
  }
  const end = () => {
    invokeEndCleanUps()
    clearRegistedEndCleanUps()
  }
  const innerMethods = {
    clearError,
    clearResult,
    run,
    end,
    pause,
    loadResult,
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
