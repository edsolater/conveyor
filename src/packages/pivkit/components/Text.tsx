import { KitProps, Piv, useKitProps } from '../piv'

export type TextProps = KitProps<{
  inline?: boolean
  /** if true, it is 'text' */
  editable?: boolean | 'text' | 'all'
  /**
   *  all widgets should have `props:v`, to handle it's duty's property \
   *  you should directily use `props.children` if possiable, this prop is for batch processing
   */
  value?: string | number
}>

/**
 * @componentType widget
 * if for layout , inner content should only be text
 */
export function Text(rawProps: TextProps) {
  const { props } = useKitProps(rawProps, { name: 'Text' })

  const contentEditableValue =
    props.editable != null
      ? props.editable
        ? props.editable === 'text' || props.editable === true
          ? 'plaintext-only'
          : 'true'
        : 'false'
      : undefined

  return (
    <Piv
      icss={{
        display: props.inline ? 'inline-block' : undefined,
      }}
      // @ts-ignore no need this check
      htmlProps={{
        contentEditable: contentEditableValue,
      }}
      shadowProps={props}
      class='Text'
    />
  )
}
