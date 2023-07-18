import { flap, pipe, shakeFalsy } from '@edsolater/fnkit'
import { mutateByAdditionalObjectDescriptors } from '../../fnkit'
import { PivProps } from '../types/piv'
import { ValidController } from '../types/tools'
import { mergeRefs } from '../utils/mergeRefs'
import { classname } from './classname'
import { parsePivChildren } from './controller'
import { parseHTMLProps } from './htmlProps'
import { parseCSSToString } from './icss'
import { parseIStyles } from './istyle'
import { parseOnClick } from './onClick'
import { handlePluginProps } from './plugin'
import { handleShadowProps } from './shadowProps'
import { omit } from '../utils'

/**
 * Parses the PivProps object and returns an object with the parsed properties.
 * @param rawProps - The raw PivProps object to be parsed.
 * @returns An object with the parsed properties.
 */
// TODO: props should be lazy load, props.htmlProps should also be lazy load
export function parsePivProps(rawProps: PivProps<any>) {
  function getProps(rawProps: Partial<PivProps>) {
    const props = pipe(
      rawProps as Partial<PivProps>,
      handleShadowProps,
      handlePluginProps,
      parsePivRenderPrependChildren,
      parsePivRenderAppendChildren
    )
    const controller = (props.innerController ?? {}) as ValidController
    const ifNeedRenderChildren = 'if' in props ? Boolean(props.if) : undefined
    const ifNeedRenderSelf = ('ifCanWrap' as keyof PivProps) in props ? Boolean(props.ifCanWrap) : undefined
    const renderSelf = 'render:self' in props ? props['render:self']?.(omit(props, ['render:self'])) : undefined
    return { props, controller, ifNeedRenderChildren, renderSelf, ifNeedRenderSelf }
  }
  const { props, controller, ifNeedRenderChildren, renderSelf, ifNeedRenderSelf } = getProps(rawProps)
  debugLog(rawProps, props, controller)
  const nativeProps = {
    ...parseHTMLProps(props.htmlProps),
    get class() {
      const { props, controller } = getProps(rawProps)
      // get ter for lazy solidjs render
      return (
        shakeFalsy([classname(props.class, controller), parseCSSToString(props.icss, controller)]).join(' ') ||
        undefined
      ) /* don't render if empty string */
    },
    get ref() {
      const { props } = getProps(rawProps)
      return (el: HTMLElement) => el && mergeRefs(...flap(props.domRef))(el)
    },
    get style() {
      const { props, controller } = getProps(rawProps)
      return parseIStyles(props.style, controller)
    },
    get onClick() {
      const { props, controller } = getProps(rawProps)
      return 'onClick' in props ? parseOnClick(props.onClick!, controller) : undefined
    },
    get children() {
      const { props, controller } = getProps(rawProps) // 🤔: is children depend on shadow props, shadow props has createMemo, so solidjs engine will re-run this function evey time inner subscribiton changed?
      return parsePivChildren(props.children, controller)
    }
  }
  return { props: nativeProps, ifNeedRenderChildren, renderSelf, ifNeedRenderSelf }
}

/**
 * Creates an object with keys from the input array and values set to undefined.
 * @example
 * const obj = createEmptyObject(['a', 'b', 'c']);
 * // obj is { a: undefined, b: undefined, c: undefined }
 * @param keys - An array of keys to use for the object.
 * @returns An object with keys from the input array and values set to undefined.
 */
export function createEmptyObject<T extends (keyof any)[]>(keys: T): { [K in T[number]]: undefined } {
  return Object.fromEntries(keys.map((k) => [k, undefined])) as any
}

/**
 * Parses the PivProps's render:firstChild.
 * @param props - The raw PivProps object to be parsed.
 * @param controller - The controller object to be used for parsing.
 * @returns new props with the parsed properties and prepended children.
 */
function parsePivRenderPrependChildren<T extends Partial<PivProps<any, any>>>(props: T): Omit<T, 'render:firstChild'> {
  return 'render:firstChild' in props
    ? mutateByAdditionalObjectDescriptors(props, {
        newGetters: { children: (props) => flap(props['render:firstChild']).concat(props.children) },
        deletePropertyNames: ['render:firstChild']
      })
    : props
}

/**
 * Parses the PivProps's render:lastChild.
 * @param props - The raw PivProps object to be parsed.
 * @param controller - The controller object to be used for parsing.
 * @returns new props with the parsed properties and appended children.
 */
function parsePivRenderAppendChildren<T extends Partial<PivProps<any, any>>>(props: T): Omit<T, 'render:lastChild'> {
  return 'render:lastChild' in props
    ? mutateByAdditionalObjectDescriptors(props, {
        newGetters: {
          children: (props) => flap(props.children).concat(flap(props['render:lastChild']))
        },
        deletePropertyNames: ['render:lastChild']
      })
    : props
}

/**
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/console/debug
 */
function debugLog(rawProps: PivProps<any>, props: PivProps<any>, controller: ValidController) {
  if (props.debugLog) {
    if (props.debugLog.includes('shadowProps')) {
      console.debug('shadowProps (raw): ', rawProps.shadowProps)
    }
    if (props.debugLog.includes('plugin')) {
      console.debug('plugin (raw): ', rawProps.plugin)
    }
    if (props.debugLog.includes('htmlProps')) {
      console.debug('htmlProps (raw → parsed): ', props.htmlProps, { ...parseHTMLProps(props.htmlProps) })
    }
    if (props.debugLog.includes('icss')) {
      console.debug('icss (raw → parsed): ', props.icss, parseCSSToString(props.icss, controller))
    }
    if (props.debugLog.includes('style')) {
      console.debug('style (raw → parsed): ', props.style, parseIStyles(props.style, controller))
    }
    if (props.debugLog.includes('class')) {
      console.debug('class (raw → parsed): ', props.class, classname(props.class, controller))
    }
    if (props.debugLog.includes('innerController')) {
      console.debug('innerController (raw → parsed): ', props.innerController)
    }
    if (props.debugLog.includes('onClick')) {
      console.debug(
        'onClick (raw → parsed): ',
        props.onClick,
        'onClick' in props && parseOnClick(props.onClick!, controller)
      )
    }
    if (props.debugLog.includes('children')) {
      console.debug('children', props.children)
    }
  }
}
