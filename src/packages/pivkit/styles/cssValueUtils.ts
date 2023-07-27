import { isString, toPercentString } from '@edsolater/fnkit'

type ColorString = string

/**
 * @deprecated use this will cause code too complicated to read
 */
export const cssColorMix = (...colors: (ColorString | [ColorString, number | `${number}%`])[]) =>
  `color-mix(in srgb, ${colors
    .map((c) => (isString(c) ? c : `${c[0]} ${isString(c[1]) ? c[1] : toPercentString(c[1])}`))
    .join(', ')})`
