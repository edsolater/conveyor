import { DeMayArray, flap, isObject, isString } from '@edsolater/fnkit'
import { LinkItem, LinkItemScreenshot } from '../configs/links'
import { Box, Button, Image, Loop, Piv, Text, icssCard, icssGrid, icssGridItem, icssRow } from '@edsolater/pivkit'
import { Link } from './Link'

export function SiteItem(props: { item: LinkItem; level?: number }) {
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

/** get info from site url */
function parseUrl(url: string) {
  const res = fetch('api/parse-site-url', { method: 'POST', body: JSON.stringify({ url }) }).then((i) => i.json())
  res.then((i) => console.log('i: ', i))
}
export function Screenshot(props: { item?: DeMayArray<LinkItemScreenshot>; siteUrl: LinkItem['url'] }) {
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
