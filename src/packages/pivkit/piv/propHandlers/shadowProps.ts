import { MayArray, isArray, isObject, shakeNil } from '@edsolater/fnkit'
import { PivProps, pivPropsNames } from '../Piv'
import { getPivPropsValue } from '../utils/mergeProps'
import { omit } from '../utils'

export type PivShadowProps<OriginalProps> = MayArray<Partial<Omit<OriginalProps, 'as' | 'children'>>>

/** as will only calculate props when access, so, return verbose big object is ok */
export function handleShadowProps<P extends Partial<PivProps<any>>>(
  props: P,
  additionalShadowPropNames?: string[]
): Omit<P, 'shadowProps'> {
  if (!('shadowProps' in props)) return props
  const keys = getMergedKeys(props).concat(additionalShadowPropNames ?? [])
  // TODO: 🤔 need to faster like mergeProps?
  const merged = Object.defineProperties(
    {},
    keys.reduce((acc: any, key: any) => {
      acc[key] = {
        enumerable: true,
        configurable: true,
        get() {
          const candidates = shakeNil([props].concat(props.shadowProps))
          return getPivPropsValue(candidates, key)
        },
      }
      return acc
    }, {} as PropertyDescriptorMap)
  ) as Exclude<P, undefined>
  return merged
}

function getMergedKeys(props: Partial<PivProps<any>>) {
  function getShadowPropKeys(props: Partial<PivProps<any>>): string[] {
    return isArray(props.shadowProps)
      ? props.shadowProps.flatMap((p) => (isObject(p) ? Object.getOwnPropertyNames(p) : []))
      : isObject(props.shadowProps)
      ? Object.getOwnPropertyNames(props.shadowProps)
      : []
  }
  const shadowKeys = getShadowPropKeys(props)
  const selfProps = Object.getOwnPropertyNames(omit(props, ['shadowProps']))
  const pivProps = pivPropsNames
  return getIntersection(selfProps.concat(shadowKeys), pivProps)
}

function getIntersection<T, W>(arr1: T[], arr2: W[]): T[] {
  const a2 = new Set(arr2)
  const result = [...arr1].filter((item) => a2.has(item as any))
  return result
}
