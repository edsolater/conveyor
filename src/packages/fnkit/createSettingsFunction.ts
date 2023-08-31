import { AnyFn, isObject, mergeObjects } from '@edsolater/fnkit'

export type SettingsFunction<F extends AnyFn = AnyFn> = F & {
  /** inject params */
  addParam(): F
  addParam(...args: [Partial<Parameters<F>[0]>]): F
  addParam(...args: [Partial<Parameters<F>[0]>, Partial<Parameters<F>[1]>]): F
  addParam(...args: [Partial<Parameters<F>[0]>, Partial<Parameters<F>[1]>, Partial<Parameters<F>[2]>]): F
  addParam(...args: [Partial<Parameters<F>[0]>, Partial<Parameters<F>[1]>, Partial<Parameters<F>[2]>, ...any[]]): F
  addParam(...args: any[]): F
}

/**
 * creator
 * can add parameter without invoke
 */
export function createSettingsFunction<F extends AnyFn>(
  coreFn: F,
  settings?: { defaultParams?: any[]; label?: symbol }
): SettingsFunction<F> {
  let innerParameters = settings?.defaultParams ?? ([] as unknown as Parameters<F>)
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
      if (p === 'addParam') {
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

  if (settings?.label) Reflect.set(settingsFunction, settings.label, true)

  return settingsFunction
}

export function isSettingsFunction(v: any): v is SettingsFunction {
  return Reflect.has(v, 'addParam')
}
