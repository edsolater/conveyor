import { DeMayArray, MayFn, flap, isObject, isString, shrinkFn } from '@edsolater/fnkit'
import { Show, createMemo, createSignal } from 'solid-js'
import { Link } from '../components/Link'
import { NavBar } from '../components/NavBar'
import { SiteCardItem, linkCards } from '../configs/linkCards'
import { useSearch } from '../packages/features/searchItems'
import { ICSS, Piv } from '../packages/piv'
import { Box, Card, GridBox, Image, Input, List, Loop, Section, Text, icss_card, icss_row } from '../packages/pivkit'

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
        <Loop icss={icss_row({ gap: '.5em' })} of={props.item.keywords}>
          {(keyword) => <Text icss={{ fontSize: '1em' }}>{keyword}</Text>}
        </Loop>
        <Loop of={flap(props.item.screenshot)}>
          {(screenshotItem) => <Screenshot siteUrl={props.item.url} item={screenshotItem} />}
        </Loop>

        <Show when={props.item.subreddits}>
          <Loop of={props.item.subreddits}>
            {(subreddit) => <SiteItem item={subreddit} level={(props.level ?? 0) + 1}></SiteItem>}
          </Loop>
        </Show>
      </GridBox>
    </Card>
  )
}

export default function Home() {
  const [searchText, setSearchText] = createSignal<string>()

  const { searchedItems: links } = useSearch(linkCards, searchText, {
    matchConfigs: [(i) => i.name, (i) => i.keywords],
  })
  return (
    <Piv>
      <NavBar title='Home' />
      <Section icss={{ display: 'grid', justifyContent: 'center' }}>
        <Box icss={[icss_row({ gap: '4px' }), { marginBottom: '8px', fontSize: '2em' }]}>
          <Text>search tags:</Text>
          <Input icss={{ border: 'solid' }} onUserInput={({ text }) => setSearchText(text)} />
        </Box>
        <Piv icss={{ width: '80vw', height: '60vh' }}>
          <Loop of={links}>{(item) => <SiteItem item={item}></SiteItem>}</Loop>
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
    <Link href={href()} ifSelfShown={hasLink()}>
      <Image icss={{ width: '400px' }} src={src} />
    </Link>
  )
}

//TODO: should be a plugin
function icss_onlyContent(opt?: { nodeShown?: MayFn<boolean> }): ICSS {
  const nodeShown = !!shrinkFn(opt?.nodeShown)
  return { all: nodeShown ? undefined : 'inherit', display: nodeShown ? undefined : 'contents' }
}
