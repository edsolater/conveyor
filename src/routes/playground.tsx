import { Show, createEffect, createSignal, onCleanup } from 'solid-js'
import { CircularProgress } from '../components/CircularProgress'
import { ExamplePanel } from '../components/ExamplePanel'
import { NavBar } from '../components/NavBar'
import { useLoopPercent } from '../hooks/useLoopPercent'
import { Piv, useComponentController } from '../packages/pivkit/piv'
import {
  Box,
  Button,
  Drawer,
  DrawerController,
  Input,
  List,
  Modal,
  ModalController,
  Radio,
  Switch,
  Text,
  createIncresingAccessor,
  createIntervalEffect,
  createRef,
  icssCol,
  icssRow,
  renderSwitchThumb,
  useCSSTransition,
} from '../packages/pivkit'
import { createUUID } from '../packages/pivkit/hooks/utils/createUUID'
import { createTriggerController } from '../packages/pivkit/hooks/utils/createTriggerController'
import { onEvent } from '../packages/domkit'
import { usePopoverLocation } from '../packages/pivkit/pluginComponents/popover/usePopoverLocation'

export default function PlaygroundPage() {
  return (
    <Piv>
      <NavBar title='Playground' />
      <PlaygoundList />
    </Piv>
  )
}

function PlaygoundList() {
  return (
    <Box
      icss={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
        padding: '16px 32px 0',
        gap: '16px',
      }}
    >
      <ExamplePanel name='IntervalCircle'>
        <CircularProgressExample />
      </ExamplePanel>

      <ExamplePanel name='Drawer'>
        <DrawerExample />
      </ExamplePanel>

      <ExamplePanel name='CSSTransition'>
        <CSSTransitionExample />
      </ExamplePanel>

      <ExamplePanel name='Input'>
        <InputExample />
      </ExamplePanel>

      <ExamplePanel name='Text'>
        <TextExample />
      </ExamplePanel>

      <ExamplePanel name='Modal'>
        <ModalExample />
      </ExamplePanel>

      <ExamplePanel name='List'>
        <ListExample />
      </ExamplePanel>

      <ExamplePanel name='Switch'>
        <SwitchExample />
      </ExamplePanel>

      <ExamplePanel name='Radio'>
        <RadioExample />
      </ExamplePanel>

      <ExamplePanel name='Popover'>
        <PopoverExample />
      </ExamplePanel>

      <Foo />
    </Box>
  )
}

function Foo() {
  const [count, setCount] = createSignal(0)
  createEffect(() => {
    const timeoutId = setInterval(() => {
      setCount((c) => c + 1)
    }, 1000)
    onCleanup(() => clearInterval(timeoutId))
  })
  return (
    <Piv onClick={(console.log('why render?'), ()=>{})} icss={[{ width: count() + 'px' }]}>
      {console.log('render once')}
      {count()}
    </Piv>
  )
}
/**
 *
 * @todo 1. fade out when come to the end, not play track back.
 * @todo 2. make percent handler to be a hook
 */
function CircularProgressExample() {
  const { percent } = useLoopPercent()
  return <CircularProgress percent={percent()} />
}

function DrawerExample() {
  const drawerController = useComponentController<DrawerController>('big-drawer')
  return (
    <>
      <Button
        onClick={() => {
          console.log('drawerController: ', drawerController)
          return drawerController.toggle?.()
        }}
      >
        Open
      </Button>
      <Drawer id='big-drawer' />
    </>
  )
}

function ModalExample() {
  const modalController = useComponentController<ModalController>('example-modal')
  const modalController2 = useComponentController<ModalController>('example-modal2')
  const couter = createIncresingAccessor()
  return (
    <>
      <Button onClick={() => modalController.toggle?.()}>Open</Button>
      <Modal id='example-modal' isModal>
        Modal1
      </Modal>
      <Button onClick={() => modalController2.toggle?.()}>Open</Button>
      <Modal id='example-modal2' isModal>
        Modal2 + {couter()}
      </Modal>
    </>
  )
}

function CSSTransitionExample() {
  const [show, setShow] = createSignal(false)

  // TODO: invoke in  plugin
  const { transitionProps, refSetter } = useCSSTransition({
    show,
    onAfterEnter() {},
    onBeforeEnter() {},
    fromProps: { icss: { width: '100px' } },
    toProps: { icss: { width: '200px' } },
  })

  // createEffect(() => {
  //   // @ts-ignore
  //   console.log('transitionProps: ', transitionProps().icss?.width)
  //   console.log('show: ', show())
  // })

  return (
    <>
      <Button onClick={() => setShow((b) => !b)}>Toggle</Button>
      <Piv
        domRef={refSetter}
        shadowProps={transitionProps()}
        icss={{ backgroundColor: 'dodgerblue', height: '200', display: 'grid', placeItems: 'center' }}
      >
        <Box>hello</Box>
      </Piv>
    </>
  )
}

function InputExample() {
  const [controlledValue, setControlledValue] = createSignal<string>()
  setInterval(() => {
    setControlledValue((s) => (s ?? '') + '1')
  }, 500)
  return (
    <Input
      value={controlledValue}
      icss={{ border: 'solid' }}
      onUserInput={({ text }) => {
        setControlledValue(text)
      }}
    />
  )
}

function SwitchExample() {
  const [checked, setChecked] = createSignal(false)

  createIntervalEffect(() => {
    setChecked((b) => !b)
  }, 1200)

  return (
    <>
      <Piv
        class={checked() ? 'checked' : ''}
        render:firstChild={
          <Piv
            icss={{
              color: checked() ? 'dodgerblue' : 'crimson',
              width: '0.5em',
              height: '0.5em',
              backgroundColor: 'currentcolor',
              transition: '300ms',
            }}
          />
        }
      />
      <Switch
        name='theme-switch'
        isChecked={checked()}
        style={({ isChecked }) => ({ color: isChecked() ? 'snow' : 'white' })} // <-- will cause rerender , why?
        plugin={renderSwitchThumb()}
      />
    </>
  )
}

function TextExample() {
  return <Text editable>can edit content</Text>
}

function ListExample() {
  const mockData = [
    { name: 'a', count: 1 },
    { name: 'b', count: 2 },
    { name: 'c', count: 3 },
    { name: 'd', count: 4 },
    { name: 'e', count: 5 },
    { name: 'f', count: 6 },
    { name: 'g', count: 7 },
    { name: 'h', count: 8 },
    { name: 'i', count: 9 },
    { name: 'j', count: 10 },
    { name: 'k', count: 11 },
    { name: 'l', count: 12 },
    { name: 'm', count: 13 },
    { name: 'n', count: 14 },
    { name: 'o', count: 15 },
    { name: 'p', count: 16 },
    { name: 'q', count: 17 },
    { name: 'r', count: 18 },
    { name: 's', count: 19 },
    { name: 't', count: 20 },
    { name: 'u', count: 21 },
    { name: 'v', count: 22 },
    { name: 'w', count: 23 },
    { name: 'x', count: 24 },
    { name: 'y', count: 25 },
    { name: 'z', count: 26 },
    { name: 'aa', count: 26 + 1 },
    { name: 'ab', count: 26 + 2 },
    { name: 'ac', count: 26 + 3 },
    { name: 'ad', count: 26 + 4 },
    { name: 'ae', count: 26 + 5 },
    { name: 'af', count: 26 + 6 },
    { name: 'ag', count: 26 + 7 },
    { name: 'ah', count: 26 + 8 },
    { name: 'ai', count: 26 + 9 },
    { name: 'aj', count: 26 + 10 },
    { name: 'ak', count: 26 + 11 },
    { name: 'al', count: 26 + 12 },
    { name: 'am', count: 26 + 13 },
    { name: 'an', count: 26 + 14 },
    { name: 'ao', count: 26 + 15 },
    { name: 'ap', count: 26 + 16 },
    { name: 'aq', count: 26 + 17 },
    { name: 'ar', count: 26 + 18 },
    { name: 'as', count: 26 + 19 },
    { name: 'at', count: 26 + 20 },
    { name: 'au', count: 26 + 21 },
    { name: 'av', count: 26 + 22 },
    { name: 'aw', count: 26 + 23 },
    { name: 'ax', count: 26 + 24 },
    { name: 'ay', count: 26 + 25 },
    { name: 'az', count: 26 + 26 },
  ]
  const [data, setData] = createSignal<typeof mockData>([])
  const increaseCount = createIncresingAccessor()
  createEffect(() => {
    setTimeout(() => {
      setData(mockData)
    }, 100)
  })
  return (
    <List of={data} initRenderCount={10} icss={[icssCol({ gap: '16px' }), { height: '30dvh' }]}>
      {(d, idx) => {
        console.count(`render item from <Playground>, ${d.name}, ${d.count}`)
        return (
          <Box icss={[icssRow({ gap: '8px' }), { background: '#0001', width: '100%' }]}>
            <Text>{d.name}</Text>
            <Text>{d.count + increaseCount()}</Text>
          </Box>
        )
      }}
    </List>
  )
}

function RadioExample() {
  const [checked, setChecked] = createSignal(false)
  createIntervalEffect(() => {
    setChecked((b) => !b)
  }, 1200)
  return <Radio option='gender' isChecked={checked()} />
}

function PopoverExample() {
  const { trigger, isTriggerOn } = createTriggerController()

  const [popoverDom, setPopoverDom] = createRef<HTMLElement>()

  // open popover by state
  createEffect(() => {
    if (isTriggerOn()) {
      // @ts-expect-error ts dom not ready yet
      popoverDom()?.showPopover?.()
    } else {
      // @ts-expect-error ts dom not ready yet
      popoverDom()?.hidePopover?.()
    }
  })

  // listen to popover toggle event and reflect to trigger state
  createEffect(() => {
    const el = popoverDom()
    if (!el) return
    const { abort } = onEvent(el, 'toggle', ({ ev }) => {
      // @ts-expect-error force
      const { newState } = ev as { newState: 'open' | 'closed' }
      if (newState === 'open') {
        trigger.turnOn(el)
      } else {
        trigger.turnOff(el)
      }
    })
    onCleanup(abort)
  })
  const [buttonDom, setButtonDom] = createRef<HTMLElement>()
  const { panelStyle } = usePopoverLocation({
    buttonDom: buttonDom,
    panelDom: popoverDom,
    isTriggerOn,
  })
  return (
    <>
      <Button
        domRef={setButtonDom}
        onClick={({ el }) => {
          trigger.toggle(el)
        }}
      >
        💬popover
      </Button>

      <Box
        domRef={setPopoverDom}
        icss={{ border: 'solid', width: '', minHeight: '5em' }}
        htmlProps={{ popover: 'manual' }}
        style={panelStyle()}
      >
        hello world
      </Box>
    </>
  )
}
