import { AnyObj, mergeObjects, overwriteFunctionName } from '@edsolater/fnkit'
import { Accessor } from 'solid-js'
import { SettingsFunction, createSettingsFunction } from '../../../fnkit/createSettingsFunction'
import { KitProps } from '../../createKit'
import { Accessify } from '../../utils'
import { ValidController, ValidProps } from '../typeTools'

export type GetPluginParams<T> = T extends Plugin<infer Px1>
  ? Px1
  : T extends Plugin<infer Px1>[]
  ? Px1
  : T extends (Plugin<infer Px1> | Plugin<infer Px2>)[]
  ? Px1 & Px2
  : T extends (Plugin<infer Px1> | Plugin<infer Px2> | Plugin<infer Px3>)[]
  ? Px1 & Px2 & Px3
  : T extends (Plugin<infer Px1> | Plugin<infer Px2> | Plugin<infer Px3> | Plugin<infer Px4>)[]
  ? Px1 & Px2 & Px3 & Px4
  : T extends (Plugin<infer Px1> | Plugin<infer Px2> | Plugin<infer Px3> | Plugin<infer Px4> | Plugin<infer Px5>)[]
  ? Px1 & Px2 & Px3 & Px4 & Px5
  : unknown

export type Plugin<
  PluginOptions extends Record<string, any>,
  T extends ValidProps = any,
  C extends ValidController = ValidController
> = SettingsFunction<{
  (options?: PluginOptions): (
    props: T,
    utils: {
      /** only in component has controller, or will be an empty object*/
      controller: Accessor<C>
      dom: Accessor<HTMLElement | undefined>
    }
  ) => Accessify<Partial<KitProps<T, C>>> | undefined | void // TODO: should support 'plugin' and 'shadowProps' for easier compose
  priority?: number
  pluginName?: string
}>

// 💡 TODO: plugin should also can used like normal `const { state } = useHooks()` or `const { isHover } = usePlugin(hoverPlugin, options)`
/** plugin can only have one level */
export function createPlugin<
  Options extends AnyObj,
  State extends AnyObj = any,
  Props extends ValidProps = ValidProps,
  Controller extends ValidController = ValidController
>(
  createrFn: (
    options: Options,
    addHookState: (state: Partial<State>) => void
  ) => (
    props: Props,
    utils: {
      controller: Accessor<Controller>
      dom: Accessor<HTMLElement | undefined>
    }
  ) => Accessify<Partial<Props>>, // return a function , in this function can exist hooks
  options?: {
    defaultSettings?: Partial<Options>
    priority?: number // NOTE -1:  it should be render after final prop has determine
    name?: string
  }
): Plugin<Options> {
  const status = {} as State
  function setStatus(state: Partial<State>) {
    mergeObjects(status, state)
  }
  const factory = createSettingsFunction((params: Options) => createrFn(params, setStatus), options?.defaultSettings)
  Object.assign(factory, options)
  // rename
  const fn = options?.name ? overwriteFunctionName(factory, options.name) : factory

  // @ts-expect-error no need to check
  return fn
}
