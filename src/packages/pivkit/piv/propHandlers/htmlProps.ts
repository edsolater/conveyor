import {
  AnyObj,
  MayArray,
  flapDeep,
  isArray,
  mergeObjectsWithConfigs,
  shakeNil,
  shakeUndefinedItem,
} from '@edsolater/fnkit'
import { JSX } from 'solid-js'
import { objectMerge } from '../../../fnkit'
import { HTMLTag } from '../types/tools'

export type HTMLProps<TagName extends HTMLTag = HTMLTag> = MayArray<JSX.IntrinsicElements[TagName] | undefined>

/**
 * htmlProps can't have controller, because if this props be a function. there is no way to detect which props it will finnaly use
 */
export function parseHTMLProps(htmlProps: HTMLProps) {
  if (!htmlProps) return undefined
  return objectMerge(...shakeNil(flapDeep(htmlProps)))
}

// TODO: moveToFnkit
export function mergeObjects<T, W>(...objs: [T, W]): (T extends undefined ? {} : T) & (W extends undefined ? {} : W)
export function mergeObjects<T, W, X>(
  ...objs: [T, W, X]
): (T extends undefined ? {} : T) & (W extends undefined ? {} : W) & (X extends undefined ? {} : X)
export function mergeObjects<T, W, X, Y>(
  ...objs: [T, W, X, Y]
): (T extends undefined ? {} : T) &
  (W extends undefined ? {} : W) &
  (X extends undefined ? {} : X) &
  (Y extends undefined ? {} : Y)
export function mergeObjects<T, W, X, Y, Z>(
  ...objs: [T, W, X, Y, Z]
): (T extends undefined ? {} : T) &
  (W extends undefined ? {} : W) &
  (X extends undefined ? {} : X) &
  (Y extends undefined ? {} : Y) &
  (Z extends undefined ? {} : Z)
export function mergeObjects<T extends AnyObj | undefined>(...objs: T[]): T
export function mergeObjects<T extends AnyObj | undefined>(...objs: T[]): T {
  return mergeObjectsWithConfigs(shakeUndefinedItem(objs), ({ valueA: v1, valueB: v2 }) => v2 ?? v1)
}

/**
 *
 * detect it related HTML attribute key
 * @todo has shadow props
 */
export function getHTMLPropsKeys(htmlProps: HTMLProps): string[] {
  if (!htmlProps) return []
  return isArray(htmlProps) ? htmlProps.map((i) => (i ? Object.keys(i) : [])).flat() : Object.keys(htmlProps)
}
