import { CSSObject, ICSSObject } from '../../piv'
import { cssColors } from '../styles/cssColors'

export type ICSSRowOption = {
  gap?: CSSObject['gap']
  items?: CSSObject['alignItems']
}

export const icssRow = (options?: ICSSRowOption) =>
  ({
    display: 'flex',
    alignItems: options?.items ?? 'center',
    gap: options?.gap,
  } satisfies ICSSObject)

export type ICSSColOption = {
  gap?: CSSObject['gap']
  items?: CSSObject['alignItems']
}

export const icssCol = (options?: ICSSColOption) =>
  ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: options?.items ?? 'center',
    gap: options?.gap,
  } satisfies ICSSObject)

//#region ------------------- grid -------------------
export type ICSSGridOption = {
  gap?: CSSObject['gap']
  items?: CSSObject['placeItems']
  template?: CSSObject['gridTemplate']
}

export const icssGrid = (options?: ICSSGridOption) =>
  ({
    display: 'grid',
    placeItems: options?.items ?? 'center',
    gridTemplate: options?.template,
    gap: options?.gap,
  } satisfies ICSSObject)

export type ICSSGridItemOption = {
  area: CSSObject['gridArea']
}

export const icssGridItem = (options?: ICSSGridItemOption) =>
  ({
    gridArea: options?.area,
  } satisfies ICSSObject)

//#endregion

export type ICSSCardOption = {
  gap?: CSSObject['gap']
  items?: CSSObject['alignItems']
}
export const icssCard = (options?: ICSSCardOption) =>
  ({
    display: 'grid',
    border: 'solid',
    padding: '24px',
    borderRadius: '16px',
  } satisfies ICSSObject)

export type ICSSClickableOption = {}
export const icssClickable = (options?: ICSSClickableOption) =>
  ({
    cursor: 'pointer',
    ':is(:hover,:active)': { backdropFilter: 'brightness(0.9)', filter: 'brightness(0.9)' },
  } satisfies ICSSObject)

export const icssLabel = (options?: { w: CSSObject['minWidth']; h: CSSObject['minHeight'] }) =>
  ({
    minWidth: options?.w ?? '5em',
    minHeight: options?.h ?? 'calc(2em)',
    textAlign: 'center',
    paddingBlock: '.25em',
    paddingInline: '.5em',
    borderRadius: '4px',
    background: cssColors.component_label_bg_default,
  } satisfies ICSSObject)

export const icssInputType = (options?: { w: CSSObject['minWidth']; h: CSSObject['minHeight'] }) =>
  ({
    minWidth: '12em',
    paddingBlock: '.25em',
    paddingInline: '.5em',
    // borderRadius: '4px',
    // background: cssColors.component_input_bg_default,
    // outlineColor: cssColors.dodgerBlue,
    borderBottom: 'solid',
  } satisfies ICSSObject)
