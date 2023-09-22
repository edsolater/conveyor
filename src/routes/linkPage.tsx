import { DeMayArray, MayFn, flap, isObject, isString, shrinkFn } from '@edsolater/fnkit'
import { createSignal } from 'solid-js'
import { Link } from '../components/Link'
import { LinkItem, LinkItemScreenshot, links } from '../configs/links'
import { useSearch } from '../packages/features/searchItems'
import {
  Box,
  Button,
  GridBox,
  GridItem,
  ICSS,
  Image,
  Input,
  Loop,
  Piv,
  Section,
  Text,
  icssCard,
  icssGrid,
  icssGridItem,
  icssRow,
} from '../packages/pivkit'

export default function LinksPage() {
  const [searchText, setSearchText] = createSignal<string>()

  const { searchedItems: searchedLinks } = useSearch(links, searchText, {
    matchConfigs: [(i) => i.name, (i) => i.keywords],
  })

  const visiableLinks = searchedLinks

  // const loadBilibiliPopular = async () => {
  //   const clientRes = await fetch('api/bilibili/popular').then((i) => i.json())
  //   console.log('clientRes: ', clientRes)
  // }

  // const mock = async () => {
  //   fetch('api/mock-from-server', {
  //     method: 'POST', // GET, POST, PUT, DELETE, etc.
  //     headers: {
  //       'Content-Type': 'application/json',
  //       // 'Content-Type': 'application/x-www-form-urlencoded',
  //     },
  //     body: JSON.stringify({
  //       simulateUrl: 'https://api.bilibili.com/x/web-interface/popular',
  //     } as PostBodyData), // body data type must match "Content-Type" header
  //   }).then((i) => i.json())
  // }

  return (
    <Piv>
      <Section name='content' icss={{ display: 'grid', padding: '32px' }}>
        <Box icss={[icssRow({ gap: '4px' }), { marginBottom: '8px', fontSize: '2em' }]}>
          <Text>search tags:</Text>
          <Input icss={{ border: 'solid' }} onUserInput={({ text }) => setSearchText(text)} />
        </Box>

        <Loop of={visiableLinks} icss={icssGrid({ gap: '24px' })}>
          {(item) => <SiteItem item={item} />}
        </Loop>
      </Section>
    </Piv>
  )
}

/** get info from site url */
function parseUrl(url: string) {
  const res = fetch('api/parse-site-url', { method: 'POST', body: JSON.stringify({ url }) }).then((i) => i.json())
  res.then((i) => console.log('i: ', i))
}

function SiteItem(props: { item: LinkItem; level?: /* zero or undefined is the top */ number }) {
  // const {gridContainerICSS, gridItemICSS} = useICSS('Grid')
  return (
    <Piv
      icss={[
        icssCard,
        icssGrid({
          template: `
            "info" auto 
            "sub " auto / 1fr
          `,
          gap: '1em',
        }),
        { color: '#1b1b1d' },
      ]}
    >
      <Box icss={icssGridItem({ area: 'info' })}>
        <Box icss={icssRow({ gap: '8px' })}>
          <Link href={props.item.url}>
            <Box icss={icssRow({ gap: '8px' })}>
              <Piv
                icss={{
                  backgroundColor: '#eee',
                  width: '80px',
                  aspectRatio: '1',
                  borderRadius: '50%',
                  display: 'grid',
                  placeItems: 'center',
                }}
              >
                <Image src={props.item.icon} icss={{ maxWidth: 'calc(100% - 16px)', maxHeight: 'calc(100% - 16px)' }} />
              </Piv>
              <Text icss={{ fontSize: '2em', fontWeight: 'bold' }}>{props.item.name}</Text>
            </Box>
          </Link>
          <Loop of={props.item.keywords} icss={icssRow({ gap: '.5em' })}>
            {(keyword) => <Text icss={{ fontSize: '1em' }}>{keyword}</Text>}
          </Loop>
          <Button onClick={() => props.item.url && parseUrl(props.item.url)}>fetch</Button>
        </Box>
        <Loop of={flap(props.item.screenshots)}>
          {(screenshotItem) => <Screenshot siteUrl={screenshotItem?.url} item={screenshotItem} />}
        </Loop>
      </Box>

      {/* <Box icss={icssGridItem({ area: 'sub' })}>
        <Loop if={props.item.subreddits} of={props.item.subreddits} icss={icssGrid({ templateColumn: '1fr 1fr 1fr' })}>
          {(subreddit) => <SiteSubItem item={subreddit} level={(props.level ?? 0) + 1} />}
        </Loop>
      </Box> */}
    </Piv>
  )
}

function SiteSubItem(props: { item: LinkItem; level?: /* zero or undefined is the top */ number }) {
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
        <Loop of={flap(props.item.screenshots)}>
          {(screenshotItem) => <Screenshot siteUrl={props.item.url} item={screenshotItem} />}
        </Loop>
      </GridItem>

      <GridItem icss:area='sub' />
    </GridBox>
  )
}

function Screenshot(props: { item?: DeMayArray<LinkItemScreenshot>; siteUrl: LinkItem['url'] }) {
  const src = () => (isString(props.item) ? props.item : props.item?.src)
  const detectedLinkAddress = () => (isObject(props.item) ? props.item?.url : undefined)
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
