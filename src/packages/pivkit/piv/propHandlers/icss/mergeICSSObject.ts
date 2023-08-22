import { mergeObjectsWithConfigs, shrinkFn } from '@edsolater/fnkit'
import { ValidController } from '../../types/tools'
import { ICSSObject } from './type'

export function mergeICSSObject<Controller extends ValidController | unknown = unknown>(
  ...icsses: ICSSObject<Controller>[]
): ICSSObject<Controller> {
  return (controller: Controller) =>
    mergeObjectsWithConfigs(
      icsses.map((ic) => shrinkFn(ic, [controller])),
      ({ valueA: v1, valueB: v2 }) => v2 ?? v1
    )
}
