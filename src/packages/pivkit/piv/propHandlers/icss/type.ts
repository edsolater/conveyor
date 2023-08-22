import { MayArray } from '@edsolater/fnkit'
import { CSSAttribute } from 'solid-styled-components'
import { LoadController, ValidController } from '../../types/tools'

export type ICSSObject<Controller extends ValidController | unknown = unknown> = LoadController<CSSObject, Controller> // rename  for ICSSObject may be a superset of CSSObject

// export type CSSObject = JSX.CSSProperties & {
//   '&:hover'?: JSX.CSSProperties
//   //TODO
// }
export type CSSObject = CSSAttribute

export type ICSS<Controller extends ValidController | unknown = unknown> = MayArray<
  LoadController<boolean | string | number | null | undefined, Controller> | ICSSObject<Controller>
>
