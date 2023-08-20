import { AnyFn, AnyObj, generateEmptyObjectByCloneOlds, isObject, mergeObjects } from '@edsolater/fnkit'

export type DeepFunction<F extends AnyFn = AnyFn> = {
  (): DeepFunction<F>
  (...args: [Partial<Parameters<F>[0]>]): DeepFunction<F>
  (...args: [Partial<Parameters<F>[0]>, Partial<Parameters<F>[1]>]): DeepFunction<F>
  (...args: [Partial<Parameters<F>[0]>, Partial<Parameters<F>[1]>, Partial<Parameters<F>[2]>]): DeepFunction<F>
  (
    ...args: [Partial<Parameters<F>[0]>, Partial<Parameters<F>[1]>, Partial<Parameters<F>[2]>, ...any[]]
  ): DeepFunction<F>
  (...args: any[]): DeepFunction<F>
  [execSymbol]: F
}

export type MayDeepFunction<F extends AnyFn = AnyFn> = DeepFunction<F> | F

// use symbol so user can assign any symbol he like
const execSymbol = Symbol('exec')

/**
 * creator
 * will auto-merge parameters according to their index
 */
export function createDeepFunction<F extends AnyFn, P extends object | undefined>(
  coreFn: F,
  obj?: P
): P extends undefined ? DeepFunction<F> : DeepFunction<F> & P {
  let innerParameters = [] as unknown as Parameters<F>
  const fnWithObj = obj ? Object.assign(coreFn, generateEmptyObjectByCloneOlds(obj)) : coreFn
  const deepFunction = new Proxy(fnWithObj, {
    apply(target, thisArg, argArray) {
      const additionalArgs = argArray
      additionalArgs.forEach((arg, index) => {
        if (arg === undefined) return
        const oldParam = innerParameters[index]
        if ((isObject(oldParam) || oldParam === undefined) && isObject(arg)) {
          innerParameters[index] = mergeObjects(oldParam, arg)
        } else {
          innerParameters[index] = arg
        }
      })
      return deepFunction
    },
    get(target, p, receiver) {
      if (p === execSymbol) return () => coreFn.apply(coreFn, innerParameters)
      return obj ? Reflect.get(obj, p, receiver) : Reflect.get(target, p, receiver)
    },
  }) as any
  return deepFunction
}

export function isDeepFunction(v: any): v is DeepFunction {
  return Reflect.has(v, execSymbol)
}

/**
 * consumer
 */
export function invokeDeepFunction<F extends (options?: AnyObj) => any>(coreFn: DeepFunction<F>): ReturnType<F> {
  return Reflect.get(coreFn, execSymbol)()
}

/**
 * accept both **DeepFunction** and **NormalFunction**
 */
export function invoke<T extends DeepFunction | AnyFn>(
  fn: T
): T extends DeepFunction ? ReturnType<T[typeof execSymbol]> : ReturnType<T> {
  return isDeepFunction(fn) ? invokeDeepFunction(fn) : fn()
}
