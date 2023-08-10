import { NativeProps } from '..'
import { AnyObj, omit, mergeObjects } from '@edsolater/fnkit'
import { Dynamic } from 'solid-js/web'

export const domMap = (props: NativeProps, additionalProps: AnyObj | undefined) => ({
  div: () =>
    additionalProps || 'htmlProps' in props ? (
      <Dynamic component='div' {...mergeObjects(props.htmlProps, omit(props, 'htmlProps'), additionalProps)} />
    ) : (
      <div onClick={props.onClick} ref={props.ref} class={props.class} style={props.style}>
        {props.children}
      </div>
    ),

  span: () =>
    additionalProps || 'htmlProps' in props ? (
      <Dynamic component='span' {...mergeObjects(props.htmlProps, omit(props, 'htmlProps'), additionalProps)} />
    ) : (
      <span onClick={props.onClick} ref={props.ref} class={props.class} style={props.style}>
        {props.children}
      </span>
    ),
  p: () =>
    additionalProps || 'htmlProps' in props ? (
      <Dynamic component='p' {...mergeObjects(props.htmlProps, omit(props, 'htmlProps'), additionalProps)} />
    ) : (
      <p onClick={props.onClick} ref={props.ref} class={props.class} style={props.style}>
        {props.children}
      </p>
    ),
  nav: () =>
    additionalProps || 'htmlProps' in props ? (
      <Dynamic component='nav' {...mergeObjects(props.htmlProps, omit(props, 'htmlProps'), additionalProps)} />
    ) : (
      <nav onClick={props.onClick} ref={props.ref} class={props.class} style={props.style}>
        {props.children}
      </nav>
    ),
  img: () =>
    additionalProps || 'htmlProps' in props ? (
      <Dynamic component='img' {...mergeObjects(props.htmlProps, omit(props, 'htmlProps'), additionalProps)} />
    ) : (
      <img onClick={props.onClick} ref={props.ref} class={props.class} style={props.style}>
        {props.children}
      </img>
    ),
  a: () =>
    additionalProps || 'htmlProps' in props ? (
      <Dynamic component='a' {...mergeObjects(props.htmlProps, omit(props, 'htmlProps'), additionalProps)} />
    ) : (
      <a onClick={props.onClick} ref={props.ref} class={props.class} style={props.style}>
        {props.children}
      </a>
    ),
  button: () =>
    additionalProps || 'htmlProps' in props ? (
      <Dynamic component='button' {...mergeObjects(props.htmlProps, omit(props, 'htmlProps'), additionalProps)} />
    ) : (
      <button onClick={props.onClick} ref={props.ref} class={props.class} style={props.style}>
        {props.children}
      </button>
    ),
  input: () =>
    additionalProps || 'htmlProps' in props ? (
      <Dynamic component='input' {...mergeObjects(props.htmlProps, omit(props, 'htmlProps'), additionalProps)} />
    ) : (
      <input onClick={props.onClick} ref={props.ref} class={props.class} style={props.style}>
        {props.children}
      </input>
    ),
  details: () =>
    additionalProps || 'htmlProps' in props ? (
      <Dynamic component='details' {...mergeObjects(props.htmlProps, omit(props, 'htmlProps'), additionalProps)} />
    ) : (
      <details onClick={props.onClick} ref={props.ref} class={props.class} style={props.style}>
        {props.children}
      </details>
    ),
  summary: () =>
    additionalProps || 'htmlProps' in props ? (
      <Dynamic component='summary' {...mergeObjects(props.htmlProps, omit(props, 'htmlProps'), additionalProps)} />
    ) : (
      <summary onClick={props.onClick} ref={props.ref} class={props.class} style={props.style}>
        {props.children}
      </summary>
    ),
  dialog: () =>
    additionalProps || 'htmlProps' in props ? (
      <Dynamic component='dialog' {...mergeObjects(props.htmlProps, omit(props, 'htmlProps'), additionalProps)} />
    ) : (
      <dialog onClick={props.onClick} ref={props.ref} class={props.class} style={props.style}>
        {props.children}
      </dialog>
    ),
  label: () =>
    additionalProps || 'htmlProps' in props ? (
      <Dynamic component='label' {...mergeObjects(props.htmlProps, omit(props, 'htmlProps'), additionalProps)} />
    ) : (
      <label onClick={props.onClick} ref={props.ref} class={props.class} style={props.style}>
        {props.children}
      </label>
    ),
  form: () =>
    additionalProps || 'htmlProps' in props ? (
      <Dynamic component='form' {...mergeObjects(props.htmlProps, omit(props, 'htmlProps'), additionalProps)} />
    ) : (
      <form onClick={props.onClick} ref={props.ref} class={props.class} style={props.style}>
        {props.children}
      </form>
    ),
  iframe: () =>
    additionalProps || 'htmlProps' in props ? (
      <Dynamic component='iframe' {...mergeObjects(props.htmlProps, omit(props, 'htmlProps'), additionalProps)} />
    ) : (
      <iframe onClick={props.onClick} ref={props.ref} class={props.class} style={props.style}>
        {props.children}
      </iframe>
    ),
  canvas: () =>
    additionalProps || 'htmlProps' in props ? (
      <Dynamic component='canvas' {...mergeObjects(props.htmlProps, omit(props, 'htmlProps'), additionalProps)} />
    ) : (
      <canvas onClick={props.onClick} ref={props.ref} class={props.class} style={props.style}>
        {props.children}
      </canvas>
    ),
  // span: () => <span {...props} {...additionalProps} />,
  // p: () => <p {...props} {...additionalProps} />,
  // nav: () => <nav {...props} {...additionalProps} />,
  // img: () => <img {...props} {...additionalProps} />,
  // button: () => <button {...props} {...additionalProps} />,
  // input: () => <input {...props} {...additionalProps} />,
  // details: () => <details {...props} {...additionalProps} />,
  // summary: () => <summary {...props} {...additionalProps} />,
  // dialog: () => <dialog {...props} {...additionalProps} />,
  // label: () => <label {...props} {...additionalProps} />,
  // form: () => <form {...props} {...additionalProps} />,
  // iframe: () => <iframe {...props} {...additionalProps} />,
  // canvas: () => <canvas {...props} {...additionalProps} />, // for lazy invoke
})
