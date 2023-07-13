import { CSSObject, ICSSObject } from '../../piv'
import { cssColors } from '../styles/cssColors'

export type ICSSRowOption = {
  gap?: CSSObject['gap']
  items?: CSSObject['alignItems']
}

export const icss_row = (options?: ICSSRowOption) =>
  ({
    display: 'flex',
    alignItems: options?.items ?? 'center',
    gap: options?.gap
  } satisfies ICSSObject)

export type ICSSColOption = {
  gap?: CSSObject['gap']
  items?: CSSObject['alignItems']
}

export const icss_col = (options?: ICSSColOption) =>
  ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: options?.items ?? 'center',
    gap: options?.gap
  } satisfies ICSSObject)

export type ICSSGridOption = {
  gap?: CSSObject['gap']
  items?: CSSObject['placeItems']
}

export const icss_grid = (options?: ICSSGridOption) =>
  ({
    display: 'grid',
    placeItems: options?.items ?? 'center',
    gap: options?.gap
  } satisfies ICSSObject)

export type ICSSCardOption = {
  gap?: CSSObject['gap']
  items?: CSSObject['alignItems']
}

export const icss_card = (options?: ICSSCardOption) =>
  ({
    display: 'grid',
    border: 'solid',
    padding: '24px',
    borderRadius: '16px'
  } satisfies ICSSObject)

export type ICSSClickableOption = {}
export const icss_clickable = (options?: ICSSClickableOption) =>
  ({
    cursor: 'pointer',
    ':is(:hover,:active)': { backdropFilter: 'brightness(0.9)', filter: 'brightness(0.9)' }
  } satisfies ICSSObject)

export const icss_label = (options?: { w: CSSObject['minWidth']; h: CSSObject['minHeight'] }) =>
  ({
    minWidth: options?.w ?? '5em',
    minHeight: options?.h ?? 'calc(2em)',
    textAlign: 'center',
    paddingBlock: '.25em',
    paddingInline: '.5em',
    borderRadius: '4px',
    background: cssColors.component_label_bg_default
  } satisfies ICSSObject)

export const icss_inputType = (options?: { w: CSSObject['minWidth']; h: CSSObject['minHeight'] }) =>
  ({
    minWidth: '12em',
    paddingBlock: '.25em',
    paddingInline: '.5em',
    // borderRadius: '4px',
    // background: cssColors.component_input_bg_default,
    // outlineColor: cssColors.dodgerBlue,
    borderBottom: 'solid'
  } satisfies ICSSObject)
