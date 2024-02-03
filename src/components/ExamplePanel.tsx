import { Box, KitProps, Piv, Text, useKitProps } from '@edsolater/pivkit'

export interface ExamplePanelProps {
  name?: string
}

export function ExamplePanel(rawProps: KitProps<ExamplePanelProps>) {
  const { props } = useKitProps(rawProps, { name: ExamplePanel.name })
  return (
    <Piv shadowProps={props}>
      <Text icss={{ fontWeight: 'bold', fontSize: 'clamp(14px, 3vw, 52px)' }}>{props.name}</Text>
      <Box icss={{ display: 'grid', gap: '4px' }}>{props.children}</Box>
    </Piv>
  )
}
