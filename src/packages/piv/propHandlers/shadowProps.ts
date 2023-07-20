import { MayArray, isArray, isObject, omit, shakeNil } from '@edsolater/fnkit'
import { PivProps } from '../types/piv'
import { getPivPropsValue } from '../utils/mergeProps'
import { pivPropsNames } from '../Piv'
import { getKeys } from '../utils'

export type PivShadowProps<OriginalProps> = MayArray<Partial<Omit<OriginalProps, 'as' | 'children'>>>

/** as will only calculate props when access, so, return verbose big object is ok */
// TODO: just like plugin, which use `mergeProps`
export function handleShadowProps<P extends Partial<PivProps<any>>>(
  props: P,
  additionalShadowPropNames?: string[]
): Omit<P, 'shadowProps'> {
  if (!('shadowProps' in props)) return props
  const keys = getMergedKeys(props).concat(additionalShadowPropNames ?? [])
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
      ? props.shadowProps.flatMap((p) => (isObject(p) ? Object.keys(p) : []))
      : isObject(props.shadowProps)
      ? Object.keys(props.shadowProps)
      : []
  }
  const shadowKeys = getShadowPropKeys(props)
  const selfProps = Object.keys(omit(props, ['shadowProps']))
  const pivProps = pivPropsNames
  return getIntersection(selfProps.concat(shadowKeys), pivProps)
}

function getIntersection<T, W>(arr1: T[], arr2: W[]): T[] {
  const a2 = new Set(arr2)
  const result = [...arr1].filter((item) => a2.has(item as any))
  return result
}
