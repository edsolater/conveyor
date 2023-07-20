import { MayArray, shakeNil } from '@edsolater/fnkit'
import { PivProps } from '../types/piv'
import { getPivPropsValue } from '../utils/mergeProps'
import { pivPropsNames } from '../Piv'

export type PivShadowProps<OriginalProps> = MayArray<Partial<Omit<OriginalProps, 'as' | 'children'>>>

/** as will only calculate props when access, so, return verbose big object is ok */
// TODO: just like plugin, which use `mergeProps`
export function handleShadowProps<P extends Partial<PivProps<any>>>(
  props: P,
  additionalShadowPropNames?: string[]
): Omit<P, 'shadowProps'> {
  if (!('shadowProps' in props)) return props
  const keys = getMergedPropKeys(props).concat(additionalShadowPropNames ?? [])
  const merged = Object.defineProperties(
    {},
    keys.reduce((acc: any, key: any) => {
      acc[key] = {
        enumerable: true,
        configurable: true,
        get() {
          const candidates = shakeNil([props].concat(props.shadowProps))
          return getPivPropsValue(candidates, key)
        }
      }
      return acc
    }, {} as PropertyDescriptorMap)
  ) as Exclude<P, undefined>
  return merged
}

function getMergedPropKeys(props: Partial<PivProps<any>>) {
  const selfProps = Object.keys(props).concat(Object.keys(props.shadowProps))
  const pivProps = pivPropsNames
  return getIntersection(selfProps, pivProps)
}

function getIntersection<T, W>(arr1: T[], arr2: W[]): T[] {
  const a2 = new Set(arr2)
  return [...arr1].filter((item) => a2.has(item as any))
}
