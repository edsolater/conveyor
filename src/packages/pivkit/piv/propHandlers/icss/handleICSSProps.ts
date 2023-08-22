import { flapDeep, getKeys, isObject, isString, shrinkFn } from '@edsolater/fnkit'
import { css } from 'solid-styled-components'
import { ValidController } from '../../types/tools'
import { ICSS, CSSObject } from './type'

export function handleICSSProps<Controller extends ValidController | unknown = unknown>(
  cssProp: ICSS<Controller>,
  controller: Controller = {} as Controller
) {
  const cssObjList = flapDeep(cssProp)
    .map((i) => shrinkFn(i, [controller]))
    .filter((i) => isString(i) || (isObject(i) && getKeys(i).length > 0)) as (CSSObject | string)[]
  const classes = cssObjList.map((i) => (isString(i) ? i : css(i)))
  return classes.join(' ')
}
