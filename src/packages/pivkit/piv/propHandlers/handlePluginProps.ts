import { AnyObj, flap, MayArray, shakeNil, shrinkFn } from '@edsolater/fnkit'
import { createSignal } from 'solid-js'
import { KitProps } from '../../createKit'
import { PivProps } from '../Piv'
import { ValidController } from '../typeTools'
import { mergeProps } from '../utils/mergeProps'
import { omit } from '../utils/omit'
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
  if (!plugin) return omit(props, 'plugin')
  const flated = flap(plugin).map((i) => ('plugin' in i ? i.plugin : i))
  const parsed = omit(mergePluginReturnedProps({ plugins: sortPluginByPriority(flated), props }), 'plugin')
  return parsed
}

function sortPluginByPriority(plugins: Plugin<any>[]) {
  if (plugins.length <= 1) return plugins
  if (plugins.every((plugin) => plugin.priority)) return plugins

  return [...plugins].sort((pluginA, pluginB) => {
    const priorityA = pluginA.priority ?? 0
    const priorityB = pluginB.priority ?? 0
    return (priorityB ?? 0) - (priorityA ?? 0)
  })
}
/**
 * merge additional props from plugin
 */

function mergePluginReturnedProps<T extends AnyObj>({
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

  const pluginProps = shrinkFn(plugin()(props, { controller, dom }))
  const returnProps = mergeProps(props, pluginProps, { controllerRef: setController, domRef: setDom })
  return returnProps
}
