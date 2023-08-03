import { flap } from '@edsolater/fnkit'
import { JSXElement, Show, createComponent } from 'solid-js'
import { makePipline } from '../../fnkit/makePipline'
import { parsePivProps } from './propHandlers/parsePivProps'
import { PivProps } from './types/piv'
import { HTMLTag, ValidController } from './types/tools'
import { omit } from './utils'

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
  'dangerousRenderWrapperNode' in props
    ? handleDangerousWrapperPluginsWithChildren(props)
    : makePipline(props).pipe(handleNormalPivProps).calcValue()

function handleNormalPivProps(props?: Omit<PivProps<any, any>, 'plugin' | 'shadowProps'>) {
  if (!props) return
  const { props: parsedProps, ifNeedRenderChildren, renderSelf, ifNeedRenderSelf } = parsePivProps(props)
  return renderSelf ? renderSelf : renderHTMLDiv(parsedProps, ifNeedRenderChildren, ifNeedRenderSelf)
}

function renderHTMLDiv(
  parsedProps: any,
  ifNeedRenderChildren: boolean | undefined,
  ifNeedRenderSelf: boolean | undefined
) {
  if (ifNeedRenderChildren === undefined && ifNeedRenderSelf === undefined) {
    return <div {...parsedProps} />
  } else if (ifNeedRenderSelf === undefined) {
    return (
      <Show when={ifNeedRenderChildren}>
        <div {...parsedProps} />
      </Show>
    )
  } else if (ifNeedRenderChildren === undefined) {
    return (
      <>
        <Show when={ifNeedRenderSelf}>
          <div {...parsedProps} />
        </Show>
        <Show when={!ifNeedRenderSelf}>{parsedProps.children}</Show>
      </>
    )
  } else {
    return (
      <Show when={ifNeedRenderChildren}>
        <Show when={ifNeedRenderSelf}>
          <div {...parsedProps} />
        </Show>
        <Show when={!ifNeedRenderSelf}>{parsedProps.children}</Show>
      </Show>
    )
  }
}

function handleDangerousWrapperPluginsWithChildren(props: PivProps<any, any>): JSXElement {
  return flap(props['render:outWrapper']).reduce(
    (prevNode, getWrappedNode) => (getWrappedNode ? getWrappedNode(prevNode) : prevNode),
    createComponent(Piv, omit(props, 'render:outWrapper'))
  )
}
