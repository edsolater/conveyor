import { HTMLTag, NativeProps, PivProps } from '..'
import { parsePivProps } from '..'
import { JSX, Show } from 'solid-js'
import { switchCase } from '../../../fnkit/switchCase'
import { AnyObj, getKeys } from '@edsolater/fnkit'
import { domMap } from './domMap'

function getSolidJSXNode(type: HTMLTag, parsedProps: NativeProps, additionalProps?: AnyObj): JSX.Element | undefined {
  return switchCase(type, domMap(parsedProps, additionalProps))?.()
}

export const renderHTMLDOM = (type: HTMLTag, rawProps: PivProps<any, any>, additionalProps?: Record<any, any>) => {
  const { props, ifOnlyNeedRenderChildren, ifOnlyNeedRenderSelf, selfCoverNode } = parsePivProps(rawProps)

  if (selfCoverNode) return selfCoverNode

  if (ifOnlyNeedRenderChildren === undefined && ifOnlyNeedRenderSelf === undefined) {
    // in most case
    return getSolidJSXNode(type, props, additionalProps)
  } else if (ifOnlyNeedRenderSelf === undefined) {
    return <Show when={ifOnlyNeedRenderChildren}>{getSolidJSXNode(type, props, additionalProps)}</Show>
  } else if (ifOnlyNeedRenderChildren === undefined) {
    return (
      <>
        <Show when={ifOnlyNeedRenderSelf}>{getSolidJSXNode(type, props, additionalProps)}</Show>
        <Show when={!ifOnlyNeedRenderSelf}>{props.children}</Show>
      </>
    )
  } else {
    return (
      <Show when={ifOnlyNeedRenderChildren}>
        <Show when={ifOnlyNeedRenderSelf}>{getSolidJSXNode(type, props, additionalProps)}</Show>
        <Show when={!ifOnlyNeedRenderSelf}>{props.children}</Show>
      </Show>
    )
  }
}
