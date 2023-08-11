import { AnyFn, mergeObjects, createObjectByGetters } from '@edsolater/fnkit'
import { Accessor, createMemo, createSignal, untrack } from 'solid-js'
import { getAccessorValue } from '../utils/parseAccessorWithoutTrack'

type ActionPhase = 'before-init' | 'running' | 'paused' | 'end' | 'idle' /* (after-run) */

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

  /** core action: **load result from outside; will also end pending action** */
  loadResult(result: T): void
  /** core action: **load result from outside; will also end pending action** */
  loadError(reason?: unknown): void
}

export type ActionSignals<T> = ActionHookStates<T> & ActionHookMethods<T>

type ActionCoreFunctionProvideParamsUtils<T> = {
  /** action result, maybe undefined */
  prevResult?: T
  /** before runAction  */
  prevPhase: ActionPhase

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
  /** core action, usually this action is async */
  action: (utils: ActionCoreFunctionProvideParamsUtils<T>) => Promise<T | void>

  /** lifecycle hook: run when init */
  onActionBegin?(utils: ActionSignals<T>): void
  /** lifecycle hook: run on resume */
  onActionResume?(utils: ActionSignals<T>): void
  /** lifecycle hook: run on pause */
  onActionPause?(utils: ActionSignals<T>): void
  /** lifecycle hook: run in the end */
  onActionEnd?(utils: ActionSignals<T>): void

  /** helper for checking result state */
  checkResultIsEmpty?(result: T | undefined): boolean
  /** helper for checking result state */
  checkResultIsValid?(result: T | undefined): boolean
}

/**
 * every action should have 4 states: isCalculating, isResultEmpty, isResultValid, isError
 *
 * core method is `settings:action`(for returned action) and `returnController:loadResult`(for unreturned action)
 *
 * @param settings settings
 * @returns
 */
export function createAction<T>(settings: ActionParamSettings<T>): ActionSignals<T> {
  const [currentPhase, setCurrentPhase] = createSignal<ActionPhase>('before-init')
  const [result, setResult] = createSignal<T>()
  const [error, setError] = createSignal<unknown>()
  const clearResult = () => setResult(undefined)
  const clearError = () => setError(undefined)

  const [isCalculating, setIsCalculating] = createSignal(false)
  const isResultValid = createMemo(() => {
    const v = result()
    return settings.checkResultIsValid ? settings.checkResultIsValid(v) : v !== undefined
  })
  const isResultEmpty = createMemo(() => {
    const v = result()
    return settings.checkResultIsEmpty ? settings.checkResultIsEmpty(v) : isEmpty(v)
  })
  const isError = createMemo(() => !isCalculating() && !!error())

  //--- run count
  const [runCount, setRunCount] = createSignal(0)
  const genRunCount = () => {
    const newCount = runCount() + 1
    setRunCount(newCount)
    return newCount
  }

  //--- abort clean ups
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

  //--- end clean ups
  const endCleanUps = [] as AnyFn[]
  const registEndCleanUp = (cb: AnyFn) => {
    endCleanUps.push(cb)
  }
  const clearRegistedEndCleanUps = () => {
    endCleanUps.splice(0, endCleanUps.length)
  }

  const invokeEndCleanUps = (...args: any[]) => endCleanUps.map((cb) => cb(...args))

  const pause = () => {
    setCurrentPhase((p) => (p === 'running' ? 'paused' : p))
    settings.onActionPause?.(all)
    // run cleanUp
    invokeAbortCleanUps()
    clearRegistedAbortCleanUps()
    setIsCalculating(false)
  }

  //--- get result
  let resolvePromiseResult: ((result: T) => void) | undefined = undefined
  let rejectPromiseError: ((reason?: unknown) => void) | undefined = undefined
  const loadResult = (result: T) => {
    setResult(() => result)
    resolvePromiseResult?.(result)
  }
  const loadError = (reason?: unknown) => {
    setError(() => reason)
    rejectPromiseError?.(reason)
  }
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
        settings.onActionBegin?.(all)
      }
      if (getAccessorValue(currentPhase) === 'paused') {
        settings.onActionResume?.(all)
      }

      // get result by run action
      const promisedResult =
        settings.action({
          get prevResult() {
            return getAccessorValue(result)
          },
          get runCount() {
            return count
          },
          get prevPhase() {
            return getAccessorValue(currentPhase)
          },
          canContinue,
          onAbortCleanUp: registAbortCleanUp,
          onEndCleanUp: registEndCleanUp,
        }) ??
        new Promise<T>((resolve, reject) => {
          resolvePromiseResult = resolve
          rejectPromiseError = reject
        })
      setCurrentPhase('running')
      const returnedResult = await promisedResult

      setError(undefined)
      //@ts-expect-error void should can be treated as undefined
      setResult(() => returnedResult)
      return returnedResult
    } catch (err) {
      setError(err)
      throw err
    } finally {
      setCurrentPhase('idle')
      setIsCalculating(false)
    }
  }
  const end = () => {
    invokeEndCleanUps()
    clearRegistedEndCleanUps()
    setCurrentPhase('end')
    settings.onActionEnd?.(all)
  }
  const innerStatus = {
    result,
    error,
    runCount,
    currentPhase,
    isCalculating,
    isResultValid,
    isResultEmpty,
    isError,
  }
  const innerMethods = {
    clearError,
    clearResult,
    run,
    end,
    pause,
    loadResult,
    loadError,
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
