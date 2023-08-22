import { AnyFn, isObject, mergeObjects } from '@edsolater/fnkit'

export type SettingsFunction<F extends AnyFn = AnyFn> = F & {
  /** inject params */
  in(): F
  in(...args: [Partial<Parameters<F>[0]>]): F
  in(...args: [Partial<Parameters<F>[0]>, Partial<Parameters<F>[1]>]): F
  in(...args: [Partial<Parameters<F>[0]>, Partial<Parameters<F>[1]>, Partial<Parameters<F>[2]>]): F
  in(...args: [Partial<Parameters<F>[0]>, Partial<Parameters<F>[1]>, Partial<Parameters<F>[2]>, ...any[]]): F
  in(...args: any[]): F
}

/**
 * creator
 * will auto-merge parameters according to their index
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
      if (p === 'in') {
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
  return Reflect.has(v, 'in')
}
