import { flap } from '@edsolater/fnkit'
import { JSXElement, Show, createComponent } from 'solid-js'
import { makePipline } from '../../fnkit/makePipline'
import { parsePivProps } from './propHandlers/parsePivProps'
import { PivProps } from './types/piv'
import { HTMLTag, ValidController } from './types/tools'
import { omit } from './utils'
import { renderHTMLDOM } from './propHandlers/renderHTMLDOM'

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
  props: PivProps<TagName, Controller>
) =>
  'render:outWrapper' in props
    ? handleDangerousWrapperPluginsWithChildren(props)
    : makePipline(props).pipe(handleNormalPivProps).calcValue()

function handleNormalPivProps(props?: Omit<PivProps<any, any>, 'plugin' | 'shadowProps'>) {
  if (!props) return
  return renderHTMLDOM('div', props)
  // const { props: parsedProps, ifOnlyNeedRenderChildren, selfCoverNode, ifOnlyNeedRenderSelf } = parsePivProps(props)
  // return selfCoverNode ? selfCoverNode : renderHTMLDiv(parsedProps, ifOnlyNeedRenderChildren, ifOnlyNeedRenderSelf)
}

function handleDangerousWrapperPluginsWithChildren(props: PivProps<any, any>): JSXElement {
  return flap(props['render:outWrapper']).reduce(
    (prevNode, getWrappedNode) => (getWrappedNode ? getWrappedNode(prevNode) : prevNode),
    createComponent(Piv, omit(props, 'render:outWrapper'))
  )
}
