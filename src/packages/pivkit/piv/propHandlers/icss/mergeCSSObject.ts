import { mergeObjectsWithConfigs } from '@edsolater/fnkit'
import { CSSObject } from './type'

export function mergeCSSObject(...icsses: CSSObject[]): CSSObject {
  return mergeObjectsWithConfigs(icsses, ({ valueA: v1, valueB: v2 }) => v2 ?? v1)
}
