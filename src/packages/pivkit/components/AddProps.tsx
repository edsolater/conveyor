// create a context  to past props
/**
 * this component is related to useKitProps
 */
import { JSXElement, createContext, mergeProps, useContext } from 'solid-js';
import { PivProps, ValidProps } from '../piv';

/** add props is implied by solidjs context */
const InnerPropContext = createContext<{ props: unknown; when: AddPropsWhen }[]>()

type AddPropsWhen = (info: { componentName: string }) => boolean

export function AddProps<Props extends ValidProps = PivProps>(props: {
  additionalProps: Props
  when?: AddPropsWhen
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
export function getPropsFromAddPropsContext(componentInfo: { componentName: string }): ValidProps | undefined {
  const parentPropContext = useContext(InnerPropContext)
  const props = parentPropContext?.map(({ props, when }) => (when(componentInfo) ? (props as ValidProps) : undefined))
  const merged = props && mergeProps(...props)
  return merged
}
