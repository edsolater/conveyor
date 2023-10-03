import { Context, createContext, useContext } from 'solid-js'
import { PivProps, ValidController, ValidProps, mergeProps } from '.'
import { Fragnment } from './Fragnment'
import { WeakerMap, WeakerSet } from '@edsolater/fnkit'

type ControllerContext = Context<ValidController | undefined>
type ComponentName = string

// same component share same ControllerContext
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

const getAllControllerContext = () => [
  ...controllerContextStore.values(),
  ...anonymousComponentControllerContextStore.values(),
]

/** add additional prop through solidjs context */
export function getControllerObjFromControllerContext() {
  const Contexts = getAllControllerContext()
  const contextControllers = Contexts.map(useContext)
  const mergedController = mergeProps(...contextControllers)
  return mergedController
}

/** should handle this only in <Piv> */
export function handlePropsInnerController(props: ValidProps, componentName?: string): ValidProps {
  const inputController = props.innerController as PivProps['innerController']
  // only check props not props.shadowProps
  if (inputController && Object.keys(inputController).length) {
    const ControllerContext = getControllerContext(componentName)
    const newProps = mergeProps(props, {
      'render:outWrapper': (originalNode) => (
        <ControllerContext.Provider value={inputController}>
          <Fragnment>{originalNode}</Fragnment>
        </ControllerContext.Provider>
      ),
    } as Partial<PivProps>)
    return newProps
  }
  return props
}
