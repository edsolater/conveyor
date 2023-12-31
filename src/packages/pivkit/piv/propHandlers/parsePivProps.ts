import { flap, pipe, shakeFalsy } from '@edsolater/fnkit'
import { mutateByAdditionalObjectDescriptors } from '../../../fnkit'
import { ValidController } from '../typeTools'
import { mergeRefs } from '../utils/mergeRefs'
import { classname } from './classname'
import { parsePivChildren } from './children'
import { parseHTMLProps } from './htmlProps'
import { handleICSSProps } from './icss'
import { parseIStyles } from './istyle'
import { parseOnClick } from './onClick'
import { handlePluginProps } from './handlePluginProps'
import { handleShadowProps } from './shadowProps'
import { mergeProps, omit } from '../utils'
import { PivProps } from '../Piv'
import { getPropsFromPropContextContext } from '../PropContext'
import { handleMergifyOnCallbackProps } from './mergifyProps'

export type NativeProps = ReturnType<typeof parsePivProps>['props']
/**
 * Parses the PivProps object and returns an object with the parsed properties.
 * @param rawProps - The raw PivProps object to be parsed.
 * @returns An object with the parsed properties.
 */
// TODO: props should be lazy load, props.htmlProps should also be lazy load
export function parsePivProps(rawProps: PivProps<any>) {
  // handle PropContext
  const contextProps = getPropsFromPropContextContext({ componentName: 'Piv' })
  const mergedContextProps = contextProps ? mergeProps(contextProps, rawProps) : rawProps

  function getPropsInfo(raw: Partial<PivProps>) {
    const props = pipe(
      raw as Partial<PivProps>,
      handleShadowProps,
      handlePluginProps,
      parsePivRenderPrependChildren,
      parsePivRenderAppendChildren,
      handleMergifyOnCallbackProps,
    )
    const controller = (props.innerController ?? {}) as ValidController
    const ifOnlyNeedRenderChildren = 'if' in props ? Boolean(props.if) : undefined
    const ifOnlyNeedRenderSelf = ('ifSelfShown' as keyof PivProps) in props ? Boolean(props.ifSelfShown) : undefined
    const selfCoverNode = 'render:self' in props ? props['render:self']?.(omit(props, ['render:self'])) : undefined
    return { props, controller, ifOnlyNeedRenderChildren, selfCoverNode, ifOnlyNeedRenderSelf }
  }
  const { props, controller, ifOnlyNeedRenderChildren, selfCoverNode, ifOnlyNeedRenderSelf } =
    getPropsInfo(mergedContextProps)
  debugLog(mergedContextProps, props, controller)
  const nativeProps =
    'htmlProps' in props // 💩 currently urgly now
      ? {
          get htmlProps() {
            return parseHTMLProps(props.htmlProps)
          },
          get class() {
            // get ter for lazy solidjs render
            return (
              shakeFalsy([classname(props.class, controller), handleICSSProps(props.icss, controller)]).join(' ') ||
              undefined
            ) /* don't render if empty string */
          },
          get ref() {
            return (el: HTMLElement) => el && mergeRefs(...flap(props.domRef))(el)
          },
          get style() {
            return parseIStyles(props.style, controller)
          },
          get onClick() {
            return 'onClick' in props ? parseOnClick(props.onClick!, controller) : undefined
          },
          get children() {
            return parsePivChildren(props.children, controller)
          },
        }
      : {
          get class() {
            // get ter for lazy solidjs render
            return (
              shakeFalsy([classname(props.class, controller), handleICSSProps(props.icss, controller)]).join(' ') ||
              undefined
            ) /* don't render if empty string */
          },
          get ref() {
            return (el: HTMLElement) => el && mergeRefs(...flap(props.domRef))(el)
          },
          get style() {
            return parseIStyles(props.style, controller)
          },
          get onClick() {
            return 'onClick' in props ? parseOnClick(props.onClick!, controller) : undefined
          },
          get children() {
            return parsePivChildren(props.children, controller)
          },
        }

  return { props: nativeProps, ifOnlyNeedRenderChildren, selfCoverNode, ifOnlyNeedRenderSelf }
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
        deletePropertyNames: ['render:firstChild'],
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
          children: (props) => flap(props.children).concat(flap(props['render:lastChild'])),
        },
        deletePropertyNames: ['render:lastChild'],
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
      console.debug('icss (raw → parsed): ', props.icss, handleICSSProps(props.icss, controller))
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
