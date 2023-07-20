import {
  filter,
  flap,
  flapDeep,
  getKeys,
  isObject,
  isString,
  MayArray,
  mergeObjectsWithConfigs,
  shrinkFn,
} from '@edsolater/fnkit'
import { css, CSSAttribute } from 'solid-styled-components'
import { LoadController, ValidController } from '../types/tools'

export type ICSSObject<Controller extends ValidController | unknown = unknown> = LoadController<CSSObject, Controller> // rename  for ICSSObject may be a superset of CSSObject
// export type CSSObject = JSX.CSSProperties & {
//   '&:hover'?: JSX.CSSProperties
//   //TODO
// }
export type CSSObject = CSSAttribute

export type ICSS<Controller extends ValidController | unknown = unknown> = MayArray<
  LoadController<boolean | string | number | null | undefined, Controller> | ICSSObject<Controller>
>

export function classifyICSS<Controller extends ValidController | unknown = unknown>(
  cssProp: ICSS<Controller>,
  controller: Controller = {} as Controller
) {
  const cssObjList = flapDeep(cssProp)
    .map((i) => shrinkFn(i, [controller]))
    .filter((i) => isString(i) || (isObject(i) && getKeys(i).length > 0)) as (CSSObject | string)[]
  const classes = cssObjList.map((i) => (isString(i) ? i : css(i)))
  return classes.join(' ')
}

export function compressICSSToObj<Controller extends ValidController | unknown = unknown>(
  icss: ICSS<Controller>
): ICSSObject<Controller> {
  return (controller: Controller) => {
    const cssObjList = filter(
      flap(icss).map((i) => shrinkFn(i, [controller])),
      isObject
    ) as ICSSObject<Controller>[]
    const l = cssObjList.reduce((acc, cur) => mergeICSSObject<Controller>(acc, cur), {} as ICSSObject<Controller>)
    return shrinkFn(l, [controller])
  }
}

export function mergeICSSObject<Controller extends ValidController | unknown = unknown>(
  ...icsses: ICSSObject<Controller>[]
): ICSSObject<Controller> {
  return (controller: Controller) =>
    mergeObjectsWithConfigs(
      icsses.map((ic) => shrinkFn(ic, [controller])),
      ({ valueA: v1, valueB: v2 }) => v2 ?? v1
    )
}
export function mergeCSSObject(...icsses: CSSObject[]): CSSObject {
  return mergeObjectsWithConfigs(icsses, ({ valueA: v1, valueB: v2 }) => v2 ?? v1)
}
