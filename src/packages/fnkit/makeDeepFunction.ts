import { AnyFn, AnyObj, mergeObjects } from '@edsolater/fnkit'

type DeepFunction<F extends (options: AnyObj) => any> = { exec: F } & ((
  additionalOption: Partial<Parameters<F>[0]>
) => DeepFunction<F>)

// use symbol so user can assign any symbol he like
const execSymbol = Symbol('exec')

// creator
/**
 * @todo test it!!!
 */
export function makeDeepFunction<F extends (options?: AnyObj) => any>(coreFn: F): DeepFunction<F> {
  let innerOptions: AnyObj = {}
  const deepFunction = new Proxy(coreFn, {
    apply(target, thisArg, argArray) {
      const additionalOption = argArray[0]
      innerOptions = mergeObjects(innerOptions, additionalOption)
      return deepFunction
    },
  }) as any
  Reflect.set(deepFunction, execSymbol, () => coreFn(innerOptions))
  return deepFunction
}

// consumer
/**
 * @todo test it!!!
 */
export function invokeDeepFunction<F extends (options?: AnyObj) => any>(coreFn: DeepFunction<F>): ReturnType<F> {
  return Reflect.get(coreFn, execSymbol)()
}
