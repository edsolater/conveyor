import { Context, createContext, useContext } from 'solid-js'
import { PivChild, PivProps, ValidController, ValidProps, mergeProps } from '.'
import { Fragnment } from './Fragnment'
import { WeakerMap, WeakerSet } from '@edsolater/fnkit'

type ControllerContext = Context<ValidController | undefined>
type ComponentName = string

// same component share same ControllerContext
const controllerContextStore = new Map<ComponentName, ControllerContext>()
const anonymousComponentControllerContextStore = new Set<ControllerContext>()

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
  console.log('mergedController: ', mergedController, Contexts, contextControllers)
  return mergedController
}

export function handlePropsInnerController(props: ValidProps, componentName?: string): ValidProps {
  const inputController = props.innerController as PivProps['innerController']
  // only check props not props.shadowProps
  if (inputController && Object.keys(inputController).length) {
    console.log('innerController:1', inputController)
    const ControllerContext = getControllerContext(componentName)
    const newProps = mergeProps(props, {
      'render:outWrapper': (originalNode) => {
        console.log('innerController:2', inputController)
        return (
          <ControllerContext.Provider value={inputController}>
            <Fragnment>{originalNode}</Fragnment>
          </ControllerContext.Provider>
        )
      },
    } as Partial<PivProps>)
    return newProps
  }
  return props
}
