import { DeMayArray, MayFn, flap, isObject, isString, shrinkFn } from '@edsolater/fnkit'
import { Show, createEffect, createSignal } from 'solid-js'
import { Link } from '../components/Link'
import { NavBar } from '../components/NavBar'
import { SiteCardItem, linkCards } from '../configs/linkCards'
import { useSearch } from '../packages/features/searchItems'
import { ICSS, Piv } from '../packages/piv'
import {
  Box,
  Card,
  GridBox,
  GridItem,
  Image,
  Input,
  Loop,
  Section,
  Text,
  icssCard,
  icssGrid,
  icssRow,
} from '../packages/pivkit'

function SiteItem(props: { item: SiteCardItem; level?: /* zero or undefined is the top */ number }) {
  // const {gridContainerICSS, gridItemICSS} = useICSS('Grid')
  return (
    <Card icss={[icssCard()]}>
      <GridBox
        icss:grid={{
          template: `
            "info" auto 
            "sub " auto / 1fr
          `,
          gap: '1em',
        }}
      >
        <GridItem icss:area='info'>
          <Link href={props.item.url}>
            <Image src={props.item.headerLogo} css:width='50px' />
          </Link>
          <Link href={props.item.url}>
            <Text icss={{ fontSize: '2em', fontWeight: 'bold' }}>{props.item.name}</Text>
          </Link>
          <Loop icss={icssRow({ gap: '.5em' })} of={props.item.keywords}>
            {(keyword) => <Text icss={{ fontSize: '1em' }}>{keyword}</Text>}
          </Loop>
          <Loop of={flap(props.item.screenshot)}>
            {(screenshotItem) => <Screenshot siteUrl={props.item.url} item={screenshotItem} />}
          </Loop>
        </GridItem>

        <GridItem icss:area='sub'>
          <Loop
            if={props.item.subreddits}
            of={props.item.subreddits}
            icss={icssGrid({ templateColumn: '1fr 1fr 1fr' })}
          >
            {(subreddit) => <SiteSubItem item={subreddit} level={(props.level ?? 0) + 1}></SiteSubItem>}
          </Loop>
        </GridItem>
      </GridBox>
    </Card>
  )
}

function SiteSubItem(props: { item: SiteCardItem; level?: /* zero or undefined is the top */ number }) {
  return (
    <GridBox
      icss:grid={{
        template: `
            "info" auto 
            "sub " auto / 1fr
          `,
      }}
    >
      <GridItem icss:area='info'>
        <Link href={props.item.url}>
          <Image src={props.item.headerLogo} css:width='50px' />
        </Link>
        <Link href={props.item.url}>
          <Text icss={{ fontSize: '2em', fontWeight: 'bold' }}>{props.item.name}</Text>
        </Link>
        <Loop icss={icssRow({ gap: '.5em' })} of={props.item.keywords}>
          {(keyword) => <Text icss={{ fontSize: '1em' }}>{keyword}</Text>}
        </Loop>
        <Loop of={flap(props.item.screenshot)}>
          {(screenshotItem) => <Screenshot siteUrl={props.item.url} item={screenshotItem} />}
        </Loop>
      </GridItem>

      <GridItem icss:area='sub'></GridItem>
    </GridBox>
  )
}

export default function Home() {
  const [searchText, setSearchText] = createSignal<string>()

  const { searchedItems: links } = useSearch(linkCards, searchText, {
    matchConfigs: [(i) => i.name, (i) => i.keywords],
  })
  createEffect(() => {
    console.log(links())
  })
  return (
    <Piv>
      <NavBar title='Home' />

      <Section name='content' icss={{ display: 'grid', padding: '32px' }}>
        <Box icss={[icssRow({ gap: '4px' }), { marginBottom: '8px', fontSize: '2em' }]}>
          <Text>search tags:</Text>
          <Input icss={{ border: 'solid' }} onUserInput={({ text }) => setSearchText(text)} />
        </Box>

        <Loop of={links} icss={icssGrid({ gap: '32px' })}>
          {(item) => <SiteItem item={item}></SiteItem>}
        </Loop>
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
