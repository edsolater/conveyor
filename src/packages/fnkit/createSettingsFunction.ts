import { AnyFn, isObject, mergeObjects } from '@edsolater/fnkit'

export type SettingsFunction<F extends AnyFn = AnyFn> = F & {
  attach(): F
  attach(...args: [Partial<Parameters<F>[0]>]): F
  attach(...args: [Partial<Parameters<F>[0]>, Partial<Parameters<F>[1]>]): F
  attach(...args: [Partial<Parameters<F>[0]>, Partial<Parameters<F>[1]>, Partial<Parameters<F>[2]>]): F
  attach(...args: [Partial<Parameters<F>[0]>, Partial<Parameters<F>[1]>, Partial<Parameters<F>[2]>, ...any[]]): F
  attach(...args: any[]): F
}

/**
 * creator
 * will auto-merge parameters according to their index
 */
export function createSettingsFunction<F extends AnyFn>(coreFn: F): SettingsFunction<F> {
  let innerParameters = [] as unknown as Parameters<F>
  const settingsFunction = new Proxy(coreFn, {
    apply(target, thisArg, argArray) {
      for (const [idx, param] of argArray.entries()) {
        if (param === undefined) continue
        if (isObject(param) && isObject(innerParameters[idx])) {
          innerParameters[idx] = mergeObjects(innerParameters[idx], param)
        } else {
          innerParameters[idx] = param
        }
      }
      return Reflect.apply(target, thisArg, innerParameters)
    },
    get(target, p, receiver) {
      if (p === 'attach') {
        return (...additionalSettings: any[]) => {
          for (const [idx, param] of additionalSettings.entries()) {
            if (param === undefined) continue
            if (isObject(param) && isObject(innerParameters[idx])) {
              innerParameters[idx] = mergeObjects(innerParameters[idx], param)
            } else {
              innerParameters[idx] = param
            }
          }
          return settingsFunction
        }
      }
      return Reflect.get(target, p, receiver)
    },
  }) as SettingsFunction<F>
  return settingsFunction
}

export function isSettingsFunction(v: any): v is SettingsFunction {
  return Reflect.has(v, 'attach')
}
