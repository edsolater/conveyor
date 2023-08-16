import { AnyObj, overwriteFunctionName } from '@edsolater/fnkit'
import { KitProps } from '../createKit'
import { ValidController, ValidProps } from '../types/tools'
import { Accessor } from 'solid-js'

export type GetPluginFactoryParams<T> = T extends PluginFactory<infer Px1>
  ? Px1
  : T extends PluginFactory<infer Px1>[]
  ? Px1
  : T extends (PluginFactory<infer Px1> | PluginFactory<infer Px2>)[]
  ? Px1 & Px2
  : T extends (PluginFactory<infer Px1> | PluginFactory<infer Px2> | PluginFactory<infer Px3>)[]
  ? Px1 & Px2 & Px3
  : T extends (
      | PluginFactory<infer Px1>
      | PluginFactory<infer Px2>
      | PluginFactory<infer Px3>
      | PluginFactory<infer Px4>
    )[]
  ? Px1 & Px2 & Px3 & Px4
  : T extends (
      | PluginFactory<infer Px1>
      | PluginFactory<infer Px2>
      | PluginFactory<infer Px3>
      | PluginFactory<infer Px4>
      | PluginFactory<infer Px5>
    )[]
  ? Px1 & Px2 & Px3 & Px4 & Px5
  : unknown

export type PluginFactory<PluginParams extends Record<string, any>> = (params?: PluginParams) => Plugin<any>

type PluginObject<T extends ValidProps, C extends ValidController> = {
  pluginCoreFn?: (
    props: T,
    utils: {
      /** only in component has controller, or will be an empty object*/
      controller: Accessor<C>
      dom: Accessor<HTMLElement | undefined>
    }
  ) => Partial<KitProps<T, C> | undefined | void> // TODO: should support 'plugin' and 'shadowProps' too
  priority?: number
  affects?: (keyof T)[] // maybe no need
}

type PluginFn<T extends ValidProps, C extends ValidController> = (
  props: T,
  utils: {
    /** only in component has controller, or will be an empty object*/
    controller: Accessor<C>
    dom: Accessor<HTMLElement | undefined>
  }
) => Partial<KitProps<T, C>> | undefined | void // TODO: should support 'plugin' and 'shadowProps' for easier compose

/** plugin can only have one level */
export type Plugin<T extends ValidProps = ValidProps, C extends ValidController = {}> =
  | PluginObject<T, C>
  | PluginFn<T, C>

export function createPluginFactory<Params extends AnyObj, Props extends ValidProps = ValidProps>(
  createrFn: (params?: Params) => (props: Props) => Partial<Props>, // return a function , in this function can exist hooks
  options?: {
    priority?: number // NOTE -1:  it should be render after final prop has determine
    name?: string
    affects?: (keyof Props)[]
  }
): PluginFactory<Params> {
  const factory = (params: Params) => ({
    pluginCoreFn: createrFn(params),
    priority: options?.priority,
    affects: options?.affects,
  })
  // @ts-expect-error no need to check
  return options?.name ? overwriteFunctionName(factory, options.name) : factory
}
