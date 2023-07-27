import { KitProps, Piv, useKitProps } from '../../piv'

export type SectionProps = KitProps<{
  name?: string
}>

/**
 * if for layout , don't render important content in Box
 */
export function Section(rawProps: SectionProps) {
  const { shadowProps, props } = useKitProps(rawProps, { name: 'Section' })
  /* ---------------------------------- props --------------------------------- */
  return <Piv class={`Section ${props.name ?? ''}`} shadowProps={shadowProps} />
}
