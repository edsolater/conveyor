import { MayArray, flap, pipe } from '@edsolater/fnkit'
import { JSX, JSXElement, createComponent } from 'solid-js'
import { makePipline } from '../../fnkit/makePipline'
import { ClassName, HTMLProps, ICSS, IStyle, Plugin, handlePluginProps, handleShadowProps } from './propHandlers'
import { renderHTMLDOM } from './propHandlers/renderHTMLDOM'
import { HTMLTag, PivChild, ValidController } from './typeTools'
import { omit } from './utils'
import { handlePropsInnerController } from './ControllerContext'
import { createOnRunObject } from '../../fnkit'

type Boollike = any

export interface PivProps<TagName extends HTMLTag = HTMLTag, Controller extends ValidController | unknown = unknown> {
  /** if is settled and is flase , only it's children will render */
  if?: Boollike
  /** if is settled and is flase , only it's children will render */
  ifSelfShown?: Boollike

  debugLog?: (keyof PivProps)[]

  /**
   * auto merge by shadowProps
   */
  domRef?: MayArray<CRef<any> | null | undefined>

  /**
   * auto merge by shadowProps
   * if it's in shadow props, it will merge with exist props
   */
  class?: MayArray<ClassName<Controller>>

  /**
   * id for component instance
   * so others can access component's controller without set `props:controllerRef` to component, this have to have access to certain component instance
   */
  id?: string

  onClick?: (
    utils: {
      ev: MouseEvent & {
        currentTarget: HTMLElement
        target: Element
      }
      el: HTMLElement
    } & Controller
  ) => void // for accessifyProps, onClick can't be array

  /**
   * auto merge by shadowProps
   * if it's in shadow props, it will merge with exist props
   */
  icss?: ICSS<Controller>

  /**
   * auto merge by shadowProps
   * if it's in shadow props, it will merge with exist props
   */
  style?: IStyle<Controller>

  /**
   * auto merge by shadowProps
   * if it's in shadow props, it will merge with exist props
   *
   * htmlProps can't have controller, because if this props be a function. there is no way to detect which props it will finnaly use
   */
  htmlProps?: HTMLProps<TagName>

  children?: PivChild<unknown extends Controller ? any : Controller> // any is convient for <Piv>

  /**
   * auto merge by shadowProps
   * high priority
   */
  shadowProps?: MayArray<any /* too difficult to type */>

  // /** low priority */
  // outsideProps?: MayArray<any /* too difficult to type */>

  /**
   * auto merge by shadowProps
   * special: every kit baseon <Piv> should support this prop
   */
  plugin?: MayArray<Plugin<any>>

  // -------- special prop --------

  /** only passed in parent component */
  innerController?: Controller

  /** @example
   * const Button = () => <Piv as={(parsedPivProps) => <button {...parsedPivProps} />} />
   */
  as?: any // TODO: imply it // 💡soft `render-self`, props will merge other than cover
  'render:self'?: (selfProps: PivProps<any, any>) => JSX.Element // assume a function return ReactNode is a Component

  /**
   * auto merge by shadowProps
   * change outter wrapper element
   */
  'render:outWrapper'?: MayArray<DangerousWrapperNodeFn>

  'render:firstChild'?: MayArray<PivChild<Controller>>

  'render:lastChild'?: MayArray<PivChild<Controller>>
}

type DangerousWrapperNodeFn = (originalChildren: JSXElement) => JSXElement // change outter wrapper element

export type CRef<T> = (el: T) => void // not right

export const pivPropsNames = [
  'id',
  'if',
  'ifSelfShown',

  'domRef',
  'class',
  'htmlProps',
  'icss',
  'onClick',

  'plugin',
  'shadowProps',

  'style',
  'debugLog',

  'innerController',
  'children',

  'render:self',
  'render:outWrapper',
  'render:firstChild',
  'render:lastChild',
] satisfies (keyof PivProps<any>)[]

export const Piv = <TagName extends HTMLTag = HTMLTag, Controller extends ValidController | unknown = unknown>(
  kitProps: PivProps<TagName, Controller>
) => {
  const props = pipe(
    kitProps as PivProps<any>,
    handleShadowProps,
    handlePluginProps,
    handleShadowProps,
    handlePropsInnerController
  )
  if ('innerController' in props) {
    console.log('rawProps 1111: ', props)
  }
  return 'render:outWrapper' in props ? handlePropRenderOutWrapper(props) : handleNormalPivProps(props)
}

function handleNormalPivProps(props?: Omit<PivProps<any, any>, 'plugin' | 'shadowProps'>) {
  if (!props) return
  return renderHTMLDOM('div', props)
  // const { props: parsedProps, ifOnlyNeedRenderChildren, selfCoverNode, ifOnlyNeedRenderSelf } = parsePivProps(props)
  // return selfCoverNode ? selfCoverNode : renderHTMLDiv(parsedProps, ifOnlyNeedRenderChildren, ifOnlyNeedRenderSelf)
}

function handlePropRenderOutWrapper(props: PivProps<any, any>): JSXElement {
  return flap(props['render:outWrapper']).reduce(
    (prevNode, getWrappedNode) => (getWrappedNode ? getWrappedNode(prevNode) : prevNode),
    // @ts-expect-error force
    (() => handleNormalPivProps(omit(props, 'render:outWrapper'))) as JSXElement // 📝 wrap function to let not solidjs read at once when array.prototype.reduce not finish yet
  )
}
