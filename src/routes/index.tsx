import { createSignal } from 'solid-js'
import server$ from 'solid-start/server'
import { NavBar } from '../components/NavBar'
import { linkCards } from '../configs/linkCards'
import { useSearch } from '../packages/features/searchItems'
import { Piv } from '../packages/piv'
import { Box, Card, Input, List, Section, Text, icss_card, icss_row } from '../packages/pivkit'

export function routeData() {
  const students = server$(async () => {
    const response = await fetch('https://api.bilibili.com/x/web-interface/popular')
    return response
    const responseJson = await response.json()
    console.log('responseJson: ', responseJson)
    return responseJson
  })

  students().then((i) => {
    console.log('i: ', i)
  })
  const logHello = server$(async (message: string) => {
    console.log('message from server: ', message)
  })

  logHello('Hello')
}

export default function Home() {
  const [searchText, setSearchText] = createSignal<string>()
  const links = useSearch(() => linkCards, searchText, { matchConfigs: [(i) => i.name, (i) => i.keywords] })
  const logHello = server$(async (message: string) => {
    console.log('message from server22: ', message)
  })

  logHello('Hello')
  return (
    <Piv>
      <NavBar title="Home" />
      <Section icss={{ display: 'grid', justifyContent: 'center' }}>
        <Box icss={[icss_row({ gap: '4px' }), { marginBottom: '8px' }]}>
          <Text>search tags:</Text>
          <Input onUserInput={({ text }) => setSearchText(text)} />
        </Box>
        <Piv icss={{ width: '80vw', height: '60vh' }}>
          <List items={links}>
            {(item) => (
              <Card icss={[icss_card, icss_row({ gap: '.5em', items: 'center' })]}>
                <Text icss={{ fontSize: '2em', fontWeight: 'bold' }}>{item.name}</Text>
                <List icss={icss_row({ gap: '.5em' })} items={item.keywords}>
                  {(keyword) => <Text icss={{ fontSize: '1em' }}>{keyword}</Text>}
                </List>
              </Card>
            )}
          </List>
        </Piv>
      </Section>
    </Piv>
  )
}
