import { Context, createContext, useContext } from 'solid-js'
import { PivChild, PivProps, ValidController, ValidProps, mergeProps } from '.'
import { Fragnment } from './Fragnment'
import { WeakerMap, WeakerSet } from '@edsolater/fnkit'

type ControllerContext = Context<ValidController | undefined>
type ComponentName = string
const controllerContextStore = new WeakerMap<ComponentName, ControllerContext>()
const anonymousComponentControllerContextStore = new WeakerSet<ControllerContext>()

/**
 * same componentName will output same context
 */
export function getControllerContext(name?: ComponentName) {
  if (name) {
    if (controllerContextStore.has(name)) {
      return controllerContextStore.get(name)!
    } else {
      const InnerControllerContext: ControllerContext = createContext()
      controllerContextStore.set(name, InnerControllerContext)
      return InnerControllerContext
    }
  } else {
    const InnerAnonymousControllerContext: ControllerContext = createContext()
    anonymousComponentControllerContextStore.add(InnerAnonymousControllerContext)
    return InnerAnonymousControllerContext
  }
}
const getAllControllerContext = () => [...controllerContextStore.values(), ...anonymousComponentControllerContextStore.values()]

/** add additional prop through solidjs context */
export function getControllerObjFromControllerContext() {
  const contextControllers = getAllControllerContext().map(useContext)
  const mergedController = mergeProps(...contextControllers)
  return mergedController
}

/**
 * used in useKitProps and piv\
 * so ControllerContext will auto input by set prop:innerController
 */
function ControllerContext(props: { componentName: string; controller: ValidController; children?: PivChild }) {
  const ControllerContext = getControllerContext(props.componentName)
  return (
    <ControllerContext.Provider value={props.controller}>
      <Fragnment>{props.children}</Fragnment>
    </ControllerContext.Provider>
  )
}

export function handlePropsInnerController(props: ValidProps, componentName: string): ValidProps {
  const innerController = props.innerController as PivProps['innerController']
  // only check props not props.shadowProps
  if (innerController) {
    const newProps = mergeProps(props, {
      shadowProps: {
        'render:outWrapper': (originalNode) => (
          <ControllerContext controller={innerController} componentName={componentName}>
            {originalNode}
          </ControllerContext>
        ),
      } as Partial<PivProps>,
    })
    return newProps
  }
  return props
}
