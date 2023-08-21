import { AnyObj, overwriteFunctionName } from '@edsolater/fnkit'
import { KitProps } from '../createKit'
import { ValidController, ValidProps } from '../types/tools'
import { Accessor } from 'solid-js'
import { DeepFunction } from '../../../fnkit/createDeepFunction'

export type GetPluginFactoryParams<T> = T extends Plugin<infer Px1>
  ? Px1
  : T extends Plugin<infer Px1>[]
  ? Px1
  : T extends (Plugin<infer Px1> | Plugin<infer Px2>)[]
  ? Px1 & Px2
  : T extends (Plugin<infer Px1> | Plugin<infer Px2> | Plugin<infer Px3>)[]
  ? Px1 & Px2 & Px3
  : T extends (
      | Plugin<infer Px1>
      | Plugin<infer Px2>
      | Plugin<infer Px3>
      | Plugin<infer Px4>
    )[]
  ? Px1 & Px2 & Px3 & Px4
  : T extends (
      | Plugin<infer Px1>
      | Plugin<infer Px2>
      | Plugin<infer Px3>
      | Plugin<infer Px4>
      | Plugin<infer Px5>
    )[]
  ? Px1 & Px2 & Px3 & Px4 & Px5
  : unknown

/** their should not have PluginFactory just Plugin */
export type Plugin<
  PluginParams extends Record<string, any>,
  T extends ValidProps = any,
  C extends ValidController = ValidController
> = DeepFunction<
  (params?: PluginParams) => {
    (
      props: T,
      utils: {
        /** only in component has controller, or will be an empty object*/
        controller: Accessor<C>
        dom: Accessor<HTMLElement | undefined>
      }
    ): Partial<KitProps<T, C>> | undefined | void // TODO: should support 'plugin' and 'shadowProps' for easier compose
    priority?: number
    pluginName?: string
  }
>


/** plugin can only have one level */
export function createPlugin<Params extends AnyObj, Props extends ValidProps = ValidProps>(
  createrFn: (params?: Params) => (props: Props) => Partial<Props>, // return a function , in this function can exist hooks
  options?: {
    priority?: number // NOTE -1:  it should be render after final prop has determine
    name?: string
  }
): Plugin<Params> {
  const factory = (params: Params) => createrFn(params)
  Object.assign(factory, options)
  // rename
  const fn = options?.name ? overwriteFunctionName(factory, options.name) : factory

  // @ts-expect-error no need to check
  return fn
}
