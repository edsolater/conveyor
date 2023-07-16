import { DeMayArray, flap, isObject, isString } from '@edsolater/fnkit'
import { Show, createSignal } from 'solid-js'
import { Link } from '../components/Link'
import { NavBar } from '../components/NavBar'
import { SiteCardItem, linkCards } from '../configs/linkCards'
import { useSearch } from '../packages/features/searchItems'
import { Piv } from '../packages/piv'
import { Box, Card, Image, Input, List, Section, Text, icss_card, icss_row } from '../packages/pivkit'
import { GridBox } from '../packages/pivkit/components/Boxes/GridBox'

// export function routeData() {
//   const students = server$(async () => {
//     const response = await fetch('https://api.bilibili.com/x/web-interface/popular')
//     return response
//     const responseJson = await response.json()
//     console.log('responseJson: ', responseJson)
//     return responseJson
//   })

//   students().then((i) => {
//     console.log('i: ', i)
//   })
//   const logHello = server$(async (message: string) => {
//     console.log('message from server: ', message)
//   })

//   logHello('Hello')
// }

function SiteItem(props: { item: SiteCardItem; level?: /* zero or undefined is the top */ number }) {
  return (
    <Card icss={[icss_card]}>
      <GridBox icss:grid={{}}>
        <Link href={props.item.url}>
          <Image src={props.item.headerLogo}></Image>
        </Link>
        <Link href={props.item.url}>
          <Text icss={{ fontSize: '2em', fontWeight: 'bold' }}>{props.item.name}</Text>
        </Link>
        <List icss={icss_row({ gap: '.5em' })} items={props.item.keywords}>
          {(keyword) => <Text icss={{ fontSize: '1em' }}>{keyword}</Text>}
        </List>
        <List items={flap(props.item.screenshot)}>
          {(screenshotItem) => <Screenshot siteUrl={props.item.url} item={screenshotItem} />}
        </List>

        <Show when={props.item.subreddits}>
          <List items={props.item.subreddits}>
            {(subreddit) => <SiteItem item={subreddit} level={(props.level ?? 0) + 1}></SiteItem>}
          </List>
        </Show>
      </GridBox>
    </Card>
  )
}

export default function Home() {
  const [searchText, setSearchText] = createSignal<string>()

  const { searchedItems: links } = useSearch(linkCards, searchText, {
    matchConfigs: [(i) => i.name, (i) => i.keywords]
  })

  return (
    <Piv>
      <NavBar title="Home" />
      <Section icss={{ display: 'grid', justifyContent: 'center' }}>
        <Box icss={[icss_row({ gap: '4px' }), { marginBottom: '8px', fontSize: '2em' }]}>
          <Text>search tags:</Text>
          <Input icss={{ border: 'solid' }} onUserInput={({ text }) => setSearchText(text)} />
        </Box>
        <Piv icss={{ width: '80vw', height: '60vh' }}>
          <List items={links}>{(item) => <SiteItem item={item}></SiteItem>}</List>
        </Piv>
      </Section>
    </Piv>
  )
}

function Screenshot(props: { item?: DeMayArray<SiteCardItem['screenshot']>; siteUrl: SiteCardItem['url'] }) {
  const src = () => (isString(props.item) ? props.item : props.item?.src)
  const detectedLinkAddress = () => (isObject(props.item) ? props.item?.linkAddress : undefined)
  const href = () => detectedLinkAddress() ?? props.siteUrl
  const hasLink = () => !!href()
  return (
    <Link href={href()} show={hasLink()}>
      <Image icss={{ width: '400px' }} src={src} />
    </Link>
  )
}
