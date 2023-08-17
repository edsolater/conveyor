import { AnyFn, AnyObj, isObject, mergeObjects } from '@edsolater/fnkit'

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
 *  creator
 */
export function makeDeepFunction<F extends AnyFn>(coreFn: F): DeepFunction<F> {
  let innerParameters = [] as unknown as Parameters<F>
  const deepFunction = new Proxy(coreFn, {
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
  }) as any
  Reflect.set(deepFunction, execSymbol, () => coreFn.apply(coreFn, innerParameters))
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
