import { MayArray, MayFn, flap, shrinkFn } from '@edsolater/fnkit'
import { Accessor, createEffect, createMemo, createSignal } from 'solid-js'
import { onEvent } from '../../domkit'
import { CSSObject, PivProps, createPlugin, mergeProps } from '../piv'

const TransitionPhaseProcessIn = 'during-process'
const TransitionPhaseShowing = 'shown' /* UI visiable and stable(not in transition) */
const TransitionPhaseHidden = 'hidden' /* UI invisiable */

export type TransitionPhase =
  | typeof TransitionPhaseProcessIn
  | typeof TransitionPhaseShowing
  | typeof TransitionPhaseHidden

export type TransitionController = {
  targetDom: Accessor<HTMLElement | undefined>
  currentPhase: Accessor<TransitionPhase>
}
/**
 * it is used for open close
 */
export interface TransitionOptions {
  cssTransitionDurationMs?: number
  cssTransitionTimingFunction?: CSSObject['transitionTimingFunction']

  // detect transition should be turn on
  show?: boolean
  /** will trigger props:onBeforeEnter() if init props:show  */
  appear?: boolean

  enterFromProps?: PivProps
  duringEnterProps?: PivProps
  enterToProps?: PivProps

  leaveFromProps?: PivProps
  duringLeaveProps?: PivProps
  leaveToProps?: PivProps

  /** shortcut for both enterFrom and leaveTo */
  fromProps?: PivProps
  /** shortcut for both enterFrom and leaveTo */
  toProps?: PivProps

  onBeforeEnter?: (payload: { from: TransitionPhase; to: TransitionPhase } & TransitionController) => void
  onAfterEnter?: (payload: { from: TransitionPhase; to: TransitionPhase } & TransitionController) => void
  onBeforeLeave?: (payload: { from: TransitionPhase; to: TransitionPhase } & TransitionController) => void
  onAfterLeave?: (payload: { from: TransitionPhase; to: TransitionPhase } & TransitionController) => void

  presets?: MayArray<MayFn<Omit<TransitionOptions, 'presets'>>>
}
type TransitionApplyPropsTimeName = 'enterFrom' | 'enterTo' | 'leaveFrom' | 'leaveTo'
type TransitionTargetPhase = typeof TransitionPhaseShowing | typeof TransitionPhaseHidden

export const transitionPlugin = createPlugin(
  ({
      cssTransitionDurationMs = 300,
      cssTransitionTimingFunction,

      show,
      appear,

      fromProps,
      toProps,

      enterFromProps = fromProps,
      enterToProps = toProps,
      duringEnterProps,

      leaveFromProps = toProps,
      leaveToProps = fromProps,
      duringLeaveProps,

      onBeforeEnter,
      onAfterEnter,
      onBeforeLeave,
      onAfterLeave,

      presets,

      ...orginalDivProps
    }: TransitionOptions = {}) =>
    (props, { dom }) => {
      const transitionPhaseProps = createMemo(() => {
        const baseTransitionICSS = {
          transition: `${cssTransitionDurationMs}ms`,
          transitionTimingFunction: cssTransitionTimingFunction,
        }
        return {
          enterFrom: mergeProps(
            flap(presets).map((i) => shrinkFn(i)?.enterFromProps),
            duringEnterProps,
            enterFromProps,
            { style: baseTransitionICSS } as PivProps
          ),
          enterTo: mergeProps(
            flap(presets).map((i) => shrinkFn(i)?.enterToProps),
            duringEnterProps,
            enterToProps,
            { style: baseTransitionICSS } as PivProps
          ),
          leaveFrom: mergeProps(
            flap(presets).map((i) => shrinkFn(i)?.leaveFromProps),
            duringLeaveProps,
            leaveFromProps,
            { style: baseTransitionICSS } as PivProps
          ),
          leaveTo: mergeProps(
            flap(presets).map((i) => shrinkFn(i)?.leaveToProps),
            duringLeaveProps,
            leaveToProps,
            { style: baseTransitionICSS } as PivProps
          ),
        } as Record<TransitionApplyPropsTimeName, PivProps>
      })

      const [currentPhase, setCurrentPhase] = createSignal<TransitionPhase>(show && !appear ? 'shown' : 'hidden')
      const targetPhase = createMemo(() => (show ? 'shown' : 'hidden')) as Accessor<TransitionTargetPhase>
      const controller: TransitionController = {
        targetDom: dom,
        currentPhase,
      }
      const isInnerShow = createMemo(
        () => currentPhase() === 'during-process' || currentPhase() === 'shown' || targetPhase() === 'shown'
      )
      const propsName = createMemo<TransitionApplyPropsTimeName>(() =>
        targetPhase() === 'shown'
          ? currentPhase() === 'hidden'
            ? 'enterFrom'
            : 'enterTo'
          : currentPhase() === 'shown'
          ? 'leaveFrom'
          : 'leaveTo'
      )

      // set data-** to element for semantic
      createEffect(() => {
        const el = dom()
        if (el) {
          if (targetPhase() !== currentPhase()) {
            el.dataset['to'] = targetPhase()
          } else {
            el.dataset['to'] = ''
          }
        }
      })

      // make inTransition during state sync with UI event
      // const hasSetOnChangeCallback = useRef(false)
      createEffect(() => {
        const el = dom()
        if (el) {
          onEvent(el, 'transitionend', () => setCurrentPhase(targetPhase()), {
            onlyTargetIsSelf: true /* TODO - add feature: attach max one time  */,
          }) // not event fired by bubbled
        }
      })

      createEffect(() => {
        if (targetPhase() !== currentPhase() && currentPhase() !== 'during-process') {
          console.log('set')
          setCurrentPhase('during-process')
        }
      })

      // invoke callbacks
      createEffect((prevCurrentPhase) => {
        const _currentPhase = currentPhase()
        const _targetPhase = targetPhase()
        const payload = Object.assign({ from: _currentPhase, to: _targetPhase }, controller)
        if (_currentPhase === 'shown' && _targetPhase === 'shown') {
          dom()?.clientHeight // force GPU render frame
          onAfterEnter?.(payload)
        }

        if (_currentPhase === 'hidden' && _targetPhase === 'hidden') {
          dom()?.clientHeight // force GPU render frame
          onAfterLeave?.(payload)
        }

        if (
          (_currentPhase === 'hidden' ||
            (_currentPhase === 'during-process' && prevCurrentPhase === 'during-process')) &&
          _targetPhase === 'shown'
        ) {
          dom()?.clientHeight // force GPU render frame
          onBeforeEnter?.(payload)
        }

        if (
          (_currentPhase === 'shown' ||
            (_currentPhase === 'during-process' && prevCurrentPhase === 'during-process')) &&
          _targetPhase === 'hidden'
        ) {
          dom()?.clientHeight // force GPU render frame
          onBeforeLeave?.(payload)
        }

        return _currentPhase
      })

      return () => mergeProps(orginalDivProps, transitionPhaseProps()[propsName()])
    }
)
