import { AnyObj, flap, flapDeep, isFunction, MayArray, MayDeepArray, shakeNil } from '@edsolater/fnkit'
import { KitProps } from '../createKit'
import { PivProps } from '../types/piv'
import { ValidController } from '../types/tools'
import { mergeProps } from '../utils/mergeProps'
import { omit } from '../utils/omit'
import { createSignal } from 'solid-js'
import { Plugin } from './plugin'

//
// TODO2: not accessify yet
export function handlePluginProps<P extends AnyObj>(
  props: P,
  getPlugin: (props: PivProps) => PivProps['plugin'] = (props) => props.plugin,
  checkHasPlugin: (props: PivProps) => boolean = (props) => 'plugin' in props
) {
  if (!props) return props
  if (!checkHasPlugin(props)) return props
  const plugin = getPlugin(props)
  if (!plugin) return props
  return omit(mergePluginReturnedProps({ plugins: sortPluginByPriority(plugin), props }), 'plugin')
}

export function sortPluginByPriority(deepPluginList?: MayDeepArray<Plugin<any>>) {
  const plugins = shakeNil(flapDeep(deepPluginList))
  if (plugins.length <= 1) return plugins
  if (plugins.every((p) => isFunction(p) || !p.priority)) return plugins

  return [...plugins].sort((pluginA, pluginB) => {
    const priorityA = isFunction(pluginA) ? 0 : pluginA.priority
    const priorityB = isFunction(pluginB) ? 0 : pluginB.priority
    return (priorityB ?? 0) - (priorityA ?? 0)
  })
}
/**
 * merge additional props from plugin
 */

export function mergePluginReturnedProps<T extends AnyObj>({
  plugins,
  props,
}: {
  plugins: MayArray<Plugin<T> | undefined>
  props: T & PivProps
}): T & PivProps {
  return plugins
    ? shakeNil(flap(plugins)).reduce((acc, plugin) => {
        const pluginProps = invokePlugin(plugin, acc)
        return pluginProps ? mergeProps(acc, pluginProps) : acc
      }, props)
    : props
}
/** core */
function invokePlugin(plugin: Plugin<any>, props: KitProps<any>) {
  const [controller, setController] = createSignal<ValidController>({})
  const [dom, setDom] = createSignal<HTMLElement>()

  const pluginProps = isFunction(plugin)
    ? plugin(props, { controller, dom })
    : plugin.pluginCoreFn?.(props, { controller, dom })
  const returnProps = mergeProps(props, pluginProps, { controllerRef: setController, domRef: setDom })
  return returnProps
}
