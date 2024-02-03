import { MayFn, shrinkFn } from '@edsolater/fnkit'
import { createSignal } from 'solid-js'
import { SiteItem } from '../components/SiteItem'
import { LinkItem } from '../configs/links'
import { queryLinks } from '../kv/actions'
import { useDB } from '../kv/hook'
import { useSearch } from '../packages/features/searchItems'
import { Box, ICSS, Input, Loop, Piv, Section, Text, icssGrid, icssRow } from '@edsolater/pivkit'
import { Loading } from '../packages/pivkit/components/Loading'

export default function Home() {
  const [searchText, setSearchText] = createSignal<string>()
  const { data: links, isFetching } = useDB(queryLinks, {
    initDefaultValue: [] as LinkItem[],
    failedFetchFallbackValue: [] as LinkItem[],
  })

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
        <Box icss={[icssRow({ gap: '4px', align: 'center' }), { marginBottom: '8px', fontSize: '1em' }]}>
          <Text>search tags:</Text>
          <Input
            autoFocus
            icss={{ border: 'solid', borderRadius: '100vw' }}
            renderPrefix={'🔎'}
            onUserInput={(text) => setSearchText(text)}
          />
        </Box>

        <Loading isLoading={isFetching} fallback={<Text>fetching...</Text>}>
          <Loop of={visiableLinks} icss={icssGrid({ gap: '24px' })}>
            {(item) => <SiteItem item={item} />}
          </Loop>
        </Loading>
      </Section>
    </Piv>
  )
}

//TODO: should be a plugin
function icssOnlyContent(opt?: { nodeShown?: MayFn<boolean> }): ICSS {
  const nodeShown = !!shrinkFn(opt?.nodeShown)
  return { all: nodeShown ? undefined : 'inherit', display: nodeShown ? undefined : 'contents' }
}
