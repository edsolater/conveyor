import { AnyFn, groupArrayBySize, isNumber, mergeObjects } from '@edsolater/fnkit'

type TaskName = string

const lazyMapSettingsCache = new Map<TaskName, LazyMapSettings<any, any> & { idleId: number }>()
const taskIdleIds = new Map<TaskName, Set<number>>()

type LazyMapSettings<T, U> = {
  /**
   * like js's map's source
   */
  source: T[]

  /**
   * detection flag for todo queue
   */
  loopTaskName: string // for action key for cacheMap to identify

  /**
   * like js: array::map
   */
  loopFn: (item: T, index: number, source: readonly T[]) => U

  /**
   * @default 'lazier-idleCallback'
   */
  method?: 'hurrier-settimeout' | 'lazier-idleCallback'

  options?: {
    /**
     * the larger the more important .
     * default is 0
     * @todo imply it !!!
     **/
    priority?: 0 | 1
    /**
     * if don't set , it will auto-cacl in Chrome/Edge/Firefox, and 8 in Safari
     */
    oneGroupTasksSize?: number
    idleTimeout?: number
  }
}

// for whole task
/**
 * like Array's map(), but each loop will check if new task is pushed in todo queue
 * inspired by `window.requestIdleCallback()`
 * @param settings.source arr
 * @param settings.sourceKey flag for todo queue
 * @param settings.loopFn like js: array::map
 * @param settings.options like js: array::map
 */
export function lazyMap<T, U>(setting: LazyMapSettings<T, U>): Promise<U[]> {
  return new Promise((resolve) => {
    const newTaskIdleId = requestIdleCallback(async () => {
      cancelUnresolvedIdles(setting.loopTaskName)
      startLazyMapCore(setting).then(resolve)
    })

    // re-invoke will auto cancel the last idle callback, and record new setting
    cancelOldSameNameTask()
    recordNewNamedTask()

    function recordNewNamedTask() {
      lazyMapSettingsCache.set(setting.loopTaskName, mergeObjects(setting, { idleId: newTaskIdleId }))
    }

    function cancelOldSameNameTask() {
      const lastIdleId = lazyMapSettingsCache.get(setting.loopTaskName)?.idleId
      if (lastIdleId) cancelIdleCallback(lastIdleId)
    }
  })
}

function cancelUnresolvedIdles(loopTaskName: string) {
  taskIdleIds.get(loopTaskName)?.forEach((id) => cancelIdleCallback(id))
  taskIdleIds.get(loopTaskName)?.clear()
}

async function startLazyMapCore<T, U>({
  source,
  loopTaskName,
  options,
  loopFn,
  method: coreMethod,
}: LazyMapSettings<T, U>): Promise<U[]> {
  const needFallbackToOldWay =
    isNumber(options?.oneGroupTasksSize) || !canUseIdleCallback() || coreMethod === 'hurrier-settimeout'

  if (needFallbackToOldWay) {
    const wholeResult: U[] = []
    // old way
    for (const blockList of groupArrayBySize(source, options?.oneGroupTasksSize ?? 8)) {
      await new Promise((resolve) => {
        const invokeTasks = () => {
          const newResultList = blockList.map(loopFn)
          wholeResult.push(...newResultList)
          resolve(undefined)
        }
        requestCallback(invokeTasks, coreMethod ?? 'lazier-idleCallback')
      }) // forcely use microtask
    }

    return wholeResult
  } else {
    if (source.length === 0) return []
    // console.time(`lazy load ${loopTaskName}`)
    const taskResults = await runTasks(
      source.map((item, index) => () => {
        const task = loopFn(item, index, source)
        return task
      }),
      loopTaskName,
      options
    )
    // console.timeEnd(`lazy load ${loopTaskName}`)
    return taskResults
  }
}

async function runTasks<F extends () => any>(
  tasksQueue: F[],
  loopTaskName: LazyMapSettings<any, any>['loopTaskName'],
  options?: LazyMapSettings<any, any>['options']
): Promise<ReturnType<F>[]> {
  const testLeastCostTime = 1 // (ms) // force task cost time
  const fragmentResults = await new Promise<ReturnType<F>[]>((resolve) => {
    const wholeResult: ReturnType<F>[] = []
    const taskIdleId = requestIdleCallback(
      (deadline) => {
        let currentTaskIndex = 0
        const stillHaveTimeToRun = deadline.timeRemaining() > testLeastCostTime
        while (stillHaveTimeToRun) {
          if (currentTaskIndex < tasksQueue.length) {
            const taskResult = tasksQueue[currentTaskIndex]()
            wholeResult.push(taskResult)
            currentTaskIndex += 1
          } else {
            resolve(wholeResult)
          }
        }
        const stillHaveTask = currentTaskIndex < tasksQueue.length
        if (stillHaveTask) {
          const restTasks = tasksQueue.slice(currentTaskIndex)
          runTasks(restTasks, loopTaskName, options).then((restResult) =>
            resolve(wholeResult.concat(restResult as ReturnType<F>[]))
          )
        } else {
          resolve(wholeResult)
        }
      },
      { timeout: options?.idleTimeout ?? 1000 }
    )
    recordTaskIdleId(taskIdleId)
  })

  return fragmentResults

  function recordTaskIdleId(taskIdleId: number) {
    if (!taskIdleIds.has(loopTaskName)) taskIdleIds.set(loopTaskName, new Set())
    taskIdleIds.get(loopTaskName)!.add(taskIdleId)
  }
}

function canUseIdleCallback(): boolean {
  return Boolean(window.requestIdleCallback)
}

function requestCallback(fn: AnyFn, methods: LazyMapSettings<any, any>['method']): number {
  return methods === 'hurrier-settimeout' ? window.setTimeout?.(fn) : requestIdleCallback(fn)
}

export function requestIdleCallback(fn: IdleRequestCallback, options?: IdleRequestOptions): number {
  return window.requestIdleCallback ? window.requestIdleCallback?.(fn, options) : window.setTimeout?.(fn) // Safari no't support `window. ()`, so have to check first
}

export function cancelIdleCallback(handleId: number): void {
  return window.cancelIdleCallback ? window.cancelIdleCallback?.(handleId) : window.clearTimeout(handleId)
}
