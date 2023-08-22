import { AnyObj, overwriteFunctionName } from '@edsolater/fnkit'
import { ICSS, CSSObject } from './type'
import { createSettingsFunction } from '../../../../fnkit/createSettingsFunction'

const icssTag = Symbol('icssTag')

type TaggedICSS = ICSS & { [icssTag]: true | string }

export function createICSS(
  rule: (settings: AnyObj) => ICSS,
  options?: { name?: string; defaultSettings?: Partial<AnyObj> }
): (settings: AnyObj) => TaggedICSS {
  const factory = createSettingsFunction((params: AnyObj) => rule(params), options?.defaultSettings)
  Object.assign(factory, options)
  // rename
  const fn = options?.name ? overwriteFunctionName(factory, options.name) : factory

  // @ts-expect-error no need to check
  return fn
}
