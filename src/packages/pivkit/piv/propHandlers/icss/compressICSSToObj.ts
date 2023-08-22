import { filter, flap, isObject, shrinkFn } from '@edsolater/fnkit'
import { ValidController } from '../../types/tools'
import { mergeICSSObject } from './mergeICSSObject'
import { ICSS, ICSSObject } from './type'

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
