import { createSignal } from 'solid-js'
import server$ from 'solid-start/server'
import { NavBar } from '../components/NavBar'
import { LinkCardItem, linkCards } from '../configs/linkCards'
import { useSearch } from '../packages/features/searchItems'
import { Piv } from '../packages/piv'
import { Box, Card, Image, Input, List, Section, Text, icss_card, icss_row } from '../packages/pivkit'
import { GridBox } from '../packages/pivkit/components/Boxes/GridBox'
import { DeMayArray, flap, isString } from '@edsolater/fnkit'
import { Link } from '../components/Link'

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
  const logHello = server$(async (message: string) => {
    console.log('message from server22: ', message)
  })

  const { searchedItems: links } = useSearch(linkCards, searchText, {
    matchConfigs: [(i) => i.name, (i) => i.keywords]
  })

  logHello('Hello')
  return (
    <Piv>
      <NavBar title="Home" />
      <Section icss={{ display: 'grid', justifyContent: 'center' }}>
        <Box icss={[icss_row({ gap: '4px' }), { marginBottom: '8px', fontSize: '2em' }]}>
          <Text>search tags:</Text>
          <Input icss={{ border: 'solid' }} onUserInput={({ text }) => setSearchText(text)} />
        </Box>
        <Piv icss={{ width: '80vw', height: '60vh' }}>
          <List items={links}>
            {(item) => (
              <Card icss={[icss_card]}>
                <GridBox icss:grid={{}}>
                  <Link href={item.site}>
                    <Image src={item.headerLogo}></Image>
                  </Link>
                  <Link href={item.site}>
                    <Text icss={{ fontSize: '2em', fontWeight: 'bold' }}>{item.name}</Text>
                  </Link>
                  <List icss={icss_row({ gap: '.5em' })} items={item.keywords}>
                    {(keyword) => <Text icss={{ fontSize: '1em' }}>{keyword}</Text>}
                  </List>
                  <List items={flap(item.screenshot)}>{(screenshotItem) => <Screenshot item={screenshotItem} />}</List>
                </GridBox>
              </Card>
            )}
          </List>
        </Piv>
      </Section>
    </Piv>
  )
}
function Screenshot(props: { item?: DeMayArray<LinkCardItem['screenshot']> }) {
  const src = () => (isString(props.item) ? props.item : props.item?.src)
  const linkAddress = () => (isString(props.item) ? props.item : props.item?.linkAddress)
  const hasLink = () => !!linkAddress()
  return (
    <>
      {hasLink() ? (
        // TODO: create <Wrap> component , so can write simplier
        <Link href={linkAddress()}>
          <Image icss={{ width: '400px' }} src={src} />
        </Link>
      ) : (
        <Image icss={{ width: '400px' }} src={src} />
      )}
    </>
  )
}
