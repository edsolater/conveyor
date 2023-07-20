import { useNavigate } from '@solidjs/router'
import { HTMLTag, KitProps, Piv, PivProps, useKitProps } from '../packages/piv'
import { parsePivProps } from '../packages/piv'
import { JSX, Show } from 'solid-js'
import { isArray, isFunction, isMap } from '@edsolater/fnkit'

export interface LinkProps {
  href?: string
  boxWrapper?: boolean
  innerRoute?: boolean
}

export function Link(rawProps: KitProps<LinkProps>) {
  const { props } = useKitProps(rawProps)
  const navigate = useNavigate()
  return (
    <Piv<'a'>
      class='Link'
      icss={{ textDecoration: 'none', transition: '150ms', cursor: 'pointer' }}
      render:self={(selfProps) =>
        props.innerRoute
          ? renderHTMLDOM('span', selfProps)
          : renderHTMLDOM('a', selfProps, {
              href: props.href,
              rel: 'nofollow noopener noreferrer',
              target: '_blank',
            })
      }
      shadowProps={props}
      onClick={() => props.innerRoute && props.href && navigate(props.href)}
    />
  )
}

const domMap = (props: any, additionalProps: any) => ({
  a: () => <a {...props} {...additionalProps} />, // for lazy invoke
  span: () => <span {...props} {...additionalProps} />, // for lazy invoke
  div: () => <div {...props} {...additionalProps} />, // for lazy invoke
  p: () => <p {...props} {...additionalProps} />, // for lazy invoke
  nav: () => <nav {...props} {...additionalProps} />, // for lazy invoke
  img: () => <img {...props} {...additionalProps} />, // for lazy invoke
  button: () => <button {...props} {...additionalProps} />, // for lazy invoke
  input: () => <input {...props} {...additionalProps} />, // for lazy invoke
  details: () => <details {...props} {...additionalProps} />, // for lazy invoke
  summary: () => <summary {...props} {...additionalProps} />, // for lazy invoke
  dialog: () => <dialog {...props} {...additionalProps} />, // for lazy invoke
  label: () => <label {...props} {...additionalProps} />, // for lazy invoke
  form: () => <form {...props} {...additionalProps} />, // for lazy invoke
  iframe: () => <iframe {...props} {...additionalProps} />, // for lazy invoke
  canvas: () => <canvas {...props} {...additionalProps} />, // for lazy invoke
})

export const renderHTMLDOM = (type: HTMLTag, selfProps: PivProps<any, any>, additionalProps?: Record<any, any>) => {
  const { props, ifNeedRenderChildren, ifNeedRenderSelf } = parsePivProps(selfProps)
  if (ifNeedRenderChildren === undefined && ifNeedRenderSelf === undefined) {
    return switchCase(type, domMap(props, additionalProps)) as JSX.Element
  } else if (ifNeedRenderSelf === undefined) {
    return (
      <Show when={ifNeedRenderChildren}>{switchCase(type, domMap(props, additionalProps))?.()}</Show>
    ) as JSX.Element
  } else if (ifNeedRenderChildren === undefined) {
    return (
      <>
        <Show when={ifNeedRenderSelf}>{switchCase(type, domMap(props, additionalProps))?.()}</Show>
        <Show when={!ifNeedRenderSelf}>{props.children}</Show>
      </>
    )
  } else {
    return (
      <Show when={ifNeedRenderChildren}>
        <Show when={ifNeedRenderSelf}>{switchCase(type, domMap(props, additionalProps))?.()}</Show>
        <Show when={!ifNeedRenderSelf}>{props.children}</Show>
      </Show>
    )
  }
}

function switchCase<T extends keyof any, R>(key: T, rules: Partial<Record<T, R>>): R | undefined
function switchCase<T, R>(key: T, rules: Partial<Map<T, R>>): R | undefined
function switchCase<T, R>(key: T, rules: [matchCase: T | ((key: T) => boolean), returnValue: R][]): R | undefined
function switchCase<T, R>(
  key: T,
  rules:
    | [matchCase: T | ((key: T) => boolean), returnValue: R][]
    | Partial<Map<T, R>>
    | Partial<Record<T & keyof any, R>>
): R | undefined {
  const switchRules = isArray(rules) ? rules : isMap(rules) ? rules.entries() : Object.entries(rules)
  for (const [matchCase, returnValue] of switchRules) {
    if (isFunction(matchCase) ? matchCase(key) : key === matchCase) return returnValue as R
  }
  return undefined
}
