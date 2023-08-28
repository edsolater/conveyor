import { AnyObj, flap, hasProperty, MayArray, shakeNil, shrinkFn } from '@edsolater/fnkit'
import { createSignal } from 'solid-js'
import { KitProps } from '../../createKit'
import { PivProps } from '../Piv'
import { ValidController } from '../typeTools'
import { mergeProps } from '../utils/mergeProps'
import { omit } from '../utils/omit'
import { Plugin } from './plugin'

export const pluginSymbol = Symbol('plugin')

// TODO2: not accessify yet
export function handlePluginProps<P extends AnyObj>(
  props: P,
  getPlugin: (props: PivProps) => PivProps['plugin'] = (props) => props.plugin,
  checkHasPluginProps: (props: PivProps) => boolean = (props) => hasProperty(props, 'plugin')
) {
  if (!props) return props
  if (!checkHasPluginProps(props)) return props
  const plugin = getPlugin(props)
  if (!plugin) return omit(props, 'plugin')
  const flated = flap(plugin).map((i) => (Reflect.has(i, pluginSymbol) ? Reflect.get(i, pluginSymbol) : i))
  const parsed = omit(mergePluginReturnedProps({ plugins: sortPluginByPriority(flated), props }), 'plugin')
  return parsed
}

function sortPluginByPriority(plugins: Plugin<any>[]) {
  if (plugins.length <= 1) return plugins
  if (plugins.every((plugin) => plugin.priority)) return plugins

  // judge whether need sort
  let needSort = false
  let firstPriority = plugins[0].priority
  for (const plugin of plugins) {
    if (plugin.priority !== firstPriority) {
      needSort = true
      break
    }
  }

  return needSort ? plugins.toSorted((pluginA, pluginB) => (pluginB.priority ?? 0) - (pluginA.priority ?? 0)) : plugins
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
