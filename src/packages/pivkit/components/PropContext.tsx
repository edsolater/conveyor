// create a context  to past props
/**
 * this component is related to useKitProps
 */
import { JSXElement, createContext, useContext } from 'solid-js'
import { PivProps, ValidProps, mergeProps } from '../piv'

/** add props is implied by solidjs context */
const InnerPropContext = createContext<{ props: unknown; when: PropContextWhen }[]>()

type PropContextWhen = (info: { componentName: string }) => boolean

// TODO: <Context.Provider> now only JSXElement not ()=>JSXElement, so should create <Fragnment> component to accept controller
export function PropContext<Props extends ValidProps = PivProps>(props: {
  additionalProps: Props
  when?: PropContextWhen
  children?: JSXElement
}) {
  const parentPropContext = useContext(InnerPropContext)
  return (
    <InnerPropContext.Provider
      value={
        parentPropContext
          ? [...parentPropContext, { props: props.additionalProps, when: props.when ?? (() => true) }]
          : [{ props: props.additionalProps, when: props.when ?? (() => true) }]
      }
    >
      {props.children}
    </InnerPropContext.Provider>
  )
}

/** add additional prop through solidjs context */
export function getPropsFromPropContextContext(componentInfo: { componentName: string }): ValidProps | undefined {
  const parentPropContext = useContext(InnerPropContext)
  const props = parentPropContext?.map(({ props, when }) => (when(componentInfo) ? (props as ValidProps) : undefined))
  const merged = props && mergeProps(...props)
  return merged
}
